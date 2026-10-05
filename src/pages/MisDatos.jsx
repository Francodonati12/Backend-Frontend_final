import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMisDatos, eliminarMiCuenta } from "../services/api";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

export default function MisDatos() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [confirmacion, setConfirmacion] = useState("");
  const [eliminando, setEliminando] = useState(false);

  const { vaciar } = useCarrito();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cargarDatosUsuario = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setCargando(false);
      return;
    }

    setCargando(true);
    getMisDatos()
      .then((res) => {
        setDatos(res);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarDatosUsuario();
  }, [user]);

  const handleExportar = () => {
    if (!datos || !datos.usuario) return;
    const jsonStr = JSON.stringify(datos, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mis_datos_${datos.usuario.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEliminarCuenta = async () => {
    if (confirmacion !== "ELIMINAR") return;
    setEliminando(true);

    try {
      await eliminarMiCuenta();
      if (vaciar) vaciar();
      logout();
      alert("Tu cuenta ha sido dada de baja y tus datos han sido anonimizados.");
      navigate("/");
    } catch (err) {
      alert(err.message);
      setEliminando(false);
    }
  };

  if (cargando) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
        <p className="text-neutral-400 text-sm font-medium">Cargando información personal...</p>
      </div>
    );
  }

  // SI NO HAY TOKEN O DATOS, INVITAR A INICIAR SESIÓN
  if (!datos || !datos.usuario) {
    return (
      <div className="max-w-md mx-auto my-12 bg-[#13141f] border border-[#232538] rounded-3xl p-8 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-3xl flex items-center justify-center mx-auto">
          🔒
        </div>
        <h2 className="text-2xl font-bold text-white">Acceso a Mis Datos</h2>
        <p className="text-xs text-neutral-400">
          Inicia sesión para visualizar y exportar tu información personal registrada.
        </p>

        {error && (
          <div className="p-3 bg-red-950/70 border border-red-800 text-red-200 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="pt-2">
          <Link
            to="/login"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-sm rounded-xl transition-all shadow-md block text-center"
          >
            Ir a Iniciar Sesión 🚀
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Mis Datos Personales</h1>
        <p className="text-xs text-neutral-400">
          Información registrada en conformidad con la normativa de privacidad y protección de datos
        </p>
      </div>

      {/* INFORMACIÓN DEL USUARIO */}
      <div className="bg-[#13141f] border border-[#232538] rounded-3xl p-6 shadow-xl space-y-3 text-sm text-neutral-300">
        <div className="flex justify-between items-center pb-3 border-b border-[#232538]">
          <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Identificador</span>
          <span className="font-mono text-orange-400 font-bold">ID #{datos.usuario.id}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-neutral-400">Nombre completo:</span>
          <span className="font-bold text-white">{datos.usuario.nombre}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-neutral-400">Correo Electrónico:</span>
          <span className="font-bold text-white">{datos.usuario.email}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-neutral-400">Rol en el sistema:</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-orange-500/10 text-orange-400 border border-orange-500/30">
            {datos.usuario.rol || 'customer'}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-[#232538] text-xs">
          <span className="text-neutral-400">Fecha de consentimiento / registro:</span>
          <span className="text-neutral-200">
            {datos.usuario.creado_en
              ? new Date(datos.usuario.creado_en).toLocaleString('es-AR')
              : 'Registrado'}
          </span>
        </div>
      </div>

      {/* BOTÓN DESCARGAR DATOS */}
      <div>
        <button
          onClick={handleExportar}
          className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-orange-400 hover:text-orange-300 text-xs font-bold rounded-xl border border-neutral-700 transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>📥</span>
          <span>Descargar mis datos en formato JSON (.json)</span>
        </button>
      </div>

      {/* SECCIÓN DE ELIMINAR / ANONIMIZAR CUENTA */}
      <div className="bg-red-950/30 border border-red-800/60 rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
          <span>⚠️</span>
          <span>Eliminar mi cuenta y anonimizar datos</span>
        </h3>
        <p className="text-xs text-neutral-300 leading-relaxed">
          Al confirmar la baja, tus datos personales serán anonimizados de forma permanente. Tus pedidos anteriores se conservarán únicamente para fines impositivos y contables requeridos por ley.
        </p>

        <p className="text-xs text-neutral-400">
          Para confirmar la baja escribe <strong className="text-red-400 font-mono">ELIMINAR</strong>:
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            placeholder="ELIMINAR"
            className="bg-[#0b0c10] border border-red-800/80 rounded-xl px-4 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
          />

          <button
            disabled={confirmacion !== "ELIMINAR" || eliminando}
            onClick={handleEliminarCuenta}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {eliminando ? "Procesando baja..." : "Confirmar eliminación definitiva"}
          </button>
        </div>
      </div>
    </div>
  );
}