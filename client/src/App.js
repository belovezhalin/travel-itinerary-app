import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './MapView';
import Auth from './components/Auth';
import ItineraryList from './components/ItineraryList';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list');
    const [selectedItinerary, setSelectedItinerary] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await axios.get('/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(data);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setView('auth');
    };

    const createNewItinerary = () => {
        setSelectedItinerary(null);
        setView('map');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            <header>
                <h1>Travel Itinerary</h1>
                <div className="nav-buttons">
                    <button onClick={() => setView('list')}>Itinerary list</button>
                    <button onClick={createNewItinerary}>New Itinerary</button>
                    {user ? (
                        <>
                            <span>Logged in as: {user.username}</span>
                            <button onClick={logout}>Log out</button>
                        </>
                    ) : (
                        <button onClick={() => setView('auth')}>Log in / Sign up</button>
                    )}
                </div>
            </header>

            <main>
                {view === 'auth' && <Auth setUser={setUser} />}
                {view === 'list' && <ItineraryList user={user} setSelectedItinerary={(itinerary) => {
                    setSelectedItinerary(itinerary);
                    setView('map');
                }} />}
                {view === 'map' && <MapView
                    user={user}
                    itinerary={selectedItinerary}
                    saveItinerary={async (title, days, isPublic) => {
                        try {
                            const token = localStorage.getItem('token');
                            const headers = token ? { Authorization: `Bearer ${token}` } : {};

                            if (selectedItinerary) {
                                await axios.put(`/api/itineraries/${selectedItinerary._id}`, {
                                    title, days, isPublic
                                }, { headers });
                            } else {
                                await axios.post('/api/itineraries', {
                                    title, days, isPublic
                                }, { headers });
                            }

                            setView('list');
                        } catch (error) {
                            alert('Error saving itinerary');
                        }
                    }}
                />}
            </main>
        </div>
    );
}

export default App;