/**
 * InfiniteWorld - The transformable inner container
 * 
 * This is the "world" that contains all notes.
 * It gets translated based on viewport position
 * to create the illusion of infinite panning.
 */
function InfiniteWorld({ children, position }) {
    return (
        <div
            className="infinite-world"
            style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            }}
        >
            {children}
        </div>
    );
}

export default InfiniteWorld;
