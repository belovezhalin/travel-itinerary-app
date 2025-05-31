import React from 'react';
import { exportToPDF } from '../utils/exportToPDF';

import MarkerList from './MarkerList';

import '../styles/SideBar.css';

export default function SideBar({ days, currentDayId, setCurrentDayId, addNewDay, deleteCurrentDay, onDragEnd, saveCurrentItinerary }) {
    const current = days.find(d => d.id === currentDayId);

    return (
        <div className="sidebar">
            <h3>Places (route order)</h3>
            <MarkerList markers={current.markers} onDragEnd={onDragEnd}/>
            <div className="sidebar-controls">
                <button onClick={() => exportToPDF(days)}>Export to PDF</button>
                <button onClick={saveCurrentItinerary}>Save Itinerary</button>
                <button onClick={addNewDay}>Add Day</button>
                <button onClick={deleteCurrentDay}>Delete Current Day</button>
                <select value={currentDayId} onChange={e => setCurrentDayId(parseInt(e.target.value))}>
                    {days.map((day, index) => (
                        <option key={day.id} value={day.id}>Day {index + 1}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}