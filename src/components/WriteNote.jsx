import { useState, useRef, useEffect } from 'react';
import { randomPick, noteColors } from '../utils/randomness';
import './WriteNote.css';

/**
 * WriteNote - The act of writing, not submitting
 * 
 * This component IS a note. It looks like one, feels like one.
 * The experience is placing a thought on the wall, not filling a form.
 * No boxes, no labels stacked above inputs.
 */
function WriteNote({ onSubmit }) {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteColor] = useState(() => randomPick(noteColors));
  const textareaRef = useRef(null);

  // Auto-resize textarea to fit content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    
    await onSubmit({
      message: message.trim(),
      name: name.trim() || 'Anonymous',
    });
    
    // Reset after placing note
    setMessage('');
    setName('');
    setIsSubmitting(false);
    
    // Gentle blur to show the note was placed
    textareaRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    // Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form 
      className={`write-note ${isFocused ? 'write-note--focused' : ''} ${isSubmitting ? 'write-note--submitting' : ''}`}
      style={{ '--write-note-color': noteColor }}
      onSubmit={handleSubmit}
    >
      <div className="write-note__paper">
        {/* Message textarea - the main writing area */}
        <textarea
          ref={textareaRef}
          className="write-note__message"
          placeholder="Write something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          rows={3}
          maxLength={500}
          aria-label="Your thought"
        />
        
        {/* Footer with name and submit */}
        <div className="write-note__footer">
          <span className="write-note__dash">—</span>
          <input
            type="text"
            className="write-note__name"
            placeholder="Anonymous"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={50}
            aria-label="Your name (optional)"
          />
          
          <button 
            type="submit"
            className="write-note__submit"
            disabled={!message.trim() || isSubmitting}
            aria-label="Place note on wall"
          >
            <span className="write-note__submit-text">
              {isSubmitting ? 'Placing...' : 'Pin it'}
            </span>
            <svg className="write-note__submit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Keyboard hint */}
      {message.trim() && (
        <p className="write-note__hint">
          Press ⌘ Enter to pin
        </p>
      )}
    </form>
  );
}

export default WriteNote;
