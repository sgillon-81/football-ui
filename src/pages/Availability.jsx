import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config"; // ✅ Import base URL

export default function Availability() {
    const [players, setPlayers] = useState([]);
    const [availability, setAvailability] = useState({});

    // 🔍 Fetch players when the component loads
    useEffect(() => {
        async function fetchPlayers() {
            try {
                const response = await axios.get(`${API_BASE_URL}/players`); // ✅ Use API_BASE_URL
                setPlayers(response.data);

                // Fetch availability for each player
                response.data.forEach(player => fetchAvailability(player.name));
            } catch (error) {
                console.error("❌ Error fetching players:", error);
            }
        }
        fetchPlayers();
    }, []);

    // 🔄 Fetch availability for a specific player
    async function fetchAvailability(playerName) {
        try {
            const response = await axios.get(`${API_BASE_URL}/players/${playerName}/availability`); // ✅ Use API_BASE_URL
            setAvailability(prevState => ({
                ...prevState,
                [playerName]: response.data.available
            }));
        } catch (error) {
            console.error(`❌ Error fetching availability for ${playerName}:`, error);
        }
    }

    // 🔄 Update availability status for a player
    async function updateAvailability(playerName, newStatus) {
        try {
            await axios.put(`${API_BASE_URL}/players/${playerName}/availability`, { // ✅ Use API_BASE_URL
                available: newStatus
            });

            // ✅ Update UI state immediately
            setAvailability(prevState => ({
                ...prevState,
                [playerName]: newStatus
            }));
        } catch (error) {
            console.error(`❌ Error updating availability for ${playerName}:`, error);
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-white mb-6">Player Availability</h1>
            <div className="space-y-4">
                {players.map(player => (
                    <div key={player.name} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow">
                        <span className="text-white text-lg">{player.name}</span>
                        <button
                            className={`px-4 py-2 rounded text-white ${availability[player.name] ? "bg-green-500" : "bg-red-500"}`}
                            onClick={() => updateAvailability(player.name, !availability[player.name])}
                        >
                            {availability[player.name] ? "Available" : "Not Available"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

