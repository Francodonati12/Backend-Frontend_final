import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Arrepentimiento() {
  const { user } = useAuth();
  const token = localStorage.getItem("access_token");

  return (
    <div className="max-w-2xl mx-auto my-6 bg-[#13141f] border border-[#232538] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
          Marco Regulatorio Nacional
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Derecho de Arrepentimiento
        </h1>
        <p className="text-xs text-neutral-400">
          Resolución N° 954/2025 y Ley Nacional de Defensa del Consumidor N° 24.240
        </p>
      </div>

      <div className="bg-[#0b0c10] border border-[#232538] rounded-2xl p-5 space-y-3 text-sm text-neutral-300">
        <p className="leading-relaxed">
          Tienes derecho a revocar la aceptación del producto o servicio adquirido dentro del plazo de{" "}
          <strong className="text-orange-400">10 (diez) días corridos</strong> contados a partir de la fecha en que se entregue el bien o se celebre el contrato.
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-400 pt-2">
          <li>El trámite es completamente gratuito para el consumidor.</li>
          <li>No necesitas fundamentar ni justificar la causa de la revocación.</li>
          <li>Los costos de flete o devolución corren por cuenta exclusiva del vendedor.</li>
        </ul>
      </div>

      {token || user ? (
        <div className="pt-2 space-y-3">
          <p className="text-xs text-neutral-400">
            Para ejercer este derecho sobre alguna de tus compras vigentes:
          </p>
          <Link
            to="/mis-pedidos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/25"
          >
            <span>Ir a Mis Compras para Revocar 📦</span>
          </Link>
        </div>
      ) : (
        <div className="pt-2 space-y-3">
          <p className="text-xs text-neutral-400">
            Para identificar tu compra y gestionar la solicitud de arrepentimiento, por favor inicia sesión:
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-orange-400 hover:text-white border border-neutral-700 font-bold text-sm rounded-xl transition-all"
          >
            <span>Iniciar Sesión en mi Cuenta</span>
          </Link>
        </div>
      )}
    </div>
  );
}