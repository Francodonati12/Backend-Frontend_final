import { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { crearPedido } from "../services/api";
import { useNavigate } from "react-router-dom";

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
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-700">Tu carrito está vacío 🛒</h2>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Tu Carrito</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                    <strong>Error: </strong>{error}
                </div>
            )}

            <ul className="divide-y divide-gray-100">
                {items.map((item) => (
                    <li key={item.id} className="py-4 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-gray-800">{item.nombre}</p>
                            <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-emerald-600">
                                ${((item.precio_final || item.precio || 0) * item.cantidad).toLocaleString('es-AR')}
                            </span>
                            <button
                                onClick={() => quitar(item.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors cursor-pointer"
                            >
                                Quitar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total estimado:</span>
                <span className="text-2xl font-extrabold text-emerald-600">
                    ${total.toLocaleString('es-AR')}
                </span>
            </div>

            <button
                onClick={confirmar}
                disabled={enviando}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
            >
                {enviando ? "Confirmando compra…" : "Confirmar compra"}
            </button>
        </div>
    );
}