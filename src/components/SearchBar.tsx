import React, { useState } from 'react';
import axios from 'axios';
import styles from './SearchBar.module.css'; // Estilo básico

interface SearchBarProps {
  setPublicaciones: React.Dispatch<React.SetStateAction<any[]>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ setPublicaciones }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/BuscarPublicaciones/${searchTerm}`, {
        withCredentials: true,
      })
      
      setPublicaciones(response.data); // Actualiza las publicaciones con los resultados de la búsqueda
    } catch (error) {
      console.error('Error buscando publicaciones:', error);
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Buscar publicaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Buscar
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
