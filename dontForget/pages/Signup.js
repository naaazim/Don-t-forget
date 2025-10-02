import { useState } from "react";
import axios from "../axiosConfig";
import styles from "../style/signup.module.css";
import { useNavigate } from "react-router-dom";
import { RiEyeCloseLine, RiEyeFill } from "react-icons/ri";
import Google from "../components/Google";

function Signup() {
    const [Nom, setNom] = useState("");
    const [Prenom, setPrenom] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Message, setMessage] = useState("");
    const [Succes, setSucces] = useState(false);
    const [Error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const save = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/v1/register", {
                nom: Nom,
                prenom: Prenom,
                email: Email,
                password: Password,
            });
            setMessage(response.data);
            setSucces(true);
            setError(false);
        } catch (err) {
            const errorMessage = err.response?.data || "Erreur réseau ou serveur non disponible";
            setMessage(errorMessage);
            setError(true);
            setSucces(false);
        } finally {
            setLoading(false);
        }
    };

    const OAuth2 = () => {
        window.location.href = "http://dontforget.site/oauth2/authorization/google";
    };

    return (
        <>
            <div className={styles.side}></div>
            <img src="/task2.png" alt="taches" className={styles.task} />
            <a href="/"><img src="/logo.png" alt="logo" className={styles.logo} /></a>
            <p className={styles.sideText}>Inscrivez-vous et transformez votre planning <br />en allié.</p>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    save();
                }}
                className={styles.formulaire}
                >
                <h1 className={styles.titre}>Signup</h1>
                {Succes && (
                    <div className={loading ? styles.popUp : styles.popUpSuccess}>
                        {loading ? "Inscription en cours..." : Message}
                    </div>
                )}
    
                {Error && (
                    <div className={loading ? styles.popUp : styles.popUpError}>
                        {loading ? "Inscription en cours..." : Message}
                    </div>
                )}

                <label htmlFor="nom" className={styles.libelles}> Nom: </label>
                <input
                    type="text"
                    placeholder="Entrez votre nom"
                    id="nom"
                    maxLength={255}
                    required
                    autoFocus
                    onChange={(e) => setNom(e.target.value)}
                />

                <label htmlFor="prenom" className={styles.libelles}> Prénom: </label>
                <input
                    type="text"
                    placeholder="Entrez votre prenom"
                    id="prenom"
                    maxLength={255}
                    required
                    onChange={(e) => setPrenom(e.target.value)}
                />

                <label htmlFor="email" className={styles.libelles}> Email: </label>
                <input
                    type="email"
                    placeholder="Entrez votre e-mail"
                    id="email"
                    maxLength={255}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password" className={styles.libelles}> Mot de passe: </label>
                <div className={styles["password-container"]}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez votre mot de passe"
                        id="password"
                        maxLength={255}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className={styles["password-toggle"]}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <RiEyeFill size={20} /> : <RiEyeCloseLine size={20} />}
                    </span>
                </div>

                <div className={styles.bouttons}>
                    <button
                        type="submit"
                        className={styles.soumission}
                        disabled={loading}
                    >
                        {loading ? "Inscription..." : "S'inscrire"}
                    </button>
                    <button
                        className={styles.connexion}
                        onClick={() => { navigate("/Login") }}
                        disabled={loading}
                    >
                        J'ai déjà un compte
                    </button>
                </div>

                <Google onClick={OAuth2} />
            </form>
        </>
    );
}

export default Signup;
