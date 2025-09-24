import styles from "../style/google.module.css";
import { FcGoogle } from "react-icons/fc";


const Google = ({ onClick }) => {
  return (
    <div className={styles.googleWrapper}>
      <button className={styles.googleButton} type="button" onClick={onClick}>
        <FcGoogle size={20}/>
        Continuer avec Google
      </button>
    </div>
  );
};

export default Google;
