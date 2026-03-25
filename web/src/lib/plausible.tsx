export function track(event: string, props?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(event, { props });
  }
}

export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null as any;
  return (
    // eslint-disable-next-line @next/next/no-sync-scripts
    <script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
    />
  ) as any;
}
