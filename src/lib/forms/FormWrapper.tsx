import { useEffect, useState } from "react";
import { FormProvider, useForm, UseFormProps } from "react-hook-form";

import { FormState, FormValidationConfig, FormWrapperProps } from "./types";
import {
  buildClasses,
  createZodResolver,
  getDefaultValidationConfig,
  getErrorMessage,
} from "./utils";

export function FormWrapper<T extends Record<string, any>>(
  props: FormWrapperProps<T>
) {
  const {
    schema,
    onSubmit,
    children,
    options,
    validationConfig = {},
    customValidation,
    onFormStateChange,
    onError,
    onSuccess,
    // Style props
    rootClassName,
    formClassName,
    containerClassName,
    loadingClassName,
    errorClassName,
    successClassName,
    // Component props
    loadingComponent,
    errorComponent,
    successComponent,
    beforeForm,
    afterForm,
    // HTML attributes
    formAttributes,
  } = props;

  // =============================================================================
  // STATE AND CONFIGURATION
  // =============================================================================

  const config = {
    ...getDefaultValidationConfig(),
    ...validationConfig,
  } as Required<FormValidationConfig>;

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isValid: false,
    isDirty: false,
    isValidating: false,
    error: null,
    success: false,
  });

  // =============================================================================
  // FORM SETUP
  // =============================================================================

  const formOptions: UseFormProps<T> = {
    resolver: createZodResolver(schema),
    criteriaMode: config.criteriaMode,
    shouldFocusError: config.shouldFocusError,
    ...(config.mode && { mode: config.mode }),
    ...(config.reValidateMode && { reValidateMode: config.reValidateMode }),
    ...options,
  };

  const methods = useForm<T>(formOptions);

  // =============================================================================
  // FORM STATE MANAGEMENT
  // =============================================================================

  const updateFormState = (updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  // =============================================================================
  // FORM SUBMISSION
  // =============================================================================

  const handleSubmit = async (data: T) => {
    try {
      updateFormState({
        isSubmitting: true,
        error: null,
        success: false,
        isValidating: false,
      });

      // Validate all fields
      const isValid = await methods.trigger();
      if (!isValid) {
        updateFormState({
          isSubmitting: false,
          error: "Please fix the errors above and try again",
          isValidating: false,
        });
        return;
      }

      // Schema validation
      await schema.parseAsync(data);

      // Custom validation
      if (customValidation) {
        await customValidation(data);
      }

      // Submit the form
      await onSubmit(data);

      // Success state
      updateFormState({
        success: true,
        isSubmitting: false,
        isValidating: false,
        error: null,
      });

      onSuccess?.();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      updateFormState({
        error: errorMessage,
        isSubmitting: false,
        isValidating: false,
      });
      onError?.(error);
    }
  };

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Mount validation
  useEffect(() => {
    if (config.validateOnMount) {
      methods.trigger();
    }
  }, [methods, config.validateOnMount]);

  // Delayed validation
  useEffect(() => {
    if (config.validationDelay > 0) {
      const timer = setTimeout(() => methods.trigger(), config.validationDelay);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [methods, config.validationDelay]);

  // Form state synchronization
  useEffect(() => {
    const subscription = methods.watch(() => {
      const { isValid, isDirty } = methods.formState;

      setFormState((prevState) => {
        if (prevState.isValid !== isValid || prevState.isDirty !== isDirty) {
          const newState = { ...prevState, isValid, isDirty };

          // Notify parent of state changes
          onFormStateChange?.({
            isSubmitting: newState.isSubmitting,
            isValid: newState.isValid,
            isDirty: newState.isDirty,
            isValidating: newState.isValidating,
          });

          return newState;
        }
        return prevState;
      });
    });

    return () => subscription.unsubscribe();
  }, [methods, onFormStateChange]);

  // =============================================================================
  // CSS CLASSES
  // =============================================================================

  const cssClasses = {
    root: buildClasses(
      "form-wrapper",
      {
        submitting: formState.isSubmitting,
        "has-error": !!formState.error,
        success: formState.success,
      },
      rootClassName
    ),
    form: buildClasses(
      "form",
      {
        "opacity-50 pointer-events-none": formState.isSubmitting,
      },
      formClassName
    ),
    container: buildClasses("form-container", {}, containerClassName),
  };

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderLoadingState = () => {
    if (!formState.isSubmitting) return null;

    return (
      <div className={buildClasses("form-loading", {}, loadingClassName)}>
        {loadingComponent || <span>Submitting...</span>}
      </div>
    );
  };

  const renderErrorState = () => {
    if (!formState.error) return null;

    return (
      <div
        className={buildClasses("form-error", {}, errorClassName)}
        role="alert"
      >
        {errorComponent || <span>{formState.error}</span>}
      </div>
    );
  };

  const renderSuccessState = () => {
    if (!formState.success || !successComponent) return null;

    return (
      <div
        className={buildClasses("form-success", {}, successClassName)}
        role="status"
      >
        {successComponent}
      </div>
    );
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div className={cssClasses.root}>
      {beforeForm}

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className={cssClasses.form}
          noValidate
          {...formAttributes}
        >
          <div className={cssClasses.container}>{children}</div>

          {renderLoadingState()}
          {renderErrorState()}
          {renderSuccessState()}
        </form>
      </FormProvider>

      {afterForm}
    </div>
  );
}
