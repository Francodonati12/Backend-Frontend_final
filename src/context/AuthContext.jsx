import { createContext, useState, useEffect, useContext } from 'react';
import { loginUsuario, registrarUsuario, getPerfil, logoutUsuario } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Inicialización: si hay token guardado, recuperamos el perfil
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      getPerfil()
        .then((profile) => {
          setUser(profile);
        })
        .catch(() => {
          logoutUsuario();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login Estándar para cualquier usuario
  const login = async (email, password) => {
    setAuthError(null);
    try {
      await loginUsuario(email, password);
      const profile = await getPerfil();
      setUser(profile);
      return profile;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Login Exclusivo para Administrador: consulta y valida directamente el rol en la base de datos
  const loginAdmin = async (email, password) => {
    setAuthError(null);
    try {
      // 1. Iniciar sesión y obtener token
      await loginUsuario(email, password);

      // 2. Consultar directamente a la base de datos por el perfil
      const profile = await getPerfil();

      // 3. Validar de forma estricta si figura como administrador autorizado
      if (profile.rol !== 'admin') {
        // Denegar acceso inmediatamente y limpiar token
        logoutUsuario();
        setUser(null);
        const errMsg = `Acceso Denegado: La cuenta '${profile.email}' no posee privilegios de Administrador (Rol actual: '${profile.rol}').`;
        setAuthError(errMsg);
        throw new Error(errMsg);
      }

      // 4. Si está autorizado en la base de datos, conceder acceso
      setUser(profile);
      return profile;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  // Registro Estándar
  const register = async ({ nombre, email, password, acepto_tratamiento = true }) => {
    setAuthError(null);
    try {
      const nuevoUsuario = await registrarUsuario({ nombre, email, password, acepto_tratamiento });
      // Iniciar sesión automáticamente tras el registro
      await login(email, password);
      return nuevoUsuario;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const logout = () => {
    logoutUsuario();
    setUser(null);
    setAuthError(null);
  };

  const isAdmin = user?.rol === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        authError,
        setAuthError,
        login,
        loginAdmin,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);