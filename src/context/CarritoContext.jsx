import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const guardado = localStorage.getItem("carrito");
            return guardado ? JSON.parse(guardado) : [];
        } catch (error) {
            console.error("Error al leer localStorage:", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(items));
    }, [items]);

    const agregar = (producto, cantidad = 1) => {
        setItems((prevItems) => {
            const existe = prevItems.find((i) => i.id === producto.id);
            if (existe) {
                return prevItems.map((i) =>
                    i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
                );
            }
            return [...prevItems, { ...producto, cantidad }];
        });
    };

    const quitar = (producto_id) => {
        setItems((prevItems) => prevItems.filter((i) => i.id !== producto_id));
    };

    const vaciar = () => {
        setItems([]);
    };

    const total = items.reduce(
        (acc, item) => acc + (item.precio_final || item.precio || 0) * item.cantidad,
        0
    );

    return (
        <CarritoContext.Provider value={{ items, agregar, quitar, vaciar, total }}>
            {children}
        </CarritoContext.Provider>
    );
}

export const useCarrito = () => useContext(CarritoContext);