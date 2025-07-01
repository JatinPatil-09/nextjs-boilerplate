import { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormProps,
} from "react-hook-form";
import { z } from "zod";

// =============================================================================
// VALIDATION TYPES
// =============================================================================

export type ValidationMode =
  | "onBlur"
  | "onChange"
  | "onSubmit"
  | "onTouched"
  | "all";

export type ReValidationMode = "onBlur" | "onChange" | "onSubmit";

export const VALIDATION_MODES = {
  ON_BLUR: "onBlur",
  ON_CHANGE: "onChange",
  ON_SUBMIT: "onSubmit",
  ON_TOUCHED: "onTouched",
  ALL: "all",
} as const;

// =============================================================================
// SELECT/MULTISELECT TYPES
// =============================================================================

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export type SelectOptions = SelectOption[] | SelectOptionGroup[];

export interface MultiSelectConfig {
  isMultiSelect?: boolean;
  options?: SelectOptions;
  maxSelections?: number;
  displayLimit?: number;
  searchable?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  showSelectedCount?: boolean;
  showSelectedCountThreshold?: number;
  selectedCountText?: (count: number) => string;
  noOptionsText?: string;
  loadingText?: string;
  isLoading?: boolean;
  onOptionsLoad?: () => Promise<SelectOptions>;
  customOptionComponent?: (
    option: SelectOption,
    isSelected: boolean
  ) => ReactNode;
  customSelectedComponent?: (selectedOptions: SelectOption[]) => ReactNode;
}

// =============================================================================
// FORM CONFIGURATION TYPES
// =============================================================================

export interface FormValidationConfig {
  mode?: ValidationMode;
  reValidateMode?: ReValidationMode;
  validateOnMount?: boolean;
  validationDelay?: number;
  criteriaMode?: "firstError" | "all";
  shouldFocusError?: boolean;
}

export interface FormStyleConfig {
  rootClassName?: string;
  formClassName?: string;
  containerClassName?: string;
  loadingClassName?: string;
  errorClassName?: string;
  successClassName?: string;
}

export interface FormFieldStyleConfig {
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
  requiredClassName?: string;
  adornmentClassName?: string;
}

// =============================================================================
// FORM STATE TYPES
// =============================================================================

export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  error: string | null;
  success: boolean;
}

export type FormStateChangeCallback = (
  state: Omit<FormState, "error" | "success">
) => void;

// =============================================================================
// COMPONENT PROPS TYPES
// =============================================================================

export interface FormFieldProps<T extends FieldValues>
  extends FormFieldStyleConfig,
    MultiSelectConfig {
  // Core field properties
  name: FieldPath<T>;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Content and behavior
  helperText?: string;
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;

  // Custom components
  customInput?: ReactNode;
  customLabel?: ReactNode;
  customError?: ReactNode;

  // Validation and transformation
  transform?: (value: unknown) => unknown;
  validate?: RegisterOptions<T>["validate"];
  registerOptions?: Omit<
    RegisterOptions<T>,
    "required" | "validate" | "setValueAs"
  >;

  // Event handlers
  onValueChange?: (value: unknown) => void;
  onFocus?: () => void;
  onBlur?: () => void;

  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;

  // HTML attributes
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
}

export interface FormWrapperProps<T extends FieldValues>
  extends FormStyleConfig {
  // Core form properties
  schema: z.ZodType<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;

  // Form configuration
  options?: Omit<UseFormProps<T>, "resolver">;
  validationConfig?: FormValidationConfig;
  customValidation?: (data: T) => Promise<void> | void;

  // Custom components
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  successComponent?: ReactNode;
  beforeForm?: ReactNode;
  afterForm?: ReactNode;

  // Event handlers
  onFormStateChange?: FormStateChangeCallback;
  onError?: (error: unknown) => void;
  onSuccess?: () => void;

  // HTML attributes
  formAttributes?: React.FormHTMLAttributes<HTMLFormElement>;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export interface ClassNameConditions {
  [key: string]: boolean;
}

// Legacy type aliases for backward compatibility
/** @deprecated Use MultiSelectConfig instead */
export type MultiSelectProps = MultiSelectConfig;
/** @deprecated Use FormStyleConfig instead */
export type FormStyleProps = FormStyleConfig;
/** @deprecated Use FormFieldStyleConfig instead */
export type FormFieldStyleProps = FormFieldStyleConfig;
