import { useState, useEffect } from "react";
import axios from "../axiosConfig";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; 
import { getCookie } from "../utils/cookies";
import { useNavigate } from "react-router-dom";
import frLocale from "@fullcalendar/core/locales/fr";
import { CiCalendar } from "react-icons/ci";
import "../style/calendrier.css"; 

function Calendrier() {
  const [taches, setTaches] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userString = getCookie("user");
    if (!userString) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(decodeURIComponent(userString));
      if (!parsedUser || !parsedUser.id) {
        navigate("/login");
        return;
      }

      const fetchTaches = async () => {
        try {
          const reponse = await axios.get(`/api/v1/tache/getAllByUser/${parsedUser.id}`, {
            withCredentials: true,
          });
          setTaches(reponse.data);
        } catch (err) {
          setError("Erreur lors de la récupération des tâches.");
        }
      };

      fetchTaches();
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const events = taches.map((t) => {
    let color = "#f97316"; 
    if (t.statut === "FINI") color = "#16a34a"; 
    else if (new Date(t.mustBeFinishedAt) < new Date()) color = "#dc2626"; 

    return {
      id: t.id,
      title: t.texte,
      start: t.mustBeFinishedAt,
      color,
    };
  });

  if (error) return <p>{error}</p>;

  return (
    <div className="calendrier-container">
      <h2 className="calendrier-title">
        <CiCalendar size={30}/> Calendrier des tâches
      </h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={frLocale}
        events={events}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        buttonText={{
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
        }}
      />
    </div>
  );
}

export default Calendrier;
