import axios from "../axiosConfig";
import { useState, useEffect } from "react";
import styles from "../style/login.module.css";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookies";
import { RiEyeCloseLine, RiEyeFill } from "react-icons/ri";

function Login() {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Message, setMessage] = useState("");
    const [Error, setError] = useState(false);
    const [Succes, setSucces] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Redirection automatique si le cookie "user" existe déjà
    useEffect(() => {
        const userCookie = getCookie("user");
        if (userCookie) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const connexion = async () => {
        try {
            const response = await axios.post(
                "/api/v1/login",
                { email: Email, password: Password },
                { withCredentials: true } // indispensable pour recevoir les cookies
            );

            setMessage(response.data?.message || "Connexion réussie");
            navigate("/dashboard");
            setSucces(true);
            setError(false);
        } catch (err) {
            const errorMessage = err.response?.data || "Erreur réseau ou serveur non disponible";
            setMessage(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
            setError(true);
            setSucces(false);
        }
    };

    return (
        <>
            <a href="/"><img src="/logo.png" alt="logo" className={styles.logo}/></a>
            <form onSubmit={(e) => {
                e.preventDefault();
                connexion();
            }} className={styles.formulaire}> 
                <h1 className={styles.titre}>Login</h1>
                {Succes && <p style={{color:"green",textAlign:"center"}}>{Message}</p>}
                {Error && <p style={{color:"red", textAlign:"center"}}>{Message}</p>}
                
                <label htmlFor="email">E-mail :</label>
                <input
                    type="email"
                    placeholder="Entrez votre email"
                    id="email"
                    maxLength={255}
                    required
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">Mot de passe :</label>
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
                        {showPassword ? <RiEyeFill size={20}/> : <RiEyeCloseLine size={20}/>}
                    </span>
                </div>

                <div className={styles.mdpOublie}>
                    <label>Mot de passe oublié ?</label>
                    <a href="/forget-password">Cliquez-ici</a>
                </div>
                <button type="submit">Connexion</button>
                <button type="button" className={styles.create} onClick={() => {
                    navigate("/Signup");
                }}>Créer un compte</button>
            </form>
            <div className={styles.side}></div>
            <img src="/task.png" alt="task" className={styles.task}/>
            <p className={styles.sideText}>Don't Forget : parce qu'organiser peut aussi être un <br/>plaisir.</p>
        </>
    );
}

export default Login;
