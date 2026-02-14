import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CanvasProvider, useCanvasState } from './context/CanvasContext';
import CanvasViewport from './components/canvas/CanvasViewport';
import DraggableNote from './components/canvas/DraggableNote';
import WriteNote from './components/WriteNote';
import { fetchNotes, createNote } from './services/api';
import './App.css';

/**
 * Ashish's Wall - A personal scrapbook for thoughts
 * 
 * This is not an app. It's a personal space.
 * A corkboard. A journal. A paper surface.
 * 
 * Now with infinite canvas for spatial organization!
 */
function App() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes from API on mount
  useEffect(() => {
    async function loadNotes() {
      try {
        const loadedNotes = await fetchNotes();
        setNotes(loadedNotes);
      } catch (error) {
        // Failed to load notes - will show empty state
      } finally {
        setIsLoading(false);
      }
    }
    loadNotes();
  }, []);

  const handleAddNote = async (noteData) => {
    try {
      const newNote = await createNote(noteData);
      setNotes(prev => [newNote, ...prev]);
    } catch (error) {
      // Note creation failed - user can try again
    }
  };

  // Generate spatial positions for notes on the canvas
  const notesWithPositions = useMemo(() => {
    const baseX = 5200;
    const baseY = 5100;
    const columns = 4;
    const cellWidth = 320;
    const cellHeight = 280;

    return notes.map((note, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);

      const seed = note.id ? parseInt(note.id.slice(-8), 16) : index;
      const offsetX = (seed % 40) - 20;
      const offsetY = ((seed >> 4) % 40) - 20;

      return {
        ...note,
        position: {
          x: baseX + (col * cellWidth) + offsetX,
          y: baseY + (row * cellHeight) + offsetY,
        },
      };
    });
  }, [notes]);

  return (
    <CanvasProvider>
      <CanvasInitializer notes={notesWithPositions} />

      {/* HUD Layer - Fixed overlay with title and counter */}
      <div className="app__hud">
        <div className="app__hud-spacer" />
        <div className="app__hud-header">
          <h1 className="app__hud-title">Ashish's Wall</h1>
          {!isLoading && notes.length > 0 && (
            <div className="app__hud-counter">
              <span className="app__hud-counter-number">{notes.length}</span>
              <span className="app__hud-counter-label">
                {notes.length === 1 ? 'memory' : 'memories'} collected
              </span>
            </div>
          )}
        </div>
        <Link to="/admin" className="app__hud-admin">Admin</Link>
      </div>

      {/* Writing area - fixed overlay */}
      <div className="app__write-overlay">
        <WriteNote onSubmit={handleAddNote} />
      </div>

      {/* The infinite canvas */}
      <CanvasViewport notes={notesWithPositions}>
        {isLoading ? (
          <LoadingIndicator />
        ) : notes.length === 0 ? (
          <EmptyIndicator />
        ) : (
          notesWithPositions.map((note) => (
            <DraggableNote
              key={note.id}
              note={note}
              initialPosition={note.position}
            />
          ))
        )}
      </CanvasViewport>

      {/* Help hint - fixed at bottom */}
      <div className="app__canvas-hint">
        <span>Drag background to pan • Drag grip to move notes</span>
      </div>
    </CanvasProvider>
  );
}

/**
 * CanvasInitializer - Auto-centers the viewport on notes when they load
 */
function CanvasInitializer({ notes }) {
  const { setViewportPosition } = useCanvasState();
  const [hasCentered, setHasCentered] = useState(false);

  useEffect(() => {
    if (!hasCentered && notes.length > 0) {
      // Calculate centroid of all notes
      const totalX = notes.reduce((sum, note) => sum + note.position.x, 0);
      const totalY = notes.reduce((sum, note) => sum + note.position.y, 0);
      const centerX = totalX / notes.length;
      const centerY = totalY / notes.length;

      // Center viewport on this point
      // Target Viewport = (Screen / 2) - WorldCenter
      // But since World is translated by Viewport:
      // Screen = World + Viewport

      // We want the centroid to be at the center of the screen
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;

      // Adjust for note size (centroid is based on top-left of notes)
      // Approximate center of a note is +140, +100
      const targetWorldX = centerX + 140;
      const targetWorldY = centerY + 100;

      setViewportPosition({
        x: screenCenterX - targetWorldX,
        y: screenCenterY - targetWorldY,
      });

      setHasCentered(true);
    }
  }, [notes, hasCentered, setViewportPosition]);

  return null;
}

/**
 * LoadingIndicator - Shows while notes are loading
 */
function LoadingIndicator() {
  return (
    <div className="app__loading" style={{ position: 'absolute', left: '5200px', top: '5100px' }}>
      <p>Gathering memories...</p>
    </div>
  );
}

/**
 * EmptyIndicator - Shows when no notes exist
 */
function EmptyIndicator() {
  return (
    <div className="app__empty" style={{ position: 'absolute', left: '5200px', top: '5100px' }}>
      <p>The wall is quiet.</p>
      <p className="app__empty-cta">Leave a thought above ↑</p>
    </div>
  );
}

export default App;
