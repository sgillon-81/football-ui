import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config"; // Import API base URL

const ViewAverageRatings = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`${API_BASE_URL}/average_ratings`)
            .then(response => {
                setPlayers(response.data);
            })
            .catch(error => {
                console.error("❌ Error fetching average ratings:", error);
                setError("Failed to load player ratings. Please try again.");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">📊 Player Average Ratings</h2>
            
            {loading ? (
                <p className="text-center text-gray-300">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-600 bg-gray-800 shadow-lg rounded-lg">
                        <thead className="bg-gray-700 text-white uppercase text-lg">
                            <tr>
                                <th className="p-4 text-left">Player</th>
                                <th className="p-4">Overall Ability</th>
                            </tr>
                        </thead>
                        <tbody className="text-white text-lg">
                            {players.length > 0 ? (
                                players.map((player) => (
                                    <tr key={player.name} className="border-b border-gray-700 hover:bg-gray-700">
                                        <td className="p-4">{player.name}</td>
                                        <td className="p-4 font-bold text-blue-400">
                                            {typeof player.overall_ability === "number" ? player.overall_ability.toFixed(2) : "N/A"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center text-gray-400 p-6 text-lg">
                                        No ratings available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewAverageRatings;
