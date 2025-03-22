import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useTeam } from "../TeamContext";
import { toast } from "react-toastify";

const opponentOptions = [
  "Ancrum", "Bonnyrigg", "Chirnside", "Duns", "Earlston", "Eastside Rapids", "Edinburgh South",
  "Gala", "Hawick", "Kelso", "KSQ", "Lauderdale", "Leithen Vale", "Linton Hotspur", "Loanhead",
  "Melrose", "Mussleburgh", "Peebles 2013s", "Peebles 2014s", "Peebles 2015s", "Peebles 2016s",
  "Penicuik", "Selkirk", "Trannent", "Tweedbank Thistle"
];

const devOptions = [
  "Attacking (general)", "Crossing", "Defending (general)", "Dribbling", "Passing (short)",
  "Passing (long)", "Playing Out From the Back", "Pressing", "Set Piece (kick/throw in)",
  "Set Piece (corners)", "Set Piece (free kicks)", "Shooting", "Stamina", "Tackling", "Turning"
];

const AddMatch = () => {
  const { teamName } = useTeam();
  const [coaches, setCoaches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matchDetails, setMatchDetails] = useState({
    coach_id: "",
    opponent: "",
    date: "",
    home_or_away: "Home",
    game_comments: "",
    areas_for_dev: [],
  });

  const [playerStats, setPlayerStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coachRes = await axios.get(`${API_BASE_URL}/coaches?team_name=${teamName}`);
        setCoaches(coachRes.data);
        const playerRes = await axios.get(`${API_BASE_URL}/players?team_name=${teamName}`);
        setPlayers(playerRes.data);
      } catch (err) {
        toast.error("❌ Failed to load coaches or players");
      }
    };
    fetchData();
  }, [teamName]);

  const handlePlayerToggle = (id) => {
    setPlayerStats(prev => ({
      ...prev,
      [id]: prev[id] ? undefined : {
        player_id: id,
        coach_id: matchDetails.coach_id,
        primary_position: "Mid",
        minutes_played: 0,
        rating: null,
        crucial_tackles: 0,
        assists: 0,
        goals: 0,
        comments: "",
        outstanding_performance: false
      }
    }));
  };

  const handlePlayerChange = (id, field, value) => {
    setPlayerStats(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: field === "outstanding_performance" ? value.target.checked : value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matchDetails.coach_id || !matchDetails.opponent || !matchDetails.date) {
      toast.error("❌ Please fill in all required fields");
      return;
    }

    const statsArray = Object.values(playerStats).filter(Boolean);

    const payload = {
      match: {
        team_name: teamName,
        coach_id: matchDetails.coach_id,
        opponent: matchDetails.opponent,
        date: matchDetails.date,
        home_or_away: matchDetails.home_or_away,
        game_comments: matchDetails.game_comments || "",
        areas_for_dev: matchDetails.areas_for_dev || []
      },
      player_stats: statsArray
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/matches`, payload);
      toast.success("✅ Match and stats submitted");
      console.log("Submitted:", res.data);
    } catch (err) {
      console.error("❌ Error submitting match:", err);
      toast.error("❌ Error submitting match. See console for details.");
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">📋 Add Match</h2>

      {/* Match Info */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            Coach:
            <select
              value={matchDetails.coach_id}
              onChange={e => setMatchDetails({ ...matchDetails, coach_id: e.target.value })}
              className="mt-1 w-full p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="">Select Coach</option>
              {coaches.map(c => (
                <option key={c.id} value={c.id}>{`${c.forename} ${c.surname}`}</option>
              ))}
            </select>
          </label>
          <label className="block">
            Opponent:
            <select
              value={matchDetails.opponent}
              onChange={e => setMatchDetails({ ...matchDetails, opponent: e.target.value })}
              className="mt-1 w-full p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="">Select Opponent</option>
              {opponentOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="block">
            Date:
            <input
              type="date"
              value={matchDetails.date}
              onChange={e => setMatchDetails({ ...matchDetails, date: e.target.value })}
              className="mt-1 w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </label>
          <label className="block">
            Home or Away:
            <select
              value={matchDetails.home_or_away}
              onChange={e => setMatchDetails({ ...matchDetails, home_or_away: e.target.value })}
              className="mt-1 w-full p-2 rounded bg-gray-700 text-white"
            >
              <option>Home</option>
              <option>Away</option>
            </select>
          </label>
        </div>

        {/* Player Stats */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Select Players and Enter Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map(p => (
              <div key={p.id} className="p-3 rounded bg-gray-800 text-white">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!!playerStats[p.id]}
                    onChange={() => handlePlayerToggle(p.id)}
                  />
                  <span className="font-medium">{p.name}</span>
                </label>
                {playerStats[p.id] && (
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <label>
                      Position
                      <select
                        className="w-full p-1 bg-gray-700 rounded"
                        value={playerStats[p.id].primary_position}
                        onChange={e => handlePlayerChange(p.id, "primary_position", e.target.value)}
                      >
                        {["GK", "Def", "LB", "RB", "Mid", "LW", "RW", "Fwd"].map(pos => (
                          <option key={pos}>{pos}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Minutes
                      <input
                        type="number"
                        value={playerStats[p.id].minutes_played}
                        onChange={e => handlePlayerChange(p.id, "minutes_played", parseInt(e.target.value))}
                        className="w-full p-1 bg-gray-700 rounded"
                      />
                    </label>
                    <label>
                      Rating
                      <input
                        type="number"
                        min="1" max="10"
                        value={playerStats[p.id].rating || ""}
                        onChange={e => handlePlayerChange(p.id, "rating", parseInt(e.target.value))}
                        className="w-full p-1 bg-gray-700 rounded"
                      />
                    </label>
                    <label>
                      Tackles
                      <input
                        type="number"
                        value={playerStats[p.id].crucial_tackles}
                        onChange={e => handlePlayerChange(p.id, "crucial_tackles", parseInt(e.target.value))}
                        className="w-full p-1 bg-gray-700 rounded"
                      />
                    </label>
                    <label>
                      Assists
                      <input
                        type="number"
                        value={playerStats[p.id].assists}
                        onChange={e => handlePlayerChange(p.id, "assists", parseInt(e.target.value))}
                        className="w-full p-1 bg-gray-700 rounded"
                      />
                    </label>
                    <label>
                      Goals
                      <input
                        type="number"
                        value={playerStats[p.id].goals}
                        onChange={e => handlePlayerChange(p.id, "goals", parseInt(e.target.value))}
                        className="w-full p-1 bg-gray-700 rounded"
                      />
                    </label>
                    <label className="col-span-2">
                      Comments
                      <input
                        type="text"
                        value={playerStats[p.id].comments}
                        maxLength="150"
                        onChange={e => handlePlayerChange(p.id, "comments", e.target.value)}
                        className="w-full p-1 bg-gray-700 rounded"
                      />
                    </label>
                    <label className="col-span-2">
                      <input
                        type="checkbox"
                        checked={playerStats[p.id].outstanding_performance}
                        onChange={e => handlePlayerChange(p.id, "outstanding_performance", e)}
                        className="mr-2"
                      />
                      Outstanding Performance
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Game Comments and Areas for Dev */}
        <div className="mt-6">
          <label className="block mb-2">Game Comments</label>
          <textarea
            value={matchDetails.game_comments}
            onChange={e => setMatchDetails({ ...matchDetails, game_comments: e.target.value })}
            maxLength="300"
            className="w-full p-3 rounded bg-gray-700 text-white"
            rows="4"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2">Areas for Development</label>
          <select
            multiple
            value={matchDetails.areas_for_dev}
            onChange={e => {
              const options = Array.from(e.target.selectedOptions).map(o => o.value);
              setMatchDetails({ ...matchDetails, areas_for_dev: options });
            }}
            className="w-full p-3 rounded bg-gray-700 text-white h-40"
          >
            {devOptions.map(dev => (
              <option key={dev}>{dev}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-500 p-3 rounded text-white font-bold"
        >
          Submit Match
        </button>
      </form>
    </div>
  );
};

export default AddMatch;
