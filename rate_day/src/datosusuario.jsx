import { useState} from 'react';
import { UserContext } from './UserContext';

//Creamos el Proveedor (Este SÍ se exporta)
export function UserProvider({ children }) {
  const [anadir, setAnadir] = useState(false);
  const [del, setDelete] = useState(false);
  const [usingColor, setUsingColor] = useState({color: "#FFFFFF", id: ""});
  const [usuario, setUsuario] = useState(null);

  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
  };

  const logout = () => {
    localStorage.removeItem("Token");
    setUsuario(null);
  };

  return (
    <UserContext.Provider value={{ usuario, login, logout, usingColor, setUsingColor, del, setDelete, anadir, setAnadir }}>
      {children}
    </UserContext.Provider>
  );
}