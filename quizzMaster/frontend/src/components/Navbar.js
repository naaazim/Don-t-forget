import "../style/style.css";
import { useNavigate } from "react-router-dom";

function Navbar({ title }) {
  const navigate = useNavigate();

  const userDataString = localStorage.getItem("user");
  const user = userDataString ? JSON.parse(userDataString) : null;

  const deconnecter = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt_token");
    navigate("/login");
  };

  const initials =
    user?.firstName?.[0]?.toUpperCase() + user?.lastName?.[0]?.toUpperCase();

  return (
    <div className="maNavbar">
      <div className="navGauche">
        {(user?.appUserRole === "EXAMINATEUR" || user?.appUserRole === "ADMIN") && (
          <>
            <div id="menuToggle">
              <input type="checkbox" id="menuCheckbox" />

              <span id="bar1"></span>
              <span id="bar2"></span>
              <span id="bar3"></span>

              <ul id="menu">
                <li>
                  <label htmlFor="menuCheckbox">
                    <a href="/dashboard-examinateur">Tableau de bord</a>
                  </label>
                </li>
                <li>
                  <label htmlFor="menuCheckbox">
                    <a href="/gestion-groupes">Gestion des groupes</a>
                  </label>
                </li>
                <li>
                  <label htmlFor="menuCheckbox">
                    <a href="/gestion-examens">Gestion des examens</a>
                  </label>
                </li>
                <li>
                  <label htmlFor="menuCheckbox">
                    <a href="/ajouter-passe-examen">Gestion des passages</a>
                  </label>
                </li>
                <li>
                  <label htmlFor="menuCheckbox">
                    <a href="/analyses">Analyses</a>
                  </label>
                </li>
                {user?.appUserRole === "ADMIN"&&(<><li>
                  <label htmlFor="menuCheckbox">
                    <a href="/gestion-roles">Gestion des roles</a>
                  </label>
                </li></>)}
              </ul>
            </div>
          </>
        )}
        <div >
        <img
          src="/LOGO.png"
          width="120"
          className="image"
          onClick={() => navigate("/")}
        />
        </div>
      </div>

      <div className="titre">
        <p>{title}</p>
      </div>

      <div className="profil">
        <p>{initials}</p>
        <button onClick={deconnecter}>Déconnexion</button>
      </div>
    </div>
  );
}

export default Navbar;
