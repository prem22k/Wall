import { useState } from 'react';
import { deleteNote, updateNote, authenticateAdmin } from '../services/api';
import './AdminPanel.css';

/**
 * AdminPanel - Simple admin interface
 * 
 * Allows viewing, editing, and deleting notes
 * Password-protected but simple
 */
function AdminPanel({ notes, onNoteDeleted, onNoteUpdated, isFullPage = false }) {
  const [isOpen, setIsOpen] = useState(isFullPage ? true : false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const [editName, setEditName] = useState('');
  
  // Authenticate with backend
  const handleAuth = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');
    
    try {
      const success = await authenticateAdmin(password);
      if (success) {
        setIsAuthenticated(true);
        setPassword('');
        setAuthError('');
      }
    } catch (error) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await deleteNote(noteId);
      onNoteDeleted(noteId);
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note.id);
    setEditMessage(note.message);
    setEditName(note.name);
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await updateNote(editingNote, {
        message: editMessage,
        name: editName,
      });
      onNoteUpdated(updated);
      setEditingNote(null);
    } catch (error) {
      console.error('Failed to update note:', error);
      alert('Failed to update note');
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditMessage('');
    setEditName('');
  };

  return (
    <div className={`admin-panel ${isFullPage ? 'admin-panel--full-page' : ''}`}>
      {!isFullPage && (
        <button
          className="admin-panel__toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Admin panel"
          title="Admin panel"
        >
          <svg className="admin-panel__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="admin-panel__label">Admin</span>
        </button>
      )}

      {isOpen && (
        <>
          {!isFullPage && <div className="admin-panel__backdrop" onClick={() => setIsOpen(false)} />}
          <div className={`admin-panel__panel ${isFullPage ? 'admin-panel__panel--full' : ''}`}>
            {!isFullPage && (
              <div className="admin-panel__header">
                <h3 className="admin-panel__title">Admin Panel</h3>
                <button
                  className="admin-panel__close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            )}
            
            {!isAuthenticated ? (
              <form className="admin-panel__auth" onSubmit={handleAuth}>
                {authError && (
                  <div className="admin-panel__auth-error">
                    ⚠️ {authError}
                  </div>
                )}
                <input
                  type="password"
                  className="admin-panel__password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError('');
                  }}
                  autoFocus
                  disabled={isAuthenticating}
                />
                <button 
                  type="submit" 
                  className="admin-panel__auth-btn"
                  disabled={isAuthenticating || !password}
                >
                  {isAuthenticating ? 'Checking...' : 'Unlock'}
                </button>
              </form>
            ) : (
              <div className="admin-panel__content">
                <div className="admin-panel__stats">
                  <div className="admin-panel__stat">
                    <span className="admin-panel__stat-number">{notes.length}</span>
                    <span className="admin-panel__stat-label">Total Notes</span>
                  </div>
                </div>

                <div className="admin-panel__notes">
                  {notes.map((note) => (
                    <div key={note.id} className="admin-panel__note">
                      {editingNote === note.id ? (
                        <div className="admin-panel__edit">
                          <textarea
                            className="admin-panel__edit-message"
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            rows={3}
                          />
                          <input
                            type="text"
                            className="admin-panel__edit-name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                          />
                          <div className="admin-panel__edit-actions">
                            <button
                              className="admin-panel__btn admin-panel__btn--save"
                              onClick={handleSaveEdit}
                            >
                              Save
                            </button>
                            <button
                              className="admin-panel__btn admin-panel__btn--cancel"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="admin-panel__note-content">
                            <p className="admin-panel__note-message">{note.message}</p>
                            <div className="admin-panel__note-meta">
                              <span className="admin-panel__note-author">— {note.name}</span>
                              <span className="admin-panel__note-date">
                                {new Date(note.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="admin-panel__note-actions">
                            <button
                              className="admin-panel__btn admin-panel__btn--edit"
                              onClick={() => handleEdit(note)}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-panel__btn admin-panel__btn--delete"
                              onClick={() => handleDelete(note.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel;
