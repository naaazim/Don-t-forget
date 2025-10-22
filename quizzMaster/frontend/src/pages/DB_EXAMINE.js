import Navbar from "../components/Navbar";
import ListExamensPasses from "../components/ListExamensPasses";
import ListExamensAPasser from "../components/ListExamensAPasser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardEtudiant() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (!userDataString) {
      navigate("/login");
      return;
    }
    
    const userData = JSON.parse(userDataString);
    setUserId(userData?.id);
  }, [navigate]);

  return (
    <>  
      <Navbar title={"TABLEAU DE BORD EXAMINE"}/>   
      <div className='bgImage'></div>
      {userId && <ListExamensPasses userId={userId} />}
      {userId && <ListExamensAPasser userId={userId} />}
    </>
  );
}

export default DashboardEtudiant;
