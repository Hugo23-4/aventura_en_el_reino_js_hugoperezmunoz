import { Producto } from '../classes/Producto.js';
import { tipos_de_producto, rareza } from '../helpers/constantes.js';
import { obtenerElementoAleatorio } from '../helpers/utils.js';

/**
 * Simula la base de datos de la tienda.
 * Aquí definimos el catálogo inicial que se carga al arrancar el juego.
 * @type {Producto[]}
 */
const inventarioInicial = [
    new Producto("Espada de Madera", "espada.png", 100, rareza.COMUN, tipos_de_producto.ARMA, 10),
    new Producto("Armadura de Cuero", "armadura.png", 150, rareza.COMUN, tipos_de_producto.ARMADURA, 15),
    new Producto("Manzana Roja", "manzana.png", 50, rareza.COMUN, tipos_de_producto.CONSUMIBLE, 20),
    new Producto("Hacha de Guerra", "hacha.png", 300, rareza.POCO_COMUN, tipos_de_producto.ARMA, 25),
    new Producto("Escudo de Hierro", "escudo.png", 250, rareza.POCO_COMUN, tipos_de_producto.ARMADURA, 25),
    new Producto("Poción Mayor", "pocion.png", 200, rareza.RARO, tipos_de_producto.CONSUMIBLE, 50)
];

/**
 * Getter para recuperar los datos originales.
 * Útil si queremos reiniciar la tienda a su estado por defecto.
 * @returns {Producto[]} Array con el catálogo inicial.
 */
export const obtenerProductosBase = () => {
    return inventarioInicial;
};

/**
 * Localiza un ítem específico dentro de un catálogo.
 * Funciona buscando el primer elemento que coincida (útil para búsquedas por ID o nombre único).
 * @param {string} nombre - El texto exacto a buscar.
 * @param {Producto[]} listaProductos - El array donde vamos a buscar.
 * @returns {Producto|undefined} El objeto si existe, o undefined si no lo encuentra.
 */
export const buscarProducto = (nombre, listaProductos) => {
    return listaProductos.find(producto => producto.nombre === nombre); //devuelve el primer elemento
};

/**
 * Genera una sub-lista solo con items de una categoría concreta.
 * Sirve para las pestañas de filtro de la tienda (ej: Ver solo "Raros").
 * @param {string} rareza - La etiqueta a filtrar (usa las constantes RAREZAS).
 * @param {Producto[]} listaProductos - El catálogo completo.
 * @returns {Producto[]} Un NUEVO array solo con los elementos que pasan el filtro.
 */
export const filtrarPorRareza = (rareza, listaProductos) => {
    return listaProductos.filter(producto => producto.rareza === rareza); //nuevo array solo con los que cumplen la condición
};

/**
 * Mecánica de "Oferta del Día" o evento aleatorio.
 * 1. Elige una rareza al azar.
 * 2. Recorre todo el inventario y aplica descuento SOLO a esa rareza.
 * 3. Devuelve una lista nueva (inmutabilidad) con los precios actualizados.
 * @param {Producto[]} listaProductos - El inventario actual de la tienda.
 * @returns {Producto[]} Una NUEVA lista de productos donde algunos tienen precio rebajado.
 */
export const aplicarDescuentoAleatorio = (listaProductos) => {
    const todasLasRarezas = Object.values(rareza); 
    const rarezaElegida = obtenerElementoAleatorio(todasLasRarezas);

    const porcentaje = 20;

    console.log(`Descuento en items: ${rarezaElegida}`);

    // .map() para crear la nueva lista, para recorrer todo y transforma los elementos
    return listaProductos.map(producto => {
        if (producto.rareza === rarezaElegida) {
            return producto.aplicarDescuento(porcentaje);
        } else {
            return producto;
        }
    });
};