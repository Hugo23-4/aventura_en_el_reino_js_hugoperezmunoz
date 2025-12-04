/**
 * Funciones que se pueden reusar en cualquier parte del proyecto.
 */

/**
 * Devuelve un número entero aleatorio entre un mínimo y un máximo (ambos incluidos).
 * @param {number} min - Valor mínimo.
 * @param {number} max - Valor máximo.
 * @returns {number} Número aleatorio.
 */
export const obtenerNumeroAleatorio = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Devuelve un elemento aleatorio de un array.
 * @param {Array} array - El array del que queremos sacar algo.
 * @returns {*} Un elemento del array.
 */
export const obtenerElementoAleatorio = (array) => {
    if (!array || array.length === 0) return null;
    const indice = Math.floor(Math.random() * array.length);
    return array[indice];
};

export const guardarRanking = (nombre, puntos, monedas) => {
    let ranking = JSON.parse(localStorage.getItem('ranking_aventura')) || [];
    
    ranking.push({
        nombre: nombre,
        puntos: puntos,
        monedas: monedas,
        fecha: new Date().toLocaleString()
    });

    localStorage.setItem('ranking_aventura', JSON.stringify(ranking));
};