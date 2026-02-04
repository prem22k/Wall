import NoteCard from './NoteCard';
import VirtualWall from './VirtualWall';
import './WallCanvas.css';

/**
 * WallCanvas - The physical surface where notes live
 * 
 * This is not a list, not a grid, not a feed.
 * It's a masonry collage of paper artifacts,
 * hand-placed and slightly imperfect.
 * 
 * Uses VirtualWall for performance with large note collections.
 */
function WallCanvas({ notes, isLoading }) {
  const isEmpty = !notes || notes.length === 0;

  if (isLoading) {
    return (
      <section className="wall-canvas" aria-label="Wall of notes">
        <LoadingState />
      </section>
    );
  }

  return (
    <section className="wall-canvas" aria-label="Wall of notes">
      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {/* Memories counter - subtle, emotional */}
          <div className="wall-canvas__counter">
            <span className="wall-canvas__counter-number">{notes.length}</span>
            <span className="wall-canvas__counter-label">
              {notes.length === 1 ? 'memory' : 'memories'} collected
            </span>
          </div>
          
          {/* The wall itself - virtualized masonry layout for performance */}
          {notes.length > 50 ? (
            <VirtualWall notes={notes} />
          ) : (
            <div className="wall-canvas__grid">
              {notes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

/**
 * LoadingState - A gentle loading indicator
 */
function LoadingState() {
  return (
    <div className="wall-canvas__loading">
      <div className="wall-canvas__loading-papers" aria-hidden="true">
        <div className="wall-canvas__loading-paper" />
        <div className="wall-canvas__loading-paper" />
        <div className="wall-canvas__loading-paper" />
      </div>
      <p className="wall-canvas__loading-text">Gathering memories...</p>
    </div>
  );
}

/**
 * EmptyState - An invitation, not an error
 * 
 * When the wall is empty, it should feel inviting,
 * like a fresh journal page waiting for the first entry.
 */
function EmptyState() {
  return (
    <div className="wall-canvas__empty">
      <div className="wall-canvas__empty-illustration" aria-hidden="true">
        {/* Simple decorative elements suggesting paper/notes */}
        <div className="wall-canvas__empty-paper wall-canvas__empty-paper--1" />
        <div className="wall-canvas__empty-paper wall-canvas__empty-paper--2" />
        <div className="wall-canvas__empty-paper wall-canvas__empty-paper--3" />
      </div>
      <p className="wall-canvas__empty-text">
        The wall is quiet.
        <br />
        <span className="wall-canvas__empty-cta">Leave a thought?</span>
      </p>
    </div>
  );
}

export default WallCanvas;
