import React from 'react';
import { exportToPDF } from '../utils/exportToPDF';

import MarkerList from './MarkerList';

import '../styles/SideBar.css';

export default function SideBar({ itinerary, days, currentDayId, setCurrentDayId, addNewDay, deleteCurrentDay, onDragEnd, saveCurrentItinerary }) {
    const current = days.find(d => d.id === currentDayId);

    return (
        <div className="sidebar">
            <h3>Places (route order)</h3>
            <MarkerList markers={current.markers} onDragEnd={onDragEnd}/>
            <div className="sidebar-controls">
                <div className="row-1">
                    <select value={currentDayId} onChange={e => setCurrentDayId(parseInt(e.target.value))}>
                        {days.map((day, index) => (
                            <option key={day.id} value={day.id}>Day {index + 1}</option>
                        ))}
                    </select>
                    <button className="add-btn" onClick={addNewDay}>Add Day</button>
                    <button className="delete-btn" onClick={deleteCurrentDay}>Delete Current Day</button>
                </div>
                <div className="row-2">
                    <button className="save-btn" onClick={saveCurrentItinerary}>Save Itinerary</button>
                    <button className="export-btn" onClick={() => exportToPDF(days, itinerary || {title: 'Travel Plan'})}>Export to PDF</button>
                </div>
            </div>
        </div>
    );
}