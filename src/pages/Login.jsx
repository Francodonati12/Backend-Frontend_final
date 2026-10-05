import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [modo, setModo] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aceptoTratamiento, setAceptoTratamiento] = useState(true);

  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensajeError(null);
    setMensajeExito(null);

    try {
      await login(email, password);
      setMensajeExito('¡Sesión iniciada correctamente! Redirigiendo...');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setMensajeError(err.message || 'Error al iniciar sesión.');
    } finally {
      setCargando(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    setMensajeExito(null);

    if (password !== confirmPassword) {
      setMensajeError('Las contraseñas no coinciden.');
      return;
    }

    if (!aceptoTratamiento) {
      setMensajeError('Debes aceptar el consentimiento de tratamiento de datos personales.');
      return;
    }

    setCargando(true);
    try {
      await register({
        nombre,
        email,
        password,
        acepto_tratamiento: aceptoTratamiento,
      });
      setMensajeExito('¡Cuenta creada y sesión iniciada con éxito! Redirigiendo...');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setMensajeError(err.message || 'Error al crear la cuenta.');
    } finally {
      setCargando(false);
    }
  };

  const rellenarClientePrueba = () => {
    setEmail('cliente@tienda.com');
    setPassword('cliente123');
    setModo('login');
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto my-12 bg-[#13141f] border border-[#232538] rounded-2xl p-8 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-3xl flex items-center justify-center mx-auto">
          👤
        </div>
        <h2 className="text-2xl font-bold text-white">Sesión Activa</h2>
        <p className="text-sm text-neutral-300">
          Actualmente estás conectado como <strong className="text-orange-400">{user.nombre}</strong> ({user.email}).
        </p>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
          Rol asignado: <span className="text-orange-400 uppercase">{user.rol}</span>
        </div>
        <div className="pt-4 flex flex-col gap-3">
          <Link
            to="/"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold rounded-xl transition-all"
          >
            Ir al Catálogo de Productos
          </Link>
          <Link
            to="/mis-datos"
            className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-sm font-semibold transition-all"
          >
            Ver Mis Datos Personales
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-8">
      {/* Apartado 1: Cabecera informativa */}
      <div className="text-center mb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
          Apartado 1: Usuarios
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Portal de Autenticación
        </h1>
        <p className="text-sm text-neutral-400">
          Inicia sesión en tu cuenta o regístrate para acceder al catálogo completo y tus pedidos.
        </p>
      </div>

      <div className="bg-[#13141f] border border-[#232538] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Selector de pestañas */}
        <div className="grid grid-cols-2 p-1 bg-[#0b0c10] rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => {
              setModo('login');
              setMensajeError(null);
            }}
            className={`py-2 text-sm font-bold rounded-lg transition-all ${
              modo === 'login'
                ? 'bg-orange-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setModo('register');
              setMensajeError(null);
            }}
            className={`py-2 text-sm font-bold rounded-lg transition-all ${
              modo === 'register'
                ? 'bg-orange-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Alertas */}
        {mensajeError && (
          <div className="p-4 bg-red-950/60 border border-red-800/80 text-red-200 text-sm rounded-xl flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">{mensajeError}</div>
          </div>
        )}

        {mensajeExito && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-sm rounded-xl flex items-start gap-3">
            <span className="text-lg">✅</span>
            <div className="flex-1">{mensajeExito}</div>
          </div>
        )}

        {/* FORMULARIO LOGIN */}
        {modo === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="w-full bg-[#0b0c10] border border-[#232538] focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0b0c10] border border-[#232538] focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {cargando ? 'Verificando credenciales...' : 'Ingresar a mi Cuenta 🚀'}
            </button>

            {/* Acceso Rápido para Pruebas */}
            <div className="pt-2 border-t border-[#232538]">
              <button
                type="button"
                onClick={rellenarClientePrueba}
                className="w-full py-2 bg-neutral-800/80 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-orange-400 rounded-lg border border-neutral-700/60 transition-all flex items-center justify-center gap-1.5"
              >
                <span>🧪</span>
                <span>Rellenar con usuario cliente de prueba (cliente@tienda.com)</span>
              </button>
            </div>
          </form>
        )}

        {/* FORMULARIO REGISTRO */}
        {modo === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juan Pérez"
                required
                className="w-full bg-[#0b0c10] border border-[#232538] focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@correo.com"
                required
                className="w-full bg-[#0b0c10] border border-[#232538] focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Al menos 6 caracteres"
                required
                className="w-full bg-[#0b0c10] border border-[#232538] focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                required
                className="w-full bg-[#0b0c10] border border-[#232538] focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={aceptoTratamiento}
                onChange={(e) => setAceptoTratamiento(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-neutral-700 text-orange-500 focus:ring-orange-500 bg-[#0b0c10]"
              />
              <span className="text-xs text-neutral-400 leading-relaxed">
                Acepto el tratamiento de mis datos personales de acuerdo con las normativas legales vigentes.
              </span>
            </label>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {cargando ? 'Creando cuenta...' : 'Crear Cuenta y Comenzar ✨'}
            </button>
          </form>
        )}
      </div>

      {/* Enlace al Acceso Administrador */}
      <div className="text-center mt-6">
        <Link
          to="/admin"
          className="text-xs font-semibold text-neutral-400 hover:text-orange-400 transition-colors inline-flex items-center gap-1.5"
        >
          <span>¿Eres Administrador de la tienda?</span>
          <span className="text-orange-500 underline">Ingresar por el Acceso Exclusivo de Administrador 🛡️</span>
        </Link>
      </div>
    </div>
  );
}
