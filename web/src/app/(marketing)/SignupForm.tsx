'use client';

import { track } from '@/lib/plausible';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = Object.fromEntries(new FormData(form).entries());
        fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
          .then(async (res) => {
            if (!res.ok) throw new Error(await res.text());
            track('Lead: Beta Signup');
            form.reset();
            router.push('/thank-you');
          })
          .catch((err) => alert(`Signup failed: ${err.message}`));
      }}
      className="mb-8 flex flex-col gap-3 max-w-md"
    >
      <input name="email" type="email" required placeholder="you@company.com" className="border rounded px-3 py-2" />
      <input name="name" type="text" placeholder="Your name (optional)" className="border rounded px-3 py-2" />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">Join the Beta</button>
    </form>
  );
}
