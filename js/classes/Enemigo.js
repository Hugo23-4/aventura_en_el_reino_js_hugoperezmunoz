export class Enemigo {

    /**
     * clase base para cualquier enemigo del juego.
     * @param {string} nombre - nombre de la criatura.
     * @param {string} avatar - imagen .png.
     * @param {number} ataque - puntos de daño que hace.
     * @param {number} vida - puntos de salud iniciales.
     */
    constructor(nombre, avatar, ataque, vida) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.ataque = ataque;
        this.vida = vida;
    }
}