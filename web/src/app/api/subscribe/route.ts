import { NextRequest, NextResponse } from 'next/server';

function json(data: any, init?: number | ResponseInit) {
  return new NextResponse(JSON.stringify(data), {
    status: typeof init === 'number' ? init : init?.status ?? 200,
    headers: { 'content-type': 'application/json', ...(typeof init === 'object' ? init.headers : {}) },
  });
}

function isTruthy(v: string | undefined | null) {
  if (!v) return false;
  const s = String(v).trim();
  if (!s) return false;
  // Treat placeholders like TODO/REPLACE as unset
  if (/TODO|REPLACE|CHANGEME/i.test(s)) return false;
  return true;
}

function isValidEmail(email: string) {
  // Basic, permissive RFC5322-ish check; keep it simple
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, any>;
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : undefined;
  if (!email) return json({ error: 'email required' }, 400);
  if (!isValidEmail(email)) return json({ error: 'invalid email' }, 400);

  const source = req.headers.get('x-forwarded-for') ?? 'unknown';
  const payload = { email, name, source, ts: new Date().toISOString() };

  try {
    // Option 1: generic webhook
    const webhookEnv = process.env.LEAD_WEBHOOK_URL ?? '';
    if (isTruthy(webhookEnv)) {
      const url = webhookEnv as string;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(await r.text());
      return json({ ok: true, via: 'webhook' });
    }

    // Option 2: Formspree
    const formIdEnv = process.env.FORMSPREE_ID ?? '';
    if (isTruthy(formIdEnv)) {
      const id = formIdEnv as string;
      const r = await fetch(`https://formspree.io/f/${id}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, name, _subject: 'New Beta Signup' }),
      });
      if (!r.ok) throw new Error(await r.text());
      return json({ ok: true, via: 'formspree' });
    }

    // Option 3: local file for dev
    const leadsFile = process.env.LEADS_FILE;
    if (isTruthy(leadsFile)) {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');
      const filePath = path.resolve(process.cwd(), String(leadsFile));
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      const line = `${payload.ts},${JSON.stringify({ email, name, source }).replaceAll(',', ';')}\n`;
      await fs.appendFile(filePath, line, 'utf8');
      return json({ ok: true, via: 'file' });
    }

    // Default: black-hole response (still 200 for frictionless UX)
    console.warn('No lead sink configured. Set LEAD_WEBHOOK_URL or FORMSPREE_ID or LEADS_FILE');
    return json({ ok: true, via: 'none' });
  } catch (err: any) {
    console.error('subscribe error', err);
    return json({ error: err.message ?? 'failed' }, 500);
  }
}
