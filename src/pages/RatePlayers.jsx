import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useTeam } from "../TeamContext";
import { toast } from "react-toastify";

const RatePlayers = () => {
  const { teamName } = useTeam();
  const [players, setPlayers] = useState([]);
  const [ratings, setRatings] = useState({});
  const [coachList, setCoachList] = useState([]);
  const [selectedCoachId, setSelectedCoachId] = useState("");

  // 🔄 Load players for selected team
  useEffect(() => {
    if (!teamName) return;

    axios.get(`${API_BASE_URL}/players?team_name=${encodeURIComponent(teamName)}`)
      .then(response => {
        const sorted = [...response.data].sort((a, b) => a.name.localeCompare(b.name));
        setPlayers(sorted);
      })
      .catch(error => {
        console.error("❌ Error fetching players:", error);
        toast.error("Failed to load players.");
      });
  }, [teamName]);

  // 🔄 Load coach list for selected team
  useEffect(() => {
    if (!teamName) return;

    axios.get(`${API_BASE_URL}/coaches?team_name=${encodeURIComponent(teamName)}`)
      .then(response => setCoachList(response.data))
      .catch(error => {
        console.error("❌ Error fetching coaches:", error);
        toast.error("Failed to load coaches.");
      });
  }, [teamName]);

  const handleRatingChange = (playerName, field, value) => {
    setRatings(prev => ({
      ...prev,
      [playerName]: { ...prev[playerName], [field]: value }
    }));
  };

  const submitRating = async (playerName) => {
    if (!selectedCoachId) {
      toast.error("Please select your name before submitting ratings.");
      return;
    }

    try {
      const payload = {
        coach_id: selectedCoachId,
        ...ratings[playerName]
      };

      await axios.post(`${API_BASE_URL}/players/${encodeURIComponent(playerName)}/ratings`, payload);
      toast.success(`✅ Rating submitted for ${playerName}`);
    } catch (error) {
      console.error("❌ Error submitting rating:", error);
      toast.error("Error submitting rating. Check console.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">🎯 Rate Players</h2>

      {/* 🧑‍🏫 Coach Selector */}
      <div className="mb-6 flex flex-col items-center">
        <label htmlFor="coach" className="mb-2 text-lg">Coach</label>
        <select
          id="coach"
          value={selectedCoachId}
          onChange={(e) => setSelectedCoachId(e.target.value)}
          className="p-3 border border-gray-600 bg-gray-800 text-white rounded-md w-80 text-lg"
        >
          <option value="">Select your name</option>
          {coachList.map(coach => (
            <option key={coach.id} value={coach.id}>
              {coach.forename} {coach.surname}
            </option>
          ))}
        </select>
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
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-lg"
                    >
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
