import { useState, useRef, useEffect } from "react";
import styles from "../style/profil.module.css";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import axios from "axios";

function Profil() {
    const [showPopup, setShowPopup] = useState(false);
    const [editPrenom, setEditPrenom] = useState(false);
    const [editNom, setEditNom] = useState(false);
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);

    const [newPrenom, setNewPrenom] = useState("");
    const [newNom, setNewNom] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem("user")) || {});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    
    const popupRef = useRef(null);
    const profilRef = useRef(null);
    const nom = userData.nom || "";
    const prenom = userData.prenom || "";
    const email = userData.email || "";
    const id = userData.id;
    const initials = prenom.charAt(0) + nom.charAt(0);
    const token = localStorage.getItem("jwt_token");
    useEffect(() => {
        if (!userData.id) {
            navigate("/login");
        }
    }, [userData, navigate]);
    
    const togglePopup = () => setShowPopup(prev => !prev);
    
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("jwt_token");
        window.location.href = "/login";
    };

    const handleUpdate = async (champ) => {
        const valeur = champ === "prenom" ? newPrenom.trim() : newNom.trim();

        if (!valeur) {
            setErrorMessage(`Le ${champ} ne peut pas être vide.`);
            setSuccessMessage("");
            setTimeout(() => setErrorMessage(""), 2000);
            return;
        }

        const body = champ === "prenom" ? { prenom: valeur } : { nom: valeur };

        try {
            const response = await axios.put(
                `http://localhost:8080/api/v1/update/${id}`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 200) {
                const updatedUser = { ...userData, ...body };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUserData(updatedUser);

                setSuccessMessage(response.data.message || "Modification réussie !");
                setErrorMessage("");
                setTimeout(() => setSuccessMessage(""), 2000);
            } else {
                setErrorMessage(response.data.message || "Échec de la modification");
                setSuccessMessage("");
                setTimeout(() => setErrorMessage(""), 2000);
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Erreur lors de la mise à jour";
            setErrorMessage(msg);
            setSuccessMessage("");
            setTimeout(() => setErrorMessage(""), 2000);
        }
    };

    const handlePasswordVerification = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/verify-password", {
                id: id,
                currentPassword: currentPassword
            });

            if (response.status === 200) {
                const token = response.data;
                navigate("/reset-password?token=" + token);
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Mot de passe incorrect.";
            setErrorMessage(msg);
            setSuccessMessage("");
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
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPopup]);
    

    return (
        <>
            <nav className={styles.navigation}>
                <a href="/"><img src="/logo.png" alt="logo" className={styles.logo} /></a>
                <h1 className={styles.titre}>Profil</h1>
                <p className={styles.profil} onClick={togglePopup} ref={profilRef}>
                    {initials}
                </p>
            </nav>

            <h2 className={styles.nomPrenom}>{prenom + " " + nom} <CgProfile className={styles.profilIcon}/></h2>

            {successMessage && <div className={styles.successPopup}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorPopup}>{errorMessage}</div>}

            <table className={styles.tableau}>
                <tbody>
                    <tr>
                        <td>
                            <label className={styles.mesLabels} htmlFor="prenom">Prénom: </label>
                        </td>
                        <td>
                            <input type="text" value={prenom} readOnly />
                            <button onClick={() => {
                                setEditPrenom(true);
                                setEditNom(false);
                                setShowPasswordPopup(false);
                            }} id="prenom"><FiEdit /></button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className={styles.mesLabels} htmlFor="nom">Nom: </label>
                        </td>
                        <td>
                            <input type="text" value={nom} readOnly />
                            <button onClick={() => {
                                setEditNom(true);
                                setEditPrenom(false);
                                setShowPasswordPopup(false);
                            }} id="nom"><FiEdit /></button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className={styles.mesLabels}>Email: </label>
                        </td>
                        <td>
                            <input type="email" value={email} readOnly />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className={styles.mesLabels} htmlFor="password">Modifier le mot de passe:</label>
                        </td>
                        <td>
                            <button onClick={() => {
                                setShowPasswordPopup(true);
                                setEditNom(false);
                                setEditPrenom(false);
                            }} id="password"><FaArrowRight /></button>
                        </td>
                    </tr>
                </tbody>
            </table>

            {editPrenom && (
                <div className={styles.popup}>
                    <input
                        type="text"
                        placeholder="Nouveau prénom"
                        maxLength={255}
                        onChange={(e) => setNewPrenom(e.target.value)}
                        />
                    <div className={styles.divBoutons}>
                        <button onClick={() => { handleUpdate("prenom"); setEditPrenom(false); }} className={styles.yes}>Confirmer</button>
                        <button onClick={() => setEditPrenom(false)} className={styles.no}>Annuler</button>
                    </div>
                </div>
            )}

            {editNom && (
                <div className={styles.popup}>
                    <input
                        type="text"
                        placeholder="Nouveau nom"
                        maxLength={255}
                        onChange={(e) => setNewNom(e.target.value)}
                        />
                    <div className={styles.divBoutons}>
                        <button onClick={() => { handleUpdate("nom"); setEditNom(false); }} className={styles.yes}>Confirmer</button>
                        <button onClick={() => setEditNom(false)} className={styles.no}>Annuler</button>
                    </div>
                </div>
            )}

            {showPasswordPopup && (
                <div className={styles.popup}>
                    <input
                        type="password"
                        placeholder="Mot de passe actuel"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    <div className={styles.divBoutons}>
                        <button onClick={handlePasswordVerification} className={styles.yes}>Valider</button>
                        <button onClick={() => setShowPasswordPopup(false)} className={styles.no}>Annuler</button>
                    </div>
                </div>
            )}

            {showPopup && (
                <div ref={popupRef} className={styles.popUp}>
                    <button className={styles.popUpButton} onClick={() => {
                        setShowPopup(false);
                        navigate("/");
                    }}>Accueil</button>
                    <button className={styles.popUpButton} onClick={() => {
                        setShowPopup(false);
                        navigate("/dashboard");
                    }}>Tableau de bord</button>
                    <button className={styles.popUpButton} onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            )}
        </>
    );
}

export default Profil;
