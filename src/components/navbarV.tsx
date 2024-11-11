import { Link, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";

const NavbarV: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/"); // Redirige a la ruta de inicio
    };

    return (
        <nav className={styles.navBar}>
            <Link to="/Principal" className={styles.NavLink}>Inicio</Link>
            <Link to="/Chat" className={styles.NavLink}>Chat</Link>
            <Link to="/CrearPublicacion" className={styles.NavLink}>Crear Publicación</Link>
            <span onClick={handleLogout} className={styles.NavLink} style={{ cursor: 'pointer' }}>
                Cerrar sesión
            </span>
        </nav>
    );
}

export default NavbarV;

// Añadir esto para resolver TS1208
export {};