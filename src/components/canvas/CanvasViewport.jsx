import { useDrag } from '@use-gesture/react';
import { useCanvasState } from '../../context/CanvasContext';
import InfiniteWorld from './InfiniteWorld';
import NavigationRadar from './NavigationRadar';
import './CanvasViewport.css';

/**
 * CanvasViewport - The infinite canvas container
 * 
 * Fills the entire screen and handles pan gestures
 * on the background to move the viewport.
 */
function CanvasViewport({ children, notes = [] }) {
    const { viewportPosition, setViewportPosition, isAnimating } = useCanvasState();

    // Pan gesture handler for background dragging
    const bind = useDrag(
        ({ delta: [dx, dy], event }) => {
            // Don't pan during animation or when dragging notes
            if (isAnimating) return;
            if (event.target.closest('.draggable-note')) return;

            setViewportPosition(prev => ({
                x: prev.x + dx,
                y: prev.y + dy,
            }));
        },
        {
            filterTaps: true,
            pointer: { touch: true },
        }
    );

    return (
        <div className="canvas-viewport" {...bind()}>
            <InfiniteWorld position={viewportPosition}>
                {children}
            </InfiniteWorld>

            {/* Navigation radar for off-screen notes */}
            <NavigationRadar notes={notes} />
        </div>
    );
}

export default CanvasViewport;

