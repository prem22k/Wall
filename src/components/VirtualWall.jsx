import { useState, useEffect, useRef, useCallback } from 'react';
import NoteCard from './NoteCard';
import './VirtualWall.css';

/**
 * VirtualWall - Performance-optimized wall renderer
 * 
 * Only renders notes that are visible in the viewport.
 * Uses intersection observer for efficient lazy loading.
 */
function VirtualWall({ notes }) {
  const [visibleNotes, setVisibleNotes] = useState(new Set());
  const observerRef = useRef(null);
  const containerRef = useRef(null);
  
  // Batch size for initial render
  const INITIAL_BATCH = 20;
  const [loadedCount, setLoadedCount] = useState(INITIAL_BATCH);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const noteId = entry.target.dataset.noteId;
            if (entry.isIntersecting) {
              setVisibleNotes(prev => new Set([...prev, noteId]));
            }
          });
        },
        {
          root: null,
          rootMargin: '200px', // Load notes 200px before they enter viewport
          threshold: 0.01,
        }
      );
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Observe note placeholders
  const observeNote = useCallback((element) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  // Load more notes when scrolling near the end
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrolledPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrolledPercentage > 0.7 && loadedCount < notes.length) {
        setLoadedCount(prev => Math.min(prev + 20, notes.length));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadedCount, notes.length]);

  const notesToRender = notes.slice(0, loadedCount);

  return (
    <div className="virtual-wall" ref={containerRef}>
      <div className="virtual-wall__grid">
        {notesToRender.map((note) => (
          <div
            key={note.id}
            data-note-id={note.id}
            ref={observeNote}
            className="virtual-wall__item"
          >
            {visibleNotes.has(note.id) || notesToRender.indexOf(note) < INITIAL_BATCH ? (
              <NoteCard note={note} />
            ) : (
              <div className="virtual-wall__placeholder" style={{ height: '180px' }} />
            )}
          </div>
        ))}
      </div>
      
      {loadedCount < notes.length && (
        <div className="virtual-wall__loader">
          <p className="virtual-wall__loader-text">Loading more memories...</p>
        </div>
      )}
    </div>
  );
}

export default VirtualWall;
