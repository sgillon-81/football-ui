import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useTeam } from "../TeamContext";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

export default function PlayerAnalysis() {
  const { teamName } = useTeam();
  const [players, setPlayers] = useState([]);
  const [playerId, setPlayerId] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/players?team_name=${teamName}`)
      .then(res => setPlayers(res.data))
      .catch(err => console.error("❌ Failed to fetch players", err));
  }, [teamName]);

  const fetchAnalysis = () => {
    if (!playerId) return;
    axios.get(`${API_BASE_URL}/player_analysis`, {
      params: {
        player_id: playerId,
        start_date: startDate,
        end_date: endDate,
      },
    })
      .then(res => setAnalysis(res.data))
      .catch(err => console.error("❌ Failed to fetch analysis", err));
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold text-blue-300 mb-6">📊 Player Analysis</h2>

      {/* Player Selector */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <select
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          className="p-2 bg-gray-800 rounded border border-gray-600 w-64"
        >
          <option value="">Select Player</option>
          {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <div className="flex gap-2 items-center">
          <label>From:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 bg-gray-800 border border-gray-600 rounded" />
          <label>To:</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 bg-gray-800 border border-gray-600 rounded" />
        </div>

        <button
          onClick={fetchAnalysis}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white font-semibold"
        >
          Load Analysis
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-lg">
          <div className="bg-gray-800 p-4 rounded shadow">
            <h3 className="text-xl font-bold text-blue-400 mb-2">Summary Stats</h3>
            <ul className="space-y-1">
              <li>🧠 Games Played: {analysis.games_played}</li>
              <li>⏱ Minutes Played: {analysis.minutes_played}</li>
              <li>💪 Crucial Tackles: {analysis.crucial_tackles} (avg {analysis.avg_crucial_tackles})</li>
              <li>🎯 Assists: {analysis.assists} (avg {analysis.avg_assists})</li>
              <li>⚽ Goals: {analysis.goals} (avg {analysis.avg_goals})</li>
              <li>🔥 Outstanding Performances: {analysis.outstanding_performances}</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded shadow">
            <h3 className="text-xl font-bold text-green-400 mb-2">Ratings</h3>
            <ul className="space-y-1">
              <li>⭐ Highest Rating: {analysis.highest_rating}</li>
              <li>📊 Average Rating: {analysis.avg_rating}</li>
              <li>📌 By Position:</li>
              <ul className="ml-4 text-sm">
                {Object.entries(analysis.rating_by_position).map(([pos, rating]) => (
                  <li key={pos}>{pos}: {rating.toFixed(1)}</li>
                ))}
              </ul>
            </ul>
          </div>

          {/* Chart */}
          <div className="col-span-1 md:col-span-2 bg-gray-800 p-6 rounded shadow">
            <h3 className="text-xl font-bold text-purple-400 mb-2">📈 Rating Over Time</h3>
            <Line
              data={{
                labels: analysis.rating_trend.map(entry => entry.date),
                datasets: [{
                  label: "Rating",
                  data: analysis.rating_trend.map(entry => entry.rating),
                  borderColor: "rgba(59, 130, 246, 1)",
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                }]
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
