import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewRatings() {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/ratings")
      .then(response => setRatings(response.data))
      .catch(error => console.error("Error fetching ratings", error));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Player Ratings</h2>
      {ratings.map((rating, index) => (
        <div key={index} className="p-4 bg-gray-100 rounded-lg shadow mt-2">
          <h3>{rating.coach} rated {rating.player_name}</h3>
          <p>Attack: {rating.attack_skill}, Defense: {rating.defense_skill}</p>
          <p>Passing: {rating.passing}, Attitude: {rating.attitude}, Teamwork: {rating.teamwork}</p>
        </div>
      ))}
    </div>
  );
}
