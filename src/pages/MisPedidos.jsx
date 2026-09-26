import { useEffect, useState } from "react";
import { getMisPedidos, revocarPedido } from "../services/api";

const DIAS_PARA_REVOCAR = 10;

// Regla de los 10 días para poder arrepentirse de la compra
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
        if (enviando) return; // Barrera contra el doble clic[cite: 5]
        if (!window.confirm("¿Estás seguro de que querés arrepentirte de esta compra?")) return;

        setEnviando(true);
        setError(null);
        try {
            const res = await revocarPedido(pedidoId);
            // Muestra el código devuelto por el backend[cite: 5]
            setMensajeCodigo(`Solicitud registrada. Código de revocación: ${res.codigo}`);
            await cargarPedidos(); // Refresca el historial[cite: 5]
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    };

    if (cargando) {
        return <div className="text-center py-12 text-gray-600 font-medium">Cargando tus compras... ⏳</div>;
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-600 font-medium">
                <h3>{error}</h3>
            </div>
        );
    }

    if (pedidos.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700">Aún no realizaste ninguna compra 📦</h3>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Historial de Compras</h2>

            {/* Código de la solicitud en pantalla con role="status" (Entregable 1)[cite: 5] */}
            {mensajeCodigo && (
                <div
                    role="status"
                    className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg font-semibold shadow-sm"
                >
                    ✅ {mensajeCodigo}
                </div>
            )}

            {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-center font-bold text-gray-800">
                        <span>Pedido #{pedido.id}</span>
                        <span
                            className={`text-xs px-2.5 py-1 rounded-full uppercase ${pedido.estado === "cancelado"
                                ? "bg-red-100 text-red-800"
                                : "bg-emerald-100 text-emerald-800"
                                }`}
                        >
                            {pedido.estado}
                        </span>
                    </div>

                    <p className="text-xs text-gray-500">
                        Fecha: {new Date(pedido.creado_en).toLocaleString('es-AR')}
                    </p>

                    <ul className="divide-y divide-gray-100 text-sm text-gray-600 pt-2">
                        {pedido.items.map((item) => (
                            <li key={item.producto_id} className="py-2 flex justify-between">
                                <span>Producto ID: {item.producto_id} (x{item.cantidad})</span>
                                <span className="font-medium text-gray-800">${item.precio_unitario} c/u</span>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                        <div>
                            {/* Botón «Arrepentirme» (solo aparece si pasaron <= 10 días y no está cancelado)[cite: 5] */}
                            {puedeRevocar(pedido) && (
                                <button
                                    disabled={enviando}
                                    onClick={() => handleRevocar(pedido.id)}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                                >
                                    {enviando ? "Procesando..." : "Arrepentirme de esta compra"}
                                </button>
                            )}
                        </div>

                        <span className="text-lg font-bold text-emerald-600">
                            Total: ${pedido.total}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}   