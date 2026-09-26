import { Link } from "react-router-dom";

export default function Arrepentimiento() {
    const token = localStorage.getItem("access_token");

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Derecho de Arrepentimiento</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
                De acuerdo con la Disposición 954/2025 y la Ley 24.240, tenés derecho a revocar tu compra dentro de los <strong className="text-gray-800">10 días corridos</strong> contados desde la recepción del producto o confirmación de la compra[cite: 6].
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>El trámite es completamente gratuito[cite: 6].</li>
                <li>No necesitás justificar el motivo[cite: 6].</li>
                <li>Los gastos de devolución corren por cuenta del vendedor[cite: 6].</li>
            </ul>

            {token ? (
                <div className="pt-4">
                    <p className="text-sm text-gray-600 mb-3">Para ejercer este derecho sobre uno de tus pedidos:</p>
                    <Link
                        to="/mis-pedidos"
                        className="inline-block bg-emerald-600 text-white font-medium text-sm px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                    >
                        Ir a mis pedidos para arrepentirme
                    </Link>
                </div>
            ) : (
                <div className="pt-4">
                    <p className="text-sm text-gray-600 mb-3">Para identificar tu compra, por favor iniciá sesión[cite: 6]:</p>
                    <Link
                        to="/login"
                        className="inline-block bg-gray-600 text-white font-medium text-sm px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            )}
        </div>
    );
}