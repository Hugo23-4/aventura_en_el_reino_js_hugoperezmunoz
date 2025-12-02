/**
 * Determina si el jugador es un experto o acaba de empezar.
 * Utiliza un "parámetro por defecto" para el umbral: si no especificamos nada, asume 800.
 * @param {number} puntuacion - Los puntos totales que ha conseguido el usuario.
 * @param {number} [umbral=800] - La nota de corte para ser Veterano. Por defecto es 800.
 * @returns {string} La etiqueta de rango ("Veterano" o "Novato").
 */
export const distinguirJugador = (puntuacion, umbral = 800) => {
    if (puntuacion >= umbral) {
        return "Veterano";
    } else {
        return "Novato";
    }
};