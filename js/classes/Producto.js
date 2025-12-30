export class Producto {

    /**
     * clase que representa un objeto de la tienda.
     * @param {string} nombre - nombre del item.
     * @param {string} imagen - nombre del archivo png.
     * @param {number} precio - coste en monedas.
     * @param {string} rareza - común, raro, épico...
     * @param {string} tipo - arma, armadura o consumible.
     * @param {number} bonus - puntos que suma a la estadística.
     */
    constructor(nombre, imagen, precio, rareza, tipo, bonus) {
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
    }

    /**
     * metodo para obtener el precio con el texto 'monedas'.
     * @returns {string} precio formateado.
     */
    obtenerPrecioFormateado() {
        return `${this.precio} monedas`;
    }

    /**
     * devuelve una descripción corta de lo que hace el objeto.
     * ejemplo: "+10 Ataque"
     * @returns {string} texto descriptivo.
     */
    obtenerDescripcionBonus() {
        if (this.tipo === 'Arma') {
            return `+${this.bonus} Ataque`;
        } else if (this.tipo === 'Armadura') {
            return `+${this.bonus} Defensa`;
        } else {
            return `+${this.bonus} Vida`;
        }
    }
}