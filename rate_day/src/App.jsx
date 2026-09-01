import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registro from "./pages/Registro.jsx";
import InicioSesion from "./pages/InicioSesion.jsx";
import Principal from "./pages/Principal.jsx";

function App(){

  return <BrowserRouter>

    <Routes>
      <Route path="/" element={<InicioSesion />}></Route>
      <Route path="/registro" element={<Registro />}></Route>
      <Route path='/principal' element={<Principal />}></Route>
    </Routes>
  </BrowserRouter>
}

export default App;