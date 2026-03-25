import fs from 'node:fs';
import path from 'node:path';
import SignupForm from './(marketing)/SignupForm';

function getLandingCopy() {
  try {
    const p = path.join(process.cwd(), '../../landing-copy.md');
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

export default function Home() {
  const copy = getLandingCopy();
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        Rebuild Lab — AI‑native automation studio
      </h1>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        We rebuild how work gets done — with agents. First product: AgentOrchestrator for reliable multi‑agent workflows.
      </p>

      <SignupForm />

      <p style={{ marginBottom: '1rem' }}>
        <a href="/demo" style={{ color: '#2563eb', textDecoration: 'underline' }}>Watch the 2‑minute demo →</a>
      </p>

      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>
        {copy ?? 'Landing copy missing. Edit site/landing-copy.md.'}
      </pre>
    </main>
  );
}
