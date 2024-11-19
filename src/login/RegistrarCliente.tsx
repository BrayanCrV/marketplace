import React, { useState, useEffect } from "react";
import styles from './nuevaCuenta.module.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function RegistrarVendedor() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [apellidoP, setApellidoP] = useState('');
  const [apellidoM, setApellidoM] = useState('');
  const [fecha, setFecha] = useState('');
  const [correo, setCorreo] = useState('');
  const [nickname, setNickname] = useState('');
  const [pass, setpass] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Verifica que todos los campos estén llenos
    if (name && apellidoP && apellidoM && fecha && correo && nickname && pass && telefono) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, apellidoP, apellidoM, fecha, correo, nickname, pass, telefono]);

  const createUser = async () => {
    const data = { nickname, pass, nombres: name, apellidoP, apellidoM, fechaN: fecha, correo, telefono, tipo:"Cliente", };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/RegistrarCliente`, data);
      console.log(response.data);
      localStorage.clear();
      localStorage.setItem('msg', nickname);
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("userData", JSON.stringify(data));
      window.location.href = "/Principal";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className={styles.newAccountSection} style={{
      backgroundImage: `url(${process.env.REACT_APP_PUBLIC_FOLDER_URL}/fondo.jpeg)`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover', // Opcional, asegura que la imagen se ajuste bien al contenedor
    }}>
      <div className={styles.container}>
        <div className={styles.formulario}>
          <form action="#">
            <h3>Registro de Cliente</h3>

            {/* Campos comunes */}
            <div className={styles.inputGroup}>
              <div className={styles.inputContainer}>
                <label>Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className={styles.inputContainer}>
                <label>Apellido Paterno</label>
                <input required value={apellidoP} onChange={(e) => setApellidoP(e.target.value)} />
              </div>

              <div className={styles.inputContainer}>
                <label>Apellido Materno</label>
                <input required value={apellidoM} onChange={(e) => setApellidoM(e.target.value)} />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputContainer}>
                <label>Fecha de Nacimiento</label>
                <input type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </div>

              <div className={styles.inputContainer}>
                <label>Correo</label>
                <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
              </div>

              <div className={styles.inputContainer}>
                <label>Teléfono</label>
                <input type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputContainer}>
                <label>Nickname</label>
                <input required value={nickname} onChange={(e) => setNickname(e.target.value)} />
              </div>

              <div className={styles.inputContainer}>
                <label>pass</label>
                <input type="password" required value={pass} onChange={(e) => setpass(e.target.value)} />
              </div>
            </div>

            <button
              className={styles.button1}
              onClick={createUser}
              disabled={!isFormValid} // Deshabilitado si no es válido
            >
              Registrar Cliente
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RegistrarVendedor;
