import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config"; // ✅ Move import to the top

export default function AddPlayer() {
  const [player, setPlayer] = useState({
    name: "",
    position: "Midfielder",
    foot: "Right",
    goalkeeper: false,
  });
  const [message, setMessage] = useState(""); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlayer({ ...player, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPlayer = {
      name: player.name,
      position: player.position.toLowerCase(),  
      foot: player.foot.toLowerCase(),  
      goalkeeper: player.goalkeeper === true, // ✅ Ensure boolean format
    };

    try {
      await axios.post(`${API_BASE_URL}/players`, newPlayer);
      alert("Player added successfully!");
    } catch (error) {
      console.error("❌ Error adding player:", error);
      alert("Error adding player. Check console.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">➕ Add New Player</h2>
      {message && <p className="mt-2 text-red-500">{message}</p>}
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
          <option value="Defender">Defender</option>
          <option value="Midfielder">Midfielder</option>
          <option value="Forward">Forward</option>
        </select>
        <select name="foot" value={player.foot} onChange={handleChange} className="w-full border p-2">
          <option value="Right">Right</option>
          <option value="Left">Left</option>
          <option value="Both">Both</option>
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
