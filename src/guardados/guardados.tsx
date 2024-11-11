import React, { useEffect, useState } from "react";
import styles from "./guardados.module.css";
import {  useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/navbar"

// Definir la interfaz para tipar las publicaciones
interface Publicacion {
  idPublicacion: number;
  foto: string;
  Nombre: string;
  Precio: string;
}

function Principal() {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
 // const [selectedPublicacion, setSelectedPublicacion] = useState<Publicacion | null>(null);

  useEffect(() => {
    // Corregir el uso de axios para obtener las publicaciones
    const nickname = localStorage.getItem("nickname");
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/BuscarPublicacionesGuardadas`,{
        params: {
            nickname
        }
    })
      .then(response => {
        setPublicaciones(response.data.results[0]);
      })
      .catch(error => {
        console.error("Hubo un error al obtener las publicaciones: ", error);
      });
  }, []);

  const handlePublicacionClick = (idPublicacion: number) => {
    // Construye la URL con el ID de la publicación
    navigate(`/publicacion/${idPublicacion}`);
  };

  return (
    <>
    <div>
      <Navbar />
    </div>
      <div className={styles.publicaciones}>
        <div className={styles.tabla}>
          <div className={styles.publicacionesContainer}>
            {publicaciones.map((publicacion) => (
            
              <div key={publicacion.idPublicacion} className={styles.publicacionRectangulo}>
                <img src={publicacion.foto} alt="Imagen de la publicación" />
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
export {}