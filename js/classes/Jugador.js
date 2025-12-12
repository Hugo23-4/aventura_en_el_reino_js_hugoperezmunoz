import { Producto } from './Producto.js';

export class Jugador {

    /**
     * Configura al personaje desde cero.
     * @param {string} nombre - El nick del usuario.
     * @param {string} avatar - Ruta a la imagen del personaje.
     * * @param {number} ataqueExtra - Puntos extra de ataque.
     * @param {number} defensaExtra - Puntos extra de defensa.
     * @param {number} vidaExtra - Puntos extra de vida (base 100).
     */
    constructor(nombre, avatar, ataqueExtra = 0, defensaExtra = 0, vidaExtra = 100) {
        this.nombre = nombre;
        this.avatar = avatar;

        // añadido
        this.ataqueBase = ataqueExtra;
        this.defensaBase = defensaExtra;
        this.vidaBase = vidaExtra;
        
        this.vida = 100; 
        this.puntos = 0;
        
        this.inventario = []; 
    }

    /**
     * Mete un objeto en la mochila.
     * Importante: Guardamos una copia (clon) para que el objeto sea independiente de la tienda.
     * @param {Producto} productoOriginal - El ítem que queremos guardar.
     */
    agregarAlInventario(productoOriginal) {
        // Tenemos que crear un nuevo producto, por q si lo cambaimos de la tienda cambiara
        // en la mochila, y de esta manera haciendo un new producto, no cambiara
        const nuevoObjeto = new Producto(
            productoOriginal.nombre,
            productoOriginal.imagen,
            productoOriginal.precio,
            productoOriginal.rareza,
            productoOriginal.tipo,
            productoOriginal.bonus
        );

        this.inventario.push(nuevoObjeto);
    }

    /**
     * Calcula cuánto daño hacemos sumando los bonus de todas las armas del inventario.
     * @returns {number} El ataque total acumulado.
     */
    obtenerAtaqueTotal() {
        let total = let.ataqueBase;

        this.inventario.forEach(item => {
            if (item.tipo === 'Arma') total += item.bonus;
        });
        return total;
    }

    /**
     * Suma la protección que nos dan todas las armaduras que llevamos.
     * @returns {number} La defensa total.
     */
    obtenerDefensaTotal() {
        let total = this.defensaBase;

        this.inventario.forEach(item => {
            if (item.tipo === 'Armadura') total += item.bonus;
        });
        return total;
    }

    /**
     * Calcula la salud máxima actual.
     * Es la vida base (100) más lo que sumen los consumibles/items pasivos.
     * @returns {number} Vida total calculada.
     */
    obtenerVidaTotal() {
        let total = this.vidaBase;

        this.inventario.forEach(item => {
            if (item.tipo === 'Consumible') total += item.bonus; // Nota: Si son consumibles de un solo uso, esto cambiaría, pero para stats totales sirve.
        });
        return total;
    }

    /**
     * Actualiza el marcador tras una victoria o evento.
     * @param {number} puntosGanados - Cuántos puntos sumamos.
     */
    sumarPuntos(puntosGanados) {
        this.puntos += puntosGanados;
    }
}