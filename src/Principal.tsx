import React, { useEffect, useState } from "react";
import styles from "./Principal.module.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "./components/navbar";
import NavbarV from "./components/navbarV";
import SearchBar from "./components/SearchBar"; 
import api from "./funciones/api"

// Definir la interfaz para tipar las publicaciones
interface Publicacion {
  idPublicacion: number;
  foto: string;
  nombre: string;
  precio: string;
}

interface Tipo {
  tipo: string // Restringe los valores posibles
}

function Principal() {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [tipo, setTipo] = useState<Tipo | null>(null); // Cambiar a null inicial

  useEffect(() => {
    const storedTipo = localStorage.getItem("tipo");
    if (storedTipo) {
      setTipo({tipo: storedTipo});
    } else {
      console.warn("No se encontró un tipo de usuario válido en localStorage.");
    }
  }, []); 
  

  // Cargar las publicaciones solo si tipo ha sido cargado
  useEffect(() => {
    if (tipo) {
      if (tipo.tipo === "Cliente") {
        axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/api/publicaciones`, { withCredentials: true })
          .then(response => {
            setPublicaciones(response.data);
          })
          .catch(error => {
            console.error("Hubo un error al obtener las publicaciones: ", error);
            
          });
      } else if (tipo.tipo === "Vendedor") {
        axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/api/misPublicaciones`, {
            withCredentials: true 
          })
          .then(response => {
            setPublicaciones(response.data);
          })
          .catch(error => {
            console.error("Hubo un error al obtener las publicaciones del vendedor: ", error);
            // navigate(`/`);
          });
      }
    }
  }, [tipo]); 

  const handlePublicacionClick = (idPublicacion: number) => {
    // Construye la URL con el ID de la publicación
    navigate(`/publicacion/${idPublicacion}`);
  };

  return (
    <>
    <div>
    {tipo ? (tipo.tipo === "Cliente" ? <Navbar /> : <NavbarV />) : null}
    {tipo && tipo.tipo === "Cliente" ? <SearchBar setPublicaciones={setPublicaciones} /> : null}
    </div>
      <div className={styles.publicaciones}>
        <div className={styles.tabla}>
          <div className={styles.publicacionesContainer}>
            {publicaciones?.map((publicacion) => (
              <div key={publicacion.idPublicacion} className={styles.publicacionRectangulo}>
                <img src={publicacion.foto} alt="Imagen de la publicación" loading="lazy"/>
                <h3 className={styles.publicationTitle}>{publicacion.nombre}</h3>
                <p className={styles.publicationPrice}>${publicacion.precio}</p>
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
