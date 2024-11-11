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
  
  // Campos adicionales para vendedor
  const [calle, setCalle] = useState('');
  const [colonia, setColonia] = useState('');
  const [lote, setLote] = useState<number>(0);
  const [municipio, setMunicipio] = useState('');

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Verifica que todos los campos estén llenos
    if (name && apellidoP && apellidoM && fecha && correo && nickname && pass && telefono && calle && colonia && lote && municipio) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, apellidoP, apellidoM, fecha, correo, nickname, pass, telefono, calle, colonia, lote, municipio]);

  const createUser = async () => {
    const data = { nickname, pass, nombres: name, apellidoP, apellidoM, fechaN: fecha, correo, telefono, calle, colonia, lote, municipio };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}`, data);
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
    <section className={styles.newAccountSection}>
      <div className={styles.container}>
        <div className={styles.formulario}>
          <form action="#">
            <h3>Registro de Vendedor</h3>

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

            {/* Campos adicionales para vendedor */}
            <div className={styles.inputGroup}>
              <div className={styles.inputContainer}>
                <label>Calle</label>
                <input required value={calle} onChange={(e) => setCalle(e.target.value)} />
              </div>

              <div className={styles.inputContainer}>
                <label>Colonia</label>
                <input required value={colonia} onChange={(e) => setColonia(e.target.value)} />
              </div>

              <div className={styles.inputContainer}>
                <label>Lote</label>
                <input type="number" required value={lote} onChange={(e) => setLote(parseInt(e.target.value, 10))} />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputContainer}>
                <label>Municipio</label>
                <input required value={municipio} onChange={(e) => setMunicipio(e.target.value)} />
              </div>
            </div>

            <button
              className={styles.button1}
              onClick={createUser}
              disabled={!isFormValid} // Deshabilitado si no es válido
            >
              Registrar Vendedor
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RegistrarVendedor;
