import { Producto } from '../classes/Producto.js';

/**
 * genera la lista inicial de productos disponibles.
 * precios ajustados para no superar los 500 de oro iniciales.
 * @returns {Producto[]} array de objetos producto
 */
export const obtenerProductosBase = () => {
    return [
        // armas
        new Producto("Espada", "espada.png", 150, "Común", "Arma", 10),
        new Producto("Hacha", "hacha.png", 200, "Raro", "Arma", 15),
        
        // armaduras
        new Producto("Escudo", "escudo.png", 100, "Común", "Armadura", 10),
        new Producto("Armadura", "armadura.png", 250, "Épico", "Armadura", 20),
        
        // consumibles
        new Producto("Poción", "pocion.png", 50, "Común", "Consumible", 20),
        new Producto("Manzana", "manzana.png", 25, "Común", "Consumible", 10)
    ];
};

/**
 * aplica ofertas aleatorias a los precios.
 * modificamos el precio original con un pequeño descuento o aumento.
 * @param {Producto[]} productos - lista base
 * @returns {Producto[]} lista con precios actualizados
 */
export const aplicarDescuentoAleatorio = (productos) => {
    return productos.map(p => {
        // factor aleatorio entre 0.8 (20% descuento) y 1.1 (10% recarga)
        const factor = 0.8 + Math.random() * 0.3; 
        
        // calculamos nuevo precio y redondeamos
        let nuevoPrecio = Math.floor(p.precio * factor);
        
        // regla de negocio: el precio nunca puede ser mayor a 500 (dinero inicial)
        if (nuevoPrecio > 500) nuevoPrecio = 500;
        
        // creamos una copia con el nuevo precio para no interferir en el original
        return new Producto(p.nombre, p.imagen, nuevoPrecio, p.rareza, p.tipo, p.bonus);
    });
};