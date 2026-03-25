import fs from 'node:fs';
import path from 'node:path';

function getLandingCopy() {
  const p = path.join(process.cwd(), '../../landing-copy.md');
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

export default function DemoPage() {
  const copy = getLandingCopy();
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Product Demo</h1>
      <p style={{ color: '#555', marginBottom: '1rem' }}>Watch how AgentOrchestrator composes reliable multi-agent workflows.</p>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '1.5rem' }}>
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ" // TODO: replace with real demo URL
          title="AgentOrchestrator Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        />
      </div>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{copy ?? 'Landing copy missing. Edit site/landing-copy.md.'}</pre>
      <p style={{ marginTop: '1.5rem' }}>
        <a href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>← Back to home</a>
      </p>
    </main>
  );
}
