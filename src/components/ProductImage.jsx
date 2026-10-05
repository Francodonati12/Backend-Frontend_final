import { useState } from 'react';

export default function ProductImage({
  src,
  alt = 'Producto',
  className = '',
  aspectRatio = 'aspect-[16/10]',
  allowZoom = true,
}) {
  const [cargado, setCargado] = useState(false);
  const [errorCarga, setErrorCarga] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const fallbackUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
  const imagenUrl = errorCarga || !src ? fallbackUrl : src;

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-xl bg-neutral-900/90 border border-neutral-800/80 transition-all duration-300 group-hover:border-orange-500/40 group-hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] ${aspectRatio} ${className}`}
      >
        {/* Skeleton placeholder mientras carga */}
        {!cargado && !errorCarga && (
          <div className="absolute inset-0 bg-neutral-900 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Imagen principal */}
        <img
          src={imagenUrl}
          alt={alt}
          loading="lazy"
          onLoad={() => setCargado(true)}
          onError={() => {
            setErrorCarga(true);
            setCargado(true);
          }}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            cargado ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradiente sutil para profundidad visual */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />

        {/* Botón de ampliar en hover */}
        {allowZoom && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setModalAbierto(true);
            }}
            title="Ver imagen en tamaño completo"
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 hover:bg-orange-500 text-white hover:text-black p-1.5 rounded-lg backdrop-blur-md text-xs cursor-pointer shadow-md"
          >
            🔍
          </button>
        )}
      </div>

      {/* Modal Lightbox para visualización de imagen */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setModalAbierto(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-neutral-900 border border-orange-500/30 rounded-2xl p-3 shadow-[0_0_40px_rgba(255,107,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
              <span className="text-sm font-semibold text-orange-400">{alt}</span>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-neutral-400 hover:text-white px-2 py-1 rounded-md text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <img
              src={imagenUrl}
              alt={alt}
              className="w-full max-h-[70vh] object-contain rounded-xl bg-black/50"
            />
          </div>
        </div>
      )}
    </>
  );
}
