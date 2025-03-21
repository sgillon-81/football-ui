import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function RatePlayers() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [coach, setCoach] = useState("");
    const [ratings, setRatings] = useState({
        attack_skill: 0,
        defense_skill: 0,
        passing: 0,
        attitude: 0,
        teamwork: 0,
    });

    useEffect(() => {
        axios.get(`${API_BASE_URL}/players`)
            .then(response => {
                const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setPlayers(sorted);
            })
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
        if (!selectedPlayer || !coach) return alert("Please select a player and coach");

        try {
            await axios.post(`${API_BASE_URL}/players/${selectedPlayer}/ratings`, {
                coach,
                ...ratings,
            });
            alert("✅ Rating submitted!");
        } catch (error) {
            console.error("❌ Error submitting rating:", error);
            alert("❌ Failed to submit rating. Check console.");
        }
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-4 text-center">Rate Players</h1>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                <div>
                    <label className="block mb-1">Select Player</label>
                    <select
                        value={selectedPlayer}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                        className="w-full p-2 text-black rounded"
                    >
                        <option value="">-- Choose Player --</option>
                        {players.map(player => (
                            <option key={player.name} value={player.name}>
                                {player.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Coach</label>
                    <select
                        value={coach}
                        onChange={(e) => setCoach(e.target.value)}
                        className="w-full p-2 text-black rounded"
                    >
                        <option value="">-- Select Coach --</option>
                        {["Dannie", "James", "Kirsten", "Stephen","Stuart"].map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                {Object.entries(ratings).map(([key, value]) => (
                    <div key={key}>
                        <label className="block mb-1 capitalize">{key.replace("_", " ")}</label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            name={key}
                            value={value}
                            onChange={handleRatingChange}
                            className="w-full"
                        />
                        <div className="text-sm text-right">{value}</div>
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
                >
                    Submit Rating
                </button>
            </form>
        </div>
    );
}
