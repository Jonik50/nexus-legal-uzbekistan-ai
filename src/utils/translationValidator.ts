
import en from "../locales/en/index";
import ru from "../locales/ru/index";
import uz from "../locales/uz/index";

type ValidationIssue = {
  language: string;
  key: string;
  expected: string;
  actual: string | undefined;
  severity: 'error' | 'warning';
};

/**
 * Validates that all necessary translation keys exist across languages
 * This function is intended to be used during development to catch missing translations
 */
export function validateTranslations(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const requiredArrays = [
    { key: 'features.items', expected: 'array' },
    { key: 'faq.items', expected: 'array' },
    { key: 'testimonials.items', expected: 'array' },
    { key: 'personas.items', expected: 'array' },
    { key: 'advantages.table.headers', expected: 'array' },
    { key: 'advantages.table.rows', expected: 'array' },
    { key: 'security.features', expected: 'array' },
  ];

  // Check each language for each required array
  const languages = { en, ru, uz };
  Object.entries(languages).forEach(([lang, translations]) => {
    requiredArrays.forEach(({ key, expected }) => {
      const keyPath = key.split('.');
      let value: any = translations;
      
      // Navigate through the object path
      for (const k of keyPath) {
        value = value?.[k];
        if (value === undefined) break;
      }
      
      // Check if the value exists and is an array
      if (value === undefined) {
        issues.push({
          language: lang,
          key,
          expected,
          actual: 'undefined',
          severity: 'error'
        });
      } else if (expected === 'array' && !Array.isArray(value)) {
        issues.push({
          language: lang,
          key,
          expected,
          actual: typeof value,
          severity: 'error'
        });
      }
    });
  });

  return issues;
}

/**
 * Logs validation issues to the console
 * This can be called during development to catch translation issues
 */
export function logTranslationIssues(): void {
  const issues = validateTranslations();
  
  if (issues.length === 0) {
    console.log('✓ All translations validated successfully');
    return;
  }
  
  console.group('Translation Validation Issues');
  issues.forEach(issue => {
    const method = issue.severity === 'error' ? 'error' : 'warn';
    console[method](
      `[${issue.language}] ${issue.key}: Expected ${issue.expected}, got ${issue.actual}`
    );
  });
  console.groupEnd();
}

// This can be automatically run in development environments
if (process.env.NODE_ENV === 'development') {
  // Uncomment to enable automatic validation during development
  // logTranslationIssues();
}

/**
 * Checks if a path exists in a nested object
 * This is useful for checking if a translation key exists
 */
export function pathExists(obj: any, path: string): boolean {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null || !Object.prototype.hasOwnProperty.call(current, key)) {
      return false;
    }
    current = current[key];
  }
  
  return true;
}

/**
 * Gets a value from a nested object by path
 */
export function getByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[key];
  }
  
  return current;
}
