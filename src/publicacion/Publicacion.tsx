import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate
import styles from "./Publicacion.module.css";
import Navbar from "../components/navbar";

// Definición de tipos
interface PublicacionInd {
  foto: string;
  Precio: string;
  Nombre: string;
  Descripcion: string;
  tunidad: string;
  Cantidad: string;
  nickname: string; // Propietario de la publicación
  NombreC: string;
}

interface Comentario {
  id: number;
  nickname: string;
  fecha: string;
  comentario: string;
}
interface Guardados {
  resultado: 0 | 1; // Resultado es siempre 0 o 1
}

const Publicacion: React.FC = () => {
  const { idPublicacion } = useParams<{ idPublicacion: string }>();
  const navigate = useNavigate(); // Hook para la navegación
  const [publicacion, setPublicacion] = useState<PublicacionInd | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState<string>("");
  const [comprobarGuardados, setComprobarGuardados] = useState<Guardados>({ resultado: 0 });

  useEffect(() => {
    // Obtener datos de la publicación
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/ObtenerPublicacion`, {
        params: { idPublicacion },
      })
      .then((response) => {
        const data = response.data.results[0]; // Acceder al primer elemento del array `results`
        setPublicacion(data[0]);
        console.log("publicacion", data);
      })
      .catch((error) => {
        console.error("Error al obtener la publicación:", error);
      });

    // Obtener comentarios
    obtenerComentarios();
    ComprobarGuardados();
  }, [idPublicacion]);

  const obtenerComentarios = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/ObtenerComentarios`, {
        params: { idPublicacion },
      })
      .then((response) => {
        // Formatear la fecha antes de actualizar el estado
        const data = response.data.results[0].map((comentario: Comentario) => ({
          ...comentario,
          fecha: new Date(comentario.fecha)
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
        }));
        setComentarios(data);
        console.log("comentarios", data);
      })
      .catch((error) => {
        console.error("Error al obtener los comentarios:", error);
      });
  };

  const ComprobarGuardados = () => {
    const nickname = localStorage.getItem("nickname");

    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/ComprobarGuardados`, {
        params: {
          idPublicacion,
          nickname,
        },
      })
      .then((response) => {
        const data = response.data.results[0];
        console.log("esta guardada", data);
        setComprobarGuardados(data[0]);
        console.log(comprobarGuardados);
      })
      .catch((error) => {
        console.error("Error al comprobar si esta guardada:", error);
      });
  };

  // Modificación en handleChat para redirigir a la página de chat
  const handleChat = () => {
    const nickname = localStorage.getItem("nickname");
    if (publicacion && publicacion.nickname) {
      // Redirige a la página de chat con los datos del nickname del dueño de la publicación
      navigate(`/Chat`, { state: { nickname1: nickname, nickname2: publicacion.nickname } });
    }
  };

  const handleEnviarComentario = () => {
    const nickname = localStorage.getItem("nickname");

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/Comentar`, {
        idPublicacion,
        nickname,
        comentario: nuevoComentario,
      })
      .then((response) => {
        setNuevoComentario(""); // Limpiar el área de comentario
        obtenerComentarios(); // Actualizar la lista de comentarios
      })
      .catch((error) => {
        console.error("Error al enviar el comentario:", error);
      });
  };

  const handleGuardarPublicacion = () => {
    const nickname = localStorage.getItem("nickname");
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/GuardarPublicacion`, {
        idPublicacion,
        nickname,
      })
      .then((response) => {
        ComprobarGuardados();
        console.log("publicacion guardada");
      })
      .catch((error) => {
        console.error("Error al guardar la publicacion:", error);
      });
  };

  const handleEliminarPublicacion = () => {
    const nickname = localStorage.getItem("nickname");
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/EliminarPublicacion`, {
        params: {
          idPublicacion,
          nickname,
        },
      })
      .then((response) => {
        console.log("publicacion eliminada");
        ComprobarGuardados();
      })
      .catch((error) => {
        console.error("Error al eliminar la publicacion:", error);
      });
  };

  // Mostrar un mensaje de carga mientras se obtienen los datos de la publicación
  if (!publicacion) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {/* Cabecera de la página */}
      <Navbar />
      {/* Contenido de la publicación */}
      <div className={styles.publicacionContainer}>
        <div className={styles.publicacionImagen}>
          <img src={publicacion.foto} alt={publicacion.Nombre} />
        </div>
        <div className={styles.publicacionDetalle}>
          <h2>{publicacion.Nombre}</h2>
          <p>{publicacion.Descripcion}</p>
          <h3>Vendedor: {publicacion.NombreC} </h3>
          <h3>
            Precio por {publicacion.tunidad}: ${publicacion.Precio}
          </h3>
          <h3>
            Cantidad mínima: {publicacion.Cantidad}{" "}
            {publicacion.tunidad === "kilo" ? "kilos" : "piezas"}
          </h3>
          <div className={styles.buttonContainer}>
            <button className={styles.mybutton} onClick={handleChat}>
              Chatear
            </button>
            <button
              className={styles.mybutton}
              onClick={
                comprobarGuardados.resultado === 1
                  ? handleEliminarPublicacion
                  : handleGuardarPublicacion
              }
            >
              {comprobarGuardados.resultado === 1
                ? "Eliminar Publicacion"
                : "Guardar Publicacion"}
            </button>
          </div>
        </div>
      </div>

      {/* Área de comentarios */}
      <div className={styles.comentarios}>
        <h4>Comentar:</h4>
        <textarea
          placeholder="comenta aquí"
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
        />
        <button onClick={handleEnviarComentario}>Enviar</button>
        <div className={styles.comentariosLista}>
          {comentarios.map((comentario) => (
            <div key={comentario.id} className={styles.comentario}>
              <p>
                <strong>{comentario.nickname}</strong> ({comentario.fecha})
              </p>
              <p>{comentario.comentario}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Publicacion;
