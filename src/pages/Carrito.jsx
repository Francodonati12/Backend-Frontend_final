import { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { crearPedido, getProductImage } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Carrito() {
  const { items, quitar, vaciar, total } = useCarrito();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const confirmar = async () => {
    if (enviando || items.length === 0) return;

    setEnviando(true);
    setError(null);

    try {
      await crearPedido(items);
      vaciar();
      navigate("/mis-pedidos");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-[#13141f] border border-[#232538] rounded-3xl p-10 text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-4xl flex items-center justify-center mx-auto shadow-inner">
          🛒
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Tu carrito está vacío</h2>
          <p className="text-sm text-neutral-400">
            Aún no has agregado ningún producto. Explora nuestro catálogo y aprovecha las ofertas disponibles.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/25"
          >
            <span>Explorar Catálogo 🚀</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Tu Carrito de Compras</h1>
          <p className="text-xs text-neutral-400">
            Revisa los artículos antes de proceder con el pedido
          </p>
        </div>
        <button
          onClick={vaciar}
          className="text-xs text-neutral-400 hover:text-red-400 transition-colors font-semibold"
        >
          Vaciar carrito
        </button>
      </div>

      {error && (
        <div className="bg-red-950/70 border border-red-800 text-red-200 p-4 rounded-2xl text-sm flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <strong>Error al procesar: </strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="bg-[#13141f] rounded-3xl p-6 border border-[#232538] shadow-2xl space-y-6">
        <ul className="divide-y divide-[#232538]">
          {items.map((item) => {
            const img = item.imagen || getProductImage(item);
            return (
              <li key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail de la imagen del producto */}
                  <img
                    src={img}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded-xl bg-neutral-900 border border-neutral-800"
                  />
                  <div>
                    <p className="font-bold text-white text-base">{item.nombre}</p>
                    <p className="text-xs text-neutral-400">
                      Cantidad: <span className="text-orange-400 font-bold">{item.cantidad}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <span className="font-black text-lg text-orange-400">
                      ${((item.precio_final || item.precio || 0) * item.cantidad).toLocaleString('es-AR')}
                    </span>
                    <p className="text-[10px] text-neutral-500">
                      ${(item.precio_final || item.precio || 0).toLocaleString('es-AR')} c/u
                    </p>
                  </div>

                  <button
                    onClick={() => quitar(item.id)}
                    className="text-neutral-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-950/30 transition-colors text-xs font-semibold cursor-pointer"
                    title="Quitar este artículo"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Resumen del Total */}
        <div className="border-t border-[#232538] pt-5 space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-bold text-neutral-300">Total a Pagar:</span>
            <div className="text-right">
              <span className="text-3xl font-black text-orange-500 tracking-tight">
                ${total.toLocaleString('es-AR')}
              </span>
              <span className="text-xs text-neutral-500 ml-1.5">ARS</span>
            </div>
          </div>

          <button
            onClick={confirmar}
            disabled={enviando}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-black font-black text-base rounded-2xl transition-all shadow-[0_0_25px_rgba(255,107,0,0.3)] cursor-pointer active:scale-98 flex items-center justify-center gap-2"
          >
            <span>{enviando ? "Procesando compra en servidor…" : "Confirmar y Comprar Ahora ⚡"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}