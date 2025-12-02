import { Enemigo } from './Enemigo.js';

export class Jefe extends Enemigo {

    /**
     * Inicializa al Boss reutilizando la construcción del enemigo normal.
     * @param {string} nombre - El nombre del jefe (ej: "Dragón Anciano").
     * @param {string} avatar - Ruta de la imagen.
     * @param {number} ataque - Daño base (suele ser más alto que el normal).
     * @param {number} vida - Salud total.
     * @param {number} multiplicador - Factor de recompensa. Por defecto 1.38 (da un 38% más de puntos).
     */
    constructor(nombre, avatar, ataque, vida, multiplicador = 1.38) {
        super(nombre, avatar, ataque, vida); // extends de Enemigo

        this.multiplicador = multiplicador;
    }
}