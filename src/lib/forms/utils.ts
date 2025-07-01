import { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import { z } from "zod";

import {
  ClassNameConditions,
  FormValidationConfig,
  ReValidationMode,
  SelectOption,
  SelectOptionGroup,
  VALIDATION_MODES,
  ValidationMode,
} from "./types";

// =============================================================================
// CSS CLASS UTILITIES
// =============================================================================

/**
 * Builds CSS class names by combining base classes, conditional classes, and custom classes
 */
export const buildClasses = (
  baseClass: string,
  conditions: ClassNameConditions = {},
  customClass?: string
): string => {
  return [
    baseClass,
    ...Object.entries(conditions)
      .filter(([, condition]) => condition)
      .map(([className]) => className),
    customClass,
  ]
    .filter(Boolean)
    .join(" ");
};

// =============================================================================
// FORM VALIDATION UTILITIES
// =============================================================================

/**
 * Creates a Zod resolver for React Hook Form
 */
export const createZodResolver = <T extends FieldValues>(
  schema: z.ZodType<T>
): Resolver<T> => {
  return async (values, _context, _options) => {
    try {
      const data = await schema.parseAsync(values);
      return { values: data, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: FieldErrors<T> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const path = err.path.join(".") as keyof T;
            errors[path] = {
              type: "validation",
              message: err.message,
            } as FieldErrors<T>[keyof T];
          }
        });
        return { values: {}, errors };
      }
      throw error;
    }
  };
};

/**
 * Gets default validation configuration with sensible defaults
 */
export const getDefaultValidationConfig =
  (): Required<FormValidationConfig> => ({
    mode: VALIDATION_MODES.ON_TOUCHED as ValidationMode,
    reValidateMode: VALIDATION_MODES.ON_CHANGE as ReValidationMode,
    validateOnMount: false,
    validationDelay: 0,
    criteriaMode: "firstError",
    shouldFocusError: true,
  });

// =============================================================================
// ERROR HANDLING UTILITIES
// =============================================================================

/**
 * Extracts a user-friendly error message from an error object
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

// =============================================================================
// FORM FIELD UTILITIES
// =============================================================================

/**
 * Determines if a form field error should be displayed
 */
export const shouldDisplayError = (
  errorMessage: string | undefined,
  isFieldTouched: boolean,
  isSubmitted: boolean,
  isSubmitSuccessful: boolean
): boolean => {
  return !!(
    errorMessage &&
    (isFieldTouched || (isSubmitted && !isSubmitSuccessful))
  );
};

/**
 * Builds aria-describedby attribute value from multiple possible IDs
 */
export const buildAriaDescribedBy = (
  ids: (string | undefined | false)[]
): string | undefined => {
  const validIds = ids.filter(Boolean) as string[];
  return validIds.length > 0 ? validIds.join(" ") : undefined;
};

/**
 * Generates consistent field IDs
 */
export const generateFieldId = (name: string): string => `field-${name}`;

/**
 * Generates consistent error IDs
 */
export const generateErrorId = (fieldId: string): string => `${fieldId}-error`;

/**
 * Generates consistent helper text IDs
 */
export const generateHelperId = (fieldId: string): string =>
  `${fieldId}-helper`;

// =============================================================================
// ARRAY UTILITIES
// =============================================================================

/**
 * Safely flattens nested arrays (for processing grouped options)
 */
export const flattenOptions = (
  items: (SelectOption | SelectOptionGroup)[]
): SelectOption[] => {
  return items.reduce((acc: SelectOption[], item) => {
    if ("options" in item && Array.isArray(item.options)) {
      return [...acc, ...item.options];
    }
    return [...acc, item as SelectOption];
  }, []);
};

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Type guard to check if an error is a Zod error
 */
export const isZodError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};

/**
 * Type guard to check if a value is a React element
 */
export const isReactElement = (value: unknown): value is React.ReactElement => {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "props" in value
  );
};
