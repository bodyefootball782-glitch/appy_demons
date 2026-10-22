(() => {
  const form = document.getElementById('applicationForm');
  const steps = [...document.querySelectorAll('.form-step')];
  const startBtn = document.getElementById('startBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');
  const stepLabel = document.getElementById('stepLabel');
  const stepTitle = document.getElementById('stepTitle');
  const formError = document.getElementById('formError');
  const formSuccess = document.getElementById('formSuccess');
  const formControls = document.getElementById('formControls');
  const titles = ['البيانات الشخصية', 'خبرتك داخل المدينة', 'العلاقات والخبرة'];
  let currentStep = 0;
  let sending = false;

  function showStep(index) {
    currentStep = index;
    steps.forEach((step, i) => step.classList.toggle('active', i === index));
    const pct = Math.round(((index + 1) / steps.length) * 100);
    progressBar.style.width = pct + '%';
    progressPercent.textContent = pct + '%';
    stepLabel.textContent = `المرحلة ${String(index + 1).padStart(2, '0')} من ${String(steps.length).padStart(2, '0')}`;
    stepTitle.textContent = titles[index];
    prevBtn.disabled = index === 0;
    nextBtn.hidden = index === steps.length - 1;
    submitBtn.hidden = index !== steps.length - 1;
    formError.hidden = true;
  }

  function validateStep() {
    const fields = [...steps[currentStep].querySelectorAll('input, textarea')];
    for (const field of fields) {
      if (!field.checkValidity() || !field.value.trim()) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }
    return true;
  }

  startBtn.addEventListener('click', () => {
    document.getElementById('application').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const first = form.querySelector('input');
      if (first) first.focus({ preventScroll: true });
    }, 450);
  });
  nextBtn.addEventListener('click', () => {
    if (validateStep() && currentStep < steps.length - 1) showStep(currentStep + 1);
  });
  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) showStep(currentStep - 1);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !validateStep()) return;
    formError.hidden = true;
    sending = true;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'جارٍ الإرسال...';
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'حصلت مشكلة أثناء الإرسال. حاول مرة تانية.');
      steps.forEach(step => step.classList.remove('active'));
      formSuccess.hidden = false;
      formControls.hidden = true;
      document.querySelector('.privacy-note').hidden = true;
      progressBar.style.width = '100%';
      progressPercent.textContent = '100%';
      stepLabel.textContent = 'تم استلام الطلب';
      stepTitle.textContent = 'شكرًا لك';
    } catch (error) {
      formError.textContent = error.message || 'تعذر إرسال الطلب. حاول مرة أخرى بعد قليل.';
      formError.hidden = false;
    } finally {
      sending = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'إرسال الطلب <span>↗</span>';
    }
  });

  showStep(0);
})();
