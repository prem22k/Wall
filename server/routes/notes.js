import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

/**
 * GET /api/notes
 * Retrieve all notes, sorted by newest first
 */
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

/**
 * POST /api/notes
 * Create a new note on the wall
 */
router.post('/', async (req, res) => {
  try {
    const { message, name } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const note = new Note({
      message: message.trim(),
      name: name?.trim() || 'Anonymous',
    });
    
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create note' });
  }
});

/**
 * DELETE /api/notes/:id
 * Remove a note from the wall (optional, for future use)
 */
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note removed' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
