import { Enemigo } from './Enemigo.js';

export class Jefe extends Enemigo {

    /**
     * clase para el boss final, hereda de enemigo.
     * @param {string} nombre 
     * @param {string} avatar 
     * @param {number} ataque 
     * @param {number} vida 
     * @param {number} multiplicador - factor extra de puntos/dinero al ganar.
     */
    constructor(nombre, avatar, ataque, vida, multiplicador) {
        super(nombre, avatar, ataque, vida);
        this.multiplicador = multiplicador;
    }
}