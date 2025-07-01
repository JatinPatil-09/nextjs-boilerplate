# Form Handling Library Documentation

A comprehensive, type-safe form handling library built with React Hook Form, Zod validation, and TypeScript. This library provides reusable components and utilities for building forms with consistent styling, validation, and user experience.

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Usage](#basic-usage)
- [Form Components](#form-components)
- [Field Types](#field-types)
- [Validation](#validation)
- [Advanced Features](#advanced-features)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [API Reference](#api-reference)

---

## Getting Started

### Installation

The form library is already included in this project. You can import components and utilities like this:

```typescript
import { FormWrapper, FormField, buildClasses } from "@/lib/forms";
import { demoFormSchema, FORM_STYLES, COUNTRIES } from "@/constants";
```

### Core Concepts

1. **FormWrapper**: The main container that handles form state, validation, and submission
2. **FormField**: Individual form fields with built-in validation and styling
3. **Zod Schema**: Defines validation rules and TypeScript types
4. **Constants**: Reusable options, styles, and configuration

---

## Basic Usage

### 1. Create a Validation Schema

First, define your form structure using Zod:

```typescript
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be 18 or older"),
});

type UserFormData = z.infer<typeof userSchema>;
```

### 2. Create Your Form Component

```typescript
"use client";

import { useState } from "react";
import { FormWrapper, FormField } from "@/lib/forms";
import { FORM_STYLES } from "@/constants";

export default function UserForm() {
  const [submissionCount, setSubmissionCount] = useState(0);

  const handleSubmit = async (data: UserFormData) => {
    console.log("Form data:", data);
    // API call here
    setSubmissionCount(prev => prev + 1);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <FormWrapper
        schema={userSchema}
        onSubmit={handleSubmit}
        formClassName={FORM_STYLES.CONTAINER}
      >
        <FormField<UserFormData>
          name="name"
          label="Full Name"
          placeholder="Enter your name"
          required
          containerClassName={FORM_STYLES.FIELD_CONTAINER}
          labelClassName={FORM_STYLES.LABEL}
          inputClassName={FORM_STYLES.INPUT_BASE}
          errorClassName={FORM_STYLES.ERROR_TEXT}
        />

        <FormField<UserFormData>
          name="email"
          label="Email"
          type="email"
          placeholder="user@example.com"
          required
          containerClassName={FORM_STYLES.FIELD_CONTAINER}
          labelClassName={FORM_STYLES.LABEL}
          inputClassName={FORM_STYLES.INPUT_BASE}
          errorClassName={FORM_STYLES.ERROR_TEXT}
        />

        <FormField<UserFormData>
          name="age"
          label="Age"
          type="number"
          required
          containerClassName={FORM_STYLES.FIELD_CONTAINER}
          labelClassName={FORM_STYLES.LABEL}
          inputClassName={FORM_STYLES.INPUT_BASE}
          errorClassName={FORM_STYLES.ERROR_TEXT}
          transform={(value) => parseInt(value as string)}
        />

        <button
          type="submit"
          className={FORM_STYLES.BUTTON_PRIMARY}
        >
          Submit
        </button>
      </FormWrapper>
    </div>
  );
}
```

---

## Form Components

### FormWrapper

The main form container that manages form state, validation, and submission.

#### Basic Props

```typescript
interface FormWrapperProps<T> {
  schema: z.ZodType<T>; // Zod validation schema
  onSubmit: (data: T) => void; // Submit handler
  children: ReactNode; // Form fields

  // Optional configuration
  options?: UseFormProps<T>; // React Hook Form options
  validationConfig?: {
    mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched";
    reValidateMode?: "onBlur" | "onChange" | "onSubmit";
  };

  // Event handlers
  onError?: (error: unknown) => void;
  onSuccess?: () => void;

  // Custom components
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  successComponent?: ReactNode;
}
```

#### Example with All Options

```typescript
<FormWrapper
  schema={userSchema}
  onSubmit={handleSubmit}
  onError={(error) => console.error(error)}
  onSuccess={() => alert("Success!")}
  validationConfig={{
    mode: "onTouched",
    reValidateMode: "onChange"
  }}
  options={{
    defaultValues: { name: "", email: "", age: 18 }
  }}
  loadingComponent={<div>Saving...</div>}
  successComponent={<div>Form saved successfully!</div>}
>
  {/* Your form fields here */}
</FormWrapper>
```

### FormField

Individual form fields with built-in validation and styling.

#### Basic Props

```typescript
interface FormFieldProps<T> {
  name: string; // Field name (must match schema)
  label: string; // Field label
  type?: string; // Input type (text, email, password, etc.)
  placeholder?: string; // Placeholder text
  required?: boolean; // Whether field is required
  disabled?: boolean; // Whether field is disabled

  // Styling
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;

  // Content
  helperText?: string; // Help text below field
  leftAdornment?: ReactNode; // Icon/text on left
  rightAdornment?: ReactNode; // Icon/text on right

  // Custom components
  customInput?: ReactNode; // Custom input component
  customLabel?: ReactNode; // Custom label component

  // Validation & transformation
  transform?: (value: any) => any; // Transform value before validation
  validate?: (value: any) => boolean | string;

  // Events
  onValueChange?: (value: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```

---

## Field Types

### Standard Input Fields

```typescript
// Text input
<FormField<T>
  name="firstName"
  label="First Name"
  type="text"
  placeholder="Enter first name"
/>

// Email input
<FormField<T>
  name="email"
  label="Email"
  type="email"
  placeholder="user@example.com"
/>

// Password input
<FormField<T>
  name="password"
  label="Password"
  type="password"
  placeholder="Enter password"
/>

// Number input
<FormField<T>
  name="age"
  label="Age"
  type="number"
  transform={(value) => parseInt(value as string)}
/>

// Date input
<FormField<T>
  name="birthDate"
  label="Birth Date"
  type="date"
/>

// File input
<FormField<T>
  name="avatar"
  label="Profile Picture"
  type="file"
  inputProps={{ accept: "image/*" }}
  transform={(files) => (files as FileList)?.[0]}
/>
```

### Checkbox and Radio

```typescript
// Checkbox
<FormField<T>
  name="newsletter"
  label="Subscribe to newsletter"
  type="checkbox"
  containerClassName="flex items-center space-x-2"
/>

// Radio (requires custom component)
<FormField<T>
  name="experience"
  label="Experience Level"
  customInput={
    <RadioGroup
      name="experience"
      options={[
        { value: "junior", label: "Junior" },
        { value: "senior", label: "Senior" }
      ]}
    />
  }
/>
```

### Select Dropdown

```typescript
<FormField<T>
  name="country"
  label="Country"
  customInput={
    <Select
      name="country"
      options={[
        { value: "us", label: "United States" },
        { value: "ca", label: "Canada" }
      ]}
      placeholder="Select country"
    />
  }
/>
```

### Textarea

```typescript
<FormField<T>
  name="bio"
  label="Bio"
  customInput={
    <Textarea
      name="bio"
      placeholder="Tell us about yourself..."
      rows={4}
    />
  }
/>
```

### Multi-Select

```typescript
<FormField<T>
  name="skills"
  label="Skills"
  isMultiSelect
  options={[
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "react", label: "React" }
  ]}
  placeholder="Select skills..."
  searchable
  clearable
  maxSelections={5}
/>
```

---

## Validation

### Schema-Level Validation

Define validation rules in your Zod schema:

```typescript
const schema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
    age: z.number().min(18, "Must be 18+").max(100, "Invalid age"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

### Field-Level Validation

Add custom validation to specific fields:

```typescript
<FormField<T>
  name="username"
  label="Username"
  validate={async (value) => {
    if (!value) return true;
    const isAvailable = await checkUsernameAvailability(value);
    return isAvailable || "Username is not available";
  }}
/>
```

### Async Validation

```typescript
const validateEmail = async (email: string) => {
  const response = await fetch(`/api/check-email?email=${email}`);
  const data = await response.json();
  return data.available || "Email is already taken";
};

<FormField<T>
  name="email"
  label="Email"
  validate={validateEmail}
/>
```

---

## Advanced Features

### Custom Input Components

Create reusable custom inputs:

```typescript
function CustomDatePicker({ name }: { name: string }) {
  const { register } = useFormContext();

  return (
    <input
      type="date"
      className="custom-date-picker"
      {...register(name)}
    />
  );
}

// Usage
<FormField<T>
  name="birthDate"
  label="Birth Date"
  customInput={<CustomDatePicker name="birthDate" />}
/>
```

### Multi-Step Forms

```typescript
function MultiStepForm() {
  const [step, setStep] = useState(1);

  return (
    <FormWrapper schema={schema} onSubmit={handleSubmit}>
      {step === 1 && (
        <div>
          <FormField name="firstName" label="First Name" />
          <FormField name="lastName" label="Last Name" />
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <FormField name="email" label="Email" />
          <FormField name="phone" label="Phone" />
          <button onClick={() => setStep(1)}>Back</button>
          <button type="submit">Submit</button>
        </div>
      )}
    </FormWrapper>
  );
}
```

### Dynamic Fields

```typescript
function DynamicForm() {
  const [skills, setSkills] = useState([""]);

  const addSkill = () => setSkills([...skills, ""]);
  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <FormWrapper schema={schema} onSubmit={handleSubmit}>
      {skills.map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <FormField
            name={`skills.${index}`}
            label={`Skill ${index + 1}`}
          />
          <button onClick={() => removeSkill(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addSkill}>Add Skill</button>
    </FormWrapper>
  );
}
```

### Conditional Fields

```typescript
function ConditionalForm() {
  const { watch } = useFormContext();
  const hasLicense = watch("hasLicense");

  return (
    <>
      <FormField
        name="hasLicense"
        label="Do you have a driver's license?"
        type="checkbox"
      />

      {hasLicense && (
        <FormField
          name="licenseNumber"
          label="License Number"
          required
        />
      )}
    </>
  );
}
```

---

## Best Practices

### 1. Organize Constants

Keep form options and styles in constants files:

```typescript
// constants/form-options.ts
export const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
];

export const FORM_DEFAULT_VALUES = {
  firstName: "",
  email: "",
  country: "",
  skills: [],
};
```

### 2. Use TypeScript Generics

Always specify the form data type:

```typescript
<FormField<UserFormData>
  name="email"  // TypeScript will validate this exists in UserFormData
  label="Email"
/>
```

### 3. Consistent Styling

Use style constants for consistency:

```typescript
import { FORM_STYLES } from "@/constants";

<FormField
  name="email"
  label="Email"
  containerClassName={FORM_STYLES.FIELD_CONTAINER}
  labelClassName={FORM_STYLES.LABEL}
  inputClassName={FORM_STYLES.INPUT_BASE}
  errorClassName={FORM_STYLES.ERROR_TEXT}
/>
```

### 4. Form State Management

Handle form state changes:

```typescript
<FormWrapper
  schema={schema}
  onSubmit={handleSubmit}
  onFormStateChange={(state) => {
    console.log("Form is valid:", state.isValid);
    console.log("Form is dirty:", state.isDirty);
  }}
/>
```

### 5. Error Handling

Provide meaningful error messages:

```typescript
const handleError = (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("Something went wrong");
  }
};

<FormWrapper
  schema={schema}
  onSubmit={handleSubmit}
  onError={handleError}
/>
```

---

## Examples

### Complete Registration Form

```typescript
"use client";

import { useState } from "react";
import { z } from "zod";
import { FormWrapper, FormField } from "@/lib/forms";
import { FORM_STYLES, COUNTRIES } from "@/constants";

const registrationSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be 8+ characters"),
  country: z.string().min(1, "Please select a country"),
  agreeToTerms: z.boolean().refine(val => val, "Must agree to terms")
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Registration successful!");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>

      <FormWrapper
        schema={registrationSchema}
        onSubmit={handleSubmit}
        formClassName={FORM_STYLES.CONTAINER}
        options={{
          defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            country: "",
            agreeToTerms: false
          }
        }}
      >
        {/* Name Fields */}
        <div className={FORM_STYLES.GRID_TWO_COLS}>
          <FormField<RegistrationData>
            name="firstName"
            label="First Name"
            required
            containerClassName={FORM_STYLES.FIELD_CONTAINER}
            labelClassName={FORM_STYLES.LABEL}
            inputClassName={FORM_STYLES.INPUT_BASE}
            errorClassName={FORM_STYLES.ERROR_TEXT}
          />

          <FormField<RegistrationData>
            name="lastName"
            label="Last Name"
            required
            containerClassName={FORM_STYLES.FIELD_CONTAINER}
            labelClassName={FORM_STYLES.LABEL}
            inputClassName={FORM_STYLES.INPUT_BASE}
            errorClassName={FORM_STYLES.ERROR_TEXT}
          />
        </div>

        {/* Email */}
        <FormField<RegistrationData>
          name="email"
          label="Email Address"
          type="email"
          required
          containerClassName={FORM_STYLES.FIELD_CONTAINER}
          labelClassName={FORM_STYLES.LABEL}
          inputClassName={FORM_STYLES.INPUT_BASE}
          errorClassName={FORM_STYLES.ERROR_TEXT}
        />

        {/* Password */}
        <FormField<RegistrationData>
          name="password"
          label="Password"
          type="password"
          required
          containerClassName={FORM_STYLES.FIELD_CONTAINER}
          labelClassName={FORM_STYLES.LABEL}
          inputClassName={FORM_STYLES.INPUT_BASE}
          errorClassName={FORM_STYLES.ERROR_TEXT}
          helperText="Must be at least 8 characters"
          helperTextClassName={FORM_STYLES.HELPER_TEXT}
        />

        {/* Country */}
        <FormField<RegistrationData>
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
              placeholder="Select your country"
            />
          }
        />

        {/* Terms Agreement */}
        <FormField<RegistrationData>
          name="agreeToTerms"
          label="I agree to the Terms of Service and Privacy Policy"
          type="checkbox"
          required
          containerClassName={FORM_STYLES.CHECKBOX_CONTAINER}
          inputClassName={FORM_STYLES.CHECKBOX}
          errorClassName={FORM_STYLES.ERROR_TEXT}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={FORM_STYLES.BUTTON_PRIMARY}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </FormWrapper>
    </div>
  );
}
```

---

## API Reference

### Utilities

#### `buildClasses(baseClass, conditions, customClass)`

Utility for building conditional CSS classes:

```typescript
import { buildClasses } from "@/lib/forms";

const className = buildClasses(
  "base-class",
  {
    "error-class": hasError,
    "disabled-class": isDisabled,
  },
  "custom-class"
);
```

#### `createZodResolver(schema)`

Creates a React Hook Form resolver from a Zod schema:

```typescript
import { createZodResolver } from "@/lib/forms";

const resolver = createZodResolver(mySchema);
```

#### `shouldDisplayError(errorMessage, isTouched, isSubmitted, isSuccessful)`

Determines when to show field errors:

```typescript
import { shouldDisplayError } from "@/lib/forms";

const showError = shouldDisplayError(
  error?.message,
  fieldTouched,
  formSubmitted,
  submitSuccessful
);
```

### Form State

The form provides access to these state values:

```typescript
interface FormState {
  isSubmitting: boolean; // Form is being submitted
  isValid: boolean; // All fields are valid
  isDirty: boolean; // Form has been modified
  isValidating: boolean; // Validation in progress
  error: string | null; // Submission error
  success: boolean; // Submission succeeded
}
```

### Validation Modes

```typescript
type ValidationMode =
  | "onBlur" // Validate when field loses focus
  | "onChange" // Validate on every change
  | "onSubmit" // Validate only on submit
  | "onTouched" // Validate after field is touched
  | "all"; // Validate on all events
```

---

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Make sure your field names match your schema exactly
2. **Validation Not Working**: Check that your schema is properly defined
3. **Styling Issues**: Use the provided style constants for consistency
4. **Form Not Submitting**: Ensure your submit handler is async if making API calls

### Debug Tips

1. Use `console.log` in your submit handler to check form data
2. Check the browser's Network tab for API request errors
3. Use React DevTools to inspect form state
4. Validate your Zod schema separately if needed

---

This documentation covers the essential usage patterns for the form handling library. For more complex use cases, refer to the demo form in `/src/app/[locale]/form/page.tsx` which demonstrates all features in action.
