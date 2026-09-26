import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMisDatos, eliminarMiCuenta } from "../services/api";
import { useCarrito } from "../context/CarritoContext";

export default function MisDatos() {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [confirmacion, setConfirmacion] = useState("");
    const [eliminando, setEliminando] = useState(false);

    const { vaciar } = useCarrito();
    const navigate = useNavigate();

    useEffect(() => {
        getMisDatos()
            .then((res) => setDatos(res))
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    }, []);

    // Descarga los datos en formato JSON[cite: 6]
    const handleExportar = () => {
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
        if (confirmacion !== "ELIMINAR") return; // Palabra clave exigida[cite: 6]
        setEliminando(true);

        try {
            await eliminarMiCuenta();
            if (vaciar) vaciar(); // Vacía el carrito[cite: 6]
            localStorage.removeItem("access_token"); // Cierra sesión[cite: 6]
            alert("Tu cuenta ha sido dada de baja y tus datos han sido anonimizados.");
            navigate("/"); // Redirige a la portada[cite: 6]
        } catch (err) {
            alert(err.message);
            setEliminando(false);
        }
    };

    if (cargando) return <p className="text-center py-12 text-gray-600 font-medium">Cargando información personal... ⏳</p>;
    if (error) return <p className="text-center py-12 text-red-600 font-medium">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Mis Datos Personales</h2>

            {/* Visualización de datos personales y Fecha de consentimiento para la CAPTURA 2[cite: 6] */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-2 text-sm text-gray-700">
                <p><strong>ID Usuario:</strong> {datos.usuario.id}</p>
                <p><strong>Nombre:</strong> {datos.usuario.nombre}</p>
                <p><strong>Email:</strong> {datos.usuario.email}</p>
                <p><strong>Fecha de consentimiento / registro:</strong> {new Date(datos.usuario.creado_en).toLocaleString('es-AR')}</p>
            </div>

            <button
                onClick={handleExportar}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
            >
                📥 Descargar mis datos (.JSON)
            </button>

            {/* Proceso de baja de cuenta[cite: 6] */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-5 space-y-3">
                <h3 className="text-lg font-bold text-red-700">Eliminar mi cuenta</h3>
                <p className="text-xs text-red-600 leading-relaxed">
                    Al confirmar la baja, tus datos personales (nombre, email, contraseña) se <strong>anonimizarán permanentemente</strong>. Tus pedidos anteriores se conservarán por normativas contables pero de forma anonimizada[cite: 6].
                </p>

                <p className="text-xs text-gray-700 font-medium">Escribí la palabra <strong>ELIMINAR</strong> para confirmar[cite: 6]:</p>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={confirmacion}
                        onChange={(e) => setConfirmacion(e.target.value)}
                        placeholder="ELIMINAR"
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-red-500"
                    />

                    <button
                        disabled={confirmacion !== "ELIMINAR" || eliminando}
                        onClick={handleEliminarCuenta}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {eliminando ? "Procesando..." : "Confirmar eliminación"}
                    </button>
                </div>
            </div>
        </div>
    );
}