import { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "../style/dashboard.module.css";
import { useNavigate } from "react-router-dom";
import ListeDesTaches from "../components/ListeDesTaches";
import { FaArrowRight } from "react-icons/fa6";
import { IoIosAddCircleOutline } from "react-icons/io";
function DashboardUser() {
    const [showPopup, setShowPopup] = useState(false);
    const [popUpTache, setPopUpTache] = useState(false);
    const [tache, setTache] = useState("");
    const [deadline, setDeadline] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [toggleListe, setToggleListe] = useState(false)
    const popupRef = useRef(null);
    const profilRef = useRef(null);
    const navigate = useNavigate();

    const data = JSON.parse(localStorage.getItem("user")) || {};
    const userId = data.id;
    const prenom = data.prenom || "";
    const nom = data.nom || "";
    const initials = (prenom.charAt(0) || "") + (nom.charAt(0) || "");

    const togglePopup = () => setShowPopup(!showPopup);
    const togglePopUpTache = () => setPopUpTache(true);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("jwt_token");
        window.location.href = "/login";
    };

    const handleSubmitTache = async () => {
        setErrorMessage(""); // Réinitialiser les messages
        setSuccessMessage("");

        if (!tache || !deadline) {
            setErrorMessage("Veuillez remplir tous les champs.");
            setTimeout(() => setErrorMessage(""), 2000);
            return;
        }

        const payload = {
            texte: tache,
            mustBeFinishedAt: new Date(deadline).toISOString(),
            user: { id: userId }
        };

        try {
            const response = await axios.post("http://localhost:8080/api/v1/tache/create", payload);
            setSuccessMessage(response.data);
            setTimeout(() => setSuccessMessage(""), 2000);
            setPopUpTache(false);
            setTache("");
            setDeadline("");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("Erreur lors de la création de la tâche.");
            }
            setTimeout(() => setErrorMessage(""), 2000);
        }
    };

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
                <label htmlFor="ajout">Ajouter une tâche</label>
                <button id="ajout" onClick={togglePopUpTache}><IoIosAddCircleOutline/></button>
            </div>

            {popUpTache && (
                <div className={styles.formulaireTache}>
                    <label htmlFor="tache">Tâche :</label>
                    <input
                        type="text"
                        id="tache"
                        placeholder="Quelle tâche souhaitez-vous ajouter ?"
                        value={tache}
                        onChange={(e) => setTache(e.target.value)}
                    />

                    <label htmlFor="deadline">Échéance :</label>
                    <input
                        type="datetime-local"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                    <div className={styles.popUpBouton}>
                        <button className={styles.no} onClick={()=>{
                            setPopUpTache(false);
                        }}>Annuler</button>
                        <button className={styles.yes} onClick={handleSubmitTache}>Ajouter</button>
                    </div>
                </div>
            )}
            <div className={styles.flex}>
                <p className={styles.listeDesTaches}>Liste des tâches:</p>
                <button onClick={() =>{
                    setToggleListe(!toggleListe);
                }}>
                    <FaArrowRight/>
                </button>
            </div>

            {
                toggleListe &&
                <ListeDesTaches id = {userId}/>
            }

            {errorMessage && (
                <p className={styles.error}>{errorMessage}</p>
            )}

            {successMessage && (
                <p className={styles.success}>{successMessage}</p>
            )}
        </>
    );
}

export default DashboardUser;
