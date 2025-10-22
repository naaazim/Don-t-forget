import "../style/Navbar.css"
import { useNavigate } from "react-router-dom";

function Navbar ({title}){
    const user=JSON.parse(localStorage.getItem("user"));
    const naviguer = useNavigate();
    const deconnecter = ()=>{ localStorage.removeItem("user");
        naviguer("/login");
    };

    const initials = user.firstName[0]+user.lastName[0];




    return(
            <div className="nav">
        <div className="nav-gauche">
        <img src="LOGO.png" width="150" style={{ marginTop: "1vw" }}/>
        </div>
        <div className="nav-mid">
        <h1>{title}</h1>
        </div>
        
        <div className="nav-droite">
            <div className="initials"><p>{initials}</p></div>
            <button className="bt-deconnexion" onClick={deconnecter}>Déconnexion</button>
        </div>

    </div>
    )

};

export default Navbar;