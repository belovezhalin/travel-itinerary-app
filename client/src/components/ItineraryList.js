import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../styles/ItineraryList.css';

export default function ItineraryList({ user, setSelectedItinerary }) {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const { data } = await axios.get('/api/itineraries', {
                    withCredentials: true
                });
                setItineraries(data);
            } catch (error) {
                console.error('Error fetching itineraries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItineraries();
    }, []);

    const handleDelete = async (itineraryId) => {
        if (window.confirm('Are you sure you want to delete this itinerary?')) {
            try {
                await axios.delete(`/api/itineraries/${itineraryId}`, {
                    withCredentials: true
                });
                setItineraries(itineraries.filter(item => item._id !== itineraryId));
            } catch (error) {
                console.error('Error deleting itinerary', error);
                alert('Error deleting itinerary. Please try again later.');
            }
        }
    };

    return (
        <div className="itinerary-list">
            <h2>All itineraries</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {itineraries.map((itinerary) => (
                        <div key={itinerary._id} className="itinerary-item">
                            {itinerary.user === user?.id && (
                                <span className="delete-icon" onClick={() => handleDelete(itinerary._id)}>
                                            🗑️
                                </span>
                            )}

                            <h3>{itinerary.title}</h3>
                            <p>
                                {itinerary.user ? (
                                    <>Author: {itinerary.user === user?.id ? 'You' : 'Another user'}</>
                                ) : (
                                    <>Created anonymously</>
                                )}
                            </p>

                            <button onClick={() => setSelectedItinerary(itinerary)}>
                                View Itinerary
                            </button>
                        </div>
                    ))}
                    {itineraries.length === 0 && <p>No itineraries available</p>}
                </div>
            )}
        </div>
    );
}