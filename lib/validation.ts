export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validation = {
  validateName: (name: string): ValidationResult => {
    if (name.length < 1) {
      return { isValid: false, error: 'Name is required' };
    }
    if (name.length > 50) {
      return { isValid: false, error: 'Name must be 50 characters or less' };
    }
    return { isValid: true };
  },

  validateBio: (bio: string): ValidationResult => {
    if (bio.length > 500) {
      return { isValid: false, error: 'Bio must be 500 characters or less' };
    }
    return { isValid: true };
  }
};
