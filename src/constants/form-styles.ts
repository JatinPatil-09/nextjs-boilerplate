// =============================================================================
// FORM CSS CLASSES
// =============================================================================

export const FORM_STYLES = {
  // Container styles
  CONTAINER: "space-y-6",
  SECTION: "space-y-4",
  GRID_TWO_COLS: "grid grid-cols-1 md:grid-cols-2 gap-6",
  GRID_THREE_COLS: "grid grid-cols-1 md:grid-cols-3 gap-6",

  // Field container styles
  FIELD_CONTAINER: "space-y-2",
  CHECKBOX_CONTAINER: "flex items-center space-x-3",

  // Label styles
  LABEL: "block text-sm font-medium text-gray-700",
  REQUIRED_MARK: "text-red-500 ml-1",

  // Input styles
  INPUT_BASE:
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
  INPUT_ERROR: "border-red-300 focus:ring-red-500",
  TEXTAREA:
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors",
  SELECT:
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
  CHECKBOX: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded",
  RADIO: "h-4 w-4 text-blue-600 focus:ring-blue-500",

  // Helper text and error styles
  HELPER_TEXT: "text-sm text-gray-500",
  ERROR_TEXT: "text-sm text-red-600",

  // Button styles
  BUTTON_PRIMARY:
    "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium",
  BUTTON_SECONDARY:
    "px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium",

  // Layout styles
  ACTIONS_CONTAINER: "flex justify-end space-x-4 pt-8 border-t border-gray-200",
  DIVIDER: "border-t border-gray-200 my-8",

  // Card styles
  CARD: "bg-white rounded-xl shadow-sm border border-gray-200 p-8",
  CARD_HEADER: "mb-8 pb-6 border-b border-gray-200",

  // Radio group styles
  RADIO_GROUP: "space-y-3",
  RADIO_ITEM: "flex items-center space-x-3",
  RADIO_LABEL: "text-sm text-gray-700 font-medium",

  // File input styles
  FILE_INPUT:
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors",

  // Input adornment styles
  INPUT_WRAPPER: "relative",
  INPUT_WITH_LEFT_ADORNMENT: "pl-12",
  INPUT_WITH_RIGHT_ADORNMENT: "pr-12",
  INPUT_WITH_BOTH_ADORNMENTS: "pl-12 pr-12",
  LEFT_ADORNMENT:
    "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10",
  RIGHT_ADORNMENT:
    "absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10",
} as const;

// =============================================================================
// RESPONSIVE BREAKPOINTS
// =============================================================================

export const BREAKPOINTS = {
  SM: "sm:",
  MD: "md:",
  LG: "lg:",
  XL: "xl:",
  "2XL": "2xl:",
} as const;

// =============================================================================
// SPACING UTILITIES
// =============================================================================

export const SPACING = {
  SECTION_GAP: "space-y-8",
  FIELD_GAP: "space-y-6",
  SMALL_GAP: "space-y-4",
  TIGHT_GAP: "space-y-2",
  HORIZONTAL_GAP: "space-x-4",
} as const;
