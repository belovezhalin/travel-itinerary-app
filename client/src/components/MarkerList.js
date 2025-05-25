import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import '../styles/MarkerList.css';

export default function MarkerList({ markers, onDragEnd }) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="markers">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {markers.map((marker, idx) => (
                            <Draggable key={idx} draggableId={String(idx)} index={idx}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="marker-list-item"
                                        style={provided.draggableProps.style}
                                    >
                                        {idx + 1}. {marker.label}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}