/**
 * useIllustrationDesign Composable
 * =================================
 * Provides consistent design system constants for SVG hand-drawn illustrations.
 * Used by all illustration components to ensure visual consistency.
 *
 * Features:
 * - Color palette with Tailwind-to-hex mapping
 * - Spacing constants for consistent layouts
 * - Stroke styles for hand-drawn aesthetic
 * - Typography settings
 * - Utility functions for calculations
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ColorValue {
  main: string
  light: string
  text: string
}

export type ColorName = 'violet' | 'blue' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'gray'

// =============================================================================
// COLOR PALETTE
// =============================================================================

/**
 * Maps Tailwind color names to hex values for SVG fill/stroke
 * Each color has: main (500), light (400), lighter (300/200 opacity effect)
 */
export const COLORS: Record<ColorName, ColorValue> = {
  violet: { main: '#8b5cf6', light: '#a78bfa', text: '#c4b5fd' },
  blue: { main: '#3b82f6', light: '#60a5fa', text: '#93c5fd' },
  emerald: { main: '#10b981', light: '#34d399', text: '#6ee7b7' },
  amber: { main: '#f59e0b', light: '#fbbf24', text: '#fcd34d' },
  rose: { main: '#f43f5e', light: '#fb7185', text: '#fda4af' },
  cyan: { main: '#06b6d4', light: '#22d3ee', text: '#67e8f9' },
  gray: { main: '#6b7280', light: '#9ca3af', text: '#d1d5db' }
}

// =============================================================================
// SPACING CONSTANTS
// =============================================================================

export const SPACING = {
  /** Padding inside boxes */
  boxPadding: 20,
  /** Gap between items in a list */
  itemGap: 35,
  /** Length of arrows between elements */
  arrowLength: 50,
  /** Padding inside containers */
  containerPadding: 30,
  /** Width of standard box */
  boxWidth: 140,
  /** Height of standard box */
  boxHeight: 70,
  /** Width of large box (for roles, artifacts) */
  largeBoxWidth: 160,
  /** Height of large box */
  largeBoxHeight: 200,
  /** Radius for rounded corners */
  borderRadius: 12,
  /** Icon circle radius */
  iconRadius: 25,
  /** Maximum items per row in horizontal flow */
  maxItemsPerRow: 4,
  /** Vertical gap between rows in multi-row horizontal flow */
  rowGap: 60
}

// =============================================================================
// STROKE STYLES
// =============================================================================

export const STROKES = {
  /** Dash pattern for boxes: "8,4" = 8px dash, 4px gap */
  boxDash: '8,4',
  /** Dash pattern for arrows */
  arrowDash: '4,3',
  /** Dash pattern for containers */
  containerDash: '10,5',
  /** Stroke width for boxes */
  boxStrokeWidth: 2.5,
  /** Stroke width for arrows */
  arrowStrokeWidth: 2,
  /** Stroke width for containers */
  containerStrokeWidth: 2
}

// =============================================================================
// OPACITY VALUES
// =============================================================================

export const OPACITY = {
  /** Background fill for boxes */
  boxFill: 0.15,
  /** Background for icon circles */
  iconCircleFill: 0.3,
  /** Hover state */
  hoverFill: 0.25
}

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const TYPOGRAPHY = {
  /** Font family for all text (matches --font-content in main.css) */
  fontFamily: '\'Fuzzy Bubbles\', cursive',
  /** Title/header text size */
  titleSize: 14,
  /** Main label text size */
  labelSize: 12,
  /** Secondary/sublabel text size */
  sublabelSize: 10,
  /** Small text (notes, captions) */
  smallSize: 9,
  /** Icon/emoji size */
  iconSize: 20
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get color values by name
 * @param colorName - Tailwind color name (e.g., 'violet', 'blue')
 * @returns Color object with main, light, and text hex values
 */
export function getColor(colorName: string): ColorValue {
  const validColors: ColorName[] = ['violet', 'blue', 'emerald', 'amber', 'rose', 'cyan', 'gray']
  if (validColors.includes(colorName as ColorName)) {
    return COLORS[colorName as ColorName]
  }
  return COLORS.gray
}

/**
 * Calculate viewBox dimensions for a linear flow
 * @param stepCount - Number of steps in the flow
 * @param direction - 'horizontal' or 'vertical'
 * @param hasFeedbackLoop - Whether to add space for feedback arrow
 */
export function calculateLinearFlowViewBox(
  stepCount: number,
  direction: 'horizontal' | 'vertical' = 'horizontal',
  hasFeedbackLoop = false
) {
  if (direction === 'horizontal') {
    const width = stepCount * (SPACING.boxWidth + SPACING.arrowLength) - SPACING.arrowLength + 60
    const height = hasFeedbackLoop ? 200 : 130
    return { width, height }
  } else {
    const width = SPACING.boxWidth + 60
    const height = stepCount * (SPACING.boxHeight + 50) + 40
    return { width, height }
  }
}

/**
 * Calculate viewBox for a checklist
 * @param itemCount - Number of checklist items
 * @param hasNote - Whether there's a note at the bottom
 */
export function calculateChecklistViewBox(itemCount: number, hasNote = false) {
  // Base height accounts for title (45) + underline (20) + spacing to first item (30) = 95
  const baseHeight = 110 + itemCount * SPACING.itemGap
  const height = hasNote ? baseHeight + 50 : baseHeight
  return { width: 450, height }
}

/**
 * Calculate viewBox for team composition
 * @param roleCount - Number of roles
 */
export function calculateTeamViewBox(roleCount: number) {
  const width = roleCount * (SPACING.largeBoxWidth + 20) + 80
  const height = 350
  return { width, height }
}

/**
 * Calculate viewBox for comparison map
 * @param connectionCount - Number of connections
 */
export function calculateComparisonViewBox(connectionCount: number) {
  const width = 600
  const height = 80 + connectionCount * 50 + 40
  return { width, height }
}

/**
 * Generate slight rotation for hand-drawn effect
 * @param index - Index of element (for variation)
 * @returns Rotation in degrees (-1.5 to 1.5)
 */
export function getHandDrawnRotation(index: number): number {
  const rotations: number[] = [-1, 0.5, -0.5, 1, -1.2, 0.8, -0.3, 1.1]
  return rotations[index % rotations.length] ?? 0
}

// =============================================================================
// COMPOSABLE EXPORT
// =============================================================================

export function useIllustrationDesign() {
  return {
    COLORS,
    SPACING,
    STROKES,
    OPACITY,
    TYPOGRAPHY,
    getColor,
    calculateLinearFlowViewBox,
    calculateChecklistViewBox,
    calculateTeamViewBox,
    calculateComparisonViewBox,
    getHandDrawnRotation
  }
}
