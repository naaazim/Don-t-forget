import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ListExamensACorriger from "../components/ListExamensACorriger";
import Actions from "../components/Actions";

const DebutExamen = () => {
  const [examinateurId, setExaminateurId] = useState(null);
  const navigate = useNavigate();

  // Nettoyage du fond hérité d’autres pages
  document.documentElement.style.backgroundImage = 'none';
  document.documentElement.style.backgroundColor = 'white';

  useEffect(() => {
    // Récupère les infos de l'utilisateur depuis le localStorage
    const userDataString = localStorage.getItem("user");

    // Redirige vers la page de login si l'utilisateur n'est pas connecté
    if (!userDataString) {
      navigate("/login");
    } else {
      // Si l'utilisateur est trouvé, on extrait son ID
      const userData = JSON.parse(userDataString);
      setExaminateurId(userData?.id);
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <Actions />
      <div style={{ width: "95%", margin: "auto" }}>
        {/* Liste des examens à corriger pour cet examinateur */}
        <ListExamensACorriger examinateurId={examinateurId} />
      </div>
    </div>
  );
};

export default DebutExamen;