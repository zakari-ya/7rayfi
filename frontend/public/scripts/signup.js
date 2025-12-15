const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

const SIGNUP_STORAGE_KEY = 'artisanSignupDraft';

function parseCommaList(value) {
  return (value || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
    .filter((v, idx, arr) => arr.indexOf(v) === idx);
}

function parseLines(value) {
  return (value || '')
    .split(/\r?\n/)
    .map(v => v.trim())
    .filter(Boolean);
}

function isValidEmail(email) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(String(email || '').trim());
}

function isValidMoroccanPhone(phone) {
  return /^(\+212|0)[5-7][0-9]{8}$/.test(String(phone || '').trim());
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

class SignupWizard {
  constructor() {
    this.i18n = window.i18n || (typeof I18n !== 'undefined' ? new I18n() : null);

    this.form = document.getElementById('signup-form');
    this.progress = document.getElementById('wizard-progress');

    this.nextBtn = document.getElementById('next-btn');
    this.backBtn = document.getElementById('back-btn');
    this.submitBtn = document.getElementById('submit-btn');

    this.sendSmsBtn = document.getElementById('send-sms-btn');
    this.verifySmsBtn = document.getElementById('verify-sms-btn');
    this.smsHint = document.getElementById('sms-hint');
    this.smsStatus = document.getElementById('sms-status');

    this.formStatus = document.getElementById('form-status');

    this.smsStatusInfo = { key: '', type: '', params: {} };
    this.formStatusInfo = { key: '', type: '', params: {} };
    this.formStatusCustom = { text: '', type: '' };

    this.inputs = {
      firstName: document.getElementById('firstName'),
      lastName: document.getElementById('lastName'),
      email: document.getElementById('email'),
      phone: document.getElementById('phone'),
      smsCode: document.getElementById('smsCode'),
      profession: document.getElementById('profession'),
      category: document.getElementById('category'),
      skills: document.getElementById('skills'),
      city: document.getElementById('city'),
      serviceAreas: document.getElementById('serviceAreas'),
      bio: document.getElementById('bio'),
      portfolioLinks: document.getElementById('portfolioLinks'),
      hourlyRate: document.getElementById('hourlyRate'),
      pricingNote: document.getElementById('pricingNote'),
      username: document.getElementById('username'),
      password: document.getElementById('password'),
      confirmPassword: document.getElementById('confirmPassword'),
    };

    this.panels = Array.from(document.querySelectorAll('.wizard-panel'));

    this.state = this.loadState();
    this.autosaveEnabled = true;
    this.errors = {};

    this.attachEventListeners();
    this.applyStateToForm();
    this.loadCategories();

    this.goToStep(this.state.currentStep || 1, { scroll: false });
    this.renderDynamicText();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(SIGNUP_STORAGE_KEY);
      if (!saved) {
        return {
          currentStep: 1,
          sms: { sentCode: '', verified: false, sentTo: '' },
        };
      }
      const parsed = JSON.parse(saved);
      return {
        currentStep: 1,
        sms: { sentCode: '', verified: false, sentTo: '' },
        ...parsed,
        sms: {
          sentCode: '',
          verified: false,
          sentTo: '',
          ...(parsed.sms || {}),
        },
      };
    } catch {
      return {
        currentStep: 1,
        sms: { sentCode: '', verified: false, sentTo: '' },
      };
    }
  }

  saveState() {
    if (!this.autosaveEnabled) return;
    localStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(this.state));
  }

  attachEventListeners() {
    this.nextBtn.addEventListener('click', () => this.handleNext());
    this.backBtn.addEventListener('click', () => this.handleBack());

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmit();
    });

    this.sendSmsBtn.addEventListener('click', () => this.handleSendSms());
    this.verifySmsBtn.addEventListener('click', () => this.handleVerifySms());

    Object.entries(this.inputs).forEach(([key, el]) => {
      if (!el) return;

      const handler = () => {
        this.state[key] = el.value;

        if (key === 'phone') {
          this.resetSmsVerificationIfNeeded();
        }

        if (key === 'city') {
          const serviceAreas = String(this.inputs.serviceAreas.value || '').trim();
          if (!serviceAreas && el.value.trim()) {
            this.inputs.serviceAreas.value = el.value.trim();
            this.state.serviceAreas = this.inputs.serviceAreas.value;
          }
        }

        this.saveState();
      };

      el.addEventListener('input', handler);
      el.addEventListener('blur', () => {
        this.validateCurrentStep({ showAll: false });
      });
    });

    const languageSelector = document.getElementById('language-selector');
    languageSelector?.addEventListener('change', () => {
      setTimeout(() => {
        this.renderDynamicText();
      }, 0);
    });
  }

  applyStateToForm() {
    Object.entries(this.inputs).forEach(([key, el]) => {
      if (!el) return;
      if (this.state[key] !== undefined && this.state[key] !== null) {
        el.value = this.state[key];
      }
    });
  }

  getStepCount() {
    return 4;
  }

  getCurrentStep() {
    return Math.max(1, Math.min(this.getStepCount(), parseInt(this.state.currentStep || 1)));
  }

  goToStep(step, { scroll = true } = {}) {
    const stepNumber = Math.max(1, Math.min(this.getStepCount(), parseInt(step)));
    this.state.currentStep = stepNumber;
    this.saveState();

    this.panels.forEach(panel => {
      const panelStep = parseInt(panel.getAttribute('data-step'));
      panel.classList.toggle('hidden', panelStep !== stepNumber);
    });

    const progressSteps = Array.from(this.progress.querySelectorAll('.wizard-progress-step'));
    progressSteps.forEach(item => {
      const itemStep = parseInt(item.getAttribute('data-step'));
      item.classList.toggle('active', itemStep === stepNumber);
      item.classList.toggle('completed', itemStep < stepNumber);
    });

    this.backBtn.disabled = stepNumber === 1;

    if (stepNumber === this.getStepCount()) {
      this.nextBtn.classList.add('hidden');
      this.submitBtn.classList.remove('hidden');
    } else {
      this.nextBtn.classList.remove('hidden');
      this.submitBtn.classList.add('hidden');
    }

    if (scroll) {
      this.panels
        .find(p => parseInt(p.getAttribute('data-step')) === stepNumber)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    this.formStatusInfo = { key: '', type: '', params: {} };
    this.formStatusCustom = { text: '', type: '' };
    this.renderFormStatus();

    this.validateCurrentStep({ showAll: false });
    this.renderDynamicText();
  }

  translate(key, params = {}) {
    const base = this.i18n?.translate ? this.i18n.translate(key) : key;
    if (typeof base !== 'string') return key;

    return Object.entries(params).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), base);
  }

  setStatus(el, { key, params = {}, type = '' } = {}) {
    if (!el) return;
    const baseClass = el.classList.length ? el.classList[0] : '';
    el.textContent = key ? this.translate(key, params) : '';
    el.className = baseClass;
    if (type) el.classList.add(type);
  }

  setSmsStatus({ key = '', type = '', params = {} } = {}) {
    this.smsStatusInfo = { key, type, params };
    this.renderSmsStatus();
  }

  setFormStatus({ key = '', type = '', params = {} } = {}) {
    this.formStatusCustom = { text: '', type: '' };
    this.formStatusInfo = { key, type, params };
    this.renderFormStatus();
  }

  setFormStatusText(text, type = '') {
    this.formStatusInfo = { key: '', type: '', params: {} };
    this.formStatusCustom = { text: String(text || ''), type };
    this.renderFormStatus();
  }

  renderSmsStatus() {
    const sms = this.state.sms || { sentCode: '', verified: false, sentTo: '' };

    if (sms.verified) {
      this.setStatus(this.smsStatus, { key: 'signup.sms.verified', type: 'success' });
      return;
    }

    if (this.smsStatusInfo.key) {
      this.setStatus(this.smsStatus, this.smsStatusInfo);
      return;
    }

    this.setStatus(this.smsStatus, { key: '', type: '' });
  }

  renderFormStatus() {
    if (!this.formStatus) return;

    if (this.formStatusCustom.text) {
      const baseClass = this.formStatus.classList.length ? this.formStatus.classList[0] : 'form-status';
      this.formStatus.textContent = this.formStatusCustom.text;
      this.formStatus.className = baseClass;
      if (this.formStatusCustom.type) this.formStatus.classList.add(this.formStatusCustom.type);
      return;
    }

    if (this.formStatusInfo.key) {
      this.setStatus(this.formStatus, this.formStatusInfo);
      return;
    }

    this.setStatus(this.formStatus, { key: '', type: '' });
  }

  setFieldError(field, errorKey) {
    const errorEl = document.getElementById(`error-${field}`);
    const inputEl = this.inputs[field];

    if (errorEl) {
      errorEl.textContent = errorKey ? this.translate(errorKey) : '';
    }

    if (inputEl) {
      inputEl.classList.toggle('input-error', Boolean(errorKey));
      if (errorKey) {
        inputEl.setAttribute('aria-invalid', 'true');
      } else {
        inputEl.removeAttribute('aria-invalid');
      }
    }
  }

  setErrors(errors) {
    this.errors = errors;
    const allFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'smsCode',
      'profession',
      'category',
      'skills',
      'city',
      'serviceAreas',
      'bio',
      'portfolioLinks',
      'hourlyRate',
      'username',
      'password',
      'confirmPassword',
    ];

    allFields.forEach(field => {
      this.setFieldError(field, errors[field] || '');
    });
  }

  validateCurrentStep({ showAll = true } = {}) {
    const step = this.getCurrentStep();
    const errors = this.validateStep(step, { showAll });
    this.setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  validateStep(step) {
    const errors = {};

    if (step === 1) {
      const firstName = (this.inputs.firstName.value || '').trim();
      const lastName = (this.inputs.lastName.value || '').trim();
      const email = (this.inputs.email.value || '').trim();
      const phone = (this.inputs.phone.value || '').trim();

      if (!firstName) errors.firstName = 'signup.errors.required';
      else if (firstName.length < 2) errors.firstName = 'signup.errors.min2';

      if (!lastName) errors.lastName = 'signup.errors.required';
      else if (lastName.length < 2) errors.lastName = 'signup.errors.min2';

      if (!email) errors.email = 'signup.errors.required';
      else if (!isValidEmail(email)) errors.email = 'signup.errors.invalidEmail';

      if (!phone) errors.phone = 'signup.errors.required';
      else if (!isValidMoroccanPhone(phone)) errors.phone = 'signup.errors.invalidPhone';

      if (!this.state.sms?.verified) {
        errors.smsCode = 'signup.errors.smsNotVerified';
      }
    }

    if (step === 2) {
      const profession = (this.inputs.profession.value || '').trim();
      const categoryId = this.inputs.category.value;
      const skills = parseCommaList(this.inputs.skills.value);
      const city = (this.inputs.city.value || '').trim();
      const serviceAreas = parseCommaList(this.inputs.serviceAreas.value);

      if (!profession) errors.profession = 'signup.errors.required';
      if (!categoryId) errors.category = 'signup.errors.required';
      if (skills.length === 0) errors.skills = 'signup.errors.minOne';
      if (!city) errors.city = 'signup.errors.required';
      if (serviceAreas.length === 0) errors.serviceAreas = 'signup.errors.minOne';
    }

    if (step === 3) {
      const bio = (this.inputs.bio.value || '').trim();
      const hourlyRate = String(this.inputs.hourlyRate.value || '').trim();
      const links = parseLines(this.inputs.portfolioLinks.value);

      if (!bio) errors.bio = 'signup.errors.required';

      if (!hourlyRate) errors.hourlyRate = 'signup.errors.required';
      else if (Number.isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0) {
        errors.hourlyRate = 'signup.errors.positiveNumber';
      }

      const invalidLink = links.find(l => !isValidUrl(l));
      if (invalidLink) errors.portfolioLinks = 'signup.errors.invalidUrl';
    }

    if (step === 4) {
      const username = (this.inputs.username.value || '').trim();
      const password = String(this.inputs.password.value || '');
      const confirmPassword = String(this.inputs.confirmPassword.value || '');

      if (!username) errors.username = 'signup.errors.required';
      else if (username.length < 3) errors.username = 'signup.errors.min3';

      if (!password) errors.password = 'signup.errors.required';
      else if (password.length < 6) errors.password = 'signup.errors.passwordMin6';

      if (!confirmPassword) errors.confirmPassword = 'signup.errors.required';
      else if (confirmPassword !== password) errors.confirmPassword = 'signup.errors.passwordMismatch';
    }

    return errors;
  }

  handleNext() {
    const valid = this.validateCurrentStep({ showAll: true });
    if (!valid) return;

    const next = this.getCurrentStep() + 1;
    this.goToStep(next);
  }

  handleBack() {
    const prev = this.getCurrentStep() - 1;
    this.goToStep(prev);
  }

  resetSmsVerificationIfNeeded() {
    const phone = (this.inputs.phone.value || '').trim();
    const sms = this.state.sms || { sentCode: '', verified: false, sentTo: '' };

    if (sms.sentTo && sms.sentTo !== phone) {
      this.state.sms = { sentCode: '', verified: false, sentTo: '' };
      this.smsStatusInfo = { key: '', type: '', params: {} };
      this.saveState();
      this.renderDynamicText();
    }
  }

  handleSendSms() {
    const phone = (this.inputs.phone.value || '').trim();

    if (!phone) {
      this.setFieldError('phone', 'signup.errors.required');
      this.setSmsStatus({ key: 'signup.sms.errors.enterPhone', type: 'error' });
      return;
    }

    if (!isValidMoroccanPhone(phone)) {
      this.setFieldError('phone', 'signup.errors.invalidPhone');
      this.setSmsStatus({ key: 'signup.sms.errors.invalidPhone', type: 'error' });
      return;
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    this.state.sms = { sentCode: code, verified: false, sentTo: phone };
    this.saveState();

    this.inputs.smsCode.value = '';
    this.state.smsCode = '';
    this.saveState();

    this.setSmsStatus({ key: 'signup.sms.sent', type: '' });
    this.renderDynamicText();
    this.validateCurrentStep({ showAll: false });
  }

  handleVerifySms() {
    const sms = this.state.sms || { sentCode: '', verified: false, sentTo: '' };
    const entered = String(this.inputs.smsCode.value || '').trim();

    if (!sms.sentCode) {
      this.setFieldError('smsCode', 'signup.sms.errors.sendFirst');
      this.setSmsStatus({ key: 'signup.sms.errors.sendFirst', type: 'error' });
      return;
    }

    if (!/^[0-9]{6}$/.test(entered)) {
      this.setFieldError('smsCode', 'signup.sms.errors.invalidCodeFormat');
      this.setSmsStatus({ key: 'signup.sms.errors.invalidCodeFormat', type: 'error' });
      return;
    }

    if (entered !== sms.sentCode) {
      this.setFieldError('smsCode', 'signup.sms.errors.wrongCode');
      this.setSmsStatus({ key: 'signup.sms.errors.wrongCode', type: 'error' });
      return;
    }

    this.state.sms = { ...sms, verified: true };
    this.saveState();

    this.setFieldError('smsCode', '');
    this.setSmsStatus({ key: 'signup.sms.verified', type: 'success' });
    this.renderDynamicText();
    this.validateCurrentStep({ showAll: false });
  }

  renderDynamicText() {
    const sms = this.state.sms || { sentCode: '', verified: false, sentTo: '' };

    if (sms.sentCode && sms.sentTo) {
      this.smsHint.textContent = this.translate('signup.sms.mockHint', {
        phone: sms.sentTo,
        code: sms.sentCode,
      });
    } else {
      this.smsHint.textContent = this.translate('signup.sms.noCodeYet');
    }

    this.renderSmsStatus();
    this.renderFormStatus();
    this.setErrors(this.errors || {});
  }

  async loadCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/services?active=true`);
      if (!response.ok) throw new Error('Failed to load categories');

      const data = await response.json();
      const categories = Array.isArray(data?.data) ? data.data : [];
      this.populateCategorySelect(categories);
    } catch (error) {
      console.error('Categories fetch error:', error);
      const fallback = [
        { _id: '000000000000000000000001', name: 'Plomberie' },
        { _id: '000000000000000000000002', name: 'Électricité' },
        { _id: '000000000000000000000003', name: 'Menuiserie' },
      ];
      this.populateCategorySelect(fallback, { isFallback: true });
    }
  }

  populateCategorySelect(categories, { isFallback = false } = {}) {
    const select = this.inputs.category;
    if (!select) return;

    const firstOption = select.querySelector('option[value=""]');
    select.innerHTML = '';
    if (firstOption) select.appendChild(firstOption);

    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat._id;
      option.textContent = cat.name;
      select.appendChild(option);
    });

    if (this.state.category) {
      select.value = this.state.category;
    }

    if (isFallback) {
      this.setFormStatus({ key: 'signup.status.categoriesFallback', type: '' });
    }
  }

  async handleSubmit() {
    const currentStep = this.getCurrentStep();
    if (currentStep !== this.getStepCount()) {
      this.goToStep(this.getStepCount());
      return;
    }

    const isStepValid = this.validateCurrentStep({ showAll: true });
    if (!isStepValid) return;

    const allValid = [1, 2, 3, 4].every(step => Object.keys(this.validateStep(step)).length === 0);
    if (!allValid) {
      this.setFormStatus({ key: 'signup.errors.fixBeforeSubmit', type: 'error' });
      return;
    }

    this.setFormStatus({ key: 'signup.status.submitting', type: '' });
    this.submitBtn.disabled = true;
    this.backBtn.disabled = true;

    const payload = this.buildPayload();

    try {
      const response = await fetch(`${API_BASE_URL}/artisan/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data?.error || this.translate('signup.status.submitError');
        this.setFormStatusText(message, 'error');
        return;
      }

      const message = data?.message || this.translate('signup.status.submitSuccess');
      this.setFormStatusText(message, 'success');

      this.autosaveEnabled = false;
      localStorage.removeItem(SIGNUP_STORAGE_KEY);
    } catch (error) {
      console.error('Submit error:', error);
      this.setFormStatus({ key: 'signup.status.networkError', type: 'error' });
    } finally {
      this.submitBtn.disabled = false;
      this.backBtn.disabled = this.getCurrentStep() === 1;
    }
  }

  buildPayload() {
    const skills = parseCommaList(this.inputs.skills.value);
    const serviceAreas = parseCommaList(this.inputs.serviceAreas.value);
    const portfolioLinks = parseLines(this.inputs.portfolioLinks.value);

    const payload = {
      firstName: (this.inputs.firstName.value || '').trim(),
      lastName: (this.inputs.lastName.value || '').trim(),
      email: (this.inputs.email.value || '').trim(),
      phone: (this.inputs.phone.value || '').trim(),
      profession: (this.inputs.profession.value || '').trim(),
      categories: this.inputs.category.value ? [this.inputs.category.value] : [],
      skills,
      city: (this.inputs.city.value || '').trim(),
      serviceAreas,
      description: (this.inputs.bio.value || '').trim(),
      portfolioLinks,
      hourlyRate: this.inputs.hourlyRate.value ? Number(this.inputs.hourlyRate.value) : undefined,
      pricingNote: (this.inputs.pricingNote.value || '').trim(),
      smsVerified: Boolean(this.state.sms?.verified),
      username: (this.inputs.username.value || '').trim(),
      password: String(this.inputs.password.value || ''),
    };

    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) delete payload[key];
    });

    return payload;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.i18n?.updatePage?.();
  window.i18n?.updateDirection?.();
  new SignupWizard();
});
