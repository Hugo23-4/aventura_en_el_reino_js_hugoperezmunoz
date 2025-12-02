export class Producto {

    /**
     * Inicializa el ítem con todas sus estadísticas.
     * @param {string} nombre - El nombre visible (ej: "Espada Maestra").
     * @param {string} imagen - Nombre del archivo de la foto.
     * @param {number} precio - Coste base en monedas.
     * @param {string} rareza - Nivel de exclusividad (Común, Raro...).
     * @param {string} tipo - Categoría para el inventario (Arma, Consumible...).
     * @param {number} bonus - Valor de efecto (daño, defensa o curación).
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
     * Devuelve el precio listo para mostrar en la interfaz (2 decimales + €).
     * @returns {string} Precio maquetado, tipo "12.50€".
     */
    obtenerPrecioFormateado() {
        // el número tiene siempre 2 decimales
        return this.precio.toFixed(2) + "€";
    }

    /**
     * Devuelve el texto del bonus para la tarjeta.
     * @returns {string} Texto descriptivo.
     */
    obtenerDescripcionBonus() {
        if (this.tipo === 'Arma') return `+${this.bonus} Ataque`;
        if (this.tipo === 'Armadura') return `+${this.bonus} Defensa`;
        if (this.tipo === 'Consumible') return `+${this.bonus} Vida`;
        return `+${this.bonus} Bonus`;
    }

    /**
     * Genera una versión rebajada de este producto.
     * @param {number} porcentaje - Cantidad a descontar (ej: 20 para un 20%).
     * @returns {Producto} Un clon del objeto actual pero más barato.
     */
    aplicarDescuento(porcentaje) {
        // nuevo precio
        const factor = 1 - (porcentaje / 100);
        const nuevoPrecio = this.precio * factor;

        // devolvemos un "new Producto"
        return new Producto(
            this.nombre,
            this.imagen,
            nuevoPrecio, 
            this.rareza,
            this.tipo,
            this.bonus
        );
    }
}