import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate
import styles from "./Publicacion.module.css";
import Navbar from "../components/navbar";
import NavbarV from "../components/navbarV";


// Definición de tipos
interface PublicacionInd {
  id: string;
  foto: string;
  precio: string;
  Nombre: string;
  Descripcion: string;
  tunidad: string;
  Cantidad: string;
  nickname: string; // Propietario de la publicación
  nombreC: string;
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
interface Tipo {
  tipo: string // Restringe los valores posibles
}

const Publicacion: React.FC = () => {
  const { idPublicacion } = useParams<{ idPublicacion: string }>();
  const navigate = useNavigate(); // Hook para la navegación
  const [publicacion, setPublicacion] = useState<PublicacionInd | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState<string>("");
  const [comprobarGuardados, setComprobarGuardados] = useState<Guardados>({ resultado: 0 });
  const [tipo, setTipo] = useState<Tipo | null>(null); 

  useEffect(() => {
    // Obtener datos de la publicación
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/publicaciones/${idPublicacion}`, {
          withCredentials: true,
      })
      .then((response) => {
        const data = response.data; // Acceder al primer elemento del array `results`
        setPublicacion(data);
        console.log("publicacion", data);
      })
      .catch((error) => {
        console.error("Error al obtener la publicación:", error);
      });
      const storedTipo = localStorage.getItem("tipo");
    if (storedTipo) {
      setTipo({tipo: storedTipo});
    } else {
      console.warn("No se encontró un tipo de usuario válido en localStorage.");
    }
    // Obtener comentarios
    obtenerComentarios();
    ComprobarGuardados();
  }, []);

  const obtenerComentarios = () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/comentarios/${idPublicacion}`, {
      withCredentials: true,
    })
      .then((response) => {
        // Formatear la fecha antes de actualizar el estado
        const data = response.data.map((comentario: Comentario) => ({
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
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/guardados/${idPublicacion}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          console.log("Éxito:");
          setComprobarGuardados({ resultado: 1 });

      } else {
          console.log("No encontrado");
          setComprobarGuardados({ resultado: 0 });
      }
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
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/api/comentarios `, {
        idPublicacion,
        comentario: nuevoComentario,
        
      },
    {withCredentials: true})
      .then((response) => {
        setNuevoComentario(""); // Limpiar el área de comentario
        obtenerComentarios(); // Actualizar la lista de comentarios
      })
      .catch((error) => {
        console.error("Error al enviar el comentario:", error);
      });
  };

  const handleGuardarPublicacion = () => {
    
    axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/guardados/${idPublicacion}`,
      {}, // Cuerpo vacío (si no hay datos que enviar)
      { withCredentials: true } // Configuración (incluyendo credenciales)
    )
    .then((response) => {
        ComprobarGuardados();
        console.log("publicacion guardada");
      })
      .catch((error) => {
        console.error("Error al guardar la publicacion:", error);
      });
  };

  const handleEliminarPublicacion = () => {
  
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/api/guardados/${idPublicacion}`, {
       withCredentials: true,
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
      {tipo ? (tipo.tipo === "Cliente"? <Navbar /> : <NavbarV />) : null}
      {/* Contenido de la publicación */}
      <div className={styles.publicacionContainer}>
        <div className={styles.publicacionImagen}>
          <img src={publicacion.foto} alt={publicacion.Nombre} />
        </div>
        <div className={styles.publicacionDetalle}>
          <h2>{publicacion.Nombre}</h2>
          <p>{publicacion.Descripcion}</p>
          <h3>Vendedor: {publicacion.nombreC} </h3>
          <h3>
            precio por {publicacion.tunidad}: ${publicacion.precio}
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
        <button onClick={handleEnviarComentario} disabled={!nuevoComentario.trim()}>
  Enviar
</button>
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
