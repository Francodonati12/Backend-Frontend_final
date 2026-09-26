import React from 'react';
import { useCarrito } from '../context/CarritoContext';

export function ProductCard({
  producto,
  nombre,
  precio_final,
  cuotas_cantidad,
  cuotas_valor,
  garantia_meses,
  stock,
}) {
  const { agregar } = useCarrito();

  const p = producto || {};

  const name = nombre ?? p.nombre ?? '';
  const precioFinal = precio_final ?? p.precio_final ?? 0;
  const cuotasCantidad = cuotas_cantidad ?? p.cuotas_cantidad;
  const cuotasValor = cuotas_valor ?? p.cuotas_valor;
  const garantiaMeses = garantia_meses ?? p.garantia_meses;
  const stockUnidades = stock ?? p.stock;
  const imagen = p.imagen || p.image || p.foto;

  const productoParaCarrito = producto || {
    id: p.id,
    nombre: name,
    precio_final: precioFinal,
    stock: stockUnidades,
  };

  return (
    <div className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
      <div>
        {imagen && (
          <img
            src={imagen}
            alt={name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <h2 className="text-xl font-bold text-gray-800 mb-3">{name}</h2>
        <div className="text-2xl font-extrabold text-emerald-600 mb-3">
          ${typeof precioFinal === 'number' ? precioFinal.toLocaleString('es-AR') : precioFinal}
        </div>
      </div>

      <div>
        <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm text-gray-600">
          {cuotasCantidad != null && cuotasValor != null && (
            <p className="text-gray-700">
              <span className="font-semibold">{cuotasCantidad}</span> cuotas de{' '}
              <span className="font-semibold">
                ${typeof cuotasValor === 'number' ? cuotasValor.toLocaleString('es-AR') : cuotasValor}
              </span>
            </p>
          )}
          {garantiaMeses != null && (
            <p className="text-gray-500">
              Garantía: <span className="font-medium text-gray-700">{garantiaMeses} meses</span>
            </p>
          )}
          {stockUnidades != null && (
            <p className="text-gray-500">
              Stock disponible: <span className="font-medium text-gray-700">{stockUnidades} u.</span>
            </p>
          )}
        </div>

        <button
          onClick={() => agregar(productoParaCarrito, 1)}
          className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          Agregar al carrito 🛒
        </button>
      </div>
    </div>
  );
}

export default ProductCard;