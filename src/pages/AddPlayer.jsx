import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useTeam } from "../TeamContext";  // ✅ Import team context
import { toast } from "react-toastify";

export default function AddPlayer() {
  const { teamName } = useTeam(); // ✅ Get selected team
  const [player, setPlayer] = useState({
    name: "",
    position: "midfielder",
    foot: "right",
    goalkeeper: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlayer({ ...player, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!teamName) {
      toast.error("❌ Please select a team before adding a player.");
      return;
    }

    const newPlayer = {
      ...player,
      team_name: teamName, // ✅ Assign selected team
      position: player.position.toLowerCase(),
      foot: player.foot.toLowerCase(),
    };

    try {
      console.log("🔹 Adding player:", newPlayer);  // ✅ Debug request payload

      const response = await axios.post(`${API_BASE_URL}/players`, newPlayer);
      
      console.log("✅ Player added:", response.data); // ✅ Debug API response

      toast.success(`✅ Player added to ${teamName}!`);
      setPlayer({ name: "", position: "midfielder", foot: "right", goalkeeper: false });
    } catch (error) {
      console.error("❌ Error adding player:", error);
      toast.error("Error adding player. Check console.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">➕ Add New Player ({teamName})</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          name="name"
          value={player.name}
          onChange={handleChange}
          placeholder="Player Name"
          required
          className="w-full border p-2"
        />
        <select name="position" value={player.position} onChange={handleChange} className="w-full border p-2">
          <option value="midfielder">Midfielder</option>
          <option value="defender">Defender</option>
          <option value="forward">Forward</option>
        </select>
        <select name="foot" value={player.foot} onChange={handleChange} className="w-full border p-2">
          <option value="right">Right</option>
          <option value="left">Left</option>
          <option value="both">Both</option>
        </select>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="goalkeeper" checked={player.goalkeeper} onChange={handleChange} />
          <span>Goalkeeper?</span>
        </label>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Add Player
        </button>
      </form>
    </div>
  );
}
