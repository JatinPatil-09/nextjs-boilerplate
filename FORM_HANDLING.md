# Form Handling in Next.js Boilerplate

This guide outlines our form handling approach using React Hook Form, Zod, and TypeScript to create type-safe, accessible, and developer-friendly forms.

## Core Libraries

- **react-hook-form**: Form state management with minimal re-renders
- **zod**: TypeScript-first schema validation
- **@hookform/resolvers/zod**: Integration between React Hook Form and Zod

## Getting Started

### 1. Basic Form Setup

```tsx
// src/components/forms/FormWrapper.tsx
import { ReactNode } from "react";
import {
  useForm,
  FormProvider,
  UseFormProps,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface FormWrapperProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  options?: Omit<UseFormProps<T>, "resolver">;
  className?: string;
}

export function FormWrapper<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  options,
  className,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    ...options,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}
```

### 2. Create a Reusable Form Field Component

```tsx
// src/components/forms/FormField.tsx
import { useFormContext, FieldPath, FieldValues } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
}: FormFieldProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={errorMessage ? `${name}-error` : undefined}
        {...register(name)}
      />

      {errorMessage && (
        <p id={`${name}-error`} className="error-message">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
```

## Form Schema Definition

Use Zod to define your form schemas:

```tsx
// src/schemas/userSchema.ts
import { z } from "zod";

export const userFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserFormData = z.infer<typeof userFormSchema>;
```

## Complete Form Example

```tsx
// src/components/forms/UserRegistrationForm.tsx
import { FormWrapper } from "./FormWrapper";
import { FormField } from "./FormField";
import { userFormSchema, UserFormData } from "../../schemas/userSchema";

interface UserRegistrationFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function UserRegistrationForm({ onSubmit }: UserRegistrationFormProps) {
  return (
    <FormWrapper
      schema={userFormSchema}
      onSubmit={onSubmit}
      className="user-registration-form"
    >
      <FormField<UserFormData> name="name" label="Full Name" required />

      <FormField<UserFormData>
        name="email"
        label="Email Address"
        type="email"
        required
      />

      <FormField<UserFormData>
        name="password"
        label="Password"
        type="password"
        required
      />

      <FormField<UserFormData>
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        required
      />

      <button type="submit">Register</button>
    </FormWrapper>
  );
}
```

## Using the Form

```tsx
// src/app/register/page.tsx
"use client";

import { UserRegistrationForm } from "../../components/forms/UserRegistrationForm";
import { UserFormData } from "../../schemas/userSchema";
import { useState } from "react";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      // API call to register user
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Handle successful registration
      // e.g., redirect, show success message, etc.
    } catch (error) {
      // Handle errors
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <h1>Create an Account</h1>
      <UserRegistrationForm onSubmit={handleSubmit} />

      {isSubmitting && <p>Submitting...</p>}
    </div>
  );
}
```

## Advanced Features

### 1. Handling Form Arrays

For dynamic form arrays (e.g., adding multiple items):

```tsx
// FormArray.tsx example
import { useFieldArray, useFormContext } from "react-hook-form";

export function ExperienceFieldArray() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  return (
    <div>
      <h3>Work Experience</h3>

      {fields.map((field, index) => (
        <div key={field.id} className="experience-item">
          <FormField
            name={`experiences.${index}.company`}
            label="Company"
            required
          />

          <FormField
            name={`experiences.${index}.position`}
            label="Position"
            required
          />

          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ company: "", position: "" })}
      >
        Add Experience
      </button>
    </div>
  );
}
```

### 2. Form State Management and Persistence

For persisting form data between sessions:

```tsx
// src/hooks/usePersistedForm.ts
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

export function usePersistedForm<T>(form: UseFormReturn<T>, formId: string) {
  const [isRestored, setIsRestored] = useState(false);

  // Save form data on changes
  useEffect(() => {
    if (!isRestored) return;

    const subscription = form.watch((values) => {
      localStorage.setItem(`form_${formId}`, JSON.stringify(values));
    });

    return () => subscription.unsubscribe();
  }, [form, formId, isRestored]);

  // Restore form data on mount
  useEffect(() => {
    const savedValues = localStorage.getItem(`form_${formId}`);

    if (savedValues) {
      try {
        form.reset(JSON.parse(savedValues));
      } catch (e) {
        console.error("Could not restore form values", e);
      }
    }

    setIsRestored(true);
  }, [form, formId]);

  // Clear form data
  const clearSavedForm = () => {
    localStorage.removeItem(`form_${formId}`);
  };

  return { isRestored, clearSavedForm };
}
```

### 1. Enhanced Form Wrapper with Customization

```tsx
// src/components/forms/FormWrapper.tsx
import { ReactNode } from "react";
import {
  useForm,
  FormProvider,
  UseFormProps,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { twMerge } from "tailwind-merge"; // For handling Tailwind class merging

interface FormWrapperStyleProps {
  rootClassName?: string;
  formClassName?: string;
  containerClassName?: string;
  loadingClassName?: string;
  errorClassName?: string;
  successClassName?: string;
}

// Add validation mode types
type ValidationMode = "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
type ValidationTrigger = "onBlur" | "onChange" | "onSubmit" | "onTouched";

interface FormValidationOptions {
  mode?: ValidationMode;
  reValidateMode?: ValidationMode;
  validationTrigger?: ValidationTrigger[];
  shouldUnregister?: boolean;
  criteriaMode?: "firstError" | "all";
  shouldFocusError?: boolean;
  delayError?: number;
}

interface FormWrapperProps<T extends FieldValues>
  extends FormWrapperStyleProps {
  schema: z.ZodType<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  options?: Omit<UseFormProps<T>, "resolver">;
  // Validation options
  validation?: FormValidationOptions;
  // Additional customization props
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  successComponent?: ReactNode;
  beforeForm?: ReactNode;
  afterForm?: ReactNode;
  formAttributes?: React.FormHTMLAttributes<HTMLFormElement>;
  // Form state handlers
  onFormStateChange?: (state: {
    isSubmitting: boolean;
    isValid: boolean;
    isDirty: boolean;
    isValidating: boolean;
  }) => void;
  // Custom validation
  customValidation?: (data: T) => Promise<void> | void;
  // Error handling
  onError?: (error: unknown) => void;
}

export function FormWrapper<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  options,
  validation = {
    mode: "onBlur",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
    shouldFocusError: true,
    delayError: 0,
  },
  // Style props
  rootClassName,
  formClassName,
  containerClassName,
  loadingClassName,
  errorClassName,
  successClassName,
  // Custom components
  loadingComponent,
  errorComponent,
  successComponent,
  beforeForm,
  afterForm,
  formAttributes,
  // Handlers
  onFormStateChange,
  customValidation,
  onError,
}: FormWrapperProps<T>) {
  const [formState, setFormState] = useState({
    isSubmitting: false,
    isValid: false,
    isDirty: false,
    isValidating: false,
    error: null as string | null,
    success: false,
  });

  // Create validation triggers based on configuration
  const createValidationTriggers = (triggers?: ValidationTrigger[]) => {
    if (!triggers) return {};

    return triggers.reduce(
      (acc, trigger) => {
        acc[trigger] = async () => {
          try {
            await methods.trigger();
          } catch (error) {
            console.error(`Validation failed on ${trigger}:`, error);
          }
        };
        return acc;
      },
      {} as Record<string, () => Promise<void>>
    );
  };

  const methods = useForm<T>({
    resolver: zodResolver(schema),
    mode: validation.mode,
    reValidateMode: validation.reValidateMode,
    criteriaMode: validation.criteriaMode,
    shouldFocusError: validation.shouldFocusError,
    shouldUnregister: validation.shouldUnregister,
    delayError: validation.delayError,
    ...options,
  });

  // Watch form state changes with enhanced state tracking
  useEffect(() => {
    const subscription = methods.watch(() => {
      const formState = methods.formState;
      const state = {
        isSubmitting: formState.isSubmitting,
        isValid: formState.isValid,
        isDirty: formState.isDirty,
        isValidating: formState.isValidating,
      };
      onFormStateChange?.(state);

      setFormState((prev) => ({
        ...prev,
        isValid: formState.isValid,
        isDirty: formState.isDirty,
        isValidating: formState.isValidating,
      }));
    });

    return () => subscription.unsubscribe();
  }, [methods, onFormStateChange]);

  // Enhanced submit handler with better error handling
  const handleSubmit = async (data: T) => {
    try {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
        isValidating: true,
      }));

      // Run schema validation explicitly
      await schema.parseAsync(data);

      // Run custom validation if provided
      if (customValidation) {
        await customValidation(data);
      }

      await onSubmit(data);

      setFormState((prev) => ({
        ...prev,
        success: true,
        isValidating: false,
      }));
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

  const rootClasses = twMerge(
    "form-wrapper",
    formState.isSubmitting && "submitting",
    formState.error && "has-error",
    formState.success && "success",
    rootClassName
  );

  const formClasses = twMerge(
    "form",
    formState.isSubmitting && "opacity-50 pointer-events-none",
    formClassName
  );

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
          <div className={twMerge("form-container", containerClassName)}>
            {children}
          </div>

          {formState.isSubmitting && (
            <div className={twMerge("form-loading", loadingClassName)}>
              {loadingComponent || <span>Submitting...</span>}
            </div>
          )}

          {formState.error && (
            <div className={twMerge("form-error", errorClassName)}>
              {errorComponent || <span>{formState.error}</span>}
            </div>
          )}

          {formState.success && successComponent && (
            <div className={twMerge("form-success", successClassName)}>
              {successComponent}
            </div>
          )}
        </form>
      </FormProvider>

      {afterForm}
    </div>
  );
}
```

### 2. Enhanced Form Field with Advanced Customization

```tsx
// src/components/forms/FormField.tsx
import { useFormContext, FieldPath, FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface FormFieldStyleProps {
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
  requiredClassName?: string;
}

interface FormFieldProps<T extends FieldValues> extends FormFieldStyleProps {
  name: FieldPath<T>;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  // Additional customization
  helperText?: string;
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  // Custom components
  customInput?: ReactNode;
  customLabel?: ReactNode;
  customError?: ReactNode;
  // Validation and transformation
  transform?: (value: any) => any;
  validate?: (value: any) => boolean | string | Promise<boolean | string>;
  // Event handlers
  onValueChange?: (value: any) => void;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  // Style props
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
  helperTextClassName,
  requiredClassName,
  // Additional props
  helperText,
  leftAdornment,
  rightAdornment,
  inputProps,
  labelProps,
  // Custom components
  customInput,
  customLabel,
  customError,
  // Validation and transformation
  transform,
  validate,
  onValueChange,
}: FormFieldProps<T>) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<T>();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;
  const value = watch(name);

  // Handle value changes
  useEffect(() => {
    if (onValueChange) {
      onValueChange(value);
    }
  }, [value, onValueChange]);

  const containerClasses = twMerge(
    "form-field",
    error && "has-error",
    containerClassName
  );

  const labelClasses = twMerge(
    "form-field-label",
    error && "text-error",
    labelClassName
  );

  const inputClasses = twMerge(
    "form-field-input",
    error && "border-error",
    inputClassName
  );

  const errorClasses = twMerge("form-field-error", errorClassName);

  const helperTextClasses = twMerge(
    "form-field-helper-text",
    helperTextClassName
  );

  const requiredIndicatorClasses = twMerge(
    "form-field-required",
    requiredClassName
  );

  const registerOptions = {
    ...register(name, {
      required: required && "This field is required",
      validate: validate,
      setValueAs: transform,
    }),
    ...inputProps,
  };

  return (
    <div className={containerClasses}>
      {/* Label */}
      {customLabel || (
        <label htmlFor={name} className={labelClasses} {...labelProps}>
          {label}
          {required && <span className={requiredIndicatorClasses}>*</span>}
        </label>
      )}

      {/* Input Field */}
      <div className="form-field-input-wrapper">
        {leftAdornment && (
          <div className="form-field-adornment-left">{leftAdornment}</div>
        )}

        {customInput || (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={
              errorMessage
                ? `${name}-error`
                : helperText
                  ? `${name}-helper`
                  : undefined
            }
            {...registerOptions}
          />
        )}

        {rightAdornment && (
          <div className="form-field-adornment-right">{rightAdornment}</div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !errorMessage && (
        <p id={`${name}-helper`} className={helperTextClasses}>
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {errorMessage &&
        (customError || (
          <p id={`${name}-error`} className={errorClasses}>
            {errorMessage}
          </p>
        ))}
    </div>
  );
}
```

### Usage Example with Validation Options

```tsx
function RegistrationForm() {
  return (
    <FormWrapper
      schema={userFormSchema}
      onSubmit={handleSubmit}
      validation={{
        mode: "onChange", // Validate on every change
        reValidateMode: "onBlur", // Re-validate when field loses focus
        validationTrigger: ["onChange", "onBlur"], // Additional triggers
        criteriaMode: "all", // Show all validation errors
        shouldFocusError: true, // Focus first error field
        delayError: 500, // Delay error display by 500ms
      }}
      onFormStateChange={(state) => {
        // Track detailed form state
        console.log("Form state:", state);
      }}
      onError={(error) => {
        // Handle validation/submission errors
        console.error("Form error:", error);
      }}
    >
      <FormField
        name="email"
        label="Email"
        type="email"
        required
        // Field will inherit form-level validation behavior
        // But can override with its own validation props
        validate={async (value) => {
          const isValid = await validateEmail(value);
          return isValid || "Invalid email format";
        }}
      />
      {/* Other fields */}
    </FormWrapper>
  );
}
```

## Validation Modes Explained

1. **Available Modes**:
   - `onBlur`: Validate when field loses focus
   - `onChange`: Validate on every change
   - `onSubmit`: Validate only on form submission
   - `onTouched`: Validate after field is touched
   - `all`: Validate on all events

2. **Validation Triggers**:
   - Configure multiple validation events
   - Mix and match different triggers
   - Control validation timing
   - Handle async validation efficiently

3. **Error Handling**:
   - Configurable error display delay
   - Focus management for errors
   - Comprehensive error state tracking
   - Custom error handling callbacks

4. **Performance Considerations**:
   - Debounced validation for onChange mode
   - Optimized re-render cycles
   - Efficient validation state tracking
   - Proper cleanup of subscriptions

5. **Best Practices**:
   - Choose appropriate validation mode based on UX requirements
   - Consider performance implications of each mode
   - Implement proper error handling
   - Use validation triggers judiciously

## Conclusion

This form handling approach provides a robust foundation for creating forms in Next.js projects. By combining React Hook Form for state management and Zod for validation, we get excellent developer experience, strong type safety, and good performance.

Junior developers should be able to quickly get started by following the patterns provided here, adding new form fields and validation rules as needed for their specific use cases.

/\*\*

- Available validation modes
  \*/
  export const VALIDATION_MODES = {
  ON_BLUR: "onBlur",
  ON_CHANGE: "onChange",
  ON_SUBMIT: "onSubmit",
  ON_TOUCHED: "onTouched",
  ALL: "all",
  } as const;

export type ValidationMode = typeof VALIDATION_MODES[keyof typeof VALIDATION_MODES];

interface FormValidationConfig {
/\*\*

- When to trigger validation
- @default "onBlur"
  \*/
  mode?: ValidationMode;
  /\*\*
- When to trigger revalidation
- @default "onChange"
  \*/
  reValidateMode?: ValidationMode;
  /\*\*
- Whether to validate on mount
- @default false
  \*/
  validateOnMount?: boolean;
  /\*\*
- Delay in ms before showing validation errors
- @default 0
  \*/
  validationDelay?: number;
  /\*\*
- Whether to show all errors or just the first one
- @default "firstError"
  \*/
  criteriaMode?: "firstError" | "all";
  }

interface FormWrapperProps<T extends FieldValues> {
// ... existing props ...

/\*\*

- Validation configuration
  \*/
  validationConfig?: FormValidationConfig;
  }

export function FormWrapper<T extends FieldValues>({
schema,
onSubmit,
children,
validationConfig = {
mode: VALIDATION_MODES.ON_BLUR,
reValidateMode: VALIDATION_MODES.ON_CHANGE,
validateOnMount: false,
validationDelay: 0,
criteriaMode: "firstError",
},
// ... other props
}: FormWrapperProps<T>) {
const methods = useForm<T>({
resolver: zodResolver(schema),
mode: validationConfig.mode,
reValidateMode: validationConfig.reValidateMode,
criteriaMode: validationConfig.criteriaMode,
...options,
});

// Validate on mount if configured
useEffect(() => {
if (validationConfig.validateOnMount) {
methods.trigger();
}
}, [methods, validationConfig.validateOnMount]);

// Handle delayed validation
useEffect(() => {
if (validationConfig.validationDelay > 0) {
const timer = setTimeout(() => {
methods.trigger();
}, validationConfig.validationDelay);

      return () => clearTimeout(timer);
    }

}, [methods, validationConfig.validationDelay]);

// ... rest of the component implementation
}

## Usage Examples

### 1. Basic Usage with Default Validation (onBlur)

```tsx
function SimpleForm() {
  return (
    <FormWrapper schema={userSchema} onSubmit={handleSubmit}>
      <FormField name="email" label="Email" />
      <FormField name="password" label="Password" type="password" />
    </FormWrapper>
  );
}
```

### 2. Real-time Validation (onChange)

```tsx
function RealtimeValidationForm() {
  return (
    <FormWrapper
      schema={userSchema}
      onSubmit={handleSubmit}
      validationConfig={{
        mode: VALIDATION_MODES.ON_CHANGE,
        reValidateMode: VALIDATION_MODES.ON_CHANGE,
        validateOnMount: true, // Validate fields immediately
        criteriaMode: "all", // Show all errors
      }}
    >
      <FormField name="email" label="Email" />
      <FormField name="password" label="Password" type="password" />
    </FormWrapper>
  );
}
```

### 3. Submit-only Validation

```tsx
function SubmitOnlyForm() {
  return (
    <FormWrapper
      schema={userSchema}
      onSubmit={handleSubmit}
      validationConfig={{
        mode: VALIDATION_MODES.ON_SUBMIT,
        reValidateMode: VALIDATION_MODES.ON_SUBMIT,
      }}
    >
      <FormField name="email" label="Email" />
      <FormField name="password" label="Password" type="password" />
    </FormWrapper>
  );
}
```

### 4. Delayed Validation for Better UX

```tsx
function DelayedValidationForm() {
  return (
    <FormWrapper
      schema={userSchema}
      onSubmit={handleSubmit}
      validationConfig={{
        mode: VALIDATION_MODES.ON_CHANGE,
        validationDelay: 500, // Wait 500ms before showing errors
        criteriaMode: "all",
      }}
    >
      <FormField name="email" label="Email" />
      <FormField name="password" label="Password" type="password" />
    </FormWrapper>
  );
}
```

### 5. Mixed Validation Strategy

```tsx
function MixedValidationForm() {
  return (
    <FormWrapper
      schema={userSchema}
      onSubmit={handleSubmit}
      validationConfig={{
        mode: VALIDATION_MODES.ON_BLUR, // Validate on blur by default
        reValidateMode: VALIDATION_MODES.ON_CHANGE, // But revalidate on change
        validateOnMount: false,
        validationDelay: 200,
      }}
    >
      {/* This field follows the form's validation config */}
      <FormField name="email" label="Email" />

      {/* This field has its own validation behavior */}
      <FormField
        name="password"
        label="Password"
        type="password"
        validateOn="onChange" // Override form-level validation mode
      />
    </FormWrapper>
  );
}
```

## Validation Modes Explained

1. **onBlur** (Default):
   - Validates when a field loses focus
   - Good balance between UX and validation
   - Recommended for most forms

2. **onChange**:
   - Validates on every keystroke
   - Best for immediate feedback
   - Consider using with `validationDelay` for better UX

3. **onSubmit**:
   - Validates only when form is submitted
   - Less intrusive user experience
   - Good for simple forms

4. **onTouched**:
   - Validates after field is interacted with
   - Similar to onBlur but persists
   - Good for complex forms

5. **all**:
   - Combines all validation modes
   - Most strict validation
   - Use sparingly, can be overwhelming

## Best Practices

1. **Choose the Right Mode**:

   ```tsx
   // For login forms: validate on submit
   <FormWrapper
     validationConfig={{
       mode: VALIDATION_MODES.ON_SUBMIT
     }}
   />

   // For registration forms: validate on blur
   <FormWrapper
     validationConfig={{
       mode: VALIDATION_MODES.ON_BLUR
     }}
   />

   // For search forms: validate on change with delay
   <FormWrapper
     validationConfig={{
       mode: VALIDATION_MODES.ON_CHANGE,
       validationDelay: 300
     }}
   />
   ```

2. **Performance Considerations**:
   - Use `validationDelay` with onChange validation
   - Avoid validateOnMount for large forms
   - Consider criteriaMode impact on performance

3. **UX Recommendations**:

   ```tsx
   // Good UX for complex forms
   <FormWrapper
     validationConfig={{
       mode: VALIDATION_MODES.ON_BLUR,
       reValidateMode: VALIDATION_MODES.ON_CHANGE,
       validationDelay: 200,
       criteriaMode: "firstError",
     }}
   />
   ```

4. **Field-Level Override**:
   ```tsx
   <FormField
     name="email"
     validateOn="onChange"
     validationDelay={300}
     showAllErrors={true}
   />
   ```
