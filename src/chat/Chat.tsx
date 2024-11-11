import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import ChatDetail from "./chatdetail";
import styles from "./Chat.module.css";
import NavbarV from "../components/navbarV";

interface Conversacion {
  enviadoPor: string;
  fecha: Date;
  mensaje: string;
  nickname2: string;
}

interface LocationState {
  nickname1: string;
  nickname2: string;
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

function Chat() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [selectedChat, setSelectedChat] = useState<{ nickname1: string; nickname2: string } | null>(null);
  const nickname = localStorage.getItem("nickname") || "";
  const [userData, setUserData] = useState<UserData | null>(null); // Cambiar a null inicial

  const location = useLocation();
  const locationState = location.state as LocationState | null;

  // Función para cargar conversaciones
  const cargarConversaciones = () => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    if (nickname) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/obtenerUltimosMensajes`, {
          params: { nickname },
        })
        .then((response) => {
          const listaConversaciones = response.data;
          console.log("Conversaciones obtenidas:", listaConversaciones);
          setConversaciones(listaConversaciones);
        })
        .catch((error) => {
          console.error("Error al obtener la lista de conversaciones", error);
        });
    }
  };

  useEffect(() => {
    // Carga las conversaciones al montar el componente y cada vez que cambia el nickname
    cargarConversaciones();

    // Configura el intervalo para actualizar cada 5 segundos
    const intervalId = setInterval(() => {
      cargarConversaciones();
    }, 5000);

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [nickname]);

  useEffect(() => {
    // Verifica si los datos del chat están presentes en el estado de navegación
    if (locationState && locationState.nickname1 && locationState.nickname2) {
      setSelectedChat({
        nickname1: locationState.nickname1,
        nickname2: locationState.nickname2,
      });
    }
  }, [locationState]);

  const handleChatClick = (nickname1: string, nickname2: string) => {
    setSelectedChat({ nickname1, nickname2 });
  };

  return (
    <div className={styles.container}>
      {userData ? (userData.tipo === "Cliente" ? <Navbar /> : <NavbarV />) : null}
      <div className={styles.mainContent}>
        <div className={styles.publicacionesContainer}>
          {conversaciones.length > 0 ? (
            conversaciones.map((conversacion) => (
              <div
                key={conversacion.nickname2}
                className={styles.publicacionRectangulo}
                onClick={() => handleChatClick(nickname, conversacion.nickname2)}
              >
                <h2 className={ styles.enviadoPor}>
                  {conversacion.nickname2}
                </h2>
                <div
                  className={
                    conversacion.enviadoPor === nickname ?  styles.mensaje: styles.mensajeEnviadoPor
                  }
                >
                  {conversacion.enviadoPor !== nickname && (
                    <span className={styles.puntoAzul}></span>
                  )}
                  {conversacion.mensaje}
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noConversations}>No hay conversaciones disponibles.</p>
          )}
        </div>
        {selectedChat && (
          <div className={styles.chatDetailContainer}>
            <ChatDetail nickname1={selectedChat.nickname1} nickname2={selectedChat.nickname2} />
          </div>
        )}
      </div>
    </div>
  );
  
}

export default Chat;
