import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Players from "./pages/Players";
import Availability from "./pages/Availability";
import Teams from "./pages/Teams";
import RatePlayers from "./pages/RatePlayers";
import ViewRatings from "./pages/ViewRatings";
import ViewAverageRatings from "./pages/ViewAverageRatings";
import AddPlayer from "./pages/AddPlayer";

export default function App() {
  return (
    <Router>
      {/* ✅ Header & Navigation */}
<div className="flex flex-col items-center p-4 bg-blue-600 text-white">
  <h1 className="text-3xl font-bold">Football Team Selector</h1> {/* Increased title size */}
  <nav className="flex space-x-6 mt-2 text-lg font-semibold text-gray-200"> {/* Larger & lighter menu text */}
    <Link to="/players" className="hover:text-white transition duration-200">Players</Link>
    <Link to="/availability" className="hover:text-white transition duration-200">Availability</Link>
    <Link to="/teams" className="hover:text-white transition duration-200">Teams</Link>
    <Link to="/add-player" className="hover:text-white transition duration-200">Add Player</Link>
    <Link to="/rate-players" className="hover:text-white transition duration-200">Rate Players</Link>
    <Link to="/view-average-ratings" className="hover:text-white transition duration-200">Average Ratings</Link>
  </nav>
</div>


      {/* ✅ Page Content (Routing) */}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<h2 className="text-xl font-bold">🏠 Welcome! Select an option above.</h2>} />
          <Route path="/players" element={<Players />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/add-player" element={<AddPlayer />} />
          <Route path="/rate-players" element={<RatePlayers />} />
          <Route path="/view-average-ratings" element={<ViewAverageRatings />} />
        </Routes>
      </div>
    </Router>
  );
}
