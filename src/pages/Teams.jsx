import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://football-app.fly.dev"; // Ensure this is correct

export default function Teams() {
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);  // ✅ Prevent infinite API calls

  // Default values for opponent teams
  const [opponent1, setOpponent1] = useState("Team A");
  const [opponent2, setOpponent2] = useState("Team B");
  const [strength1, setStrength1] = useState(3);
  const [strength2, setStrength2] = useState(2);

  const handleSelectTeams = async () => {
    // ✅ Prevent multiple API calls by checking loading state
    if (loading) return;

    setLoading(true);  // ✅ Set loading to true before request
    setError(null); // Clear previous errors
    console.log("🔄 Sending request to API...");

    try {
      const response = await axios.post(`${API_BASE_URL}/select_teams`, {
        opponent_1_name: opponent1,
        opponent_1_strength: strength1,
        opponent_2_name: opponent2,
        opponent_2_strength: strength2
      });

      console.log("✅ Team selection successful:", response.data);

      setTeamData(response.data);
    } catch (err) {
      console.error("❌ Error selecting teams:", err);
      setError("Failed to select teams. Please try again.");
    } finally {
      setLoading(false);  // ✅ Ensure loading is false after request
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">Team Selection</h1>

      {/* Team Input Fields */}
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
          disabled={loading}  // ✅ Disable button during request
        >
          {loading ? "Selecting Teams..." : "Select Teams"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-400 font-semibold">{error}</p>}

      {/* Display Selected Teams */}
      {teamData && (
        <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team 1 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-300">{opponent1}</h3>
            <p className="mt-1 text-gray-400">Avg Ability: {teamData.teams[opponent1].average_ability}</p>
            <ul className="mt-3 space-y-2">
              {teamData.teams[opponent1].players.map((player, index) => (
                <li key={index} className="p-2 bg-gray-700 rounded-md">{`${player.name} - ${player.position}`}</li>
              ))}
            </ul>
          </div>

          {/* Team 2 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-green-300">{opponent2}</h3>
            <p className="mt-1 text-gray-400">Avg Ability: {teamData.teams[opponent2].average_ability}</p>
            <ul className="mt-3 space-y-2">
              {teamData.teams[opponent2].players.map((player, index) => (
                <li key={index} className="p-2 bg-gray-700 rounded-md">{`${player.name} - ${player.position}`}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

