import {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  useEffect,
} from "react";
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

// Style customization props
interface FormFieldStyleProps {
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
  requiredClassName?: string;
  adornmentClassName?: string;
}

// Main FormField props
interface FormFieldProps<T extends FieldValues> extends FormFieldStyleProps {
  /** Field name - must match schema property */
  name: FieldPath<T>;
  /** Field label text */
  label: string;
  /** Input type @default "text" */
  type?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether field is required @default false */
  required?: boolean;

  // Additional content
  /** Helper text shown below input */
  helperText?: string;
  /** Content shown before input */
  leftAdornment?: ReactNode;
  /** Content shown after input */
  rightAdornment?: ReactNode;

  // HTML attributes
  /** Additional input props */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  /** Additional label props */
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;

  // Custom components
  /** Custom input component */
  customInput?: ReactNode;
  /** Custom label component */
  customLabel?: ReactNode;
  /** Custom error component */
  customError?: ReactNode;

  // Validation and transformation
  /** Transform value before validation */
  transform?: (value: unknown) => unknown;
  /** Custom validation function */
  validate?: RegisterOptions<T>["validate"];
  /** Additional register options */
  registerOptions?: Omit<
    RegisterOptions<T>,
    "required" | "validate" | "setValueAs"
  >;

  // Event handlers
  /** Called when field value changes */
  onValueChange?: (value: unknown) => void;
  /** Called when field is focused */
  onFocus?: () => void;
  /** Called when field loses focus */
  onBlur?: () => void;

  // Accessibility
  /** ARIA label for input */
  ariaLabel?: string;
  /** ARIA described by */
  ariaDescribedBy?: string;
  /** Whether to disable the field */
  disabled?: boolean;
  /** Whether the field is read-only */
  readOnly?: boolean;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  required = false,

  // Style props
  containerClassName = "",
  labelClassName = "",
  inputClassName = "",
  errorClassName = "",
  helperTextClassName = "",
  requiredClassName = "",
  adornmentClassName = "",

  // Content props
  helperText,
  leftAdornment,
  rightAdornment,

  // HTML attributes
  inputProps = {},
  labelProps = {},

  // Custom components
  customInput,
  customLabel,
  customError,

  // Validation
  transform,
  validate,
  registerOptions = {},

  // Event handlers
  onValueChange,
  onFocus,
  onBlur,

  // Accessibility
  ariaLabel,
  ariaDescribedBy,
  disabled = false,
  readOnly = false,
}: FormFieldProps<T>) {
  // Get form context
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<T>();

  // Get field error and value
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;
  const fieldValue = watch(name);

  // Handle value changes
  useEffect(() => {
    if (onValueChange) {
      onValueChange(fieldValue);
    }
  }, [fieldValue, onValueChange]);

  // Build register options with proper type handling
  const baseOptions: Partial<RegisterOptions<T>> = {};

  if (required) {
    baseOptions.required = "This field is required";
  }

  if (validate) {
    baseOptions.validate = validate;
  }

  if (transform) {
    baseOptions.setValueAs = transform;
  }

  if (onBlur || registerOptions.onBlur) {
    baseOptions.onBlur = (e) => {
      onBlur?.();
      registerOptions.onBlur?.(e);
    };
  }

  const finalRegisterOptions = {
    ...registerOptions,
    ...baseOptions,
  } as RegisterOptions<T>;

  // Register the field
  const fieldRegistration = register(name, finalRegisterOptions);

  // Build CSS classes
  const containerClasses = [
    "form-field",
    error && "has-error",
    disabled && "disabled",
    readOnly && "read-only",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const labelClasses = [
    "form-field-label",
    error && "text-error",
    required && "required",
    labelClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const inputWrapperClasses = [
    "form-field-input-wrapper",
    leftAdornment && "has-left-adornment",
    rightAdornment && "has-right-adornment",
  ]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [
    "form-field-input",
    error && "border-error",
    disabled && "disabled",
    readOnly && "read-only",
    inputClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const errorClasses = ["form-field-error", errorClassName]
    .filter(Boolean)
    .join(" ");

  const helperTextClasses = ["form-field-helper-text", helperTextClassName]
    .filter(Boolean)
    .join(" ");

  const requiredIndicatorClasses = ["form-field-required", requiredClassName]
    .filter(Boolean)
    .join(" ");

  const adornmentClasses = ["form-field-adornment", adornmentClassName]
    .filter(Boolean)
    .join(" ");

  // Generate unique IDs for accessibility
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  // Build aria-describedby
  const ariaDescribedByValue =
    [
      errorMessage && errorId,
      helperText && !errorMessage && helperId,
      ariaDescribedBy,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={containerClasses}>
      {/* Label */}
      {customLabel || (
        <label htmlFor={fieldId} className={labelClasses} {...labelProps}>
          {label}
          {required && (
            <span className={requiredIndicatorClasses} aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Input wrapper with adornments */}
      <div className={inputWrapperClasses}>
        {/* Left adornment */}
        {leftAdornment && (
          <div className={`${adornmentClasses} form-field-adornment-left`}>
            {leftAdornment}
          </div>
        )}

        {/* Input field */}
        {customInput || (
          <input
            id={fieldId}
            type={type}
            placeholder={placeholder}
            className={inputClasses}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedByValue}
            aria-label={ariaLabel}
            onFocus={(e) => {
              onFocus?.();
              fieldRegistration.onBlur(e);
              inputProps.onFocus?.(e);
            }}
            {...fieldRegistration}
            {...inputProps}
          />
        )}

        {/* Right adornment */}
        {rightAdornment && (
          <div className={`${adornmentClasses} form-field-adornment-right`}>
            {rightAdornment}
          </div>
        )}
      </div>

      {/* Helper text (shown when no error) */}
      {helperText && !errorMessage && (
        <p id={helperId} className={helperTextClasses} role="note">
          {helperText}
        </p>
      )}

      {/* Error message */}
      {errorMessage &&
        (customError || (
          <p
            id={errorId}
            className={errorClasses}
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
          </p>
        ))}
    </div>
  );
}
