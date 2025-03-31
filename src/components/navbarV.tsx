import { Link, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import Cookies from "js-cookie";
const NavbarV: React.FC = () => {
    // Función para eliminar todas las cookies
    const eliminarTodasLasCookies = () => {
      const cookies = document.cookie.split(";");
    
      cookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim(); // Obtenemos el nombre de la cookie
        Cookies.remove(cookieName, { path: "/" }); // Eliminamos la cookie con la ruta raíz
      });
    };
    
    // Función para cerrar sesión
    const cerrarSesion = (navigate: any) => {
      // Limpiar localStorage
      localStorage.clear();
    
      // Eliminar todas las cookies
      eliminarTodasLasCookies();
    
      // Redirigir al usuario a la página de inicio
      navigate("/");
    };
    const navigate = useNavigate();
    return (
        <nav className={styles.navBar}>
      {/* Enlaces de navegación */}
      <Link to="/Principal" className={styles.NavLink}>
        Inicio
      </Link>
      <Link to="/Chat" className={styles.NavLink}>
        Chat
      </Link>
      <Link to="/CrearPublicacion" className={styles.NavLink}>
        Crear publicacion
      </Link>

      {/* Enlace de Cerrar sesión con manejador de clic */}
      <Link
        to="/" // Esto es solo un placeholder, no se usará directamente
        className={styles.NavLink}
        onClick={(e) => {
          e.preventDefault(); // Prevenimos la navegación predeterminada
          cerrarSesion(navigate); // Ejecutamos la lógica de cierre de sesión
        }}
      >
        Cerrar sesión
      </Link>
    </nav>
    );
}

export default NavbarV;

// Añadir esto para resolver TS1208
export {};