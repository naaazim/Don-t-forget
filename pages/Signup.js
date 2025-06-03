import { useState } from "react";
import axios from "axios";
import styles from "../style/signup.module.css"
import { useNavigate } from "react-router-dom";
function Signup(){
    const [Nom, setNom] = useState("");
    const [Prenom, setPrenom] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Message, setMessage] = useState("");
    const [Succes, setSucces] = useState(false);
    const [Error, setError] = useState(false);
    const navigate = useNavigate();
    const save = async () => {
        try{
            const response = await axios.post("http://localhost:8080/api/v1/register",{
                nom : Nom,
                prenom : Prenom,
                email : Email,
                password : Password
            });
            setMessage(response.data);
            setSucces(true);
            setError(false);
        }catch(err){
            const errorMessage = err.response?.data || "Erreur réseau ou serveur non disponible";
            setMessage(errorMessage);
            setError(true);
            setSucces(false);
        }
    }
    return (
        <>
            <a href="/"><img src="/logo.png" alt="logo" className={styles.logo}/></a>
            <h1 className={styles.titre}>Signup</h1>
            {Succes && <p style={{color:"green", textAlign:"center"}}>{Message}</p>}
            {Error && <p style={{color:"red", textAlign:"center"}}>{Message}</p>}
            <form onSubmit={(e) => {
                e.preventDefault();
                save();
            }}
            className={styles.formulaire}
            >
                <label htmlFor="nom" className={styles.libelles}> Nom: </label>
                <input
                    type="text"
                    placeholder="Entrez votre nom"
                    id="nom"
                    maxLength={255}
                    required 
                    autoFocus
                    onChange={(e) =>{
                        setNom(e.target.value)
                    }}
                    />
                <label htmlFor="prenom" className={styles.libelles}> Prénom: </label>
                <input
                    type="text"
                    placeholder="Entrez votre prenom"
                    id="prenom"
                    maxLength={255}
                    required 
                    onChange={(e) =>{
                        setPrenom(e.target.value)
                    }}
                    />
                <label htmlFor="email" className={styles.libelles}> Email: </label>
                <input
                    type="email"
                    placeholder="Entrez votre e-mail"
                    id="email"
                    maxLength={255}
                    required 
                    onChange={(e) =>{
                        setEmail(e.target.value)
                    }}
                    />
                <label htmlFor="password" className={styles.libelles}> Mot de passe: </label>
                <input
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    id="password"
                    maxLength={255}
                    required 
                    onChange={(e) =>{
                        setPassword(e.target.value)
                    }}
                />
                <div className={styles.bouttons}>
                    <button type="submit" className={styles.soumission}>S'inscrire</button>
                    <button className={styles.connexion} onClick={()=>{navigate("/Login")}}>J'ai déjà un compte</button>
                </div>
            </form>
        </>
    )
}

    
export default Signup;