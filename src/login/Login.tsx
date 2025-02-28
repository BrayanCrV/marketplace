import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Cookies from 'js-cookie';

import { jwtDecode } from "jwt-decode";


import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false); // Estado para el pop-up

  const validar_user = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("API URL:", `${process.env}`);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        nickname: nickname,
        pass: password,
      });
      console.log(response);
      if (response.status === 200) { // Verifica que el estado sea 200
       // Obtén el primer resultado
        console.log("Es la data" , response.data)
        console.log("jwt" , response.data.jwt)
        const token= response.data.jwt;
        Cookies.set('jwtToken', token, { expires: 1, secure: true, sameSite: 'strict' });
          // Guarda el nickname y el resto de los datos
        localStorage.setItem('msg', nickname);
        localStorage.setItem("nickname", nickname);
        
        const decodedToken = jwtDecode<{ sub: string; tipo: string }>(token);
        const userId = decodedToken.sub;
        console.log("ID", userId);
        const userType = decodedToken.tipo;
        console.log("tipo", userType)
        localStorage.setItem('msg', nickname);
        localStorage.setItem("nickname", nickname);
        localStorage.setItem("tipo", userType)
      //  const userId = decodedToken.sub; // "35"
     //  const userType = decodedToken.tipo;
        //   localStorage.setItem("userData", JSON.stringify(userData)); // Guardar los datos completos en localStorage

          // Verifica el tipo de usuario y redirige a la página adecuada
          if (userType === "Cliente") {
            console.log("Usuario Cliente");
            navigate("/Principal");
          } else if (userType === "Vendedor") {
            console.log("Usuario Vendedor");
            navigate("/Principal");
          } else {
            alert('Tipo de usuario no reconocido');
          }
        } else {
        //   alert('Inicio de sesión fallido');
         
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
    <section className="login-section"  >
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
