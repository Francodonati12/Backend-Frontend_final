const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const INITIAL_PRODUCTOS = [
  { id: 1, nombre: 'Sticker 1', precio_final: 100, cuotas_cantidad: 2, cuotas_valor: 50, garantia_meses: 1, stock: 5 },
  { id: 2, nombre: 'Sticker 2', precio_final: 100, cuotas_cantidad: 2, cuotas_valor: 50, garantia_meses: 1, stock: 15 },
  { id: 3, nombre: 'Sticker 3', precio_final: 100, cuotas_cantidad: 2, cuotas_valor: 50, garantia_meses: 1, stock: 40 },
  { id: 4, nombre: 'Sticker 4', precio_final: 100, cuotas_cantidad: 2, cuotas_valor: 50, garantia_meses: 1, stock: 10 },
];

export async function getProductos({ page = 0, limit = 2, nombre = "" } = {}) {
  try {
    const skip = page * limit;
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    if (nombre.trim() !== "") {
      params.append("nombre", nombre);
    }

    const response = await fetch(`${BASE_URL}/productos/?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend no alcanzable, retornando datos por defecto:', error);
    return INITIAL_PRODUCTOS;
  }
}

function authHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function crearPedido(itemsCarrito) {
  const payload = {
    items: itemsCarrito.map((item) => ({
      producto_id: item.id,
      cantidad: item.cantidad,
    })),
  };

  const res = await fetch(`${BASE_URL}/pedidos/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Tu sesión venció. Por favor, volvé a iniciar sesión.");
    }
    if (res.status === 409) {
      const data = await res.json();
      throw new Error(data.detail || "Conflicto de stock.");
    }
    throw new Error("Ocurrió un error al procesar la compra.");
  }

  return await res.json();
}

export async function getMisPedidos() {
  const res = await fetch(`${BASE_URL}/pedidos/mios`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Tu sesión venció. Volvé a iniciar sesión.");
    }
    throw new Error("Error al cargar el historial de compras.");
  }

  return await res.json();
}

// ==========================================
// NUEVAS FUNCIONES PARA LA CLASE 9
// ==========================================

// Parte 2: Revocar pedido (botón de arrepentimiento)
export async function revocarPedido(pedidoId) {
  const res = await fetch(`${BASE_URL}/pedidos/${pedidoId}/revocacion`, {
    method: "POST",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 409) {
      throw new Error(data.detail || "No se puede revocar este pedido.");
    }
    if (res.status === 404) {
      throw new Error("El pedido no existe o no te pertenece.");
    }
    throw new Error("Error al solicitar la revocación.");
  }

  return data; // Devuelve el objeto con el 'codigo'
}

// Parte 3: Obtener todos los datos del usuario
export async function getMisDatos() {
  const res = await fetch(`${BASE_URL}/usuarios/me/datos`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Tu sesión venció. Volvé a iniciar sesión.");
    }
    throw new Error("Error al obtener la información personal.");
  }

  return await res.json();
}

// Parte 4: Eliminar/Anonimizar cuenta
export async function eliminarMiCuenta() {
  const res = await fetch(`${BASE_URL}/usuarios/me`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Tu sesión venció. Volvé a iniciar sesión.");
    }
    throw new Error("No se pudo procesar la baja de la cuenta.");
  }

  return await res.json();
}