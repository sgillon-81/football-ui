import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useTeam } from "../TeamContext";  // ✅ Import team context

const Players = () => {
    const { teamName } = useTeam();  // ✅ Get selected team from dropdown
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        if (!teamName) return; // ✅ Avoid making API calls without a team selected

        console.log("🔹 Fetching players for team:", teamName);  // ✅ Log selected team

        axios.get(`${API_BASE_URL}/players`, { params: { team_name: teamName } })
            .then(response => {
                console.log("✅ API Response:", response.data); // ✅ Debug API response
                setPlayers(response.data);
            })
            .catch(error => console.error("❌ Error fetching players:", error));
    }, [teamName]); // ✅ Runs whenever `teamName` changes

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">⚽ Player List for {teamName}</h2>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 bg-white shadow-lg rounded-lg">
                    <thead className="bg-gray-800 text-white uppercase text-sm">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Position</th>
                            <th className="p-3">Foot</th>
                            <th className="p-3">Team</th> {/* ✅ Explicitly show team_name */}
                        </tr>
                    </thead>
                    <tbody className="text-gray-900 text-sm">
                        {players.length > 0 ? (
                            players.map((player, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    <td className="p-3 text-gray-900 font-medium">{player.name}</td>
                                    <td className="p-3 text-gray-700">{player.position}</td>
                                    <td className="p-3 text-gray-700">{player.foot}</td>
                                    <td className="p-3 text-gray-700">{player.team_name}</td> {/* ✅ Show team */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-gray-500 p-4">
                                    No players found for {teamName}.
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
