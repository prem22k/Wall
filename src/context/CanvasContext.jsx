import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';

/**
 * CanvasContext - Manages the infinite canvas viewport state
 * 
 * Tracks the current pan position and provides utilities
 * for visibility calculations of notes on the canvas.
 */

const CanvasContext = createContext(null);

/**
 * CanvasProvider - Wraps the app to provide canvas state
 */
export function CanvasProvider({ children }) {
    // Viewport position (how much the canvas has been panned)
    const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 });

    // Animation state
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef(null);

    // Note positions (for off-screen indicator calculations)
    const [notePositions, setNotePositions] = useState(new Map());

    // Update a single note's position
    const updateNotePosition = useCallback((noteId, position) => {
        setNotePositions(prev => {
            const next = new Map(prev);
            next.set(noteId, position);
            return next;
        });
    }, []);

    // Animate the viewport to a target position over 800ms
    const animateToPosition = useCallback((target) => {
        // Cancel any ongoing animation
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        setIsAnimating(true);

        const start = { ...viewportPosition };
        const startTime = performance.now();
        const duration = 800; // 800ms animation

        // Easing function (ease-out cubic)
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);

            const newX = start.x + (target.x - start.x) * eased;
            const newY = start.y + (target.y - start.y) * eased;

            setViewportPosition({ x: newX, y: newY });

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
                animationRef.current = null;
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [viewportPosition]);

    // Check if a note is visible in the current viewport
    const isNoteVisible = useCallback((noteId) => {
        const notePos = notePositions.get(noteId);
        if (!notePos) return true; // Assume visible if we don't have position data

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Note position in screen space = note world position + viewport offset
        const screenX = notePos.x + viewportPosition.x;
        const screenY = notePos.y + viewportPosition.y;

        // Check if the note's bounding box intersects the viewport
        const noteWidth = 280;
        const noteHeight = 200;

        return (
            screenX + noteWidth > 0 &&
            screenX < viewportWidth &&
            screenY + noteHeight > 0 &&
            screenY < viewportHeight
        );
    }, [viewportPosition, notePositions]);

    // Get direction to an off-screen note (for directional markers)
    const getDirectionToNote = useCallback((noteId) => {
        const notePos = notePositions.get(noteId);
        if (!notePos) return null;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;

        // Note center in screen space
        const noteCenterX = notePos.x + viewportPosition.x + 140;
        const noteCenterY = notePos.y + viewportPosition.y + 100;

        // Direction vector from screen center to note
        const dx = noteCenterX - centerX;
        const dy = noteCenterY - centerY;
        const angle = Math.atan2(dy, dx);

        const margin = 50;
        let markerX, markerY;

        const aspectRatio = viewportWidth / viewportHeight;
        const absAngle = Math.abs(angle);

        if (absAngle < Math.atan(aspectRatio)) {
            markerX = viewportWidth - margin;
            markerY = centerY + (markerX - centerX) * Math.tan(angle);
        } else if (absAngle > Math.PI - Math.atan(aspectRatio)) {
            markerX = margin;
            markerY = centerY + (markerX - centerX) * Math.tan(angle);
        } else if (angle > 0) {
            markerY = viewportHeight - margin;
            markerX = centerX + (markerY - centerY) / Math.tan(angle);
        } else {
            markerY = margin;
            markerX = centerX + (markerY - centerY) / Math.tan(angle);
        }

        markerX = Math.max(margin, Math.min(viewportWidth - margin, markerX));
        markerY = Math.max(margin, Math.min(viewportHeight - margin, markerY));

        return {
            x: markerX,
            y: markerY,
            angle: angle * (180 / Math.PI),
        };
    }, [viewportPosition, notePositions]);

    const value = useMemo(() => ({
        viewportPosition,
        setViewportPosition,
        animateToPosition,
        isAnimating,
        notePositions,
        updateNotePosition,
        isNoteVisible,
        getDirectionToNote,
    }), [viewportPosition, animateToPosition, isAnimating, notePositions, updateNotePosition, isNoteVisible, getDirectionToNote]);

    return (
        <CanvasContext.Provider value={value}>
            {children}
        </CanvasContext.Provider>
    );
}

/**
 * useCanvasState - Hook to access canvas viewport state
 */
export function useCanvasState() {
    const context = useContext(CanvasContext);
    if (!context) {
        throw new Error('useCanvasState must be used within a CanvasProvider');
    }
    return context;
}

export default CanvasContext;

