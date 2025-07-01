/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import { SelectOption, SelectOptionGroup, SelectOptions } from "./types";
import { buildClasses, flattenOptions } from "./utils";

// =============================================================================
// TYPES
// =============================================================================

interface MultiSelectComponentProps {
  name: string;
  options?: SelectOptions;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  maxSelections?: number;
  displayLimit?: number;
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
  ) => React.ReactNode;
  customSelectedComponent?: (
    selectedOptions: SelectOption[]
  ) => React.ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string | undefined;
  "aria-label"?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_DISPLAY_LIMIT = 5;
const DEFAULT_COUNT_THRESHOLD = 2;

// =============================================================================
// MULTI SELECT COMPONENT
// =============================================================================

export function MultiSelect(props: MultiSelectComponentProps) {
  const {
    name,
    options: initialOptions = [],
    placeholder = "Select options...",
    searchable = true,
    clearable = true,
    closeOnSelect = false,
    maxSelections,
    displayLimit = DEFAULT_DISPLAY_LIMIT,
    showSelectedCount = false,
    showSelectedCountThreshold,
    selectedCountText = (count) => `${count} selected`,
    noOptionsText = "No options available",
    loadingText = "Loading...",
    isLoading = false,
    onOptionsLoad,
    customOptionComponent,
    customSelectedComponent,
    className = "",
    disabled = false,
    ...ariaProps
  } = props;

  // =============================================================================
  // STATE AND REFS
  // =============================================================================

  const { register, watch, setValue } = useFormContext();
  const currentValue = watch(name) || [];
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<SelectOptions>(initialOptions);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  const flatOptions = flattenOptions(
    options as (SelectOption | SelectOptionGroup)[]
  );
  const filteredOptions = flatOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedOptions = flatOptions.filter((option) =>
    currentValue.includes(option.value)
  );
  const countThreshold = showSelectedCountThreshold ?? DEFAULT_COUNT_THRESHOLD;
  const finalDisplayLimit = maxSelections
    ? Math.min(displayLimit, maxSelections)
    : displayLimit;

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Register with react-hook-form
  useEffect(() => {
    register(name);
  }, [register, name]);

  // Load dynamic options
  useEffect(() => {
    if (onOptionsLoad && options.length === 0) {
      setLoadingOptions(true);
      onOptionsLoad()
        .then(setOptions)
        .catch((error) => console.error("Failed to load options:", error))
        .finally(() => setLoadingOptions(false));
    }
  }, [onOptionsLoad, options.length]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  const toggleOption = (option: SelectOption) => {
    if (disabled || option.disabled) return;

    const currentValues = currentValue || [];
    const isSelected = currentValues.includes(option.value);

    let newValues;
    if (isSelected) {
      newValues = currentValues.filter((value: any) => value !== option.value);
    } else {
      if (maxSelections && currentValues.length >= maxSelections) {
        return;
      }
      newValues = [...currentValues, option.value];
    }

    setValue(name, newValues, { shouldValidate: true, shouldDirty: true });

    if (closeOnSelect) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const clearAll = () => {
    setValue(name, [], { shouldValidate: true, shouldDirty: true });
  };

  const removeOption = (optionValue: string | number) => {
    const newValues = currentValue.filter(
      (value: any) => value !== optionValue
    );
    setValue(name, newValues, { shouldValidate: true, shouldDirty: true });
  };

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // =============================================================================
  // CSS CLASSES
  // =============================================================================

  const cssClasses = {
    container: "relative",
    display: buildClasses(
      "w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500",
      {
        "bg-gray-100 cursor-not-allowed": disabled,
        "bg-white hover:border-gray-400": !disabled,
      },
      className
    ),
    selectedItem:
      "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800",
    removeButton:
      "ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200",
    moreText: "text-sm text-gray-500",
    clearButton: "p-1 hover:bg-gray-200 rounded",
    chevron: buildClasses("w-5 h-5 transition-transform", {
      "rotate-180": isOpen,
    }),
    dropdown:
      "absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto",
    searchContainer: "p-2 border-b border-gray-200",
    searchInput:
      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
    optionsContainer: "max-h-48 overflow-y-auto",
    option: (isSelected: boolean, disabled?: boolean) =>
      buildClasses(
        "px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between",
        {
          "bg-blue-50 text-blue-700": isSelected,
          "opacity-50 cursor-not-allowed": !!disabled,
        }
      ),
    groupLabel:
      "px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50",
    emptyState: "px-3 py-2 text-center text-gray-500",
  };

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const renderSelectedDisplay = () => {
    if (customSelectedComponent) {
      return customSelectedComponent(selectedOptions);
    }

    if (selectedOptions.length === 0) {
      return <span className="text-gray-500">{placeholder}</span>;
    }

    if (showSelectedCount && selectedOptions.length > countThreshold) {
      return <span>{selectedCountText(selectedOptions.length)}</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {selectedOptions.slice(0, finalDisplayLimit).map((option) => (
          <span key={option.value} className={cssClasses.selectedItem}>
            {option.label}
            {clearable && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option.value);
                }}
                className={cssClasses.removeButton}
              >
                ×
              </button>
            )}
          </span>
        ))}
        {selectedOptions.length > finalDisplayLimit && (
          <span className={cssClasses.moreText}>
            +{selectedOptions.length - finalDisplayLimit} more
          </span>
        )}
      </div>
    );
  };

  const renderOption = (option: SelectOption) => {
    const isSelected = currentValue.includes(option.value);

    if (customOptionComponent) {
      return (
        <div
          key={option.value}
          onClick={() => toggleOption(option)}
          className="cursor-pointer"
        >
          {customOptionComponent(option, isSelected)}
        </div>
      );
    }

    return (
      <div
        key={option.value}
        onClick={() => toggleOption(option)}
        className={cssClasses.option(isSelected, option.disabled)}
      >
        <span>{option.label}</span>
        {isSelected && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    );
  };

  const renderGroupedOptions = () => {
    return options.map((item, index) => {
      if ("options" in item) {
        const group = item as SelectOptionGroup;
        const filteredGroupOptions = group.options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredGroupOptions.length === 0) return null;

        return (
          <div key={index}>
            <div className={cssClasses.groupLabel}>{group.label}</div>
            {filteredGroupOptions.map(renderOption)}
          </div>
        );
      } else {
        const option = item as SelectOption;
        if (!option.label.toLowerCase().includes(searchTerm.toLowerCase())) {
          return null;
        }
        return renderOption(option);
      }
    });
  };

  const renderDropdownContent = () => {
    if (loadingOptions || isLoading) {
      return <div className={cssClasses.emptyState}>{loadingText}</div>;
    }

    if (filteredOptions.length === 0) {
      return <div className={cssClasses.emptyState}>{noOptionsText}</div>;
    }

    return renderGroupedOptions();
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <div ref={containerRef} className={cssClasses.container}>
      {/* Hidden input for form registration */}
      <input
        type="hidden"
        {...register(name)}
        value={JSON.stringify(currentValue)}
      />

      {/* Display */}
      <div
        onClick={handleToggleDropdown}
        className={cssClasses.display}
        {...ariaProps}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">{renderSelectedDisplay()}</div>
          <div className="flex items-center space-x-2">
            {clearable && selectedOptions.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                className={cssClasses.clearButton}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <svg
              className={cssClasses.chevron}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className={cssClasses.dropdown}>
          {/* Search input */}
          {searchable && (
            <div className={cssClasses.searchContainer}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cssClasses.searchInput}
              />
            </div>
          )}

          {/* Options */}
          <div className={cssClasses.optionsContainer}>
            {renderDropdownContent()}
          </div>
        </div>
      )}
    </div>
  );
}
