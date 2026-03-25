export default function ThankYouPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>You’re on the list 🎉</h1>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        Thanks for joining the AgentOrchestrator beta waitlist. We’ll reach out with onboarding details soon.
      </p>
      <ul style={{ marginLeft: '1rem', color: '#333' }}>
        <li>Whitelist our email so you don’t miss updates</li>
        <li>Optional: reply with your ideal workflow so we can tailor your onboarding</li>
      </ul>
      <p style={{ marginTop: '1.5rem' }}>
        <a href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>← Back to home</a>
      </p>
    </main>
  );
}
