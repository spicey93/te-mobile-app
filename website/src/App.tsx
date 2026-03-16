import { useState } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import './App.css';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="app">
        <main className="main">
          <h1>Setup required</h1>
          <p className="subtitle">
            Copy <code>website/.env.example</code> to <code>website/.env</code> and add your
            Supabase URL and anon key.
          </p>
        </main>
      </div>
    );
  }
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('submitting');
    setError('');

    const { error: err } = await supabase.from('form_submissions').insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    if (err) {
      setState('error');
      setError(err.message);
      return;
    }

    setState('success');
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <div className="app">
      <main className="main">
        <h1>Get in touch</h1>
        <p className="subtitle">Send us a message and we'll get back to you.</p>

        {state === 'success' ? (
          <div className="success">
            <p>Thanks! Your message has been sent.</p>
            <button
              type="button"
              className="submit-btn"
              onClick={() => setState('idle')}
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form">
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                disabled={state === 'submitting'}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                disabled={state === 'submitting'}
              />
            </label>
            <label>
              Message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="How can we help?"
                rows={4}
                disabled={state === 'submitting'}
              />
            </label>
            {state === 'error' && <p className="error">{error}</p>}
            <button
              type="submit"
              className="submit-btn"
              disabled={state === 'submitting'}
            >
              {state === 'submitting' ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
