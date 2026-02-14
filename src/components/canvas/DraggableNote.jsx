import { useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { useCanvasState } from '../../context/CanvasContext';
import NoteCard from '../NoteCard';
import './DraggableNote.css';

/**
 * DraggableNote - A note that can be repositioned on the canvas
 * 
 * Uses framer-motion for smooth dragging.
 * Only drags when the grip handle is used.
 */
function DraggableNote({ note, initialPosition }) {
    const dragControls = useDragControls();
    const noteRef = useRef(null);
    const { updateNotePosition } = useCanvasState();

    // Register the note's position in the context
    // Use a ref to prevent resetting position on parent re-renders
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!initializedRef.current && initialPosition) {
            updateNotePosition(note.id, initialPosition);
            initializedRef.current = true;
        }
    }, [note.id, initialPosition, updateNotePosition]);

    // Start drag from the grip handle
    const handlePointerDown = (event) => {
        dragControls.start(event);
    };

    return (
        <motion.div
            ref={noteRef}
            className="draggable-note"
            drag
            dragControls={dragControls}
            dragListener={false} // Only drag from grip handle
            dragMomentum={false}
            dragElastic={0.1}
            whileDrag={{ scale: 1.02, zIndex: 100 }}
            style={{
                position: 'absolute',
                left: initialPosition?.x ?? 0,
                top: initialPosition?.y ?? 0,
            }}
            onDragEnd={(event, info) => {
                // Update position in context after drag
                updateNotePosition(note.id, {
                    x: (initialPosition?.x ?? 0) + info.offset.x,
                    y: (initialPosition?.y ?? 0) + info.offset.y,
                });
            }}
        >
            {/* Grip handle - the only way to drag the note */}
            <button
                className="draggable-note__grip"
                onPointerDown={handlePointerDown}
                aria-label="Drag to move note"
                title="Drag to move"
            >
                <GripVertical size={16} />
            </button>

            <NoteCard note={note} />
        </motion.div>
    );
}

export default DraggableNote;
