document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.validated-form');

  const getFeedback = field => {
    const wrapper = field.closest('.mb-3') || field.parentElement;
    return wrapper.querySelector('.invalid-feedback');
  };

  const setError = (field, message) => {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    const feedback = getFeedback(field);
    if (feedback) {
      feedback.textContent = message;
    }
  };

  const clearError = field => {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    const feedback = getFeedback(field);
    if (feedback) {
      feedback.textContent = '';
    }
  };

  const validateField = field => {
    const value = field.value.trim();
    const name = field.name;

    if (!value) {
      setError(field, 'This field is required.');
      return false;
    }
    if (name.endsWith('[price]')) {
      const number = Number(value);
      if (Number.isNaN(number)) {
        setError(field, 'Price must be a valid number.');
        return false;
      }
      if (number < 0) {
        setError(field, 'Price cannot be negative.');
        return false;
      }
    }

    clearError(field);
    return true;
  };

  const validateForm = form => {
    let formValid = true;
    const fields = form.querySelectorAll('input[name^="campground"], textarea[name^="campground"], select[name^="review"], input[name^="review"], textarea[name^="review"]');
    fields.forEach(field => {
      if (!validateField(field)) {
        formValid = false;
      }
    });
    return formValid;
  };

  forms.forEach(form => {
    const fields = form.querySelectorAll('input[name^="campground"], textarea[name^="campground"], select[name^="review"], input[name^="review"], textarea[name^="review"]');
    fields.forEach(field => {
      const eventType = field.tagName.toLowerCase() === 'select' ? 'change' : 'input';
      field.addEventListener(eventType, () => validateField(field));
    });

    form.addEventListener('submit', event => {
      form.classList.add('was-validated');
      if (!validateForm(form)) {
        event.preventDefault();
        event.stopPropagation();
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      } else {
        const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
        submitButtons.forEach(button => {
          button.disabled = true;
          button.classList.add('opacity-75');
        });
      }
    });
  });

  const scrollFadeElements = document.querySelectorAll('.scroll-fade-in');
  if (scrollFadeElements.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    scrollFadeElements.forEach(element => observer.observe(element));
  }
});
