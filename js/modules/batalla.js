/**
 * simula el combate turno a turno entre jugador y enemigo.
 * @param {Jugador} jugador 
 * @param {Enemigo} enemigo 
 * @returns {Object} resultado con el log, si gana el jugador y los puntos.
 */
export const combatir = (jugador, enemigo) => {
    // clonamos las vidas para no modificar las reales
    let vidaJugador = jugador.obtenerVidaTotal();
    let vidaEnemigo = enemigo.vida;
    
    // stats totales
    const ataqueJugador = jugador.obtenerAtaqueTotal();
    const defensaJugador = jugador.obtenerDefensaTotal();
    
    const logCombate = [];
    let turno = 1;

    // bucle de combate
    while (vidaJugador > 0 && vidaEnemigo > 0) {
        
        // turno jugador
        // calculo daño simple: ataque - defensa (mínimo 1 de daño siempre)
        // los enemigos no tienen defensa definida, asumimos 0 o un valor base
        const danoAlEnemigo = Math.max(1, ataqueJugador); 
        vidaEnemigo -= danoAlEnemigo;
        if (vidaEnemigo < 0) vidaEnemigo = 0;

        logCombate.push({
            turno: turno,
            atacante: jugador.nombre,
            atacado: enemigo.nombre,
            dano: danoAlEnemigo,
            vidaRestante: vidaEnemigo
        });

        if (vidaEnemigo <= 0) break; // si muere, no ataca

        // turno enemigo
        // la defensa del jugador reduce el ataque del enemigo
        const danoAlJugador = Math.max(1, enemigo.ataque - (defensaJugador * 0.5)); // la defensa mitiga el 50%
        vidaJugador -= Math.floor(danoAlJugador);
        if (vidaJugador < 0) vidaJugador = 0;

        logCombate.push({
            turno: turno,
            atacante: enemigo.nombre,
            atacado: jugador.nombre,
            dano: Math.floor(danoAlJugador),
            vidaRestante: vidaJugador
        });
        
        turno++;
    }

    // determinamos resultado
    const jugadorGana = vidaJugador > 0;
    
    // calculo puntos: (vida restante + daño realizado) * bonificador enemigo
    // si es jefe da mas puntos (tiene multiplicador 1.5, los normales 1)
    // si no tiene multiplicador definido usamos 1 por defecto
    const multi = enemigo.multiplicador || 1;
    const puntosObtenidos = jugadorGana ? Math.floor((vidaJugador + ataqueJugador) * 10 * multi) : 0;

    // aplicamos daño real al jugador si sobrevive (opcional, segun dificultad)
    // vamos a actualizar la vida del jugador al final del combate
    if (jugadorGana) {
        jugador.vida = vidaJugador;
    } else {
        jugador.vida = 0;
    }

    return {
        log: logCombate,
        jugadorGana: jugadorGana,
        puntos: puntosObtenidos
    };
};