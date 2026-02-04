/**
 * Small randomness utilities for creating organic, hand-placed feel
 * These create subtle imperfections that make the wall feel human
 */

/**
 * Generate a random rotation between -max and +max degrees
 * Used to make notes feel hand-placed rather than perfectly aligned
 */
export function randomRotation(max = 1.5) {
  return (Math.random() - 0.5) * 2 * max;
}

/**
 * Generate a random vertical offset for visual rhythm
 * Creates gentle undulation in the masonry layout
 */
export function randomOffset(max = 8) {
  return (Math.random() - 0.5) * 2 * max;
}

/**
 * Pick a random item from an array
 * Used for selecting note colors, subtle decorations
 */
export function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random delay for staggered animations
 * Creates a gentle, organic entry sequence
 */
export function randomDelay(min = 0, max = 200) {
  return min + Math.random() * (max - min);
}

/**
 * Note paper colors - warm, muted pastels that feel like real paper
 * No bright whites or harsh colors
 */
export const noteColors = [
  '#FFF9C4', // Soft sticky-note yellow
  '#FFF8E1', // Warm cream
  '#FFECB3', // Muted amber
  '#F3E5AB', // Vanilla paper
  '#E8F5E9', // Faded mint (very subtle)
  '#FCE4EC', // Blush pink
  '#FFF3E0', // Peach cream
  '#FFFDE7', // Light butter
];

/**
 * Generate consistent but random-looking properties for a note
 * Uses note ID as seed for consistency across re-renders
 */
export function getNoteStyle(noteId) {
  // Use noteId to create pseudo-random but consistent values
  const seed = typeof noteId === 'string' 
    ? noteId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : noteId;
  
  const pseudoRandom = (offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };
  
  return {
    rotation: (pseudoRandom(0) - 0.5) * 3, // ±1.5 degrees
    offsetY: (pseudoRandom(1) - 0.5) * 16, // ±8px vertical offset
    color: noteColors[Math.floor(pseudoRandom(2) * noteColors.length)],
    delay: pseudoRandom(3) * 150, // 0-150ms stagger
  };
}
