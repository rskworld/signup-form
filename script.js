/**
 * RSK World - Signup Form
 * Enhanced with modern validation and UX features
 * Contact: help@rskworld.in
 * Website: https://rskworld.in
 */

// Utility functions
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

// Contact Information
const CONTACT_INFO = {
  name: 'Molla Samser',
  email: 'help@rskworld.in',
  phone: '+91 9330539277',
  website: 'https://rskworld.in',
  sourceCode: 'https://rskworld.in/project/forms/signup-form/'
};

// Toast notification system
class Toast {
  static show(message, duration = 3000) {
    const toast = $('#toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    // Clear any existing timeout
    if (this.timeout) clearTimeout(this.timeout);
    
    // Auto-hide after duration
    this.timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }
}

// Form validation and submission
class SignupForm {
  constructor() {
    this.form = $('#signup-form');
    this.initialize();
    this.initializeContactModal();
  }

  initialize() {
    if (!this.form) return;

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Event listeners
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Real-time validation
    $('#email')?.addEventListener('input', this.validateEmailField.bind(this));
    $('#password')?.addEventListener('input', this.handlePasswordInput.bind(this));
    $('#confirm')?.addEventListener('input', this.validateConfirmField.bind(this));
    $('#terms')?.addEventListener('change', this.validateTerms.bind(this));
    
    // Password toggle
    this.initializePasswordToggles();
    
    // Social login buttons
    this.initializeSocialLogins();
  }

  initializeContactModal() {
    // Set contact information in the modal
    if ($('#contact-name')) $('#contact-name').textContent = CONTACT_INFO.name;
    if ($('#contact-email')) {
      $('#contact-email').textContent = CONTACT_INFO.email;
      $('#contact-email').setAttribute('href', `mailto:${CONTACT_INFO.email}`);
    }
    if ($('#contact-phone')) {
      $('#contact-phone').textContent = CONTACT_INFO.phone;
      $('#contact-phone').setAttribute('href', `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`);
    }
    if ($('#contact-website')) {
      $('#contact-website').setAttribute('href', CONTACT_INFO.website);
    }
    if ($('#source-code-link')) {
      $('#source-code-link').setAttribute('href', CONTACT_INFO.sourceCode);
    }

    // Add click handler for contact link in footer
    const contactLink = $('#contact-link');
    if (contactLink) {
      contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showContactModal();
      });
    }
  }

  showContactModal() {
    const modal = new bootstrap.Modal($('#contactModal'));
    modal.show();
    
    // Track modal open event
    console.log('Contact modal opened');
    Toast.show('Contact information displayed');
  }

  // Password visibility toggle
  initializePasswordToggles() {
    document.addEventListener('mousedown', (e) => {
      const btn = e.target.closest('.password__toggle');
      if (btn) e.preventDefault();
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.password__toggle');
      if (!btn) return;
      
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
      
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('bi-eye', isPassword);
        icon.classList.toggle('bi-eye-slash', !isPassword);
      }
      
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

  // Social login handlers
  initializeSocialLogins() {
    const socialBtns = $$('.social-btn');
    socialBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const provider = btn.querySelector('i').classList[1].replace('bi-', '');
        this.handleSocialLogin(provider);
      });
    });
  }

  async handleSocialLogin(provider) {
    try {
      // Show loading state
      const btn = $(`.bi-${provider}`)?.closest('.social-btn');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would redirect to the OAuth provider
      Toast.show(`Redirecting to ${provider} login...`);
      
    } catch (error) {
      console.error('Social login error:', error);
      Toast.show('Failed to initiate social login. Please try again.');
    } finally {
      // Reset button state
      const btn = $(`.bi-${provider}`)?.closest('.social-btn');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="bi bi-${provider}"></i>`;
      }
    }
  }

  // Form submission handler
  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const isEmailValid = this.validateEmailField();
    const isPasswordValid = this.validatePasswordField();
    const isConfirmValid = this.validateConfirmField();
    const isTermsValid = this.validateTerms();
    
    if (!isEmailValid || !isPasswordValid || !isConfirmValid || !isTermsValid) {
      Toast.show('Please fix the errors in the form.');
      return;
    }
    
    // Prepare form data
    const formData = {
      fullname: $('#fullname').value.trim(),
      email: $('#email').value.trim(),
      password: $('#password').value,
      remember: $('#remember').checked
    };
    
    // Show loading state
    const submitBtn = $('#submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner-border');
    
    submitBtn.disabled = true;
    btnText.textContent = 'Creating Account...';
    spinner.classList.remove('d-none');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      Toast.show('Account created successfully! Redirecting...');
      
      // In a real app, you would redirect to dashboard or confirmation page
      // window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Signup error:', error);
      Toast.show('Failed to create account. Please try again.');
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      btnText.textContent = 'Create Account';
      spinner.classList.add('d-none');
    }
  }

  // Field validations
  validateEmailField() {
    const email = $('#email').value.trim();
    const errorEl = $('#email-error');
    
    if (!email) {
      this.setFieldError('email', 'Email is required');
      return false;
    }
    
    if (!this.isValidEmail(email)) {
      this.setFieldError('email', 'Please enter a valid email address');
      return false;
    }
    
    this.clearFieldError('email');
    return true;
  }

  handlePasswordInput() {
    const password = $('#password').value;
    this.updatePasswordHints(password);
    this.updateStrengthUI(password);
    this.validatePasswordField();
    this.validateConfirmField();
    this.updateSubmitButtonState();
  }

  validatePasswordField() {
    const password = $('#password').value;
    const errorEl = $('#password-error');
    
    if (!password) {
      this.setFieldError('password', 'Password is required');
      return false;
    }
    
    if (password.length < 8) {
      this.setFieldError('password', 'Password must be at least 8 characters');
      return false;
    }
    
    const { score } = this.calculatePasswordStrength(password);
    if (score < 40) {
      this.setFieldError('password', 'Please choose a stronger password');
      return false;
    }
    
    this.clearFieldError('password');
    return true;
  }

  validateConfirmField() {
    const password = $('#password').value;
    const confirm = $('#confirm').value;
    
    if (!confirm) {
      this.setFieldError('confirm', 'Please confirm your password');
      return false;
    }
    
    if (password !== confirm) {
      this.setFieldError('confirm', 'Passwords do not match');
      return false;
    }
    
    this.clearFieldError('confirm');
    return true;
  }

  validateTerms() {
    const termsChecked = $('#terms').checked;
    if (!termsChecked) {
      this.setFieldError('terms', 'You must accept the terms and conditions');
      return false;
    }
    this.clearFieldError('terms');
    return true;
  }

  // Helper methods
  setFieldError(fieldId, message) {
    const errorEl = $(`#${fieldId}-error`);
    const inputEl = $(`#${fieldId}`);
    const fieldWrapper = inputEl?.closest('.field');
    
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add('is-invalid');
    if (fieldWrapper) fieldWrapper.setAttribute('data-status', 'error');
  }

  clearFieldError(fieldId) {
    const errorEl = $(`#${fieldId}-error`);
    const inputEl = $(`#${fieldId}`);
    const fieldWrapper = inputEl?.closest('.field');
    
    if (errorEl) errorEl.textContent = '';
    if (inputEl) inputEl.classList.remove('is-invalid');
    if (fieldWrapper) fieldWrapper.removeAttribute('data-status');
  }

  updateSubmitButtonState() {
    const submitBtn = $('#submit-btn');
    if (!submitBtn) return;
    
    const isFormValid = 
      this.validateEmailField() && 
      this.validatePasswordField() && 
      this.validateConfirmField() && 
      this.validateTerms();
    
    submitBtn.disabled = !isFormValid;
  }

  // Password strength calculation
  passwordRules = {
    length: (v) => v.length >= 8,
    upper: (v) => /[A-Z]/.test(v),
    lower: (v) => /[a-z]/.test(v),
    number: (v) => /[0-9]/.test(v),
    symbol: (v) => /[^A-Za-z0-9]/.test(v),
  };

  calculatePasswordStrength(password) {
    const rules = Object.values(this.passwordRules);
    const satisfied = rules.filter((fn) => fn(password)).length;
    const score = Math.round((satisfied / rules.length) * 100);
    
    // Map to label
    let label = 'Weak';
    let tier = 'weak';
    
    if (score >= 80) { 
      label = 'Strong'; 
      tier = 'strong'; 
    } else if (score >= 60) { 
      label = 'Good'; 
      tier = 'good'; 
    } else if (score >= 40) { 
      label = 'Fair'; 
      tier = 'fair'; 
    }
    
    return { score, label, tier };
  }

  updatePasswordHints(password) {
    const list = $('#password-hint');
    if (!list) return;
    
    $$('#password-hint li').forEach((item) => {
      const key = item.getAttribute('data-req');
      const rule = this.passwordRules[key];
      const isValid = rule ? rule(password) : false;
      item.classList.toggle('satisfied', isValid);
    });
  }

  updateStrengthUI(password) {
    const { score, label, tier } = this.calculatePasswordStrength(password);
    const meter = $('#strength-meter');
    const text = $('#strength-label');
    const wrapper = $('.strength');
    
    if (meter) meter.style.width = `${score}%`;
    if (text) text.textContent = `Strength: ${label}`;
    if (wrapper) {
      wrapper.className = 'strength';
      wrapper.classList.add(`strength--${tier}`);
    }
  }

  // Email validation helper
  isValidEmail(email) {
    if (!email) return false;
    // RFC 5322-like simple pattern for practical validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(String(email).trim());
  }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.signupForm = new SignupForm();
  
  // Add click handler for any elements with data-contact attribute
  document.querySelectorAll('[data-contact]').forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.signupForm) {
        window.signupForm.showContactModal();
      }
    });
  });
  
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = $(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add animation on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .form-control, .btn, .social-btn');
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 50) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Initial check
  animateOnScroll();
  
  // Check on scroll
  window.addEventListener('scroll', animateOnScroll);
});

// Add animation to form elements on page load
window.addEventListener('load', () => {
  const formElements = document.querySelectorAll('.form-control, .btn, .social-btn');
  formElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    
    // Trigger reflow
    void el.offsetWidth;
    
    // Add visible class to trigger animation
    el.classList.add('animate-in');
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
});
