import { ChevronRight } from 'lucide-react';

/**
 * DirectionalMarker - Points to off-screen notes
 * 
 * Fixed at screen edges, rotates to point toward
 * hidden notes. Click to pan the canvas to that note.
 */
function DirectionalMarker({ noteId, position, onClick }) {
    return (
        <button
            className="directional-marker"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `translate(-50%, -50%) rotate(${position.angle}deg)`,
            }}
            onClick={onClick}
            aria-label={`Navigate to hidden note`}
            title="Click to navigate to this note"
        >
            <ChevronRight size={20} strokeWidth={2.5} />
        </button>
    );
}

export default DirectionalMarker;
