// src/TeamContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teamName, setTeamName] = useState("Peebles 2015s");

  useEffect(() => {
    const storedTeam = localStorage.getItem("teamName");
    if (storedTeam) setTeamName(storedTeam);
  }, []);

  useEffect(() => {
    localStorage.setItem("teamName", teamName);
  }, [teamName]);

  return (
    <TeamContext.Provider value={{ teamName, setTeamName }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
