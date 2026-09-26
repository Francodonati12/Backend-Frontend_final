import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="mt-12 py-6 border-t border-gray-200 text-center bg-white">
            <p className="text-sm text-gray-500 mb-2">© 2026 Mi Tienda. Todos los derechos reservados.</p>
            <Link to="/arrepentimiento" className="text-xs text-red-600 font-semibold hover:underline">
                Botón de arrepentimiento
            </Link>
        </footer>
    );
}