import styles from "../style/navbar.module.css";
import { MdKeyboardArrowDown } from "react-icons/md";

function Navbar(){
    return(
        <>
            <ul className={styles.liste}>
                <li><a href="/">A propos <MdKeyboardArrowDown/></a></li>
                <li><a href="/">Fonctionnement<MdKeyboardArrowDown/></a></li>
                <li><a href="/">Contact<MdKeyboardArrowDown/></a></li>
            </ul>

        </>
    )
}
export default Navbar;