/**
 * API Service - Handles communication with the backend
 * 
 * This module abstracts the API calls for notes,
 * making it easy to switch between localStorage and MongoDB.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Fetch all notes from the server
 * Falls back to localStorage if server is unavailable
 */
export async function fetchNotes() {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    return await response.json();
  } catch (error) {
    console.warn('API unavailable, falling back to localStorage:', error.message);
    // Fallback to localStorage
    const saved = localStorage.getItem('wall-notes');
    return saved ? JSON.parse(saved) : [];
  }
}

/**
 * Create a new note on the server
 * Falls back to localStorage if server is unavailable
 */
export async function createNote(noteData) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    
    return await response.json();
  } catch (error) {
    console.warn('API unavailable, falling back to localStorage:', error.message);
    // Fallback: create note locally
    const newNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      message: noteData.message,
      name: noteData.name || 'Anonymous',
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage
    const saved = localStorage.getItem('wall-notes');
    const notes = saved ? JSON.parse(saved) : [];
    notes.unshift(newNote);
    localStorage.setItem('wall-notes', JSON.stringify(notes));
    
    return newNote;
  }
}

/**
 * Delete a note from the server
 */
export async function deleteNote(noteId) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
    
    return true;
  } catch (error) {
    console.warn('API unavailable:', error.message);
    // Fallback: delete from localStorage
    const saved = localStorage.getItem('wall-notes');
    if (saved) {
      const notes = JSON.parse(saved).filter(n => n.id !== noteId);
      localStorage.setItem('wall-notes', JSON.stringify(notes));
    }
    return true;
  }
}

/**
 * Update a note on the server
 */
export async function updateNote(noteId, noteData) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update note');
    }
    
    return await response.json();
  } catch (error) {
    console.warn('API unavailable:', error.message);
    // Fallback: update in localStorage
    const saved = localStorage.getItem('wall-notes');
    if (saved) {
      const notes = JSON.parse(saved);
      const index = notes.findIndex(n => n.id === noteId);
      if (index !== -1) {
        notes[index] = { ...notes[index], ...noteData };
        localStorage.setItem('wall-notes', JSON.stringify(notes));
        return notes[index];
      }
    }
    throw error;
  }
}

