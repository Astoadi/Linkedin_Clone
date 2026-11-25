export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_.]+$/;

export function validateRequired(value, fieldName = 'This field') {
  if (!value || !value.toString().trim()) {
    return `${fieldName} is required.`;
  }
  return null;
}

export function validateEmail(email) {
  const requiredError = validateRequired(email, 'Email address');
  if (requiredError) return requiredError;
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address (e.g. name@domain.com).';
  }
  return null;
}

export function validatePassword(password, minLength = 6) {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters.`;
  }
  return null;
}

export function validateUsername(username) {
  const requiredError = validateRequired(username, 'Username');
  if (requiredError) return requiredError;
  const clean = username.trim();
  if (clean.length < 3) {
    return 'Username must be at least 3 characters.';
  }
  if (clean.length > 30) {
    return 'Username cannot exceed 30 characters.';
  }
  if (!USERNAME_REGEX.test(clean)) {
    return 'Username can only contain letters, numbers, underscores, and dots.';
  }
  return null;
}

function finalizeValidation(errors) {
  const keys = Object.keys(errors);
  return {
    isValid: keys.length === 0,
    errors,
    firstError: keys.length > 0 ? errors[keys[0]] : null,
  };
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validateRequired(password, 'Password');
  if (passwordError) errors.password = passwordError;

  return finalizeValidation(errors);
}

export function validateRegisterForm({ name, username, email, password }) {
  const errors = {};
  const nameError = validateRequired(name, 'Full name');
  if (nameError) errors.name = nameError;

  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password, 6);
  if (passwordError) errors.password = passwordError;

  return finalizeValidation(errors);
}

export function validatePostForm({ body, media }) {
  if ((!body || !body.trim()) && !media) {
    return {
      isValid: false,
      error: 'Please enter post content or upload an image before sharing.',
    };
  }
  if (body && body.trim().length > 3000) {
    return {
      isValid: false,
      error: 'Post content cannot exceed 3,000 characters.',
    };
  }
  return { isValid: true, error: null };
}

export function validateCommentForm(commentText) {
  if (!commentText || !commentText.trim()) {
    return {
      isValid: false,
      error: 'Comment cannot be empty.',
    };
  }
  return { isValid: true, error: null };
}

export function validateProfileForm({ name }) {
  const errors = {};
  const nameError = validateRequired(name, 'Full name');
  if (nameError) errors.name = nameError;
  return finalizeValidation(errors);
}

export function validateWorkForm({ company, position, years }) {
  const errors = {};
  const companyError = validateRequired(company, 'Company name');
  if (companyError) errors.company = companyError;

  const positionError = validateRequired(position, 'Position');
  if (positionError) errors.position = positionError;

  const yearsError = validateRequired(years, 'Years of experience');
  if (yearsError) errors.years = yearsError;

  return finalizeValidation(errors);
}

export function validateEducationForm({ school, degree, fieldOfStudy }) {
  const errors = {};
  const schoolError = validateRequired(school, 'School');
  if (schoolError) errors.school = schoolError;

  const degreeError = validateRequired(degree, 'Degree');
  if (degreeError) errors.degree = degreeError;

  const fieldError = validateRequired(fieldOfStudy, 'Field of study');
  if (fieldError) errors.fieldOfStudy = fieldError;

  return finalizeValidation(errors);
}
