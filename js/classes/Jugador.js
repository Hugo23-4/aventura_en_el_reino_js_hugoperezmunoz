import { Producto } from './Producto.js';

export class Jugador {

    /**
     * Configura al personaje desde cero.
     * Empezamos con la vida al maximo (100) y el inventario vacío.
     * @param {string} nombre - El nick del usuario.
     * @param {string} avatar - Ruta a la imagen del personaje.
     */
    constructor(nombre, avatar) {
        this.nombre = nombre;
        this.avatar = avatar;
        
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
        let ataqueTotal = 0;

        for (const item of this.inventario) {
            if (item.tipo === 'Arma') {
                ataqueTotal += item.bonus;
            }
        }
        return ataqueTotal;
    }

    /**
     * Suma la protección que nos dan todas las armaduras que llevamos.
     * @returns {number} La defensa total.
     */
    obtenerDefensaTotal() {
        let defensaTotal = 0;

        for (const item of this.inventario) {
            if (item.tipo === 'Armadura') {
                defensaTotal += item.bonus;
            }
        }
        return defensaTotal;
    }

    /**
     * Calcula la salud máxima actual.
     * Es la vida base (100) más lo que sumen los consumibles/items pasivos.
     * @returns {number} Vida total calculada.
     */
    obtenerVidaTotal() {
        let vidaTotal = this.vida; // Empezamos con la vida base (100)

        for (const item of this.inventario) {
            if (item.tipo === 'Consumible') {
                vidaTotal += item.bonus;
            }
        }
        return vidaTotal;
    }

    /**
     * Actualiza el marcador tras una victoria o evento.
     * @param {number} puntosGanados - Cuántos puntos sumamos.
     */
    sumarPuntos(puntosGanados) {
        this.puntos += puntosGanados;
    }
}