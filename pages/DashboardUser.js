import { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "../style/dashboard.module.css";
import { useNavigate } from "react-router-dom";
import ListeDesTaches from "../components/ListeDesTaches";
import { IoMdAdd } from "react-icons/io";
import { getCookie } from "../utils/cookies";

function DashboardUser() {
    const [showPopup, setShowPopup] = useState(false);
    const [popUpTache, setPopUpTache] = useState(false);
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                profilRef.current &&
                !profilRef.current.contains(event.target)
            ) {
                setShowPopup(false);
            }
        };

        if (showPopup) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPopup]);

    useEffect(() => {
        const handleClickOutsideTache = (event) => {
            if (tacheRef.current && !tacheRef.current.contains(event.target)) {
                setPopUpTache(false);
                setTache("");
                setDeadline("");
            }
        };

        if (popUpTache) {
            document.addEventListener("mousedown", handleClickOutsideTache);
        } else {
            document.removeEventListener("mousedown", handleClickOutsideTache);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideTache);
        };
    }, [popUpTache]);

    if (!data) return null;

    const userId = data.id;
    const prenom = data.prenom || "";
    const nom = data.nom || "";
    const initials = (prenom.charAt(0) || "") + (nom.charAt(0) || "");

    const togglePopup = () => setShowPopup(!showPopup);
    const togglePopUpTache = () => setPopUpTache(true);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/v1/logout", {}, { withCredentials: true });
        } catch {}
        // Purge aussi le cookie "user" côté client (au cas où backend non joignable)
        document.cookie = "user=; Path=/; Max-Age=0; SameSite=Lax";
        window.location.href = "/login";
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
            mustBeFinishedAt: deadline,
            user: { id: userId }
        };

        try {
            await axios.post("http://localhost:8080/api/v1/tache/create", payload, { withCredentials: true });

            const res = await axios.get(`http://localhost:8080/api/v1/tache/getAllByUser/${userId}`, { withCredentials: true });
            setTaches(res.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setPopUpTache(false);
            setTache("");
            setDeadline("");
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("Erreur lors de la création de la tâche.");
            }
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    return (
        <>
            <nav className={styles.navigation}>
                <a href="/"><img src="/logo.png" alt="logo" className={styles.logo} /></a>
                <h1 className={styles.titre}>Tableau de bord</h1>
                <p className={styles.profil} onClick={togglePopup} ref={profilRef}>
                    {initials}
                </p>
            </nav>

            {showPopup && (
                <div ref={popupRef} className={styles.popUp}>
                    <button className={styles.popUpButton} onClick={() => {
                        setShowPopup(false);
                        navigate("/");
                    }}>
                        Accueil
                    </button>
                    <button className={styles.popUpButton} onClick={() => {
                        setShowPopup(false);
                        navigate("/profil");
                    }}>
                        Profil
                    </button>
                    <button className={styles.popUpButton} onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            )}

            <div className={styles.ajouterUneTache}>
                <button onClick={togglePopUpTache}>
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
                        <button className={styles.yes} onClick={handleSubmitTache}>
                            Ajouter
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.flex}>
                <label htmlFor="liste" className={styles.listeDesTaches}>To do</label>
            </div>

            <ListeDesTaches id={userId} taches={taches} setTaches={setTaches} />

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </>
    );
}

export default DashboardUser;
