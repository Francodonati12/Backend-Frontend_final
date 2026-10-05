import { useEffect, useState } from "react";
import { getMisPedidos, revocarPedido } from "../services/api";
import { Link } from "react-router-dom";

const DIAS_PARA_REVOCAR = 10;

function puedeRevocar(pedido) {
  if (pedido.estado === "cancelado") return false;
  const ms = Date.now() - new Date(pedido.creado_en);
  return ms / 86400000 <= DIAS_PARA_REVOCAR;
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensajeCodigo, setMensajeCodigo] = useState(null);
  const [error, setError] = useState(null);

  const cargarPedidos = async () => {
    try {
      const data = await getMisPedidos();
      setPedidos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const handleRevocar = async (pedidoId) => {
    if (enviando) return;
    if (!window.confirm("¿Estás seguro de que deseas revocar esta compra dentro del plazo legal de 10 días?")) return;

    setEnviando(true);
    setError(null);
    try {
      const res = await revocarPedido(pedidoId);
      setMensajeCodigo(`Solicitud registrada correctamente. Código de revocación: ${res.codigo}`);
      await cargarPedidos();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
        <p className="text-neutral-400 text-sm font-medium">Cargando tus compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 bg-[#13141f] border border-red-800/80 rounded-3xl p-8 text-center space-y-4">
        <div className="text-3xl">⚠️</div>
        <h3 className="text-lg font-bold text-red-300">{error}</h3>
        <p className="text-xs text-neutral-400">
          Para ver tus pedidos registrados, asegúrate de haber iniciado sesión con tu cuenta.
        </p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black text-xs font-bold rounded-xl transition-all"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 bg-[#13141f] border border-[#232538] rounded-3xl p-8 text-center space-y-4 shadow-2xl">
        <div className="text-4xl">📦</div>
        <h3 className="text-xl font-bold text-white">Aún no realizaste ninguna compra</h3>
        <p className="text-xs text-neutral-400">
          Tus pedidos aparecerán aquí una vez que confirmes tu carrito de compras.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-xs font-black rounded-xl shadow-md transition-all"
        >
          Ir al Catálogo 🛍️
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Historial de Compras</h1>
        <p className="text-xs text-neutral-400">
          Revisa el estado de tus compras y ejerce tu derecho de revocación si aplica
        </p>
      </div>

      {mensajeCodigo && (
        <div
          role="status"
          className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 p-4 rounded-2xl text-xs font-bold shadow-lg"
        >
          ✅ {mensajeCodigo}
        </div>
      )}

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="bg-[#13141f] border border-[#232538] hover:border-orange-500/30 rounded-3xl p-6 shadow-xl space-y-4 transition-all"
          >
            <div className="flex justify-between items-center font-bold">
              <div className="flex items-center gap-2">
                <span className="text-white text-base">Pedido #{pedido.id}</span>
                <span className="text-xs text-neutral-500">
                  • {new Date(pedido.creado_en).toLocaleString('es-AR')}
                </span>
              </div>
              <span
                className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                  pedido.estado === "cancelado"
                    ? "bg-red-950/60 text-red-300 border-red-800"
                    : "bg-orange-500/10 text-orange-400 border-orange-500/30"
                }`}
              >
                {pedido.estado}
              </span>
            </div>

            <ul className="divide-y divide-[#232538] text-sm text-neutral-300">
              {pedido.items.map((item) => (
                <li key={item.id || item.producto_id} className="py-2.5 flex justify-between">
                  <span>Producto ID: #{item.producto_id} (x{item.cantidad})</span>
                  <span className="font-semibold text-neutral-100">${item.precio_unitario} c/u</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-[#232538] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                {puedeRevocar(pedido) && (
                  <button
                    disabled={enviando}
                    onClick={() => handleRevocar(pedido.id)}
                    className="px-3.5 py-2 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-800 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {enviando ? "Procesando..." : "⚖️ Arrepentirme de esta compra"}
                  </button>
                )}
              </div>

              <div className="text-right">
                <span className="text-xs text-neutral-400 mr-2">Total abonado:</span>
                <span className="text-2xl font-black text-orange-500">
                  ${pedido.total}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}