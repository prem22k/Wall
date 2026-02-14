import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin } from 'lucide-react';
import { useCanvasState } from '../../context/CanvasContext';
import { getNoteStyle } from '../../utils/randomness';
import './NavigationRadar.css';

/**
 * NavigationRadar - Game HUD-style off-screen note indicators
 *
 * Shows subtle arrows at screen edges pointing to notes
 * that are outside the current viewport. Click to warp.
 *
 * Enhanced with:
 * - Note preview tooltip on hover
 * - Distance indicator
 * - Color matching to note
 */
function NavigationRadar({ notes = [] }) {
    const {
        viewportPosition,
        animateToPosition,
        notePositions,
        isNoteVisible
    } = useCanvasState();

    const [hoveredMarker, setHoveredMarker] = useState(null);

    // Format distance for display
    const formatDistance = (pixels) => {
        if (pixels < 500) return `${Math.round(pixels)}px`;
        if (pixels < 2000) return `${(pixels / 100).toFixed(1)}k px`;
        return `${(pixels / 1000).toFixed(1)}k px`;
    };

    // Truncate message for preview
    const truncateMessage = (message, maxLength = 60) => {
        if (!message) return '';
        if (message.length <= maxLength) return message;
        return message.slice(0, maxLength).trim() + '...';
    };

    // Calculate marker positions for off-screen notes
    const markers = useMemo(() => {
        const PADDING = 50;
        const MIN_SPACING = 60; // Minimum distance between markers
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;

        const rawMarkers = notes
            .filter(note => !isNoteVisible(note.id))
            .map(note => {
                const notePos = notePositions.get(note.id) || note.position;
                if (!notePos) return null;

                // Note center in screen space
                const noteCenterX = notePos.x + viewportPosition.x + 140;
                const noteCenterY = notePos.y + viewportPosition.y + 100;

                // Direction from screen center to note
                const dx = noteCenterX - centerX;
                const dy = noteCenterY - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                const angleDeg = angle * (180 / Math.PI);

                // Get note style for color matching
                const noteStyle = getNoteStyle(note.id);

                // Calculate edge intersection
                let markerX, markerY;
                const aspectRatio = viewportWidth / viewportHeight;
                const absAngle = Math.abs(angle);

                if (absAngle < Math.atan(aspectRatio)) {
                    // Right edge
                    markerX = viewportWidth - PADDING;
                    markerY = centerY + (markerX - centerX) * Math.tan(angle);
                } else if (absAngle > Math.PI - Math.atan(aspectRatio)) {
                    // Left edge
                    markerX = PADDING;
                    markerY = centerY + (markerX - centerX) * Math.tan(angle);
                } else if (angle > 0) {
                    // Bottom edge
                    markerY = viewportHeight - PADDING;
                    markerX = centerX + (markerY - centerY) / Math.tan(angle);
                } else {
                    // Top edge
                    markerY = PADDING;
                    markerX = centerX + (markerY - centerY) / Math.tan(angle);
                }

                // Clamp to valid screen coordinates
                markerX = Math.max(PADDING, Math.min(viewportWidth - PADDING, markerX));
                markerY = Math.max(PADDING, Math.min(viewportHeight - PADDING, markerY));

                return {
                    id: note.id,
                    x: markerX,
                    y: markerY,
                    angle: angleDeg,
                    notePosition: notePos,
                    noteName: note.name || 'Anonymous',
                    noteMessage: note.message,
                    noteColor: noteStyle.color,
                    distance: distance,
                };
            })
            .filter(Boolean);

        // Space out markers that are too close together
        const spacedMarkers = [];
        for (const marker of rawMarkers) {
            let finalX = marker.x;
            let finalY = marker.y;

            // Check distance to existing markers
            for (const existing of spacedMarkers) {
                const dist = Math.sqrt(
                    Math.pow(finalX - existing.x, 2) +
                    Math.pow(finalY - existing.y, 2)
                );

                if (dist < MIN_SPACING) {
                    // Offset this marker
                    const offsetAngle = Math.atan2(finalY - existing.y, finalX - existing.x);
                    finalX = existing.x + Math.cos(offsetAngle) * MIN_SPACING;
                    finalY = existing.y + Math.sin(offsetAngle) * MIN_SPACING;

                    // Re-clamp
                    finalX = Math.max(PADDING, Math.min(viewportWidth - PADDING, finalX));
                    finalY = Math.max(PADDING, Math.min(viewportHeight - PADDING, finalY));
                }
            }

            spacedMarkers.push({ ...marker, x: finalX, y: finalY });
        }

        return spacedMarkers;
    }, [notes, viewportPosition, notePositions, isNoteVisible]);

    const handleMarkerClick = (marker) => {
        // Calculate target viewport position to center the note
        const targetX = -marker.notePosition.x + (window.innerWidth / 2) - 140;
        const targetY = -marker.notePosition.y + (window.innerHeight / 2) - 100;

        // Animate to the new position
        animateToPosition({ x: targetX, y: targetY });
    };

    if (markers.length === 0) return null;

    return (
        <div className="navigation-radar" aria-label="Off-screen note indicators">
            <AnimatePresence>
                {markers.map(marker => (
                    <div
                        key={marker.id}
                        className="radar-marker-wrapper"
                        style={{
                            left: marker.x,
                            top: marker.y,
                        }}
                    >
                        <motion.button
                            className={`radar-marker ${hoveredMarker === marker.id ? 'radar-marker--active' : ''}`}
                            style={{
                                '--marker-color': marker.noteColor,
                            }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: hoveredMarker === marker.id ? 1 : 0.6,
                                scale: 1,
                                rotate: marker.angle,
                            }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            whileHover={{ opacity: 1, scale: 1.15 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => handleMarkerClick(marker)}
                            onMouseEnter={() => setHoveredMarker(marker.id)}
                            onMouseLeave={() => setHoveredMarker(null)}
                            aria-label={`Navigate to note by ${marker.noteName}`}
                        >
                            <ChevronRight size={18} strokeWidth={2.5} />
                        </motion.button>

                        {/* Preview tooltip */}
                        <AnimatePresence>
                            {hoveredMarker === marker.id && (
                                <motion.div
                                    className="radar-tooltip"
                                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                                    transition={{ duration: 0.15 }}
                                    style={{ '--tooltip-color': marker.noteColor }}
                                >
                                    <div className="radar-tooltip__content">
                                        <p className="radar-tooltip__message">
                                            "{truncateMessage(marker.noteMessage)}"
                                        </p>
                                        <div className="radar-tooltip__meta">
                                            <span className="radar-tooltip__author">
                                                — {marker.noteName}
                                            </span>
                                            <span className="radar-tooltip__distance">
                                                <MapPin size={12} />
                                                {formatDistance(marker.distance)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="radar-tooltip__arrow" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export default NavigationRadar;
