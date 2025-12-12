import { Jugador } from './classes/Jugador.js';
import { Enemigo } from './classes/Enemigo.js';
import { Jefe } from './classes/Jefe.js';
import { obtenerProductosBase, aplicarDescuentoAleatorio } from './modules/mercado.js';
import { combatir } from './modules/batalla.js';
import { distinguirJugador } from './modules/ranking.js';

console.log("Main.js cargado correctamente"); // para saber que funciona

let jugador;
let inventarioTienda = [];
let enemigos = [];
let indiceEnemigoActual = 0; 

// DOM

/**
 * Muestra una escena concreta y oculta las demás usando CSS.
 * @param {string} idEscena - El ID del elemento HTML que queremos mostrar.
 */
const mostrarEscena = (idEscena) => {
    // transición de entrada (Diseño)
    document.querySelectorAll('.escena').forEach(e => {
        e.classList.remove('activa');
        e.style.display = 'none';
    });
    
    const escena = document.getElementById(idEscena);
    if (escena) {
        // se muestra y despues se actva (Diseño)
        escena.style.display = 'block';
        setTimeout(() => escena.classList.add('activa'), 10);
    } else {
        console.error(`Error: No encuentro la escena con id "${idEscena}"`);
    }
};

/**
 * Actualiza la información visual del jugador (vida, daño...) y su inventario en el HTML.
 */
const actualizarStatsUI = () => {
    // Buscamos los elementos span donde van los números
    const contenedoresStats = document.querySelectorAll('.stats-jugador');
    
    contenedoresStats.forEach(contenedor => {
        contenedor.innerHTML = `
            <div class="stat-fila"><span class="label">VIDA</span> <span class="valor">${jugador.obtenerVidaTotal()}</span></div>
            <div class="stat-fila"><span class="label">ATAQUE</span> <span class="valor">${jugador.obtenerAtaqueTotal()}</span></div>
            <div class="stat-fila"><span class="label">DEFENSA</span> <span class="valor">${jugador.obtenerDefensaTotal()}</span></div>

            <div class="stat-fila"><span class="label">ORO</span> <span class="valor" style="color: gold;">${jugador.dinero}</span></div>

            <div class="stat-fila puntos"><span class="label">PUNTOS</span> <span class="valor">${jugador.puntos}</span></div>
        `;
    });
    
    // inventario
    const contenedoresCesta = document.querySelectorAll('.cesta-visual');
    contenedoresCesta.forEach(contenedor => {
        contenedor.innerHTML = ''; // limpiar
        
        if (jugador.inventario.length === 0) {
            // Opcional: Mensaje si está vacío
        } else {
            jugador.inventario.forEach(item => {
                const img = document.createElement('img');
                img.src = `assets/items/${item.imagen}`;
                img.alt = item.nombre;
                img.title = item.nombre;
                // animación de entrada (Diseño)
                img.className = 'item-icono bounce-in';
                contenedor.appendChild(img);
            });
        }
    });
};

// ESCENAS

/**
 * Validacion y comienzo
 */
const validarYEmpezar = () => {
    const nombre = document.getElementById('input-nombre-creacion').value;
    const atk = parseInt(document.getElementById('input-ataque').value);
    const def = parseInt(document.getElementById('input-defensa').value);
    const vid = parseInt(document.getElementById('input-vida').value);
    const errorMsg = document.getElementById('error-msg');

    // mayúscula, solo letras/espacios, max 20, no solo espacios.
    const regexNombre = /^[A-Z][a-zA-Z\s]{0,19}$/;
    if (!regexNombre.test(nombre) || nombre.trim().length === 0) {
        errorMsg.textContent = "Nombre inválido: Debe empezar por mayúscula, solo letras y máx 20 caracteres.";
        errorMsg.style.display = 'block';
        return;
    }

    // validación Stats
    // El input vida ya tiene min="100", así que restamos 100 para contar los puntos extra gastados
    const sumaTotal = atk + def + (vid - 100);
    if (sumaTotal > 10) {
        errorMsg.textContent = "Has gastado más de 10 puntos extra.";
        errorMsg.style.display = 'block';
        return;
    }
    
    if (vid < 100) {
         errorMsg.textContent = "La vida no puede ser menor de 100.";
         errorMsg.style.display = 'block';
         return;
    }

    // Ocultar error si todo va bien
    errorMsg.style.display = 'none';
    iniciarJuego(nombre, atk, def, vid);
};

// Escena 1: Inicialización (Modificada para recibir parámetros)
/**
 * Configura la partida: crea al jugador, la tienda y los enemigos al arrancar.
 */
const iniciarJuego = (nombre, atk, def, vid) => {
    // Usamos los datos del formulario
    jugador = new Jugador(nombre, "cazador.png", atk, def, vid);
    
    inventarioTienda = aplicarDescuentoAleatorio(obtenerProductosBase());
    
    enemigos = [
        new Enemigo("Goblin", "goblin.png", 8, 60),
        new Enemigo("Lobo", "lobo.png", 9, 80),
        new Enemigo("Bandidos", "bandido.png", 12, 90),
        new Jefe("Dragón", "dragon.png", 20, 150, 1.5)
    ];
    indiceEnemigoActual = 0;

    actualizarStatsUI(); // iniciales (0, 0, 100)
    mostrarEscena('escena-inicio');
};

// Escena 2: Renderizar el Mercado
/**
 * Pinta los productos en el HTML de la tienda y gestiona los clics de compra.
 */
const cargarMercado = () => {
    const contenedorTienda = document.getElementById('tienda-productos');
    contenedorTienda.innerHTML = ''; // limpiar

    // Verificación de seguridad
    if (!inventarioTienda || inventarioTienda.length === 0) {
        console.error("El inventario de la tienda está vacío. Revisa mercado.js");
        return;
    }

    inventarioTienda.forEach(producto => {
        // tarjeta
        const tarjeta = document.createElement('div');
        // glass-panel (Diseño)
        tarjeta.className = 'tarjeta-producto glass-panel';
        
        // cambiar estilo
        const yaComprado = jugador.inventario.some(p => p.nombre === producto.nombre);
        if (yaComprado) tarjeta.classList.add('comprado');

        tarjeta.innerHTML = `
            <img src="assets/items/${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <div class="tags">
                <span class="tag">${producto.tipo}</span>
                <span class="tag">${producto.rareza}</span>
            </div>
            <p class="bonus">${producto.obtenerDescripcionBonus()}</p>
            <p class="precio">${producto.obtenerPrecioFormateado()}</p>
            <button class="btn-accion">${yaComprado ? 'Retirar' : 'Añadir'}</button>
        `;

        //CLICK
        const boton = tarjeta.querySelector('.btn-accion');
        boton.addEventListener('click', () => {
            if (jugador.inventario.some(p => p.nombre === producto.nombre)) {
                // Retirar (filtro todos menos este)
                jugador.inventario = jugador.inventario.filter(p => p.nombre !== producto.nombre);
                // devolver dinero
                jugador.dinero += producto.precio;
                
                boton.textContent = 'Añadir';
                tarjeta.classList.remove('comprado');
            } else {
                // validar dinero
                if (jugador.dinero >= producto.precio) {
                    jugador.agregarAlInventario(producto);
                    
                    // restar precio
                    jugador.dinero -= producto.precio;

                    boton.textContent = 'Retirar';
                    tarjeta.classList.add('comprado');
                    
                    // Feedback visual "+1"
                    const feedback = document.createElement('div');
                    feedback.className = 'icono-feedback';
                    feedback.textContent = '+1';
                    tarjeta.appendChild(feedback);
                    setTimeout(() => feedback.remove(), 1000);
                } else {
                    alert("No tienes suficiente dinero."); // Feedback simple
                }
            }
            actualizarStatsUI();
        });

        contenedorTienda.appendChild(tarjeta);
    });

    mostrarEscena('escena-mercado');
};

// Escena 4: Renderizar lista de Enemigos
/**
 * Genera las tarjetas visuales de los enemigos disponibles.
 */
const cargarEnemigos = () => {
    const contenedorEnemigos = document.getElementById('lista-enemigos');
    contenedorEnemigos.innerHTML = '';

    enemigos.forEach(enemigo => {
        const card = document.createElement('div');
        // glass-panel (Diseño)
        card.className = 'card-enemigo glass-panel';
        card.innerHTML = `
            <img src="assets/avatars/${enemigo.avatar}" alt="${enemigo.nombre}">
            <h3>${enemigo.nombre}</h3>
            <p>Ataque: ${enemigo.ataque}</p>
            <p>Vida: ${enemigo.vida}</p>
        `;
        contenedorEnemigos.appendChild(card);
    });

    mostrarEscena('escena-enemigos');
};

// Escena 5: Sistema de Batallas
/**
 * Controla toda la pantalla de combate: visuales, log de texto y turnos.
 */
const iniciarBatalla = () => {
    mostrarEscena('escena-batallas');
    const logContainer = document.getElementById('log-batalla');
    const btnContinuar = document.getElementById('btn-siguiente-batalla');
    
    // Reiniciar animación de entrada (Diseño)
    const panelJugador = document.querySelector('.panel-jugador');
    const panelEnemigo = document.querySelector('.panel-enemigo');
    if(panelJugador && panelEnemigo) {
        panelJugador.classList.remove('slide-left');
        panelEnemigo.classList.remove('slide-right');
        void panelJugador.offsetWidth; // reiniciar la animacion
        panelJugador.classList.add('slide-left');
        panelEnemigo.classList.add('slide-right');
    }
    
    logContainer.innerHTML = ''; // limpiar log

    // Validar si quedan enemigos
    if (indiceEnemigoActual >= enemigos.length) {
        finalizarJuego();
        return;
    }

    const enemigoActual = enemigos[indiceEnemigoActual];

    //para la imagen del jugador
    if (panelJugador) {
        panelJugador.innerHTML = `
            <h3>${jugador.nombre}</h3>
            <img src="assets/avatars/${jugador.avatar}" 
                 alt="${jugador.nombre}" 
                 class="avatar-batalla">
            <div class="stats-jugador"></div>
        `;
    }

    // Renderizar imagen y datos del enemigo actual en la zona de batalla
    if (panelEnemigo) {
        panelEnemigo.innerHTML = `
            <h3>${enemigoActual.nombre}</h3>
            <img src="assets/avatars/${enemigoActual.avatar}" 
                 alt="${enemigoActual.nombre}" 
                 style="width: 100px; height: 100px; object-fit: contain;">
            <p>Vida: ${enemigoActual.vida}</p>
            <p>Ataque: ${enemigoActual.ataque}</p>
        `;
    }

    const resultado = combatir(jugador, enemigoActual);

    // delay 5s
    const velocidadLectura = 0.2; 

    // Log
    resultado.log.forEach((linea, index) => {
        const p = document.createElement('p');
        // Retraso animación (Diseño)
        p.style.animationDelay = `${index * velocidadLectura}s`;
        p.className = 'log-linea';

        const colorAtacante = linea.atacante === jugador.nombre ? '#00d9ff' : '#ff0038';
        p.innerHTML = `<strong style="color:${colorAtacante}">${linea.atacante}</strong> ataca y causa <strong>${linea.dano}</strong> daño. Vida restante: ${linea.vidaRestante}`;
        
        logContainer.appendChild(p);
    });

    // Calculamos cuando terminan de salir todas las líneas
    const tiempoTotal = resultado.log.length * velocidadLectura;

    // resultado combate
    const resultadoTitulo = document.createElement('div');
    resultadoTitulo.className = 'resultado-titulo';
    resultadoTitulo.style.animationDelay = `${tiempoTotal}s`;

    if (resultado.jugadorGana) {
        jugador.sumarPuntos(resultado.puntos);
        indiceEnemigoActual++; // avanzar, siguiente enemigo
        
        // dinero ganado (10 jefe, 5 normal)
        const monedasGanadas = enemigoActual.multiplicador ? 10 : 5;
        jugador.dinero += monedasGanadas;
        
        resultadoTitulo.innerHTML = `<h3>¡VICTORIA!</h3> <span class="pts">+${resultado.puntos} PTS</span> <span style="color:gold;">+${monedasGanadas} ORO</span>`;
        resultadoTitulo.classList.add ('ganador');

        btnContinuar.style.display = 'none';
        setTimeout(() => {
            btnContinuar.textContent = "Siguiente Batalla";
            btnContinuar.style.display = 'block';
            // scroll hacia abajo
            logContainer.scrollTop = logContainer.scrollHeight;
        }, tiempoTotal * 1000);

        btnContinuar.onclick = () => {
             if (indiceEnemigoActual < enemigos.length) {
                 iniciarBatalla();
             } else {
                 finalizarJuego();
             }
        };
    } else {
        resultadoTitulo.innerHTML= `<h3>Derrota...</h3>`;
        resultadoTitulo.classList.add('perdedor');
        
        // CORREGIDO: era btnContainer (error) -> btnContinuar
        btnContinuar.style.display = 'none';
        setTimeout(() => {
            btnContinuar.textContent = "Ver Resultados";
            btnContinuar.style.display = "block";
            // CORREGIDO: Añadido scroll aquí también
            logContainer.scrollTop = logContainer.scrollHeight;
        }, tiempoTotal * 1000);
        
        btnContinuar.onclick = finalizarJuego;
    }
    //para que aparezca al principio
    logContainer.prepend(resultadoTitulo);
    actualizarStatsUI();
};

// Escena 6: Final y Ranking
/**
 * Muestra la pantalla de fin de juego con el resultado.
 */
const finalizarJuego = () => {
    // puntos totales = puntos + dinero
    const puntuacionTotal = jugador.puntos + jugador.dinero;
    const rango = distinguirJugador(puntuacionTotal, 500); // Umbral 500
    
    document.getElementById('rango-final').textContent = `Rango alcanzado: ${rango}`;
    document.getElementById('puntos-finales').textContent = `Puntuación Final: ${puntuacionTotal}`;
    
    // guardar Ranking
    const registro = {
        nombre: jugador.nombre,
        puntos: puntuacionTotal,
        monedas: jugador.dinero
    };
    // guardamos un array de records o solo el ultimo
    let ranking = JSON.parse(localStorage.getItem('ranking_dwec')) || [];
    ranking.push(registro);
    localStorage.setItem('ranking_dwec', JSON.stringify(ranking));

    // botón para mostrar ranking por consola (Si no existe ya)
    const botonera = document.querySelector('#escena-final .botonera');
    if (!document.getElementById('btn-ver-ranking')) {
        const btnRanking = document.createElement('button');
        btnRanking.id = 'btn-ver-ranking';
        btnRanking.className = 'btn-primario';
        btnRanking.textContent = "Ver Ranking (Consola)";
        btnRanking.onclick = () => console.table(JSON.parse(localStorage.getItem('ranking_dwec')));
        botonera.appendChild(btnRanking);
    }

    mostrarEscena('escena-final');

    // Confeti final (Diseño)
    if (window.confetti) {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        var randomInRange = (min, max) => Math.random() * (max - min) + min;

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
};

// eventos globales
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-ir-mercado').addEventListener('click', cargarMercado);
    document.getElementById('btn-ir-stats').addEventListener('click', () => mostrarEscena('escena-stats'));
    document.getElementById('btn-ir-enemigos').addEventListener('click', cargarEnemigos);
    document.getElementById('btn-iniciar-batallas').addEventListener('click', iniciarBatalla);
    document.getElementById('btn-reiniciar').addEventListener('click', () => location.reload());

    // listener creación jugador
    document.getElementById('btn-crear-jugador').addEventListener('click', validarYEmpezar);
    
    // listener visual para actualizar puntos restantes
    const inputs = document.querySelectorAll('#escena-creacion input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
           const a = parseInt(document.getElementById('input-ataque').value) || 0; 
           const d = parseInt(document.getElementById('input-defensa').value) || 0; 
           const v = parseInt(document.getElementById('input-vida').value) || 100;
           // Restar 100 a vida porque es la base
           const restantes = 10 - (a + d + (v - 100));
           const span = document.getElementById('puntos-restantes');
           if (span) span.textContent = restantes;
        });
    });
});