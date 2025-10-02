import { useState, useRef, useEffect } from "react";
import axios from "../axiosConfig";
import styles from "../style/dashboard.module.css";
import { useNavigate } from "react-router-dom";
import ListeDesTaches from "../components/ListeDesTaches";
import { IoMdAdd } from "react-icons/io";
import { getCookie } from "../utils/cookies";
import Calendrier from "../components/Calendrier"; 
import { IoCalendarOutline } from "react-icons/io5";

function DashboardUser() {
    const [showPopup, setShowPopup] = useState(false);
    const [popUpTache, setPopUpTache] = useState(false);
    const [popUpCalendrier, setPopUpCalendrier] = useState(false);
    const [tache, setTache] = useState("");
    const [deadline, setDeadline] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState(null);
    const [taches, setTaches] = useState([]);

    const popupRef = useRef(null);
    const profilRef = useRef(null);
    const tacheRef = useRef(null);
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
            setData(parsedUser);
        } catch {
            navigate("/login");
        }
    }, [navigate]);

    const fetchTaches = async () => {
        const res = await axios.get(`/api/v1/tache/me`, { withCredentials: true });
        setTaches(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }; 


    useEffect(() => {
        if (data) {
            fetchTaches();
        }
    }, [data]);

    // 🔥 Fermer formulaire tâche si clic ailleurs
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popUpTache && tacheRef.current && !tacheRef.current.contains(e.target)) {
                setPopUpTache(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [popUpTache]);

    const handleLogout = async () => {
        try {
            await axios.post("/api/v1/logout", {}, { withCredentials: true });
        } catch {}
        document.cookie = "user=; Path=/; Max-Age=0; SameSite=Lax";
        window.location.href = "/Login";
    };

    const handleSubmitTache = async () => {
        setErrorMessage("");
        if (!tache || !deadline) {
            setErrorMessage("Veuillez remplir tous les champs.");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        const payload = {
            texte: tache,
            mustBeFinishedAt: new Date(deadline).toISOString(),
            user: { id: data.id }
        };

        try {
            await axios.post("/api/v1/tache/create", payload, { withCredentials: true });
            await fetchTaches(data.id);
            setPopUpTache(false);
            setTache("");
            setDeadline("");
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data || "Erreur lors de la création de la tâche.");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    if (!data) return null;

    const userId = data.id;
    const prenom = data.prenom || "";
    const nom = data.nom || "";
    const initials = (prenom.charAt(0) || "") + (nom.charAt(0) || "");

    return (
        <>
            <nav className={styles.navigation}>
                <a href="/"><img src="/logo.png" alt="logo" className={styles.logo} /></a>
                <h1 className={styles.titre}>Tableau de bord</h1>
                <p className={styles.profil} onClick={() => setShowPopup(!showPopup)} ref={profilRef}>
                    {initials}
                </p>
            </nav>

            {showPopup && (
                <div ref={popupRef} className={styles.popUp}>
                    <button className={styles.popUpButton} onClick={() => navigate("/")}>Accueil</button>
                    <button className={styles.popUpButton} onClick={() => navigate("/profil")}>Profil</button>
                    <button className={styles.popUpButton} onClick={handleLogout}>Déconnexion</button>
                </div>
            )}

            <div className={styles.ajouterUneTache}>
                <button onClick={() => setPopUpTache(true)}>
                    <IoMdAdd />
                    Ajouter une tâche
                </button>
            </div>

            {popUpTache && (
                <div className={styles.formulaireTache} ref={tacheRef}>
                    <textarea
                        placeholder="Quelle tâche souhaitez-vous ajouter ?"
                        value={tache}
                        maxLength={255}
                        onChange={(e) => setTache(e.target.value)}
                        autoFocus
                    />
                    <label htmlFor="deadline">Échéance :</label>
                    <input
                        type="datetime-local"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />
                    <div className={styles.popUpBouton}>
                        <button className={styles.yes} onClick={handleSubmitTache}>Ajouter</button>
                    </div>
                </div>
            )}

            <div className={styles.flex}>
                <label htmlFor="liste" className={styles.listeDesTaches}>To do</label>
                <button onClick={() => setPopUpCalendrier(true)}><IoCalendarOutline size={30}/></button>

            </div>

            <ListeDesTaches
                id={userId}
                taches={taches}
                setTaches={setTaches}
                onUpdate={() => fetchTaches(userId)}
            />

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}


            {popUpCalendrier && (
                <div 
                    className={styles.popUpOverlay} 
                    onClick={() => setPopUpCalendrier(false)}
                >
                    <div 
                        className={styles.popUpCalendrier} 
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <Calendrier />
                    </div>
                </div>
            )}
        </>
    );
}

export default DashboardUser;
