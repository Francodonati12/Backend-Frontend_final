import { Link, useLocation } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { items } = useCarrito();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#0d0e15]/90 backdrop-blur-md border-b border-[#232538] mb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(255,107,0,0.4)] group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
              <span>NEXUS</span>
              <span className="text-orange-500">STORE</span>
            </div>
            <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
              Dark & Orange Edition
            </p>
          </div>
        </Link>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              isActive('/')
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            Catálogo
          </Link>

          <Link
            to="/carrito"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              isActive('/carrito')
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <span>Carrito</span>
            <span className="text-base">🛒</span>
            {cantidadTotal > 0 && (
              <span className="bg-orange-500 text-black text-xs font-black rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center shadow-md animate-pulse">
                {cantidadTotal}
              </span>
            )}
          </Link>

          <Link
            to="/mis-pedidos"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              isActive('/mis-pedidos')
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            Mis Compras 📦
          </Link>

          <Link
            to="/mis-datos"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              isActive('/mis-datos')
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            Mis Datos 👤
          </Link>
        </nav>

        {/* SECCIÓN DE AUTENTICACIÓN Y ROLES */}
        <div className="flex items-center gap-3">
          {/* APARTADO 2: ACCESO EXCLUSIVO DE ADMINISTRADOR */}
          <Link
            to="/admin"
            className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 cursor-pointer ${
              isAdmin
                ? 'bg-orange-500 text-black font-extrabold shadow-[0_0_20px_rgba(255,107,0,0.45)] hover:bg-orange-400'
                : isActive('/admin')
                ? 'bg-neutral-800 text-orange-400 border-2 border-orange-500 shadow-[0_0_15px_rgba(255,107,0,0.3)]'
                : 'bg-neutral-900/90 text-orange-400 border border-orange-500/40 hover:border-orange-500 hover:bg-orange-500/10 hover:shadow-[0_0_15px_rgba(255,107,0,0.25)]'
            }`}
            title="Apartado exclusivo para validar credenciales y acceder como Administrador"
          >
            <span className="text-base">🛡️</span>
            <span className="hidden sm:inline">
              {isAdmin ? 'Panel Administrador Activo' : 'Acceso Administrador'}
            </span>
            <span className="sm:hidden">Admin</span>
          </Link>

          {/* APARTADO 1: REGISTRO Y LOGIN DE USUARIO */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#232538]">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-bold text-white leading-tight">
                  {user.nombre}
                </div>
                <div className="text-[10px] text-orange-400 uppercase font-semibold">
                  Rol: {user.rol}
                </div>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/80 text-neutral-300 hover:text-red-400 border border-neutral-700 hover:border-red-800 text-xs font-semibold transition-all cursor-pointer"
                title="Cerrar sesión actual"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive('/login')
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'bg-neutral-800/80 hover:bg-neutral-800 text-white hover:text-orange-400 border border-neutral-700/80'
              }`}
            >
              Ingresar / Registro
            </Link>
          )}
        </div>
      </div>

      {/* Navegación móvil */}
      <div className="md:hidden flex items-center justify-around py-2.5 px-4 bg-[#0a0b10] border-t border-[#232538] text-xs font-semibold text-neutral-300">
        <Link to="/" className={isActive('/') ? 'text-orange-400 font-bold' : ''}>
          Catálogo
        </Link>
        <Link to="/carrito" className={`flex items-center gap-1 ${isActive('/carrito') ? 'text-orange-400 font-bold' : ''}`}>
          Carrito {cantidadTotal > 0 && `(${cantidadTotal})`}
        </Link>
        <Link to="/mis-pedidos" className={isActive('/mis-pedidos') ? 'text-orange-400 font-bold' : ''}>
          Mis Compras
        </Link>
        <Link to="/mis-datos" className={isActive('/mis-datos') ? 'text-orange-400 font-bold' : ''}>
          Mis Datos
        </Link>
      </div>
    </header>
  );
}
