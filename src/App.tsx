import React from "react";
import {  Route,  Routes } from "react-router-dom";
import Login from "./login/Login";
import Principal from "./Principal";
import RegistrarVendedor from "./login/RegistrarVendedor";
import RegistrarCliente from "./login/RegistrarCliente";
import Publicacion from "./publicacion/Publicacion"
import CrearPublicacion from "./publicacion/crearPublicacion"
import Chat from "./chat/Chat";
import Guardados from "./guardados/guardados";
import { BrowserRouter } from "react-router-dom";



function App() {
  //const histori = useHistory
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index path="/" element={<Login/>} />
          <Route index path="Principal" element={<Principal />} />
          <Route index path="PrincipalVendedor" element={<Principal />} />
          <Route index path="RegistrarUsuario" element={<RegistrarCliente/>} />
          <Route index path="RegistrarVendedor" element={<RegistrarVendedor/>} />
          <Route index path="/Principal" element={<Principal/>}/>
          <Route path="Publicacion/:idPublicacion" element={<Publicacion/>} />
          <Route path="CrearPublicacion" element={<CrearPublicacion/>} />
          <Route index path="Guardados" element={<Guardados/>} />
          <Route index path="Chat" element={<Chat/>} />

          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
