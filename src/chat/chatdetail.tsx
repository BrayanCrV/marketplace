import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import styles from "./ChatDetalles.module.css";
import { format } from "date-fns";


interface ChatData {
  mensaje: string;
  fecha: Date;
  remitenteNickname: string;
}

interface ChatDetailProps {
  nickname1: string;
  nickname2: string;
  otroUsuario: number;
}

function ChatDetail({ nickname1, nickname2, otroUsuario }: ChatDetailProps) {
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // Configurar STOMP usando SockJS y la variable de entorno
    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(`${process.env.REACT_APP_API_BASE_URL}/api/ws`),
      onConnect: () => {
        console.log("Conectado a WebSocket en ChatDetail");
        // Suscribirse al canal de chat del otro usuario
        stompClient.subscribe(`/topic/chat/${nickname2}-${nickname1}`, (message) => {
          const newChatMessage: ChatData = JSON.parse(message.body);
          setChatData((prevChatData) => [...prevChatData, newChatMessage]);
          scrollToBottom();
        });
      },
      onStompError: (frame) => {
        console.error("Error en WebSocket (ChatDetail):", frame);
      },
      debug: (str) => console.log(str),
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [nickname1, nickname2]);

  useEffect(() => {
    // Cargar mensajes previos
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/conversacion/${nickname2}`, {
        withCredentials: true,
      })
      .then((response) => {
        setChatData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos del chat", error);
      });
  }, [nickname1, nickname2]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const chatMessage = {
      mensaje: newMessage,
      fecha: new Date(),
      remitenteNickname: nickname1,
    };
    const timeStamp = Date.now();

    if (stompClientRef.current) {
      stompClientRef.current.publish({
        destination: "/api/app/chat",
        body: JSON.stringify({
          mensaje: newMessage,
          fecha:  timeStamp,
          remitenteNickname: nickname1,
          receptorNickname: nickname2,
        }),
      });
    }

    setChatData((prev) => [...prev, chatMessage]);
    setNewMessage("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {chatData.map((chat, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              chat.remitenteNickname === nickname1
                ? styles.sentMessage
                : styles.receivedMessage
            }`}
          >
            <div className={styles.messageContent}>
              <p>{chat.mensaje}</p>
              <span className={styles.messageDate}>
                {format(new Date(chat.fecha), "PPpp")}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
