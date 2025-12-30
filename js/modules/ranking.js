/**
 * determina el rango del jugador segun su puntuacion final.
 * @param {number} puntosTotales - suma de puntos combate + dinero.
 * @param {number} umbral - valor para considerar si es bueno (ej: 500).
 * @returns {string} el nombre del rango.
 */
export const distinguirJugador = (puntosTotales, umbral = 500) => {
    if (puntosTotales >= umbral * 2) {
        return "LEYENDA (Sesto Elemento)";
    } else if (puntosTotales >= umbral) {
        return "VETERANO";
    } else if (puntosTotales > 0) {
        return "NOVATO";
    } else {
        return "ELIMINADO";
    }
};