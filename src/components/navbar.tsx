import { Link, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import Cookies from "js-cookie";

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

const Navbar = () => {
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
      <Link to="/Guardados" className={styles.NavLink}>
        Guardados
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
};

export default Navbar;