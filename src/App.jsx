import { useState, useEffect } from 'react';
import WriteNote from './components/WriteNote';
import WallCanvas from './components/WallCanvas';
import { fetchNotes, createNote } from './services/api';
import './App.css';

/**
 * The Wall - A scrapbook for anonymous thoughts
 * 
 * This is not an app. It's a quiet place.
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

  return (
    <div className="app">
      {/* Page header - quiet, not branded */}
      <header className="app__header">
        <h1 className="app__title">The Wall</h1>
        <p className="app__subtitle">A quiet place for thoughts</p>
      </header>

      {/* Writing area - this IS a note */}
      <WriteNote onSubmit={handleAddNote} />

      {/* The wall of notes */}
      <WallCanvas notes={notes} isLoading={isLoading} />

      {/* Footer - barely there */}
      <footer className="app__footer">
        <p>Leave a thought. Read a memory. That's all.</p>
      </footer>
    </div>
  );
}

export default App;
