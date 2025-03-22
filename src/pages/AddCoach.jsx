import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useTeam } from "../TeamContext";
import { toast } from "react-toastify";

export default function AddCoach() {
  const { teamName } = useTeam();

  const [coach, setCoach] = useState({
    forename: "",
    surname: "",
    team_name: teamName || "Peebles 2015s",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoach((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/coaches`, coach);
      toast.success("✅ Coach added successfully");
      setCoach({ forename: "", surname: "", team_name: teamName });
    } catch (error) {
      console.error("❌ Error adding coach:", error);
      toast.error("Error adding coach. Check console.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">➕ Add Coach</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded-md">
        <div>
          <label className="block text-gray-700 font-medium mb-1">First Name</label>
          <input
            type="text"
            name="forename"
            value={coach.forename}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Surname</label>
          <input
            type="text"
            name="surname"
            value={coach.surname}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Team</label>
          <select
            name="team_name"
            value={coach.team_name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option>Peebles 2013s</option>
            <option>Peebles 2014s</option>
            <option>Peebles 2015s</option>
            <option>Peebles 2016s</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500"
        >
          Add Coach
        </button>
      </form>
    </div>
  );
}
