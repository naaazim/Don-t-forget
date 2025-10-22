import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";
import axios from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import succesImg from "../assets/succes.png";

function DB_ADMIN() {
  const [userId, setUserId] = useState(null);
  const [users,setUsers]=useState([]);
  const [roles, setRoles] = useState({});
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ajout,setAjout]=useState(false);
  const [succes,setSucces]=useState(false);
  const [erreur,setErreur]=useState(false);
  const [message,setMessage]=useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get(`/api/v1/user/get-to-update`);
        console.log(response);

      setUsers(response.data);

      // Initialiser les rôles choisis avec une valeur par défaut
      const initialRoles = {};
      response.data.forEach(user => {
        initialRoles[user.email] = user.appUserRole; // ou "EXAMINATEUR", à toi de voir la valeur par défaut
      });
      setRoles(initialRoles);
    } catch (error) {
      console.log(error);
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
  };



  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (!userDataString) {
      navigate("/login");
      return;
    }
    fetchUsers();
    
    const userData = JSON.parse(userDataString);
    setUserId(userData?.id);

  }, []);


  const updateUser = async (email,role)=>{
    try {
        const response = await axios.put(`/api/v1/user/role`,{
            email : email,
            role : role
        });
        setSucces(true);
        setTimeout(() => {
          setSucces(false);           
        }, 2000);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      }
  }

  const handleRoleChange = (email, newRole) => {
    setRoles((prev) => ({
      ...prev,
      [email]: newRole 
    }));
  };

  const addUser= async()=>{
    try{
      await axios.post(`/api/v1/auth/admin-add`,{
        firstName : FirstName,
        lastName : LastName,
        email: email,
        password: password,
        });
        fetchUsers();
      setAjout(false);
      setErreur(false);
    }catch(error){
      setMessage(error.response.data);
      setErreur(true);
    }
  };


  return (
    <>  
      <Navbar title={"Tableau de bord admin"}/> 
      <div className='bgImage'></div>
      {succes && (
        <div className='p-3 m-3 bg-white align-items-center justify-content-center d-flex flex-row column rounded-3 border border-success position-fixed top-25 start-50 translate-middle w-50 '>
          <img src={succesImg} width={60} />
          <p className='montserrat font-20 text-success m-2'>Changement effectué avec succès</p>
        </div>
      )}

      <div className='d-flex flex-column justify-content-center'>
        <h2 className='montserrat mx-auto text-center '>Liste des utilisateurs</h2>
      {users.length>0 && users.map((user)=>(
        <div key={user.id} className='d-flex flex-md-row justify-content-center m-3'>
            <p className='bg-bleu p-3 rounded-3 w-400 text-white text-center montserrat m-2'>{user.firstName} {user.lastName}</p>
            <select className='border border-warning m-2 rounded-3 montserrat' value={roles[user.email]} onChange={(e) => handleRoleChange(user.email, e.target.value)}>
                <option value={"INDEFINI"}>INDEFINI</option>
                <option value={"EXAMINATEUR"}>EXAMINATEUR</option>
                <option value={"EXAMINE"}>EXAMINE</option>
                <option value={"ADMIN"}>ADMIN</option>
            </select>
            <button className='btn btn-outline-primary m-2' onClick={()=>{updateUser(user.email,roles[user.email])}}>Valider</button>
        </div>
       ))}
       {users.length==0 &&(<><h1 className='montserrat mx-auto text-center'>Aucun utilisateur inscrit</h1></>)}
       <button className='btn btn-outline-primary mx-auto w-400 rounded-5 p-2' onClick={()=>setAjout(true)}>Ajouter un utilisateur</button>
       </div>
       
       {ajout && (<div className='p-4 justify-content-center d-flex flex-column rounded-3 border border-warning bg-white position-fixed top-50 start-50 translate-middle w-50 '>
            <button className='position-absolute top-0 end-0 btn-close m-2' aria-label='Close' onClick={()=>{setAjout(false); setErreur(false)}}></button>
            <h3 className='text-center montserrat'>Ajouter un utilisateur</h3>
            {erreur && (<p className='font-20 montserrat text-danger mx-auto'>X {message}</p>)}
            <form className='p-2 justify-content-center d-flex flex-column' onSubmit={(event) => {event.preventDefault();addUser();}}>
    <div className="d-flex flex-row justify-content-between mx-auto align-items-center w-100">
        <div className="me-2 d-flex flex-column w-50">
          <label>Prénom</label>
          <input required type="text"  className="form-control " id="FirstName" placeholder="Entrez votre prénom"
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
          />
        </div>
        <div className="ms-2 w-50">
          <label>Nom</label>
          <input required type="text"  className="form-control " id="LastName" placeholder="Entrez votre nom"
          onChange={(event) => {
            setLastName(event.target.value);
          }}
          />
        </div>
        </div>
        <div class="w-100 mx-auto">
          <label>E-mail</label>
          <input required type="email"  className="form-control" id="email" placeholder="Entrez votre Email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          
          />
 
        </div>
        <div class="w-100 mx-auto">
            <label>Mot de passe</label>
            <input type="password"  className="form-control" id="password" placeholder="Enter password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            
            />
        </div>  
        <button type="submit" className="btn btn-outline-primary mx-auto mt-3" >Valider</button>
        </form>
        </div>)}

    </>
  );
}

export default DB_ADMIN;