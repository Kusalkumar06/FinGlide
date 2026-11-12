import { cn } from "./utils.js";

/**
 * FinGlide Design System - Single Source of Truth
 * Derived tokens for Spacing, Typography, Backgrounds, Text, Borders, Radii, and Shadows.
 */

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
  "4xl": "64px",
};

export const SPACING_CLASS = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
  "2xl": "gap-8",
  "3xl": "gap-12",
  "4xl": "gap-16",
};

export const PADDING_CLASS = {
  xs: "p-1",
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
  xl: "p-6",
  "2xl": "p-8",
  "3xl": "p-12",
  "4xl": "p-16",
};

export const MARGIN_CLASS = {
  xs: "m-1",
  sm: "m-2",
  md: "m-3",
  lg: "m-4",
  xl: "m-6",
  "2xl": "m-8",
  "3xl": "m-12",
  "4xl": "m-16",
};

export const TYPOGRAPHY = {
  // Display styles
  display2xl: "text-[48px] md:text-[64px] font-semibold leading-[100%] tracking-tight",
  displayXl: "text-[40px] md:text-[56px] font-bold leading-[100%] tracking-tight",
  displayLg: "text-[32px] md:text-[48px] font-bold leading-[100%] tracking-tight",
  displayMd: "text-[28px] md:text-[40px] font-semibold leading-[100%]",
  displaySm: "text-[24px] md:text-[36px] font-semibold leading-[100%]",

  // Headings
  headingXl: "text-[24px] md:text-[28px] font-medium leading-[120%]",
  headingLg: "text-[22px] md:text-[25px] font-semibold leading-[120%]",
  headingMd: "text-[20px] md:text-[22px] font-medium leading-[120%]",
  headingSm: "text-[18px] md:text-[20px] font-medium leading-[120%]",
  headingXs: "text-[16px] md:text-[18px] font-medium leading-[120%]",

  // Body text
  bodyXl: "text-[20px] font-normal leading-[140%]",
  bodyLg: "text-[18px] font-normal leading-[140%]",
  bodyMd: "text-[16px] font-normal leading-[140%]",
  bodySm: "text-[14px] font-normal leading-[140%]",
  bodyXs: "text-[12px] font-normal leading-[140%]",

  // Labels & Badges
  labelLg: "text-[16px] font-semibold leading-[120%]",
  labelMd: "text-[14px] font-semibold leading-[120%]",
  labelSm: "text-[12px] font-medium leading-[120%]",
  labelXs: "text-[10px] font-medium leading-[120%]",

  // Captions
  captionLg: "text-[14px] font-normal leading-[130%]",
  captionMd: "text-[12px] font-normal leading-[130%]",
  captionSm: "text-[10px] font-normal leading-[130%]",
  captionXs: "text-[9px] font-normal leading-[130%]",
};

/**
 * BACKGROUND COLORS (Explicitly separated as requested)
 */
export const BACKGROUND_COLORS = {
  // Brand Oranges & Accents
  bgPrimary: "bg-[#D96D38]",
  bgPrimaryHover: "hover:bg-[#e05a38]",
  bgOrange50: "bg-orange-50",
  bgOrange100: "bg-orange-100",
  bgOrange200: "bg-orange-200",
  bgOrange400: "bg-orange-400",
  bgOrange500: "bg-orange-500",
  bgOrange600: "bg-orange-600",
  bgBrandAccent: "bg-[#F96C4A]",
  bgBrandDeep: "bg-[#da6e39]",
  bgBrandDark: "bg-[#D86D38]",

  // Warm Canvas & Cards
  bgCard: "bg-[#FFFAF4]",
  bgCardSubtle: "bg-[#FFFBF3]",
  bgScaffold: "bg-[#FFF5EC]",
  bgWhite: "bg-white",
  bgWhiteTranslucent: "bg-white/95",

  // Neutrals / Grays
  bgGray50: "bg-gray-50",
  bgGray100: "bg-gray-100",
  bgGray200: "bg-gray-200",
  bgGray300: "bg-gray-300",
  bgGray800: "bg-gray-800",
  bgGray900: "bg-gray-900",

  // Semantic Status Backgrounds
  bgSuccessLight: "bg-[#DBFCE7]",
  bgSuccess: "bg-green-500",
  bgDangerLight: "bg-[#FFE2E2]",
  bgDanger: "bg-red-500",
  bgWarningLight: "bg-amber-100",
  bgWarning: "bg-yellow-500",
  bgInfoLight: "bg-blue-100",
  bgInfo: "bg-blue-500",

  // Modal Backdrop
  bgBackdrop: "bg-[#00000080]",
};

/**
 * TEXT COLORS (Explicitly separated)
 */
export const TEXT_COLORS = {
  // Brand
  primary: "text-[#D96D38]",
  primaryAccent: "text-[#F96C4A]",
  primaryDeep: "text-[#da6e39]",
  orange100: "text-orange-100",
  orange500: "text-orange-500",
  orange600: "text-orange-600",
  orange700: "text-orange-700",

  // Heading & Body Neutrals
  heading: "text-[#3A3A3A]",
  headingDark: "text-[#36353A]",
  headingCharcoal: "text-[#433C3E]",
  body: "text-[#3B3F40]",
  bodyMuted: "text-[#494847]",
  bodySecondary: "text-[#5A5A5A]",
  textGray300: "text-gray-300",
  textGray400: "text-gray-400",
  textGray500: "text-gray-500",
  textGray600: "text-gray-600",
  textGray700: "text-gray-700",
  textGray800: "text-gray-800",
  textGray900: "text-gray-900",
  white: "text-white",

  // Brand Warm Subtitle / Secondary Accents
  subtitleWarm: "text-[#8E5660]",
  subtitleMauve: "text-[#813C7F]",
  taglineBrown: "text-[#7D5555]",

  // Semantic
  success: "text-green-600",
  successDark: "text-green-700",
  danger: "text-red-600",
  dangerDark: "text-[#9F0712]",
  warning: "text-yellow-600",
  info: "text-blue-600",
};

/**
 * BORDER COLORS (Explicitly separated)
 */
export const BORDER_COLORS = {
  borderDefault: "border-[#DDDFDE]",
  borderOrange100: "border-orange-100",
  borderOrange200: "border-orange-200",
  borderOrange400: "border-orange-400",
  borderGray200: "border-gray-200",
  borderGray300: "border-gray-300",
  borderGray400: "border-gray-400",
  borderGray900: "border-gray-900",
  borderSuccess: "border-green-300",
  borderDanger: "border-red-300",
};

export const BORDER_RADIUS = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
};

export const SHADOWS = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
};

/**
 * COMPONENT PRESETS for recurring patterns across FinGlide
 */
export const COMPONENT_PRESETS = {
  // Page Title Container
  pageHeader: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5",
  pageTitle: cn(TYPOGRAPHY.headingXl, TEXT_COLORS.heading),
  pageSubtitle: cn(TYPOGRAPHY.bodySm, TEXT_COLORS.body),

  // Standard FinGlide Card
  card: cn(BACKGROUND_COLORS.bgCard, BORDER_COLORS.borderDefault, "border-2 rounded-lg shadow p-4"),
  cardLarge: cn(BACKGROUND_COLORS.bgCard, BORDER_COLORS.borderDefault, "border-2 rounded-2xl shadow-lg p-4"),

  // Buttons
  primaryButton: cn(
    BACKGROUND_COLORS.bgPrimary,
    BACKGROUND_COLORS.bgPrimaryHover,
    TEXT_COLORS.white,
    TYPOGRAPHY.headingSm,
    "p-2 px-5 rounded cursor-pointer transition-colors whitespace-nowrap"
  ),
  secondaryButton: "p-2 bg-white rounded-md border border-gray-300 text-sm font-medium text-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors",

  // Form Inputs
  input: "w-full py-2 px-3 rounded shadow outline-none border border-gray-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-300",
  modalBackdrop: "fixed inset-0 bg-[#00000080] flex items-center justify-center p-4 z-50",
  modalContainer: "bg-white w-[480px] p-5 rounded-lg shadow-xl",
};

export const FORM_STYLES = {
  label: cn(TYPOGRAPHY.headingSm, TEXT_COLORS.heading, "mb-2"),
  input: COMPONENT_PRESETS.input,
};

