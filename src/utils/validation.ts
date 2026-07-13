/**
 * Validation utilities for forms with sanitization and duplicate/spam protection.
 */

export interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  budget?: string;
  message?: string;
  general?: string;
}

/**
 * Sanitizes input text to prevent XSS or HTML injection
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates standard fields
 */
export function validateForm(fields: {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  budget?: string;
  message?: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name Validation
  if (fields.name !== undefined) {
    const name = fields.name.trim();
    if (!name) {
      errors.name = 'Full Name is required';
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }
  }

  // Email Validation
  if (fields.email !== undefined) {
    const email = fields.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  // Phone Validation
  if (fields.phone !== undefined) {
    const phone = fields.phone.trim();
    // Validates international numbers, allowing spaces, hyphens, plus sign, and parentheses
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      errors.phone = 'Please enter a valid phone number (7-20 digits)';
    }
  }

  // Website URL Validation
  if (fields.website !== undefined) {
    const website = fields.website.trim();
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    if (!website) {
      errors.website = 'Website URL is required';
    } else if (!urlRegex.test(website)) {
      errors.website = 'Please enter a valid website URL (e.g., example.com)';
    }
  }

  // Budget Validation
  if (fields.budget !== undefined) {
    const budget = fields.budget.trim();
    if (!budget) {
      errors.budget = 'Please select a budget range';
    }
  }

  // Message / Notes Validation
  if (fields.message !== undefined) {
    const message = fields.message.trim();
    if (!message) {
      errors.message = 'Message is required';
    } else if (message.length < 10) {
      errors.message = 'Please provide a bit more detail (at least 10 characters)';
    } else if (message.length > 2000) {
      errors.message = 'Message cannot exceed 2000 characters';
    }
  }

  return errors;
}

/**
 * Checks for duplicate submissions by implementing a cooldown time per form key.
 * Cooldown duration is specified in milliseconds (default: 60 seconds).
 */
export function isCooldownActive(formKey: string, cooldownMs = 60000): { active: boolean; remainingSeconds: number } {
  const lastSubmitKey = `hds_last_submit_${formKey}`;
  const lastSubmitTime = localStorage.getItem(lastSubmitKey);

  if (lastSubmitTime) {
    const elapsed = Date.now() - parseInt(lastSubmitTime, 10);
    if (elapsed < cooldownMs) {
      const remainingSeconds = Math.ceil((cooldownMs - elapsed) / 1000);
      return { active: true, remainingSeconds };
    }
  }

  return { active: false, remainingSeconds: 0 };
}

/**
 * Updates the last submission timestamp for a form key.
 */
export function setCooldownTimestamp(formKey: string): void {
  const lastSubmitKey = `hds_last_submit_${formKey}`;
  localStorage.setItem(lastSubmitKey, Date.now().toString());
}
