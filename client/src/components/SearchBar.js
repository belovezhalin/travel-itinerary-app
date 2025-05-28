import React, { useState } from 'react';
import axios from 'axios';

export default function SearchBar({ mapRef }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const searchPlace = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: query,
                    format: 'json',
                    limit: 5
                },
                withCredentials: false // Kluczowe: wyłączamy wysyłanie ciasteczek dla zewnętrznego API
            });

            setResults(response.data);
            setShowResults(true);
        } catch (error) {
            console.error('Błąd wyszukiwania:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToPlace = (result) => {
        if (mapRef.current) {
            const map = mapRef.current;
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);

            map.flyTo([lat, lng], 14);
        }
        setShowResults(false);
    };

    return (
        <div className="search-container">
            <form onSubmit={searchPlace}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Szukaj miejsc..."
                    className="search-input"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Szukam...' : 'Szukaj'}
                </button>
            </form>

            {showResults && (
                <div className="search-results">
                    {results.length > 0 ? (
                        results.map((result) => (
                            <div
                                key={result.place_id}
                                className="search-result-item"
                                onClick={() => goToPlace(result)}
                            >
                                {result.display_name}
                            </div>
                        ))
                    ) : (
                        <div className="search-result-item">Nie znaleziono wyników</div>
                    )}
                </div>
            )}
        </div>
    );
}