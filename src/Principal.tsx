import React, { useEffect, useState } from "react";
import styles from "./Principal.module.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "./components/navbar";
import NavbarV from "./components/navbarV";
import SearchBar from "./components/SearchBar"; 

// Definir la interfaz para tipar las publicaciones
interface Publicacion {
  idPublicacion: number;
  foto: string;
  Nombre: string;
  Precio: string;
}

interface UserData {
  idUsuario: number,
  nickname: string;
  pass: string;
  nombres: string;
  apellidoP: string;
  apellidoM: string;
  fechaN: string; // Podrías usar Date si prefieres manejarlo como objeto de fecha
  correo: string;
  telefono: string;
  tipo: string;
}

function Principal() {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null); // Cambiar a null inicial

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

  }, []); // Solo ejecuta una vez, al montar el componente

  // Cargar las publicaciones solo si userData ha sido cargado
  useEffect(() => {
    if (userData) {
      if (userData.tipo === "Cliente") {
        axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/ObtenerPublicaciones`)
          .then(response => {
            setPublicaciones(response.data.results);
          })
          .catch(error => {
            console.error("Hubo un error al obtener las publicaciones: ", error);
            navigate(`/`);
          });
      } else if (userData.tipo === "Vendedor") {
        axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/ObtenerMisPublicaciones`, {
            params: { idUsuario: userData.idUsuario },
          })
          .then(response => {
            setPublicaciones(response.data.results);
          })
          .catch(error => {
            console.error("Hubo un error al obtener las publicaciones del vendedor: ", error);
            navigate(`/`);
          });
      }
    }
  }, [userData]); 

  const handlePublicacionClick = (idPublicacion: number) => {
    // Construye la URL con el ID de la publicación
    navigate(`/publicacion/${idPublicacion}`);
  };

  return (
    <>
    <div>
    {userData ? (userData.tipo === "Cliente" ? <Navbar /> : <NavbarV />) : null}
    {userData && userData.tipo === "Cliente" ? <SearchBar setPublicaciones={setPublicaciones} /> : null}
    </div>
      <div className={styles.publicaciones}>
        <div className={styles.tabla}>
          <div className={styles.publicacionesContainer}>
            {publicaciones.map((publicacion) => (
              <div key={publicacion.idPublicacion} className={styles.publicacionRectangulo}>
                <img src={publicacion.foto} alt="Imagen de la publicación" loading="lazy"/>
                <h3 className={styles.publicationTitle}>{publicacion.Nombre}</h3>
                <p className={styles.publicationPrice}>${publicacion.Precio}</p>
                <button className={styles.detailsBtn} onClick={() => handlePublicacionClick(publicacion.idPublicacion)}>
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Principal;
