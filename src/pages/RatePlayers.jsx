import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function RatePlayers() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [coach, setCoach] = useState(""); // Updated from "name"
    const [ratings, setRatings] = useState({
        attack_skill: 0,
        defense_skill: 0,
        passing: 0,
        attitude: 0,
        teamwork: 0,
    });

    useEffect(() => {
        axios.get(`${API_BASE_URL}/players`)
            .then(response => setPlayers(response.data))
            .catch(error => console.error("❌ Error fetching players:", error));
    }, []);

    const handleRatingChange = (e) => {
        setRatings({
            ...ratings,
            [e.target.name]: parseInt(e.target.value),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPlayer || !coach) return alert("Please select a player and coach name");

        try {
            await axios.post(`${API_BASE_URL}/players/${selectedPlayer}/ratings`, {
                coach,
                ...ratings,
            });
            alert("✅ Rating submitted!");
        } catch (error) {
            console.error("❌ Error submitting rating:", error);
            alert("❌ Error submitting rating. Check console.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-center text-white mb-6">Rate Players</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-gray-900 p-6 rounded-lg shadow">
                <div>
                    <label className="block text-white mb-2">Select Player</label>
                    <select
                        value={selectedPlayer}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                        className="w-full p-2 rounded"
                    >
                        <option value="">-- Choose a Player --</option>
                        {players.map((player) => (
                            <option key={player.name} value={player.name}>
                                {player.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-white mb-2">Coach</label>
                    <select
                        value={coach}
                        onChange={(e) => setCoach(e.target.value)}
                        className="w-full p-2 rounded"
                    >
                        <option value="">-- Select Coach --</option>
                        {["Stephen", "Kirsten", "Dannie", "James", "Stuart"].map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                {Object.keys(ratings).map((skill) => (
                    <div key={skill}>
                        <label className="block text-white capitalize mb-1">{skill.replace("_", " ")}</label>
                        <input
                            type="range"
                            name={skill}
                            min="0"
                            max="5"
                            value={ratings[skill]}
                            onChange={handleRatingChange}
                            className="w-full"
                        />
                        <div className="text-white text-right">{ratings[skill]}</div>
                    </div>
                ))}

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Submit Rating
                </button>
            </form>
        </div>
    );
}
