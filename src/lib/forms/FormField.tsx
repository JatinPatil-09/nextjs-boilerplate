/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from "react";
import { FieldValues, RegisterOptions, useFormContext } from "react-hook-form";

import { MultiSelect } from "./MultiSelect";
import { FormFieldProps } from "./types";
import {
  buildAriaDescribedBy,
  buildClasses,
  generateErrorId,
  generateFieldId,
  generateHelperId,
  isReactElement,
  shouldDisplayError,
} from "./utils";

// =============================================================================
// FORM FIELD COMPONENT
// =============================================================================

export function FormField<T extends FieldValues>(props: FormFieldProps<T>) {
  const {
    // Core field properties
    name,
    label,
    type = "text",
    placeholder,
    required = false,
    disabled = false,
    readOnly = false,

    // Content and behavior
    helperText,
    leftAdornment,
    rightAdornment,

    // Custom components
    customInput,
    customLabel,
    customError,

    // Validation and transformation
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

    // HTML attributes
    inputProps = {},
    labelProps = {},

    // Style classes
    containerClassName,
    labelClassName,
    inputClassName,
    errorClassName,
    helperTextClassName,
    requiredClassName,
    adornmentClassName,

    // MultiSelect props
    isMultiSelect = false,
    options = [],
    maxSelections,
    displayLimit = 5,
    searchable = true,
    clearable = true,
    closeOnSelect = false,
    showSelectedCount = false,
    showSelectedCountThreshold,
    selectedCountText,
    noOptionsText = "No options available",
    loadingText = "Loading...",
    isLoading = false,
    onOptionsLoad,
    customOptionComponent,
    customSelectedComponent,
  } = props;

  // =============================================================================
  // FORM CONTEXT AND STATE
  // =============================================================================

  const {
    register,
    formState: { errors, touchedFields, isSubmitted, isSubmitSuccessful },
    watch,
  } = useFormContext<T>();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;
  const fieldValue = watch(name);
  const isFieldTouched = !!(touchedFields as any)[name];

  const shouldShowError = shouldDisplayError(
    errorMessage,
    isFieldTouched,
    isSubmitted,
    isSubmitSuccessful
  );

  // =============================================================================
  // FIELD CONFIGURATION
  // =============================================================================

  const fieldId = generateFieldId(name);
  const errorId = generateErrorId(fieldId);
  const helperId = generateHelperId(fieldId);

  const buildRegisterOptions = (): RegisterOptions<T> => {
    const options = { ...registerOptions } as RegisterOptions<T>;

    if (required) options.required = "This field is required";
    if (validate) options.validate = validate;
    if (transform) options.setValueAs = transform;
    if (onBlur || registerOptions.onBlur) {
      options.onBlur = (e) => {
        onBlur?.();
        registerOptions.onBlur?.(e);
      };
    }

    return options;
  };

  const fieldRegistration = register(name, buildRegisterOptions());

  const ariaDescribedByValue = buildAriaDescribedBy([
    shouldShowError && errorId,
    helperText && !shouldShowError && helperId,
    ariaDescribedBy,
  ]);

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    onValueChange?.(fieldValue);
  }, [fieldValue, onValueChange]);

  // =============================================================================
  // CSS CLASSES
  // =============================================================================

  const cssClasses = {
    container: buildClasses(
      "form-field",
      {
        "has-error": shouldShowError,
        disabled: disabled,
        "read-only": readOnly,
      },
      containerClassName
    ),
    label: buildClasses(
      "form-field-label",
      {
        "text-error": shouldShowError,
        required: required,
      },
      labelClassName
    ),
    inputWrapper: buildClasses("relative", {
      "has-left-adornment": !!leftAdornment,
      "has-right-adornment": !!rightAdornment,
    }),
    input: buildClasses(
      "form-field-input",
      {
        "border-error": shouldShowError,
        disabled: disabled,
        "read-only": readOnly,
        "pl-12": !!leftAdornment,
        "pr-12": !!rightAdornment,
        "pl-12 pr-12": !!leftAdornment && !!rightAdornment,
      },
      inputClassName
    ),
    required: buildClasses("form-field-required", {}, requiredClassName),
    leftAdornment: buildClasses(
      "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10",
      {},
      adornmentClassName
    ),
    rightAdornment: buildClasses(
      "absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10",
      {},
      adornmentClassName
    ),
    helperText: buildClasses("form-field-helper-text", {}, helperTextClassName),
    error: buildClasses("form-field-error", {}, errorClassName),
  };

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.();
    inputProps.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.();
    fieldRegistration.onBlur(e);
    inputProps.onBlur?.(e);
  };

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderLabel = () => {
    if (customLabel) return customLabel;

    return (
      <label htmlFor={fieldId} className={cssClasses.label} {...labelProps}>
        {label}
        {required && (
          <span className={cssClasses.required} aria-label="required">
            *
          </span>
        )}
      </label>
    );
  };

  const renderInput = () => {
    // Handle MultiSelect
    if (isMultiSelect) {
      return (
        <MultiSelect
          name={name}
          options={options}
          placeholder={placeholder || "Select options..."}
          searchable={searchable}
          clearable={clearable}
          closeOnSelect={closeOnSelect}
          showSelectedCount={showSelectedCount}
          noOptionsText={noOptionsText}
          loadingText={loadingText}
          isLoading={isLoading}
          className={cssClasses.input}
          disabled={disabled}
          id={fieldId}
          aria-invalid={shouldShowError}
          aria-describedby={ariaDescribedByValue}
          aria-label={ariaLabel || label}
          {...(maxSelections !== undefined && { maxSelections })}
          {...(displayLimit !== undefined && { displayLimit })}
          {...(showSelectedCountThreshold !== undefined && {
            showSelectedCountThreshold,
          })}
          {...(selectedCountText !== undefined && { selectedCountText })}
          {...(onOptionsLoad !== undefined && { onOptionsLoad })}
          {...(customOptionComponent !== undefined && {
            customOptionComponent,
          })}
          {...(customSelectedComponent !== undefined && {
            customSelectedComponent,
          })}
        />
      );
    }

    // Handle Custom Input
    if (customInput) {
      if (isReactElement(customInput)) {
        return React.cloneElement(customInput as React.ReactElement<any>, {
          ...fieldRegistration,
          id: fieldId,
          "aria-invalid": shouldShowError,
          "aria-describedby": ariaDescribedByValue,
          "aria-label": ariaLabel,
          onFocus: (e: React.FocusEvent<any>) => {
            handleFocus(e);
            (customInput.props as any)?.onFocus?.(e);
          },
          onBlur: (e: React.FocusEvent<any>) => {
            handleBlur(e);
            (customInput.props as any)?.onBlur?.(e);
          },
        });
      }
      return customInput;
    }

    // Handle Standard Input
    return (
      <input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        className={cssClasses.input}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={shouldShowError}
        aria-describedby={ariaDescribedByValue}
        aria-label={ariaLabel}
        {...fieldRegistration}
        {...inputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  };

  const renderAdornment = (
    content: React.ReactNode,
    position: "left" | "right"
  ) => {
    if (!content) return null;

    const adornmentClass =
      position === "left"
        ? cssClasses.leftAdornment
        : cssClasses.rightAdornment;

    return <div className={adornmentClass}>{content}</div>;
  };

  const renderHelperText = () => {
    if (!helperText || shouldShowError) return null;

    return (
      <p id={helperId} className={cssClasses.helperText} role="note">
        {helperText}
      </p>
    );
  };

  const renderError = () => {
    if (!shouldShowError) return null;

    if (customError) return customError;

    return (
      <p
        id={errorId}
        className={cssClasses.error}
        role="alert"
        aria-live="polite"
      >
        {errorMessage}
      </p>
    );
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className={cssClasses.container}>
      {renderLabel()}

      <div className={cssClasses.inputWrapper}>
        {renderAdornment(leftAdornment, "left")}
        {renderInput()}
        {renderAdornment(rightAdornment, "right")}
      </div>

      {renderHelperText()}
      {renderError()}
    </div>
  );
}
