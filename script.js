// script.js
// Adds interactivity: tabs, modal, currency & model selection, nav toggle.

document.addEventListener('DOMContentLoaded', () => {
  // Simple tab system
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const model = tab.dataset.model;
      panels.forEach(p => p.classList.toggle('active', p.id === model));
      // update selected model on click
      const modelLabel = (model === 'coupe') ? 'i8 Coupe' : (model === 'roadster') ? 'i8 Roadster' : 'Special / LCI';
      document.getElementById('selectedModel').textContent = modelLabel;
      // set msrp sample values based on selection
      updatePricingForModel(modelLabel);
    });
  });

  // Default panel shown
  document.querySelector('.tab.active')?.click();

  // Modal logic
  const modal = document.getElementById('modal');
  const inquireBtn = document.getElementById('inquireBtn');
  const closeModal = document.getElementById('closeModal');
  const cancelModal = document.getElementById('cancelModal');
  const inquiryForm = document.getElementById('inquiryForm');

  function openModal(){ modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false'); }
  function hideModal(){ modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); }

  inquireBtn?.addEventListener('click', openModal);
  closeModal?.addEventListener('click', hideModal);
  cancelModal?.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) hideModal(); });

  inquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    // For demo: show simple alert. In real site, send to backend API.
    alert(`Thanks ${name || 'there'}! We received your enquiry. We'll reply to ${email || 'your email'}.`);
    inquiryForm.reset();
    hideModal();
  });

  // Currency switcher
  const currency = document.getElementById('currency');
  currency.addEventListener('change', () => {
    convertPrices(currency.value);
  });

  // Nav toggle for mobile
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle?.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Helper: update pricing placeholders for model
  window.selectModel = function(modelName){
    document.getElementById('selectedModel').textContent = `i8 ${modelName}`;
    // set base sample values
    updatePricingForModel(`i8 ${modelName}`);
    // scroll to price
    document.getElementById('price').scrollIntoView({behavior:'smooth'});
  }

  function updatePricingForModel(modelLabel){
    // sample historic/indicative values (not live)
    // base INR values:
    let msrpINR = 22900000; // default ~ ₹2.29 Cr
    if(modelLabel.toLowerCase().includes('roadster')) msrpINR = 25000000; // example
    if(modelLabel.toLowerCase().includes('special')) msrpINR = 25000000;

    const rangeLow = Math.round(msrpINR * 0.8);
    const rangeHigh = Math.round(msrpINR * 1.4);
    // apply current currency selection
    const cur = currency.value || 'INR';
    const msrpStr = formatPrice(msrpINR, cur);
    const rangeStr = formatPrice(rangeLow, cur) + ' — ' + formatPrice(rangeHigh, cur);

    document.getElementById('msrp').textContent = msrpStr;
    document.getElementById('range').textContent = rangeStr;
  }

  function convertPrices(targetCurrency){
    // Dummy conversion rates for demo; real site should fetch live rates.
    const rates = { INR:1, USD:0.012, EUR:0.011 };
    // We store base in INR when computing
    // Parse current msrp numeric value from element (if present) else re-run update
    // For simplicity, call updatePricingForModel with current model to recalc
    const currentModel = document.getElementById('selectedModel').textContent || 'i8 Coupe';
    // extract model name: i8 Coupe -> Coupe
    const modelName = currentModel.replace(/^i8\s+/i,'');
    // Updating price by recalculation
    let baseINR;
    if(modelName.toLowerCase().includes('roadster')) baseINR = 25000000;
    else if(modelName.toLowerCase().includes('special')) baseINR = 25000000;
    else baseINR = 22900000;

    function toCurrency(valueINR){
      if(!rates[targetCurrency]) return valueINR.toLocaleString();
      const v = valueINR * rates[targetCurrency];
      if(targetCurrency === 'INR') return `₹ ${Number(v).toLocaleString('en-IN')}`;
      if(targetCurrency === 'USD') return `$ ${Number(v).toLocaleString('en-US')}`;
      if(targetCurrency === 'EUR') return `€ ${Number(v).toLocaleString('de-DE')}`;
      return Number(v).toLocaleString();
    }

    const msrpEl = document.getElementById('msrp');
    const rangeEl = document.getElementById('range');

    msrpEl.textContent = toCurrency(baseINR);
    rangeEl.textContent = `${toCurrency(Math.round(baseINR*0.8))} — ${toCurrency(Math.round(baseINR*1.4))}`;
  }

  function formatPrice(inrValue, currencyCode){
    const rates = { INR:1, USD:0.012, EUR:0.011 };
    const rate = rates[currencyCode] || 1;
    const v = inrValue * rate;
    if(currencyCode === 'INR') return `₹ ${Number(v).toLocaleString('en-IN')}`;
    if(currencyCode === 'USD') return `$ ${Number(v).toLocaleString('en-US')}`;
    if(currencyCode === 'EUR') return `€ ${Number(v).toLocaleString('de-DE')}`;
    return Number(v).toLocaleString();
  }

  // initial pricing populate
  updatePricingForModel('i8 Coupe');
});

// Animate audio features on page load
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".audio-features li");
  items.forEach((item, index) => {
    item.style.opacity = 0;
    setTimeout(() => {
      item.style.transition = "opacity 1s";
      item.style.opacity = 1;
    }, index * 300);
  });
});