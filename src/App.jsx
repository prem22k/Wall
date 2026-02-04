import { useState, useEffect } from 'react';
import WriteNote from './components/WriteNote';
import WallCanvas from './components/WallCanvas';
import FontSwitcher from './components/FontSwitcher';
import AdminPanel from './components/AdminPanel';
import { fetchNotes, createNote } from './services/api';
import './App.css';

/**
 * Ashish's Wall - A personal scrapbook for thoughts
 * 
 * This is not an app. It's a personal space.
 * A corkboard. A journal. A paper surface.
 * 
 * Everything here should feel physical, human, imperfect.
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
        console.error('Failed to load notes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotes();
  }, []);

  const handleAddNote = async (noteData) => {
    try {
      const newNote = await createNote(noteData);
      // Add to beginning so newest notes appear first
      setNotes(prev => [newNote, ...prev]);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleNoteDeleted = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  return (
    <div className="app">
      {/* Page header - personal, branded */}
      <header className="app__header">
        <h1 className="app__title">Ashish's Wall</h1>
        <p className="app__subtitle">A personal space for thoughts and memories</p>
      </header>

      {/* Writing area - this IS a note */}
      <WriteNote onSubmit={handleAddNote} />

      {/* The wall of notes */}
      <WallCanvas notes={notes} isLoading={isLoading} />

      {/* Guide section - warm and personal */}
      <footer className="app__footer">
        <div className="app__guide">
          <h2 className="app__guide-title">About This Wall</h2>
          <p className="app__guide-text">
            This is Ashish's personal collection of thoughts, ideas, and fleeting moments. 
            Each note is a memory, a reflection, or a spark of inspiration pinned to this digital corkboard.
          </p>
          <p className="app__guide-text">
            Feel free to browse, read, and absorb. These are fragments of a mind at work—
            sometimes profound, sometimes playful, always honest.
          </p>
          <p className="app__guide-text">
            Want to leave your own thought? Write it down above and pin it to the wall.
          </p>
        </div>
        <div className="app__footer-credit">
          <p>A personal space, lovingly maintained</p>
        </div>
      </footer>

      {/* Floating controls */}
      <FontSwitcher />
      <AdminPanel 
        notes={notes} 
        onNoteDeleted={handleNoteDeleted}
        onNoteUpdated={handleNoteUpdated}
      />
    </div>
  );
}

export default App;
