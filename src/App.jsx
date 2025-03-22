import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Players from "./pages/Players";
import Availability from "./pages/Availability";
import Teams from "./pages/Teams";
import RatePlayers from "./pages/RatePlayers";
import ViewAverageRatings from "./pages/ViewAverageRatings";
import AddPlayer from "./pages/AddPlayer";
import AddCoach from "./pages/AddCoach";
import AddMatch from "./pages/AddMatch";
import PlayerAnalysis from "./pages/PlayerAnalysis";
import { useTeam } from "./TeamContext";
import { useState } from "react";

export default function App() {
  const { teamName, setTeamName } = useTeam();
  const [showAnalysisMenu, setShowAnalysisMenu] = useState(false);

  return (
    <Router>
      {/* Header */}
      <div className="flex flex-col items-center p-4 bg-blue-600 text-white relative">
        <h1 className="text-3xl font-bold">Peebles FC Data Hub</h1>
        
        {/* Navigation Bar */}
        <nav className="flex flex-wrap justify-center space-x-6 mt-2 text-lg font-semibold text-gray-200 relative">
          <Link to="/players" className="hover:text-white transition duration-200">Players</Link>
          <Link to="/availability" className="hover:text-white transition duration-200">Availability</Link>
          <Link to="/teams" className="hover:text-white transition duration-200">Teams</Link>
          <Link to="/add-player" className="hover:text-white transition duration-200">Add Player</Link>
          <Link to="/rate-players" className="hover:text-white transition duration-200">Rate Players</Link>
          <Link to="/add-coach" className="hover:text-white transition duration-200">Add Coach</Link>
          <Link to="/add-match" className="hover:text-white transition duration-200">Add Match</Link>

          {/* 🔍 Analysis Dropdown */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setShowAnalysisMenu(!showAnalysisMenu)}
              className="hover:text-white focus:outline-none"
            >
              Analysis ▾
            </button>
            {showAnalysisMenu && (
              <div className="absolute z-10 mt-2 w-48 bg-white text-black rounded shadow-lg">
                <Link
                  to="/player-analysis"
                  className="block px-4 py-2 hover:bg-blue-100"
                  onClick={() => setShowAnalysisMenu(false)}
                >
                  Player Analysis
                </Link>
                <Link
                  to="/player-tables"
                  className="block px-4 py-2 hover:bg-blue-100"
                  onClick={() => setShowAnalysisMenu(false)}
                >
                  Player Tables
                </Link>
                <Link
                  to="/team-analysis"
                  className="block px-4 py-2 hover:bg-blue-100"
                  onClick={() => setShowAnalysisMenu(false)}
                >
                  Team Analysis
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Global Team Selector */}
        <div className="mt-3">
          <label htmlFor="team-select" className="mr-2 text-white text-md font-medium">Select Team:</label>
          <select
            id="team-select"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="p-2 rounded bg-white text-black"
          >
            <option>Peebles 2013s</option>
            <option>Peebles 2014s</option>
            <option>Peebles 2015s</option>
            <option>Peebles 2016s</option>
          </select>
        </div>
      </div>

      {/* Page Routing */}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<h2 className="text-xl font-bold">🏠 Welcome! Select an option above.</h2>} />
          <Route path="/players" element={<Players />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/add-player" element={<AddPlayer />} />
          <Route path="/rate-players" element={<RatePlayers />} />
          <Route path="/add-coach" element={<AddCoach />} />
          <Route path="/add-match" element={<AddMatch />} />
          <Route path="/player-analysis" element={<PlayerAnalysis />} />
          <Route path="/player-tables" element={<h2 className="text-xl font-semibold text-gray-700">📋 Player Tables (Coming Soon)</h2>} />
          <Route path="/team-analysis" element={<h2 className="text-xl font-semibold text-gray-700">📈 Team Analysis (Coming Soon)</h2>} />
        </Routes>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}
