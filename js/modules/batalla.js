/**
 * Motor principal del juego: Gestiona la pelea automática turno a turno.
 * Calcula el daño, la defensa y decide quién gana y cuántos puntos se lleva el jugador.
 * * @param {Object} jugador - El personaje del usuario con su equipamiento actual.
 * @param {Object} enemigo - El rival (puede ser un Enemigo normal o un Jefe).
 * @returns {Object} Resumen completo de la batalla para pintarlo luego en el HTML.
 */
export const combatir = (jugador, enemigo) => {
    
    // let para no modificar al personaje real
    let vidaJugador = jugador.obtenerVidaTotal();
    const defensaJugador = jugador.obtenerDefensaTotal();
    const ataqueJugador = jugador.obtenerAtaqueTotal();
    
    let vidaEnemigo = enemigo.vida;
    const ataqueEnemigo = enemigo.ataque;

    const historialLog = []; 
    let turno = 1;

    while (vidaJugador > 0 && vidaEnemigo > 0) {
        
        vidaEnemigo = vidaEnemigo - ataqueJugador;
        
        // golpe
        historialLog.push({
            turno: turno,
            atacante: jugador.nombre,
            atacado: enemigo.nombre,
            dano: ataqueJugador,
            vidaRestante: Math.max(0, vidaEnemigo) // evitamod que se muestre vida negativa
        });

        if (vidaEnemigo <= 0) break;

        // daño recibido
        const nuevaVidaCalculada = (vidaJugador + defensaJugador) - ataqueEnemigo;
        
        // actualizar vida
        vidaJugador = Math.min(vidaJugador, nuevaVidaCalculada);

        historialLog.push({
            turno: turno,
            atacante: enemigo.nombre,
            atacado: jugador.nombre,
            dano: Math.max(0, ataqueEnemigo - defensaJugador), // daño real recibido
            vidaRestante: Math.max(0, vidaJugador)
        });

        turno++;

        // SEGURIDAD: Evitar bucles infinitos si la defensa es muy alta
        if (turno > 100) break;
    }

    // ganador y recompensas
    let puntosObtenidos = 0;
    let ganadorNombre = '';

    if (vidaJugador > 0) {
        ganadorNombre = jugador.nombre;
        
        puntosObtenidos = 100 + enemigo.ataque;

        // comprobar si el objeto tiene multiplicador (así sabemos si es Jefe sin importar la clase)
        if (enemigo.multiplicador) {
            puntosObtenidos = puntosObtenidos * enemigo.multiplicador;
            
            puntosObtenidos = Math.floor(puntosObtenidos);
        }

    } else {
        ganadorNombre = enemigo.nombre;
        puntosObtenidos = 0;
    }

    return {
        ganador: ganadorNombre,
        jugadorGana: vidaJugador > 0,
        puntos: puntosObtenidos,
        log: historialLog 
    };
};