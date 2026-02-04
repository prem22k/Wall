import { useState, useEffect } from 'react';
import WriteNote from './components/WriteNote';
import WallCanvas from './components/WallCanvas';
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
  const [notes, setNotes] = useState(() => {
    // Load notes from localStorage
    const saved = localStorage.getItem('wall-notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Persist notes to localStorage
  useEffect(() => {
    localStorage.setItem('wall-notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = async (noteData) => {
    const newNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      message: noteData.message,
      name: noteData.name,
      createdAt: new Date().toISOString(),
    };

    // Add to beginning so newest notes appear first
    setNotes(prev => [newNote, ...prev]);

    // Small delay to let the animation feel intentional
    await new Promise(resolve => setTimeout(resolve, 100));
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
      <WallCanvas notes={notes} />

      {/* Footer - barely there */}
      <footer className="app__footer">
        <p>Leave a thought. Read a memory. That's all.</p>
      </footer>
    </div>
  );
}

export default App;
