import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CarritoProvider, useCarrito } from './context/CarritoContext';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import MisPedidos from './pages/MisPedidos';
import Arrepentimiento from './pages/Arrepentimiento';
import MisDatos from './pages/MisDatos';
import Footer from './components/Pie';

function Navbar() {
  const { items } = useCarrito();
  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-emerald-600 hover:text-emerald-700">
          Mi Tienda 🛍️
        </Link>
        <div className="flex items-center gap-6 font-medium text-gray-600">
          <Link to="/" className="hover:text-emerald-600 transition-colors">
            Catálogo
          </Link>
          <Link to="/carrito" className="hover:text-emerald-600 transition-colors flex items-center gap-1.5">
            Carrito 🛒
            {cantidadTotal > 0 && (
              <span className="bg-emerald-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cantidadTotal}
              </span>
            )}
          </Link>
          <Link to="/mis-pedidos" className="hover:text-emerald-600 transition-colors">
            Mis Compras 📦
          </Link>
          <Link to="/mis-datos" className="hover:text-emerald-600 transition-colors">
            Mis Datos 👤
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col justify-between">
          <div>
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 pb-12">
              <Routes>
                <Route path="/" element={<Catalogo />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/mis-pedidos" element={<MisPedidos />} />
                {/* Nuevas rutas requeridas por norma */}
                <Route path="/arrepentimiento" element={<Arrepentimiento />} />
                <Route path="/mis-datos" element={<MisDatos />} />
              </Routes>
            </main>
          </div>
          {/* El Footer se muestra en todas las páginas */}
          <Footer />
        </div>
      </BrowserRouter>
    </CarritoProvider>
  );
}

export default App;