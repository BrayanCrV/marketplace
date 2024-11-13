import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

const Navbar: React.FC = () => {
    return (
        <nav className={styles.navBar}>
            <a href="/Principal" className={styles.NavLink}>Inicio</a>
            <Link to="/Chat" className={styles.NavLink}>Chat</Link>
            <Link to="/Guardados" className={styles.NavLink}>Guardados</Link>
            <Link to="/" className={styles.NavLink}>Cerrar sesion</Link>
        </nav>
    );
}

export default Navbar;

// Añadir esto para resolver TS1208
export {};
