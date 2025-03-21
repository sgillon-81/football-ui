import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config"; // ✅ Import base URL

const RatePlayers = () => {
    const [players, setPlayers] = useState([]);
    const [ratings, setRatings] = useState({});
    const [coachName, setCoachName] = useState("");

    useEffect(() => {
        axios.get(`${API_BASE_URL}/players`) // ✅ Use API_BASE_URL
            .then(response => setPlayers(response.data))
            .catch(error => console.error("❌ Error fetching players:", error));
    }, []);

    const handleRatingChange = (playerName, field, value) => {
        setRatings(prev => ({
            ...prev,
            [playerName]: { ...prev[playerName], [field]: value }
        }));
    };

    const submitRating = async (playerName) => {
        if (!coachName) {
            alert("❌ Please enter your name before submitting ratings.");
            return;
        }
        try {
            await axios.post(`${API_BASE_URL}/players/${playerName}/ratings`, { // ✅ Use API_BASE_URL
                coach: coachName,
                ...ratings[playerName]
            });
            alert(`✅ Rating submitted for ${playerName}`);
        } catch (error) {
            console.error("❌ Error submitting rating:", error);
            alert("Error submitting rating. Check console.");
        }
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">🎯 Rate Players</h2>
            
            <div className="mb-6 flex flex-col items-center">
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    className="p-3 border border-gray-600 bg-gray-800 text-white rounded-md w-80 text-lg"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-600 bg-gray-800 shadow-lg rounded-lg">
                    <thead className="bg-gray-700 text-white uppercase text-lg">
                        <tr>
                            <th className="p-4 text-left">Player</th>
                            <th className="p-4">Attack</th>
                            <th className="p-4">Defense</th>
                            <th className="p-4">Passing</th>
                            <th className="p-4">Attitude</th>
                            <th className="p-4">Teamwork</th>
                            <th className="p-4">Submit</th>
                        </tr>
                    </thead>
                    <tbody className="text-white text-lg">
                        {players.length > 0 ? (
                            players.map((player) => (
                                <tr key={player.name} className="border-b border-gray-600 hover:bg-gray-700">
                                    <td className="p-4 font-semibold">{player.name}</td>
                                    {["attack_skill", "defense_skill", "passing", "attitude", "teamwork"].map(field => (
                                        <td key={field} className="p-4">
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                className="border border-gray-500 bg-gray-700 text-white rounded-md w-20 p-2 text-center text-lg"
                                                value={ratings[player.name]?.[field] || ""}
                                                onChange={(e) => handleRatingChange(player.name, field, e.target.value)}
                                            />
                                        </td>
                                    ))}
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => submitRating(player.name)} 
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-lg">
                                            Submit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-400 p-6 text-lg">
                                    No players found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RatePlayers;
