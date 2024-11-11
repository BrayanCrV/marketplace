import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import styles from './ChatDetalles.module.css';
import { format } from 'date-fns';

interface ChatData {
  mensaje: string;
  fecha: Date;
  remitenteNickname: string;
}

interface ChatDetailProps {
  nickname1: string;
  nickname2: string;
}

function ChatDetail({ nickname1, nickname2 }: ChatDetailProps) {
  const navigate = useNavigate();
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const [newMessage, setNewMessage] = useState(""); // Estado para almacenar el nuevo mensaje
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref para el scroll automático

  useEffect(() => {
    const fetchChatData = () => {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/obtenerConversacion`, {
        params: {
          nickname1: nickname1,
          nickname2: nickname2,
        },
      })
        .then((response) => {
          const chatInfo = response.data;
          setChatData(chatInfo);
        })
        .catch((error) => {
          console.error("Error al obtener los datos del chat", error);
        });
    };

    // Llama a la función de obtención de datos cada 5 segundos
    fetchChatData(); // Primera llamada
    const intervalId = setInterval(fetchChatData, 5000); // Actualización cada 5 segundos

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar
  }, [nickname1, nickname2]);

  const sendMessage = () => {
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/enviarMensaje`, {
        nickname1: nickname1,
        nickname2: nickname2,
        mensaje: newMessage,
      })
      .then((response) => {
        console.log("Mensaje enviado con éxito");
        setChatData(prevChatData => [
          ...prevChatData,
          {
            mensaje: newMessage,
            fecha: new Date(),
            remitenteNickname: nickname1,
          },
        ]);
        setNewMessage(""); // Limpiar el campo del nuevo mensaje
        scrollToBottom(); // Desplaza hacia abajo después de enviar
      })
      .catch((error) => {
        console.error("Error al enviar el mensaje", error);
      });
  };

  // Función para desplazar al final de los mensajes
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom(); // Desplaza hacia abajo al cargar los mensajes
  }, [chatData]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {chatData.map((chat, index) => (
          <div
            key={index}
            className={`${styles.message} ${chat.remitenteNickname === nickname1 ? styles.sentMessage : styles.receivedMessage}`}
          >
            <div className={styles.messageContent}>
              <p>{chat.mensaje}</p>
              <span className={styles.messageDate}>
                {format(new Date(chat.fecha), 'PPpp')}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Referencia al final de los mensajes */}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}

export default ChatDetail;
