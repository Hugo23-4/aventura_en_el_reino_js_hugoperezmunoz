export class Enemigo {

    /**
     * Configura los stats iniciales del monstruo.
     * @param {string} nombre - El nombre que sale en pantalla (ej: "Goblin").
     * @param {string} avatar - La foto para la carta o la batalla.
     * @param {number} ataque - Cuánto daño nos hace por turno.
     * @param {number} vida - La salud que tiene que llegar a 0 para ganar.
     */
    constructor(nombre, avatar, ataque, vida) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.ataque = ataque;
        this.vida = vida;
    }
}