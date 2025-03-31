import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
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
  otroUsuario: number;
}

interface LocationState {
  nickname1: string;
  nickname2: string;
  otroUsuario: number;
}

interface Tipo {
  tipo: string;
}

function Chat() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [selectedChat, setSelectedChat] = useState<LocationState | null>(null);
  const nickname = localStorage.getItem("nickname") || "";
  const [tipo, setTipo] = useState<Tipo | null>(null);
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const [client, setClient] = useState<Client | null>(null);

  // Función para cargar conversaciones
  const cargarConversaciones = () => {
    const storedTipo = localStorage.getItem("tipo");
    if (storedTipo) {
      setTipo({ tipo: storedTipo });
    } else {
      console.warn("No se encontró un tipo de usuario válido en localStorage.");
    }
    if (nickname) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/api/chatList`, {
          withCredentials: true,
        })
        .then((response) => {
          setConversaciones(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener la lista de conversaciones", error);
        });
    }
  };

  useEffect(() => {
    cargarConversaciones();

    // Configurar STOMP para el Chat (suscripción general)
    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(`${process.env.REACT_APP_API_BASE_URL}/api/ws`),
      connectHeaders: {
        // Agregar headers si necesitas autenticación adicional
      },
      onConnect: () => {
        console.log("Conectado al WebSocket en Chat");
        stompClient.subscribe(`/topic/chat/R/${nickname}`, (message) => {
          const newMessage: Conversacion = JSON.parse(message.body);

          setConversaciones((prev) => {
            const index = prev.findIndex(
              (conv) => conv.otroUsuario === newMessage.otroUsuario
            );

            if (index !== -1) {
              // Si ya existe, lo reemplazamos y lo movemos al principio
              const updatedList = [...prev];
              updatedList.splice(index, 1); // Eliminamos la conversación antigua
              return [newMessage, ...updatedList]; // Insertamos la nueva al inicio
            } else {
              // Si no existe, simplemente lo agregamos al inicio
              return [newMessage, ...prev];
            }
          });
        });
      },
      onStompError: (frame) => {
        console.error("Error en WebSocket (Chat):", frame);
      },
      debug: (str) => console.log(str),
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [nickname]);

  useEffect(() => {
    if (locationState && locationState.nickname1 && locationState.nickname2) {
      setSelectedChat(locationState);
    }
  }, [locationState]);

  const handleChatClick = (
    nickname1: string,
    nickname2: string,
    otroUsuario: number
  ) => {
    setSelectedChat({ nickname1, nickname2, otroUsuario });
  };

  return (
    <div className={styles.container}>
      {tipo ? tipo.tipo === "Cliente" ? <Navbar /> : <NavbarV /> : null}
      <div className={styles.mainContent}>
        <div className={styles.publicacionesContainer}>
          {conversaciones.length > 0 ? (
            conversaciones.map((conversacion) => (
              <div
                key={conversacion.nickname2}
                className={styles.publicacionRectangulo}
                onClick={() =>
                  handleChatClick(
                    nickname,
                    conversacion.nickname2,
                    conversacion.otroUsuario
                  )
                }
              >
                <h2 className={styles.enviadoPor}>{conversacion.nickname2}</h2>
                <div
                  className={
                    conversacion.enviadoPor === nickname
                      ? styles.mensaje
                      : styles.mensajeEnviadoPor
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
            <p className={styles.noConversations}>
              No hay conversaciones disponibles.
            </p>
          )}
        </div>
        {selectedChat && (
          <div className={styles.chatDetailContainer}>
            <ChatDetail
              nickname1={selectedChat.nickname1}
              nickname2={selectedChat.nickname2}
              otroUsuario={selectedChat.otroUsuario}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
