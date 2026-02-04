import { useState, useEffect, useRef } from 'react';
import { getNoteStyle } from '../utils/randomness';
import './NoteCard.css';

/**
 * NoteCard - A paper artifact on the wall
 * 
 * Each note is a physical object, not a data row.
 * It has texture, slight imperfection, and presence.
 * The design evokes handwritten notes on real paper.
 */
function NoteCard({ note }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  
  // Get consistent random styling based on note ID
  const style = getNoteStyle(note.id);
  
  // Staggered entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50 + style.delay);
    return () => clearTimeout(timer);
  }, [style.delay]);

  // Format timestamp to feel human, not data-like
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <article
      ref={cardRef}
      className={`note-card ${isVisible ? 'note-card--visible' : ''}`}
      style={{
        '--note-color': style.color,
        '--note-rotation': `${style.rotation}deg`,
        '--note-offset-y': `${style.offsetY}px`,
        '--animation-delay': `${style.delay}ms`,
      }}
      aria-label={`Note from ${note.name || 'Anonymous'}`}
    >
      {/* Subtle tape decoration - only on some notes */}
      {style.rotation > 0.5 && (
        <div className="note-card__tape" aria-hidden="true" />
      )}
      
      <p className="note-card__message">{note.message}</p>
      
      <footer className="note-card__footer">
        <span className="note-card__author">
          — {note.name || 'Anonymous'}
        </span>
        {note.createdAt && (
          <time className="note-card__time" dateTime={note.createdAt}>
            {formatTime(note.createdAt)}
          </time>
        )}
      </footer>
    </article>
  );
}

export default NoteCard;
