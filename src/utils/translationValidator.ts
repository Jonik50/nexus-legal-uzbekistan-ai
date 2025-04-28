
import en from "@/locales/en/index";
import ru from "@/locales/ru/index";
import uz from "@/locales/uz/index";

type ValidationResult = {
  missingKeys: string[];
  structuralDifferences: string[];
};

/**
 * Compare objects recursively to find missing keys
 */
function compareObjects(
  source: any,
  target: any,
  path: string = "",
  results: ValidationResult
): void {
  // Handle arrays
  if (Array.isArray(source)) {
    if (!Array.isArray(target)) {
      results.structuralDifferences.push(
        `${path}: Expected array but found ${typeof target}`
      );
    }
    return;
  }

  // Handle objects
  if (typeof source === "object" && source !== null) {
    if (typeof target !== "object" || target === null) {
      results.structuralDifferences.push(
        `${path}: Expected object but found ${typeof target}`
      );
      return;
    }

    // Check each key in source object
    for (const key in source) {
      const newPath = path ? `${path}.${key}` : key;
      
      if (!(key in target)) {
        results.missingKeys.push(newPath);
      } else {
        compareObjects(source[key], target[key], newPath, results);
      }
    }
  }
}

/**
 * Validates translation object structure against a reference language (usually English)
 */
export function validateTranslations(reference = "en"): Record<string, ValidationResult> {
  const referenceObj = reference === "en" ? en : reference === "ru" ? ru : uz;
  const results: Record<string, ValidationResult> = {};

  // Compare each language against reference
  for (const lang of ["en", "ru", "uz"]) {
    if (lang === reference) continue;
    
    const targetObj = lang === "en" ? en : lang === "ru" ? ru : uz;
    
    results[lang] = {
      missingKeys: [],
      structuralDifferences: [],
    };

    compareObjects(referenceObj, targetObj, "", results[lang]);
  }

  // Log results to console in development
  if (process.env.NODE_ENV === "development") {
    console.group("Translation Validation Results");
    Object.entries(results).forEach(([lang, result]) => {
      const hasIssues = result.missingKeys.length > 0 || result.structuralDifferences.length > 0;
      
      if (hasIssues) {
        console.group(`Issues in ${lang} translations`);
        
        if (result.missingKeys.length > 0) {
          console.group(`Missing keys (${result.missingKeys.length}):`);
          result.missingKeys.forEach(key => console.log(`- ${key}`));
          console.groupEnd();
        }
        
        if (result.structuralDifferences.length > 0) {
          console.group(`Structural differences (${result.structuralDifferences.length}):`);
          result.structuralDifferences.forEach(diff => console.log(`- ${diff}`));
          console.groupEnd();
        }
        
        console.groupEnd();
      } else {
        console.log(`✅ ${lang}: No issues found`);
      }
    });
    console.groupEnd();
  }

  return results;
}

// Auto-run in development
if (process.env.NODE_ENV === "development") {
  setTimeout(() => {
    validateTranslations();
  }, 1000);
}
