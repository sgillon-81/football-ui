import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config"; // ✅ Import base URL

const Players = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/players`) // ✅ Use API_BASE_URL
            .then(response => setPlayers(response.data))
            .catch(error => console.error("❌ Error fetching players:", error));
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">⚽ Player List</h2>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 bg-white shadow-lg rounded-lg">
                    <thead className="bg-gray-800 text-white uppercase text-sm">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Position</th>
                            <th className="p-3">Foot</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-900 text-sm">
                        {players.length > 0 ? (
                            players.map((player, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    <td className="p-3 text-gray-900 font-medium">{player.name}</td>
                                    <td className="p-3 text-gray-700">{player.position}</td>
                                    <td className="p-3 text-gray-700">{player.foot}</td>
                                    <td className="p-3 text-center text-gray-700">
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-gray-500 p-4">
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

export default Players;
