"use client";

import { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";

import {
  AVAILABILITY_OPTIONS,
  COUNTRIES,
  demoFormSchema,
  EXPERIENCE_LEVELS,
  FORM_DEFAULT_VALUES,
  FORM_STYLES,
  FRAMEWORKS,
  loadTechInterests,
  PROGRAMMING_LANGUAGES,
  SKILLS,
  type DemoFormData,
} from "@/constants";
import { FormField, FormWrapper } from "@/lib/forms";

// =============================================================================
// CUSTOM COMPONENTS
// =============================================================================

function FormSubmitButton() {
  const { formState } = useFormContext();
  const { isSubmitting } = formState;

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={FORM_STYLES.BUTTON_PRIMARY}
    >
      {isSubmitting ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
          Submitting...
        </div>
      ) : (
        "Submit Form"
      )}
    </button>
  );
}

function RadioGroup({
  name,
  options,
}: {
  name: string;
  options: { value: string | number; label: string }[];
}) {
  const { register, watch } = useFormContext();
  const currentValue = watch(name);

  return (
    <div className={FORM_STYLES.RADIO_GROUP}>
      {options.map((option) => (
        <label key={option.value} className={FORM_STYLES.RADIO_ITEM}>
          <input
            type="radio"
            value={option.value.toString()}
            className={FORM_STYLES.RADIO}
            {...register(name)}
            checked={currentValue === option.value.toString()}
          />
          <span className={FORM_STYLES.RADIO_LABEL}>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function Select({
  name,
  options,
  placeholder,
}: {
  name: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}) {
  const { register } = useFormContext();

  return (
    <select className={FORM_STYLES.SELECT} {...register(name)}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value.toString()}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Textarea({
  name,
  placeholder,
  rows = 4,
}: {
  name: string;
  placeholder?: string;
  rows?: number;
}) {
  const { register } = useFormContext();

  return (
    <textarea
      placeholder={placeholder}
      rows={rows}
      className={FORM_STYLES.TEXTAREA}
      {...register(name)}
    />
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function FormsDemo() {
  const [submissionCount, setSubmissionCount] = useState(0);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const handleSubmit = useCallback(async (data: DemoFormData) => {
    console.log("Form submitted:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmissionCount((prev) => prev + 1);
  }, []);

  const handleError = useCallback((error: unknown) => {
    console.error("Form submission error:", error);
  }, []);

  const handleSuccess = useCallback(() => {
    console.log("Form submitted successfully!");
  }, []);

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className={FORM_STYLES.CARD}>
          {/* Header */}
          <div className={FORM_STYLES.CARD_HEADER}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Form Demo</h1>
            <p className="text-gray-600">
              Comprehensive form demonstrating all field types and validation
              features
            </p>
            {submissionCount > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium">
                  ✅ Form submitted successfully {submissionCount} time(s)
                </p>
              </div>
            )}
          </div>

          <FormWrapper
            schema={demoFormSchema}
            onSubmit={handleSubmit}
            onError={handleError}
            onSuccess={handleSuccess}
            validationConfig={{
              mode: "onTouched",
              reValidateMode: "onChange",
              criteriaMode: "firstError",
              shouldFocusError: true,
            }}
            options={{
              shouldUnregister: false,
              defaultValues: FORM_DEFAULT_VALUES,
            }}
            formClassName={FORM_STYLES.CONTAINER}
            loadingComponent={
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <span className="ml-3 text-blue-600 font-medium">
                  Processing...
                </span>
              </div>
            }
            successComponent={
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Form submitted successfully! 🎉
                    </p>
                  </div>
                </div>
              </div>
            }
          >
            {/* Personal Information Section */}
            <section className={FORM_STYLES.SECTION}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>

              <div className={FORM_STYLES.GRID_TWO_COLS}>
                <FormField<DemoFormData>
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName={FORM_STYLES.INPUT_BASE}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                />

                <FormField<DemoFormData>
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName={FORM_STYLES.INPUT_BASE}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                />
              </div>

              <FormField<DemoFormData>
                name="email"
                label="Email Address"
                type="email"
                placeholder="user@example.com"
                required
                containerClassName={FORM_STYLES.FIELD_CONTAINER}
                labelClassName={FORM_STYLES.LABEL}
                inputClassName={FORM_STYLES.INPUT_BASE}
                errorClassName={FORM_STYLES.ERROR_TEXT}
                helperText="We'll never share your email with anyone else"
                helperTextClassName={FORM_STYLES.HELPER_TEXT}
              />

              <div className={FORM_STYLES.GRID_TWO_COLS}>
                <FormField<DemoFormData>
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter secure password"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName={FORM_STYLES.INPUT_BASE}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  helperText="Must contain uppercase, lowercase, and number"
                  helperTextClassName={FORM_STYLES.HELPER_TEXT}
                />

                <FormField<DemoFormData>
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName={FORM_STYLES.INPUT_BASE}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                />
              </div>
            </section>

            <div className={FORM_STYLES.DIVIDER} />

            {/* Demographics Section */}
            <section className={FORM_STYLES.SECTION}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Demographics
              </h3>

              <div className={FORM_STYLES.GRID_THREE_COLS}>
                <FormField<DemoFormData>
                  name="age"
                  label="Age"
                  type="number"
                  placeholder="25"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName={FORM_STYLES.INPUT_BASE}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  transform={(value) => parseInt(value as string)}
                />

                <FormField<DemoFormData>
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName={FORM_STYLES.INPUT_BASE}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                />

                <FormField<DemoFormData>
                  name="birthDate"
                  label="Birth Date"
                  type="date"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName={FORM_STYLES.INPUT_BASE}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                />
              </div>

              <div className={FORM_STYLES.GRID_TWO_COLS}>
                <FormField<DemoFormData>
                  name="website"
                  label="Website"
                  type="url"
                  placeholder="https://example.com"
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName={FORM_STYLES.INPUT_BASE}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  helperText="Optional: Your personal or professional website"
                  helperTextClassName={FORM_STYLES.HELPER_TEXT}
                />

                <FormField<DemoFormData>
                  name="country"
                  label="Country"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  customInput={
                    <Select
                      name="country"
                      options={COUNTRIES}
                      placeholder="Select a country"
                    />
                  }
                />
              </div>
            </section>

            <div className={FORM_STYLES.DIVIDER} />

            {/* Professional Information Section */}
            <section className={FORM_STYLES.SECTION}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Professional Information
              </h3>

              <div className={FORM_STYLES.GRID_TWO_COLS}>
                <FormField<DemoFormData>
                  name="salary"
                  label="Expected Salary"
                  type="number"
                  placeholder="50000"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName={FORM_STYLES.INPUT_BASE}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  leftAdornment={
                    <span className="text-gray-600 font-semibold text-sm">
                      $
                    </span>
                  }
                  transform={(value) => parseFloat(value as string)}
                />

                <FormField<DemoFormData>
                  name="skills"
                  label="Primary Skill"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  customInput={
                    <Select
                      name="skills"
                      options={SKILLS}
                      placeholder="Select a skill"
                    />
                  }
                />
              </div>

              <FormField<DemoFormData>
                name="bio"
                label="Bio"
                containerClassName={FORM_STYLES.FIELD_CONTAINER}
                labelClassName={FORM_STYLES.LABEL}
                errorClassName={FORM_STYLES.ERROR_TEXT}
                helperText="Tell us about yourself (max 500 characters)"
                helperTextClassName={FORM_STYLES.HELPER_TEXT}
                customInput={
                  <Textarea
                    name="bio"
                    placeholder="Write a brief bio about yourself..."
                    rows={4}
                  />
                }
              />

              <div className={FORM_STYLES.GRID_TWO_COLS}>
                <FormField<DemoFormData>
                  name="experience"
                  label="Experience Level"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  customInput={
                    <RadioGroup name="experience" options={EXPERIENCE_LEVELS} />
                  }
                />

                <FormField<DemoFormData>
                  name="availability"
                  label="Availability"
                  required
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  customInput={
                    <Select
                      name="availability"
                      options={AVAILABILITY_OPTIONS}
                      placeholder="Select availability"
                    />
                  }
                />
              </div>
            </section>

            <div className={FORM_STYLES.DIVIDER} />

            {/* File Uploads Section */}
            <section className={FORM_STYLES.SECTION}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                File Uploads
              </h3>

              <div className={FORM_STYLES.GRID_TWO_COLS}>
                <FormField<DemoFormData>
                  name="avatar"
                  label="Profile Picture"
                  type="file"
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName={FORM_STYLES.FILE_INPUT}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  helperText="Upload a profile picture (JPG, PNG)"
                  helperTextClassName={FORM_STYLES.HELPER_TEXT}
                  inputProps={{
                    accept: "image/*",
                    multiple: false,
                  }}
                  transform={(files) => (files as FileList)?.[0]}
                />

                <FormField<DemoFormData>
                  name="resume"
                  label="Resume"
                  type="file"
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName={FORM_STYLES.FILE_INPUT}
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  helperText="Upload your resume (PDF preferred)"
                  helperTextClassName={FORM_STYLES.HELPER_TEXT}
                  inputProps={{
                    accept: ".pdf,.doc,.docx",
                    multiple: false,
                  }}
                  transform={(files) => (files as FileList)?.[0]}
                />
              </div>
            </section>

            <div className={FORM_STYLES.DIVIDER} />

            {/* Technical Skills Section */}
            <section className={FORM_STYLES.SECTION}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Technical Skills
              </h3>

              <div className={FORM_STYLES.SECTION}>
                <FormField<DemoFormData>
                  name="programmingLanguages"
                  label="Programming Languages"
                  required
                  isMultiSelect
                  options={PROGRAMMING_LANGUAGES}
                  placeholder="Select programming languages..."
                  maxSelections={10}
                  displayLimit={5}
                  searchable
                  clearable
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName="w-full"
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  helperText="Select programming languages you're proficient in"
                  helperTextClassName={FORM_STYLES.HELPER_TEXT}
                />

                <FormField<DemoFormData>
                  name="frameworks"
                  label="Frameworks & Libraries"
                  isMultiSelect
                  options={FRAMEWORKS}
                  placeholder="Select frameworks..."
                  searchable
                  clearable
                  displayLimit={5}
                  showSelectedCount
                  showSelectedCountThreshold={3}
                  selectedCountText={(count) =>
                    `${count} framework${count !== 1 ? "s" : ""} selected`
                  }
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName="w-full"
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  helperText="Choose frameworks you have experience with"
                  helperTextClassName={FORM_STYLES.HELPER_TEXT}
                />

                <FormField<DemoFormData>
                  name="interests"
                  label="Technology Interests"
                  required
                  isMultiSelect
                  onOptionsLoad={loadTechInterests}
                  placeholder="Loading interests..."
                  searchable
                  clearable
                  closeOnSelect={false}
                  containerClassName={FORM_STYLES.FIELD_CONTAINER}
                  labelClassName={FORM_STYLES.LABEL}
                  inputClassName="w-full"
                  errorClassName={FORM_STYLES.ERROR_TEXT}
                  helperText="Select at least 2 technology areas you're interested in"
                  helperTextClassName={FORM_STYLES.HELPER_TEXT}
                />
              </div>
            </section>

            <div className={FORM_STYLES.DIVIDER} />

            {/* Agreement Section */}
            <section className={FORM_STYLES.SECTION}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preferences & Agreement
              </h3>

              <div className="space-y-4">
                <FormField<DemoFormData>
                  name="newsletter"
                  label="Subscribe to newsletter for updates and tips"
                  type="checkbox"
                  containerClassName={FORM_STYLES.CHECKBOX_CONTAINER}
                  labelClassName="text-sm text-gray-700"
                  inputClassName={FORM_STYLES.CHECKBOX}
                />

                <FormField<DemoFormData>
                  name="terms"
                  label="I agree to the terms and conditions and privacy policy"
                  type="checkbox"
                  required
                  containerClassName={FORM_STYLES.CHECKBOX_CONTAINER}
                  labelClassName="text-sm text-gray-700"
                  inputClassName={FORM_STYLES.CHECKBOX}
                  errorClassName={`${FORM_STYLES.ERROR_TEXT} block mt-2`}
                />
              </div>
            </section>

            {/* Actions */}
            <div className={FORM_STYLES.ACTIONS_CONTAINER}>
              <button
                type="button"
                className={FORM_STYLES.BUTTON_SECONDARY}
                onClick={() => window.location.reload()}
              >
                Reset Form
              </button>
              <FormSubmitButton />
            </div>
          </FormWrapper>
        </div>
      </div>
    </div>
  );
}
