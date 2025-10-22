import {  useState } from "react";
import axios from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import style from "../style/Register.module.css";


function Register() {

    const navigate = useNavigate();
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("EXAMINE");
    const [error, setError]=useState(false);
    const [success, setSuccess]=useState(false);
    const [message,setMessage]=useState("");   
    async function save() {
        try {
          await axios.post("/api/v1/auth/register", {
          firstName : FirstName,
          lastName : LastName,
          email: email,
          password: password,
          role:role
          });
          setError(false);
          setMessage("Verifiez vos emails pour activer votre compte");
          setSuccess(true);
        } catch (err) {
          setSuccess(false);
          setMessage(err.response.data);
          setError(true);
        }
      }
  
    return (
    <div>
            <img src="BG_SITE.png" className={style.bg}/>
    <div className={style.Register} >
            <img src="LOGO.png" width="120" style={{ margin: "1vw" }}/>
            {error&&(<p className="font-20 text-danger montserrat">{message}</p>)}
            {success&&(<p className="font-20 text-success montserrat">{message}</p>)}
    <form onSubmit={(e)=>{
      e.preventDefault();
      save();
    }}>
    <div className={style["Nom"]}>
        <div className={style["form-group"]}>
          <label style={{marginLeft:"7px"}}>Prénom</label>
          <input type="text" required className={style["form-nom"]} id="FirstName" placeholder="Entrez votre prénom"
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
          />
        </div>
        <div className={style["form-group"]}>
          <label style={{marginLeft:"7px"}}>Nom</label>
          <input type="text" required className={style["form-nom"]} id="LastName" placeholder="Entrez votre nom"
          onChange={(event) => {
            setLastName(event.target.value);
          }}
          />
        </div>
        </div>
        <div className={style["form-group"]}>
          <label style={{marginLeft:"7px"}}>E-mail</label>
          <input type="email" required className={style["form-control"]} id="email" placeholder="Entrez votre Email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          
          />
 
        </div>
        <div className={style["form-group"]}>
            <label style={{marginLeft:"7px"}}>Mot de passe</label>
            <input type="password" required className={style["form-control"]} id="password" placeholder="Entrez votre mot de passe"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            
            />
          </div>
          <div className={style["form-group"]}>
          <label  style={{marginLeft:"7px"}}>S'inscrire en tant que :</label>
          <select onChange={(e)=>setRole(e.target.value)}>
            <option value={"EXAMINATEUR"}>Examinateur</option>
            <option value={"EXAMINE"}>Examine</option>
          </select>
 
        </div>
    <div className={style["div-bt-register"]}>       
          <button className={style["bt-connexion-register"]}  onClick={() => navigate("/login")}>J'ai déjà un compte</button>
          <button type="submit" className={style["bt-inscription-register"]} >Inscription</button>
          </div> 
      </form>
    </div>
    </div>
    );
  }
  
  export default Register;