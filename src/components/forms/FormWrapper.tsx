import { ReactNode, useEffect, useState } from "react";
import {
  FieldErrors,
  FieldValues,
  FormProvider,
  Resolver,
  useForm,
  UseFormProps,
} from "react-hook-form";
import { z } from "zod";

// Custom Zod resolver
function createZodResolver<T extends FieldValues>(
  schema: z.ZodType<T>
): Resolver<T> {
  return async (values, _context, _options) => {
    try {
      const data = await schema.parseAsync(values);
      return {
        values: data,
        errors: {},
      };
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

        return {
          values: {},
          errors,
        };
      }

      throw error;
    }
  };
}

// Validation mode constants
export const VALIDATION_MODES = {
  ON_BLUR: "onBlur",
  ON_CHANGE: "onChange",
  ON_SUBMIT: "onSubmit",
  ON_TOUCHED: "onTouched",
  ALL: "all",
} as const;

export type ValidationMode =
  | "onBlur"
  | "onChange"
  | "onSubmit"
  | "onTouched"
  | "all";
export type ReValidationMode = "onBlur" | "onChange" | "onSubmit";

// Form validation configuration interface
interface FormValidationConfig {
  /** When to trigger validation @default "onBlur" */
  mode?: ValidationMode;
  /** When to trigger revalidation @default "onChange" */
  reValidateMode?: ReValidationMode;
  /** Whether to validate on mount @default false */
  validateOnMount?: boolean;
  /** Delay in ms before showing validation errors @default 0 */
  validationDelay?: number;
  /** Whether to show all errors or just the first one @default "firstError" */
  criteriaMode?: "firstError" | "all";
  /** Whether to focus first error field @default true */
  shouldFocusError?: boolean;
}

// Style customization props
interface FormWrapperStyleProps {
  rootClassName?: string;
  formClassName?: string;
  containerClassName?: string;
  loadingClassName?: string;
  errorClassName?: string;
  successClassName?: string;
}

// Form state interface
interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  error: string | null;
  success: boolean;
}

// Main FormWrapper props
interface FormWrapperProps<T extends FieldValues>
  extends FormWrapperStyleProps {
  /** Zod schema for form validation */
  schema: z.ZodType<T>;
  /** Form submission handler */
  onSubmit: (data: T) => void | Promise<void>;
  /** Form content */
  children: ReactNode;
  /** React Hook Form options (excluding resolver) */
  options?: Omit<UseFormProps<T>, "resolver">;
  /** Validation configuration */
  validationConfig?: FormValidationConfig;

  // Custom components
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  successComponent?: ReactNode;
  beforeForm?: ReactNode;
  afterForm?: ReactNode;

  // Form attributes
  formAttributes?: React.FormHTMLAttributes<HTMLFormElement>;

  // Event handlers
  onFormStateChange?: (state: Omit<FormState, "error" | "success">) => void;
  onError?: (error: unknown) => void;
  onSuccess?: () => void;

  // Custom validation
  customValidation?: (data: T) => Promise<void> | void;
}

export function FormWrapper<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  options,
  validationConfig = {
    mode: VALIDATION_MODES.ON_BLUR as ValidationMode,
    reValidateMode: VALIDATION_MODES.ON_CHANGE as ReValidationMode,
    validateOnMount: false,
    validationDelay: 0,
    criteriaMode: "firstError",
    shouldFocusError: true,
  },
  // Style props
  rootClassName = "",
  formClassName = "",
  containerClassName = "",
  loadingClassName = "",
  errorClassName = "",
  successClassName = "",
  // Custom components
  loadingComponent,
  errorComponent,
  successComponent,
  beforeForm,
  afterForm,
  formAttributes,
  // Event handlers
  onFormStateChange,
  onError,
  onSuccess,
  customValidation,
}: FormWrapperProps<T>) {
  // Internal form state
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isValid: false,
    isDirty: false,
    isValidating: false,
    error: null,
    success: false,
  });

  // Initialize React Hook Form with custom Zod resolver
  const formOptions: Required<
    Pick<UseFormProps<T>, "resolver" | "criteriaMode" | "shouldFocusError">
  > &
    Omit<UseFormProps<T>, "resolver" | "criteriaMode" | "shouldFocusError"> = {
    resolver: createZodResolver(schema),
    criteriaMode: validationConfig.criteriaMode || "firstError",
    shouldFocusError: validationConfig.shouldFocusError ?? true,
    ...options,
  };

  // Add mode if specified
  if (validationConfig.mode) {
    formOptions.mode = validationConfig.mode as ValidationMode;
  }

  // Add reValidateMode if specified
  if (validationConfig.reValidateMode) {
    formOptions.reValidateMode =
      validationConfig.reValidateMode as ReValidationMode;
  }

  const methods = useForm<T>(formOptions);

  // Validate on mount if configured
  useEffect(() => {
    if (validationConfig.validateOnMount) {
      methods.trigger();
    }
  }, [methods, validationConfig.validateOnMount]);

  // Handle delayed validation
  useEffect(() => {
    if (
      validationConfig.validationDelay &&
      validationConfig.validationDelay > 0
    ) {
      const timer = setTimeout(() => {
        methods.trigger();
      }, validationConfig.validationDelay);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [methods, validationConfig.validationDelay]);

  // Watch form state changes
  useEffect(() => {
    const subscription = methods.watch(() => {
      const formStateData = methods.formState;
      const newState = {
        isSubmitting: formStateData.isSubmitting,
        isValid: formStateData.isValid,
        isDirty: formStateData.isDirty,
        isValidating: formStateData.isValidating,
      };

      // Update internal state
      setFormState((prev) => ({
        ...prev,
        ...newState,
      }));

      // Notify parent component
      onFormStateChange?.(newState);
    });

    return () => subscription.unsubscribe();
  }, [methods, onFormStateChange]);

  // Enhanced submit handler
  const handleSubmit = async (data: FieldValues) => {
    const typedData = data as T;
    try {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
        success: false,
        isValidating: true,
      }));

      // Run schema validation explicitly
      await schema.parseAsync(typedData);

      // Run custom validation if provided
      if (customValidation) {
        await customValidation(typedData);
      }

      // Submit the form
      await onSubmit(typedData);

      // Handle success
      setFormState((prev) => ({
        ...prev,
        success: true,
        isValidating: false,
      }));

      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Form submission failed";

      setFormState((prev) => ({
        ...prev,
        error: errorMessage,
        isValidating: false,
      }));

      onError?.(error);
    } finally {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  // Build CSS classes
  const rootClasses = [
    "form-wrapper",
    formState.isSubmitting && "submitting",
    formState.error && "has-error",
    formState.success && "success",
    rootClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const formClasses = [
    "form",
    formState.isSubmitting && "opacity-50 pointer-events-none",
    formClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const containerClasses = ["form-container", containerClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClasses}>
      {beforeForm}

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className={formClasses}
          noValidate
          {...formAttributes}
        >
          <div className={containerClasses}>{children}</div>

          {/* Loading State */}
          {formState.isSubmitting && (
            <div className={`form-loading ${loadingClassName}`.trim()}>
              {loadingComponent || <span>Submitting...</span>}
            </div>
          )}

          {/* Error State */}
          {formState.error && (
            <div className={`form-error ${errorClassName}`.trim()} role="alert">
              {errorComponent || <span>{formState.error}</span>}
            </div>
          )}

          {/* Success State */}
          {formState.success && successComponent && (
            <div
              className={`form-success ${successClassName}`.trim()}
              role="status"
            >
              {successComponent}
            </div>
          )}
        </form>
      </FormProvider>

      {afterForm}
    </div>
  );
}
