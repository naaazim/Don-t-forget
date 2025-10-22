import {  useState } from "react";
import axios from "axios";
import styles from '../style/login.module.css';
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        try {
          const response = await axios.post("/api/v1/auth/login", {
            email: email,
            password: password,
          });
    
          localStorage.setItem("jwt_token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.appUser));
    
          
          
            if(response.data.appUser.appUserRole=="EXAMINE"){
              navigate("/dashboard-examine");
            }else if(response.data.appUser.appUserRole=="EXAMINATEUR" || response.data.appUser.appUserRole=="ADMIN"){
              navigate("/dashboard-examinateur");
            }
        } catch (err) {
          setMessage(err.response.data);
          setError(true);
        }
      }

    const handlemdpoublie= async()=>{
      try {
        const response = await axios.post(`/api/v1/auth/mdp-oublie/${email}`);
        setMessage("Verifiez vos E-mail.")
        setError(true);
      } catch (err) {
        setMessage(err.response.data);
        setError(true);
      }
    };

  
    return (<div className={styles.login}>
    <img src="LOGO.png" width="120" alt="Logo"/>
    {error&&(<p className="font-20 text-danger montserrat">{message}</p>)}
    <form onSubmit={handleSubmit} className={styles.formulaire}>
      <div>
        <label htmlFor="mail">E-mail :</label><br />
        <input 
          id="mail"
          type="email" 
          className={styles.formControl} 
          placeholder="Entrez votre adresse mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="mdp">Mot de passe :</label><br />
        <input 
          id="mdp"
          type="password" 
          className={styles.formControl} 
          placeholder="Entrez votre mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <p className={styles.labelMdpOublie}>Mot de passe oublié ?</p>
      <a href="#" className={styles.cliquezIci} onClick={(e) => { e.preventDefault(); handlemdpoublie(); }}>Cliquez-ici</a><br />

      <button type="submit" className={styles.loginConnexion}>Connexion</button><br />

      <label htmlFor="connexion" className={styles.premInscription}>Première inscription ? </label><br />
      <button type="button" id="connexion" className={styles.sInscrire} onClick={() => navigate("/Signup")}>Inscription</button>

      {error && <div className={styles.errorMessage} style={{marginTop: '10px'}}>{error}</div>}
    </form>
  </div>
    );
  }
  
  export default Login;