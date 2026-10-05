import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Pie';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import MisPedidos from './pages/MisPedidos';
import Arrepentimiento from './pages/Arrepentimiento';
import MisDatos from './pages/MisDatos';
import Login from './pages/Login';
import AdminPortal from './pages/AdminPortal';

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] flex flex-col justify-between selection:bg-orange-500 selection:text-black">
            <div>
              {/* Barra de navegación con tema oscuro, acentos naranja y accesos por rol */}
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Routes>
                  {/* Catálogo de productos con imágenes dinámicas */}
                  <Route path="/" element={<Catalogo />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/mis-pedidos" element={<MisPedidos />} />
                  <Route path="/arrepentimiento" element={<Arrepentimiento />} />
                  <Route path="/mis-datos" element={<MisDatos />} />

                  {/* Apartado 1: Registro y Login de Usuario estándar */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/registro" element={<Login />} />

                  {/* Apartado 2: Acceso Exclusivo y Panel de Administrador */}
                  <Route path="/admin" element={<AdminPortal />} />
                  <Route path="/admin-login" element={<AdminPortal />} />
                </Routes>
              </main>
            </div>
            {/* Pie de página en tema oscuro con enlace al botón de arrepentimiento */}
            <Footer />
          </div>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;