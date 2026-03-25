import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { track } from '@/lib/plausible';

function getLandingCopy() {
  const p = path.join(process.cwd(), '../../landing-copy.md');
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

export default function MarketingPage() {
  const copy = getLandingCopy();
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold mb-4">AgentOrchestrator — Reliable AI workflows</h1>
      <p className="text-gray-600 mb-6">Ship production‑grade LLM workflows with routing, retries, evals, and live telemetry. Close the loop from prompt to production.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const data = Object.fromEntries(new FormData(form).entries());
          fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
            .then(async (res) => {
              if (!res.ok) throw new Error(await res.text());
              track('Lead: Beta Signup');
              alert('Thanks! We\'ll be in touch.');
              form.reset();
            })
            .catch((err) => alert(`Signup failed: ${err.message}`));
        }}
        className="mb-8 flex flex-col gap-3 max-w-md"
      >
        <input name="email" type="email" required placeholder="you@company.com" className="border rounded px-3 py-2" />
        <input name="name" type="text" placeholder="Your name (optional)" className="border rounded px-3 py-2" />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Join the Beta</button>
      </form>

      <div className="prose">
        <pre className="whitespace-pre-wrap text-sm">{copy ?? 'Landing copy missing. Edit site/landing-copy.md.'}</pre>
      </div>

      <div className="mt-8">
        <Link className="text-blue-600 underline" href="/privacy">Privacy</Link>
      </div>
    </main>
  );
}
