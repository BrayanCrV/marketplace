import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "../components/navbarV";
import styles from './CrearPublicacion.module.css'; // Importar el módulo CSS
import NavbarV from '../components/navbarV';

function CrearPublicacion() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [tunidad, setTunidad] = useState('Pieza'); // Inicializado como "Pieza"
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState('');

  // Función para manejar el cambio de archivo (subida de imagen)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  // Función para subir la foto al backend y obtener el URL de Google Drive
  const handleUploadFoto = async () => {
    if (!foto) return;
    const formData = new FormData();
    formData.append('file', foto);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/SubirImagen`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFotoUrl(response.data.url); // Guardar el URL de la imagen en el estado
      console.log(response.data.url);
      alert('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error subiendo la imagen:', error);
    }
  };

  // Función para manejar el envío del formulario de creación de publicación
  const handleCrearPublicacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotoUrl) {
      alert('Sube la imagen antes de crear la publicación.');
      return;
    }

    const nickname = localStorage.getItem('nickname'); // Obtener el nickname del localStorage

    const nuevaPublicacion = {
      nombre,
      precio,
      tunidad,
      cantidad,
      descripcion,
      foto: fotoUrl, // Aquí va el link de la imagen subida a Google Drive
      nickname, // Incluir el nickname en el objeto a enviar
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/CrearPublicacion`, nuevaPublicacion);
      if (response.status === 200) {
        alert('Publicación creada exitosamente');
        // Resetear los campos del formulario después de crear la publicación
        setNombre('');
        setPrecio('');
        setTunidad('Pieza'); // Volver a la opción por defecto
        setCantidad('');
        setDescripcion('');
        setFoto(null);
        setFotoUrl('');
      }
    } catch (error) {
      console.error('Error creando la publicación:', error);
    }
  };

  return (
    <>
      <NavbarV />
      <div className={styles.container}>
        <h2 className={styles.title}>Crear Publicación</h2>
        <form onSubmit={handleCrearPublicacion} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nombre del producto:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Precio del producto:</label>
            <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Unidad:</label>
            {/* Menú desplegable para seleccionar la unidad */}
            <select value={tunidad} onChange={(e) => setTunidad(e.target.value)} required>
              <option value="pieza">Pieza</option>
              <option value="kilo">Kilo</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Cantidad minima:</label>
            <input type="text" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Descripción:</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Imagen:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} required />
            <button type="button" onClick={handleUploadFoto} className={styles.uploadButton}>Subir Imagen</button>
          </div>
          {fotoUrl && <img src={fotoUrl} alt="Vista previa" className={styles.previewImage} />}
          <button type="submit" className={styles.submitButton}>Crear Publicación</button>
        </form>
      </div>
    </>
  );
}

export default CrearPublicacion;
