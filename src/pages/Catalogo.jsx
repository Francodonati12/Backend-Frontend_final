import { useState, useEffect } from 'react';
import { getProductos, INITIAL_PRODUCTOS } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Catalogo() {
  const [productos, setProductos] = useState(INITIAL_PRODUCTOS);
  const [page, setPage] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const limit = 2;

  useEffect(() => {
    getProductos({ page, limit, nombre: busqueda })
      .then((data) => {
        if (data) setProductos(data);
      })
      .catch((error) => console.error('Error al cargar productos:', error));
  }, [page, busqueda]);

  const handleBusqueda = (e) => {
    setPage(0);
    setBusqueda(e.target.value);
  };

  const handleAnterior = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleSiguiente = () => {
    setPage(page + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>

      <div className="max-w-md">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={handleBusqueda}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos && productos.length > 0 ? (
          productos.map((producto, index) => (
            <ProductCard
              key={producto.id || producto._id || index}
              producto={producto}
              {...producto}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No se encontraron productos.</p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <button
          onClick={handleAnterior}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 font-medium cursor-pointer"
        >
          Anterior
        </button>
        <span className="text-sm font-semibold text-gray-600">
          Página {page + 1}
        </span>
        <button
          onClick={handleSiguiente}
          disabled={productos.length < limit}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50 hover:bg-emerald-700 font-medium cursor-pointer"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}