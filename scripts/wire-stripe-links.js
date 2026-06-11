// wire-stripe-links.js — populates Stripe TEST links into pricing/buttons when available
// Reads a small inline JSON blob injected at build time, or falls back to data-* attributes.
(function(){
  const cfgEl = document.getElementById('stripe-test-links');
  if(!cfgEl) return; // nothing to wire yet
  try {
    const cfg = JSON.parse(cfgEl.textContent || '{}');
    const S = (path, d=cfg) => path.split('.').reduce((o,k)=> (o||{})[k], d);
    const map = {
      starter: S('test.autofix.tiers.tier_a.link_url'),
      standard: S('test.autofix.tiers.tier_b.link_url'),
      plus: S('test.autofix.tiers.tier_c.link_url'),
      setup: S('test.autofix.setup.link_url')
    };
    const setHref = (id, url) => {
      const el = document.getElementById(id);
      if (el && url) { el.href = url; el.setAttribute('target','_blank'); el.setAttribute('rel','noopener'); }
    }
    setHref('btn-starter', map.starter);
    setHref('btn-standard', map.standard);
    setHref('btn-plus', map.plus);
    const container = document.getElementById('checkout-links');
    if (container && (map.starter || map.standard || map.plus)) {
      container.classList.remove('hidden');
      container.innerHTML = [
        map.starter ? `<a class="px-5 py-3 rounded-lg border border-white/10 hover:bg-white/5" href="${map.starter}" target="_blank" rel="noopener">Checkout (Starter)</a>` : '',
        map.standard ? `<a class="px-5 py-3 rounded-lg bg-brand-400 text-slate-900 font-semibold hover:bg-brand-300" href="${map.standard}" target="_blank" rel="noopener">Checkout (Standard)</a>` : '',
        map.plus ? `<a class="px-5 py-3 rounded-lg border border-white/10 hover:bg-white/5" href="${map.plus}" target="_blank" rel="noopener">Checkout (Plus)</a>` : ''
      ].filter(Boolean).join('\n');
    }
  } catch (e) {
    console.warn('Stripe link wiring failed', e);
  }
})();
