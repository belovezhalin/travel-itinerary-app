import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './MapView';
import Auth from './components/Auth';
import ItineraryList from './components/ItineraryList';

import './App.css';

axios.defaults.withCredentials = true;

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('map');
    const [selectedItinerary, setSelectedItinerary] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await axios.get('/api/auth/me');
                setUser(data);
            } catch (error) {
                console.log('Auth error:', error);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
            setView('auth');
        } catch (error) {
            console.error('Logout error:', error);
        }
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
                {view === 'auth' && <Auth setUser={setUser} setView={setView} />}
                {view === 'list' && <ItineraryList user={user} setSelectedItinerary={(itinerary) => {
                    setSelectedItinerary(itinerary);
                    setView('map');
                }} />}
                {view === 'map' && <MapView
                    user={user}
                    itinerary={selectedItinerary}
                    isViewMode={selectedItinerary !== null}
                    saveItinerary={async (title, days, isPublic) => {
                        try {
                            if (selectedItinerary) {
                                await axios.put(`/api/itineraries/${selectedItinerary._id}`, {
                                    title, days, isPublic
                                });
                            } else {
                                await axios.post('/api/itineraries', {
                                    title, days, isPublic
                                });
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