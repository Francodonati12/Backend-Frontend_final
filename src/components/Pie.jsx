import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-[#232538] bg-[#0d0e15] text-center">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-black text-lg">⚡ NEXUS STORE</span>
          <span className="text-xs text-neutral-500">• © 2026 Todos los derechos reservados.</span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <Link
            to="/arrepentimiento"
            className="text-orange-400 hover:text-orange-300 font-bold hover:underline transition-colors flex items-center gap-1.5"
          >
            <span>⚖️</span>
            <span>Botón de arrepentimiento (Ley 24.240)</span>
          </Link>
          <Link
            to="/mis-datos"
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Protección de Datos
          </Link>
        </div>
      </div>
    </footer>
  );
}