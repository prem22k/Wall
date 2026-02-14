/**
 * API Service - Handles communication with the backend
 * 
 * This module abstracts the API calls for notes,
 * making it easy to switch between localStorage and MongoDB.
 */

// Auto-detect API URL for GitHub Codespaces
function getApiBaseUrl() {
  // Use environment variable if set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect based on current domain
  const currentUrl = window.location.href;
  
  // Production domains - use Render backend
  if (currentUrl.includes('wall-hazel.vercel.app') || currentUrl.includes('wall.im45145v.dev')) {
    return 'https://wall-qwuk.onrender.com/api';
  }
  
  // GitHub Codespaces
  if (currentUrl.includes('.app.github.dev')) {
    // Replace port 5173 with 3001 for backend
    const backendUrl = currentUrl.replace('-5173.app.github.dev', '-3001.app.github.dev');
    const url = new URL(backendUrl);
    return `${url.protocol}//${url.host}/api`;
  }
  
  // Default to localhost for development
  return 'http://localhost:3001/api';
}

const API_BASE_URL = getApiBaseUrl();
// API Base URL configured based on environment

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
    // Fallback to localStorage when API is unavailable
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
    // Fallback: create note locally when API is unavailable
    const newNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      message: noteData.message,
      name: noteData.name || 'Anonymous',
      font: noteData.font || 'Caveat',
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
    // Fallback: delete from localStorage when API is unavailable
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
    // Fallback: update in localStorage when API is unavailable
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

/**
 * Authenticate admin user
 */
export async function authenticateAdmin(password) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Authentication failed');
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    // Provide user-friendly error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}
