import { SelectOption, SelectOptionGroup } from "@/lib/forms";

// =============================================================================
// FORM FIELD OPTIONS
// =============================================================================

export const PROGRAMMING_LANGUAGES: SelectOption[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "cpp", label: "C++" },
];

export const FRAMEWORKS: SelectOptionGroup[] = [
  {
    label: "Frontend",
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue.js" },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte" },
      { value: "nextjs", label: "Next.js" },
      { value: "nuxt", label: "Nuxt.js" },
    ],
  },
  {
    label: "Backend",
    options: [
      { value: "express", label: "Express.js" },
      { value: "fastapi", label: "FastAPI" },
      { value: "django", label: "Django" },
      { value: "spring", label: "Spring Boot" },
      { value: "laravel", label: "Laravel" },
      { value: "rails", label: "Ruby on Rails" },
    ],
  },
  {
    label: "Mobile",
    options: [
      { value: "reactnative", label: "React Native" },
      { value: "flutter", label: "Flutter" },
      { value: "ionic", label: "Ionic" },
      { value: "xamarin", label: "Xamarin" },
    ],
  },
];

export const COUNTRIES: SelectOption[] = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "au", label: "Australia" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
];

export const SKILLS: SelectOption[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "design", label: "UI/UX Design" },
  { value: "devops", label: "DevOps" },
  { value: "testing", label: "Testing" },
  { value: "database", label: "Database Management" },
];

export const EXPERIENCE_LEVELS: SelectOption[] = [
  { value: "junior", label: "Junior (0-2 years)" },
  { value: "mid", label: "Mid-level (2-5 years)" },
  { value: "senior", label: "Senior (5-8 years)" },
  { value: "lead", label: "Lead (8+ years)" },
];

export const AVAILABILITY_OPTIONS: SelectOption[] = [
  { value: "immediate", label: "Available immediately" },
  { value: "2weeks", label: "Available in 2 weeks" },
  { value: "1month", label: "Available in 1 month" },
  { value: "3months", label: "Available in 3 months" },
];

// =============================================================================
// DYNAMIC OPTIONS LOADERS
// =============================================================================

export const loadTechInterests = async (): Promise<SelectOption[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    { value: "ai", label: "Artificial Intelligence" },
    { value: "ml", label: "Machine Learning" },
    { value: "blockchain", label: "Blockchain" },
    { value: "iot", label: "Internet of Things" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "cloudcomputing", label: "Cloud Computing" },
    { value: "gamedev", label: "Game Development" },
    { value: "mobiledev", label: "Mobile Development" },
    { value: "webdev", label: "Web Development" },
    { value: "datascience", label: "Data Science" },
    { value: "devops", label: "DevOps" },
    { value: "automation", label: "Automation" },
    { value: "microservices", label: "Microservices" },
    { value: "containerization", label: "Containerization" },
  ];
};

// =============================================================================
// FORM DEFAULT VALUES
// =============================================================================

export const FORM_DEFAULT_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  age: 25,
  phone: "",
  website: "",
  birthDate: "",
  salary: 50000,
  bio: "",
  country: "",
  skills: "",
  newsletter: false,
  terms: false,
  experience: "mid" as const,
  availability: "",
  programmingLanguages: [] as string[],
  frameworks: [] as string[],
  interests: [] as string[],
};

// =============================================================================
// VALIDATION MESSAGES
// =============================================================================

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  PASSWORD_COMPLEXITY: "Password must contain uppercase, lowercase, and number",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  AGE_MIN: "Must be at least 18 years old",
  AGE_MAX: "Age cannot exceed 100",
  PHONE_INVALID: "Invalid phone number format",
  URL_INVALID: "Please enter a valid URL",
  BIO_MAX_LENGTH: "Bio must be less than 500 characters",
  SALARY_POSITIVE: "Salary must be positive",
  MIN_SELECTIONS: (min: number, field: string) =>
    `Please select at least ${min} ${field}`,
  TERMS_REQUIRED: "You must accept the terms and conditions",
} as const;
