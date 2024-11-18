import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import fondo from './imagenes/fondo.jpeg';

import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false); // Estado para el pop-up

  const validar_user = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("API URL:", `${process.env.REACT_APP_API_BASE_URL}/Login`);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/Login`, {
        nickname: nickname,
        password: password,
      });
      console.log(response);
      if (response.status === 200) { // Verifica que el estado sea 200
        const userData = response.data.results[0]; // Obtén el primer resultado

        if (response.data.message === 'usuario valido') {
          // Guarda el nickname y el resto de los datos
          localStorage.setItem('msg', nickname);
          localStorage.setItem("nickname", nickname);
          localStorage.setItem("userData", JSON.stringify(userData)); // Guardar los datos completos en localStorage

          // Verifica el tipo de usuario y redirige a la página adecuada
          if (userData.tipo === "Cliente") {
            console.log("Usuario Cliente");
            navigate("/Principal");
          } else if (userData.tipo === "Vendedor") {
            console.log("Usuario Vendedor");
            navigate("/Principal");
          } else {
            alert('Tipo de usuario no reconocido');
          }
        } else {
          alert('Inicio de sesión fallido');
        }
      }
    } catch (error) {
      console.log(error)
      alert('Fallo inicio de sesión');
    }
  };

  const handleOpenPopup = () => {
    setShowPopup(true); // Muestra el pop-up
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Oculta el pop-up
  };

  const handleNavigate = (type: string) => {
    navigate(`/Registrar${type}`); // Redirige a la ruta seleccionada
    handleClosePopup(); // Cierra el pop-up
  };

  return (
    <section className="login-section"style={{ 
      backgroundImage: `url(${fondo})`,
    }}>
      <div className="Login-contenedor">
        <div className="formulario">
          <form onSubmit={validar_user}>
            <h2>Login</h2>
            <div className="input-contenedor">
              <input
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <label htmlFor="">User</label>
            </div>
            <div className="input-contenedor">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="">Password</label>
            </div>
            <div className="olvidar">
              <label form="#">
                <input type="checkbox" />
                Remember
              </label>
            </div>
            <button className="button2" type="submit">
              Access
            </button>
          </form>
          <div className="registrar">
            <p>
              ¿No tienes cuenta? 
              <button onClick={handleOpenPopup} className="popup-link">
                Crear cuenta
              </button>
            </p>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Elige el tipo de cuenta</h3>
            <button onClick={() => handleNavigate("Usuario")}>Usuario</button>
            <button onClick={() => handleNavigate("Vendedor")}>Vendedor</button>
            <button onClick={handleClosePopup}>Cancelar</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Login;
