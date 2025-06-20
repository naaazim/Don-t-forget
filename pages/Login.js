import axios from "axios";
import { useState, useEffect } from "react";
import styles from "../style/login.module.css";
import { useNavigate } from "react-router-dom";

function Login() {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Message, setMessage] = useState("");
    const [Error, setError] = useState(false);
    const [Succes, setSucces] = useState(false);
    const navigate = useNavigate();

    //Redirection automatique si le token existe déjà
    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const connexion = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/login", {
                email: Email,
                password: Password
            });

            const { token, ...userInfo } = response.data;
            localStorage.setItem("user", JSON.stringify(userInfo));
            localStorage.setItem("jwt_token", token);

            navigate("/dashboard");
            setSucces(true);
            setError(false);
        } catch (err) {
            const errorMessage = err.response?.data || "Erreur réseau ou serveur non disponible";
            setMessage(errorMessage);
            setError(true);
            setSucces(false);
        }
    };

    return (
        <>
            <a href="/"><img src="/logo.png" alt="logo" className={styles.logo}/></a>
            <h1 className={styles.titre}>Login</h1>
            {Succes && <p style={{color:"green", textAlign:"center"}}>{Message}</p>}
            {Error && <p style={{color:"red", textAlign:"center"}}>{Message}</p>}
            <form onSubmit={(e) => {
                e.preventDefault();
                connexion();
            }} className={styles.formulaire}> 
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
                <input
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    id="password"
                    maxLength={255}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className={styles.mdpOublie}>
                    <label>Mot de passe oublié ?</label>
                    <a href="/forget-password">Cliquez-ici</a>
                </div>
                <button type="submit">Connexion</button>
            </form>
        </>
    );
}

export default Login;
