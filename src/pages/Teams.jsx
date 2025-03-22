import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useTeam } from "../TeamContext"; // ✅ Import global team context

export default function Teams() {
  const { teamName } = useTeam(); // ✅ Use selected team
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [opponent1, setOpponent1] = useState("Team A");
  const [opponent2, setOpponent2] = useState("Team B");
  const [strength1, setStrength1] = useState(3);
  const [strength2, setStrength2] = useState(2);

  const handleSelectTeams = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/select_teams`, {
        team_name: teamName, // ✅ Include team in request
        opponent_1_name: opponent1,
        opponent_1_strength: strength1,
        opponent_2_name: opponent2,
        opponent_2_strength: strength2
      });

      setTeamData(response.data);
    } catch (err) {
      console.error("❌ Error selecting teams:", err);
      setError("Failed to select teams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">Team Selection</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-blue-300 mb-4">Enter Team Info</h2>

        <label className="block text-gray-300">Opponent 1 Name:</label>
        <input
          type="text"
          value={opponent1}
          onChange={(e) => setOpponent1(e.target.value)}
          className="w-full p-2 mt-1 mb-3 bg-gray-700 text-white rounded-md"
        />

        <label className="block text-gray-300">Opponent 1 Strength (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={strength1}
          onChange={(e) => setStrength1(Number(e.target.value))}
          className="w-full p-2 mt-1 mb-3 bg-gray-700 text-white rounded-md"
        />

        <label className="block text-gray-300">Opponent 2 Name:</label>
        <input
          type="text"
          value={opponent2}
          onChange={(e) => setOpponent2(e.target.value)}
          className="w-full p-2 mt-1 mb-3 bg-gray-700 text-white rounded-md"
        />

        <label className="block text-gray-300">Opponent 2 Strength (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={strength2}
          onChange={(e) => setStrength2(Number(e.target.value))}
          className="w-full p-2 mt-1 mb-4 bg-gray-700 text-white rounded-md"
        />

        <button
          onClick={handleSelectTeams}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md transition-all"
          disabled={loading}
        >
          {loading ? "Selecting Teams..." : "Select Teams"}
        </button>
      </div>

      {error && <p className="mt-4 text-red-400 font-semibold">{error}</p>}

      {teamData && (
        <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[opponent1, opponent2].map((opponent, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className={`text-2xl font-semibold ${i === 0 ? "text-blue-300" : "text-green-300"}`}>
                {opponent}
              </h3>
              <p className="mt-1 text-gray-400">Avg Ability: {teamData.teams[opponent].average_ability}</p>
              <ul className="mt-3 space-y-2">
                {teamData.teams[opponent].players.map((player, index) => (
                  <li key={index} className="p-2 bg-gray-700 rounded-md">{`${player.name} - ${player.position}`}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
