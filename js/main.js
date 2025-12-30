import { Jugador } from './classes/Jugador.js';
import { Enemigo } from './classes/Enemigo.js';
import { Jefe } from './classes/Jefe.js';
import { obtenerProductosBase, aplicarDescuentoAleatorio } from './modules/mercado.js';
import { combatir } from './modules/batalla.js';
import { distinguirJugador } from './modules/ranking.js';

console.log("Main.js SPA cargado correctamente");

let jugador;
let inventarioTienda = [];
let enemigos = [];
let indiceEnemigoActual = 0; 

// --- GESTIÓN DE ESCENAS (SPA) ---

/**
 * Oculta todas las secciones y muestra la deseada.
 * Resetea el scroll del contenedor principal.
 */
const mostrarEscena = (idEscena) => {
    // Ocultar todas
    document.querySelectorAll('.escena').forEach(e => {
        e.classList.remove('activa');
        e.style.display = 'none';
    });
    
    // Mostrar la nueva
    const escena = document.getElementById(idEscena);
    if (escena) {
        escena.style.display = 'block';
        // Pequeño delay para permitir animaciones CSS si las hubiera
        setTimeout(() => escena.classList.add('activa'), 10);
        
        // Resetear Scroll
        const zonaJuego = document.querySelector('.zona-juego');
        if (zonaJuego) zonaJuego.scrollTop = 0;
    } else {
        console.error(`Error: No existe la escena con ID: ${idEscena}`);
    }
};

// Interfaz de usuario
const actualizarStatsUI = () => {
    // Actualizar tarjetas de stats
    document.querySelectorAll('.stats-jugador').forEach(contenedor => {
        contenedor.innerHTML = `
            <div class="stat-fila"><span class="label">VIDA</span> <span class="valor">${jugador.obtenerVidaTotal()}</span></div>
            <div class="stat-fila"><span class="label">ATAQUE</span> <span class="valor">${jugador.obtenerAtaqueTotal()}</span></div>
            <div class="stat-fila"><span class="label">DEFENSA</span> <span class="valor">${jugador.obtenerDefensaTotal()}</span></div>
            <div class="stat-fila"><span class="label">ORO</span> <span class="valor" style="color: gold;">${jugador.dinero}</span></div>
            <div class="stat-fila puntos"><span class="label">PUNTOS</span> <span class="valor">${jugador.puntos}</span></div>
        `;
    });

    // Monedero
    const textoMonedero = document.getElementById('texto-dinero-saco');
    if (textoMonedero) {
        textoMonedero.textContent = jugador.dinero;
    }
    
    // Inventario Fijo (en el footer)
    const contenedorFooter = document.getElementById('inventario-fijo');
    if (contenedorFooter) {
        contenedorFooter.innerHTML = '';
        
        // objetos que tenemos
        jugador.inventario.forEach(item => {
            const img = document.createElement('img');
            img.src = `assets/items/${item.imagen}`;
            img.alt = item.nombre;
            img.title = item.nombre;
            img.className = 'item-icono bounce-in';
            contenedorFooter.appendChild(img);
        });

        // Rellenar huecos vacíos (si tenemos 2 items, tenemos 4 huecos vacíos)
        const huecosFaltantes = Math.max(0, 6 - jugador.inventario.length);
        
        for (let i = 0; i < huecosFaltantes; i++) {
            const hueco = document.createElement('div');
            hueco.className = 'celda-vacia';
            contenedorFooter.appendChild(hueco);
        }
    }
    
    // Título con nombre
    const tituloNombre = document.getElementById('nombre-jugador-titulo');
    if(tituloNombre) tituloNombre.textContent = jugador.nombre;
};

// --- EFECTOS VISUALES ---
/**
 * Crea imágenes de monedas que caen y rotan usando CSS.
 */
const lanzarAnimacionMonedas = () => {
    const posiciones = ['25%', '50%', '75%'];
    
    posiciones.forEach((pos, index) => {
        const monedaHTML = `
            <img src="assets/imagenes/moneda.png" 
                 class="moneda-animada" 
                 style="left: ${pos}; animation-delay: ${index * 0.2}s;" 
                 alt="Moneda">`;
                 
        document.body.insertAdjacentHTML('beforeend', monedaHTML);
    });
    
    // Limpieza del DOM
    setTimeout(() => {
        document.querySelectorAll('.moneda-animada').forEach(m => m.remove());
    }, 3000);
};

// Logica
/**
 * Valida el formulario de creación
 */
const validarYEmpezar = () => {
    const nombre = document.getElementById('input-nombre-creacion').value;
    const atk = parseInt(document.getElementById('input-ataque').value) || 0;
    const def = parseInt(document.getElementById('input-defensa').value) || 0;
    const vid = parseInt(document.getElementById('input-vida').value) || 100;
    const errorMsg = document.getElementById('error-msg');

    // Regex: Mayúscula inicial, solo letras/espacios, máx 20 chars
    const regexNombre = /^[A-Z][a-zA-Z\s]{0,19}$/;
    
    if (!regexNombre.test(nombre) || nombre.trim().length === 0) {
        errorMsg.textContent = "Error: El nombre debe empezar por mayúscula, contener solo letras y máx 20 caracteres.";
        errorMsg.style.display = 'block';
        return;
    }

    // Validación Stats: Máximo 10 puntos extra a repartir
    // (Vida base es 100, así que restamos 100 para ver cuánto extra se puso)
    const puntosGastados = atk + def + (vid - 100);
    
    if (puntosGastados > 10) {
        errorMsg.textContent = `Has gastado ${puntosGastados} puntos. El máximo permitido es 10.`;
        errorMsg.style.display = 'block';
        return;
    }
    
    if (vid < 100) {
         errorMsg.textContent = "La vida no puede ser menor de 100.";
         errorMsg.style.display = 'block';
         return;
    }

    // Todo correcto
    errorMsg.style.display = 'none';
    iniciarJuego(nombre, atk, def, vid);
};

const iniciarJuego = (nombre, atk, def, vid) => {
    jugador = new Jugador(nombre, "cazador.png", atk, def, vid);
    
    inventarioTienda = aplicarDescuentoAleatorio(obtenerProductosBase());
    
    enemigos = [
        new Enemigo("Goblin", "goblin.png", 8, 60),
        new Enemigo("Lobo", "lobo.png", 9, 80),
        new Enemigo("Bandido", "bandido.png", 12, 90),
        new Jefe("Dragón", "dragon.png", 20, 150, 1.5)
    ];
    indiceEnemigoActual = 0;

    actualizarStatsUI();
    mostrarEscena('escena-inicio');
};

const cargarMercado = () => {
    const contenedorTienda = document.getElementById('tienda-productos');
    contenedorTienda.innerHTML = ''; 

    // Renderizar productos en Grid
    inventarioTienda.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto glass-panel';
        
        const yaComprado = jugador.inventario.some(p => p.nombre === producto.nombre);
        if (yaComprado) tarjeta.classList.add('comprado');

        tarjeta.innerHTML = `
            <img src="assets/items/${producto.imagen}" alt="${producto.nombre}">
            <div>
                <h3>${producto.nombre}</h3>
                <div class="tags">
                    <span class="tag">${producto.tipo}</span>
                    <span class="tag">${producto.rareza}</span>
                </div>
                <p class="bonus">${producto.obtenerDescripcionBonus()}</p>
            </div>
            <div>
                <p class="precio">${producto.obtenerPrecioFormateado()}</p>
                <button class="btn-accion ${yaComprado ? 'btn-rojo' : 'btn-primario'}">
                    ${yaComprado ? 'VENDER' : 'COMPRAR'}
                </button>
            </div>
        `;

        const boton = tarjeta.querySelector('.btn-accion');
        boton.addEventListener('click', () => {
            if (jugador.inventario.some(p => p.nombre === producto.nombre)) {
                // Vender
                jugador.inventario = jugador.inventario.filter(p => p.nombre !== producto.nombre);
                jugador.dinero += producto.precio;
                
                // Actualizar visual botón
                boton.textContent = 'COMPRAR';
                boton.className = 'btn-accion btn-primario';
                tarjeta.classList.remove('comprado');
            } else {
                // Comprar
                if (jugador.dinero >= producto.precio) {
                    jugador.agregarAlInventario(producto);
                    jugador.dinero -= producto.precio;
                    
                    // Actualizar visual botón
                    boton.textContent = 'VENDER';
                    boton.className = 'btn-accion btn-rojo';
                    tarjeta.classList.add('comprado');
                } else {
                    alert("¡No tienes suficiente oro para comprar esto!");
                }
            }
            actualizarStatsUI(); // actualizar footer al momento
        });

        contenedorTienda.appendChild(tarjeta);
    });

    mostrarEscena('escena-mercado');
};

const cargarEnemigos = () => {
    const contenedor = document.getElementById('lista-enemigos');
    contenedor.innerHTML = '';

    enemigos.forEach(enemigo => {
        contenedor.innerHTML += `
            <div class="card-enemigo glass-panel">
                <img src="assets/avatars/${enemigo.avatar}" alt="${enemigo.nombre}">
                <h3>${enemigo.nombre}</h3>
                <p>ATK: ${enemigo.ataque}</p>
                <p>HP: ${enemigo.vida}</p>
            </div>
        `;
    });

    mostrarEscena('escena-enemigos');
};

const iniciarBatalla = () => {
    mostrarEscena('escena-batallas');
    const logContainer = document.getElementById('log-batalla');
    const btnContinuar = document.getElementById('btn-siguiente-batalla');
    logContainer.innerHTML = ''; 

    if (indiceEnemigoActual >= enemigos.length) {
        finalizarJuego();
        return;
    }

    const enemigo = enemigos[indiceEnemigoActual];
    
    // Imagen del enemigo
    const imgEnemigo = document.querySelector('.img-enemigo-batalla');
    if (imgEnemigo) imgEnemigo.src = `assets/avatars/${enemigo.avatar}`;
    
    // Lógica combate
    const resultado = combatir(jugador, enemigo);
    const velocidadLectura = 0.3;

    // Log
    resultado.log.forEach((linea, index) => {
        const p = document.createElement('p');
        p.className = 'log-linea';
        p.style.animationDelay = `${index * velocidadLectura}s`;
        
        const color = linea.atacante === jugador.nombre ? '#00d9ff' : '#ff0038';
        p.innerHTML = `<strong style="color:${color}">${linea.atacante}</strong> ataca y causa <b>${linea.dano}</b> daño. Vida restante: ${linea.vidaRestante}`;
        logContainer.appendChild(p);
    });

    // Calculamos cuando terminan de salir todas las líneas
    // Resultado final
    const tiempoTotal = resultado.log.length * velocidadLectura;
    
    setTimeout(() => {
        const titulo = document.createElement('div');
        titulo.className = 'resultado-titulo';
        
        if (resultado.jugadorGana) {
            jugador.sumarPuntos(resultado.puntos);
            
            // Recompensa Oro (cliente)
            const oroGanado = enemigo.multiplicador ? 10 : 5;
            jugador.dinero += oroGanado;
            
            titulo.innerHTML = `<h3 style="color:var(--color-exito)">¡VICTORIA!</h3> +${resultado.puntos} Pts | <span style="color:gold">+${oroGanado} Oro</span>`;
            
            // Animación visual (diseño)
            lanzarAnimacionMonedas();
            
            indiceEnemigoActual++;
            
            btnContinuar.style.display = 'inline-block';
            btnContinuar.textContent = (indiceEnemigoActual < enemigos.length) ? 'Siguiente Batalla' : 'Ver Ranking';
            btnContinuar.onclick = () => {
                if(indiceEnemigoActual < enemigos.length) iniciarBatalla();
                else finalizarJuego();
            };
        } else {
            titulo.innerHTML = `<h3 style="color:var(--color-acento-rojo)">DERROTA...</h3>`;
            
            btnContinuar.style.display = 'inline-block';
            btnContinuar.textContent = 'Ver Resultados';
            btnContinuar.onclick = finalizarJuego;
        }
        
        logContainer.prepend(titulo);
        actualizarStatsUI(); // Actualizar oro
        
    }, tiempoTotal * 1000);
};

const finalizarJuego = () => {
    // Cálculo final
    const totalPuntos = jugador.puntos + jugador.dinero;
    const rango = distinguirJugador(totalPuntos, 500);
    
    document.getElementById('rango-final').textContent = `RANGO ALCANZADO: ${rango}`;
    document.getElementById('puntos-finales').textContent = `PUNTUACIÓN FINAL: ${totalPuntos}`;
    
    // Guardar ranking
    const registro = { 
        nombre: jugador.nombre, 
        puntos: totalPuntos, 
        dinero: jugador.dinero 
    };
    
    let ranking = JSON.parse(localStorage.getItem('ranking_dwec')) || [];
    ranking.push(registro);
    localStorage.setItem('ranking_dwec', JSON.stringify(ranking));
    
    // Ordenar y Pintar Tabla
    ranking.sort((a,b) => b.puntos - a.puntos);
    
    const tbody = document.getElementById('cuerpo-tabla');
    tbody.innerHTML = '';
    
    ranking.forEach(fila => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${fila.nombre}</td>
            <td style="color:var(--color-exito)">${fila.puntos}</td>
            <td style="color:gold">${fila.dinero}</td>
        `;
        tbody.appendChild(tr);
    });

    mostrarEscena('escena-final');

    // Confeti
    if (window.confetti) confetti();
    
    // Botón consola (cliente)
    console.table(ranking);
};

// Eventos globales (listeners)
document.addEventListener('DOMContentLoaded', () => {
    // Navegación Básica
    document.getElementById('btn-ir-mercado')?.addEventListener('click', cargarMercado);
    document.getElementById('btn-ir-stats')?.addEventListener('click', () => mostrarEscena('escena-stats'));
    document.getElementById('btn-ir-enemigos')?.addEventListener('click', cargarEnemigos);
    document.getElementById('btn-iniciar-batallas')?.addEventListener('click', iniciarBatalla);
    document.getElementById('btn-reiniciar')?.addEventListener('click', () => location.reload());

    // Crear Jugador
    document.getElementById('btn-crear-jugador')?.addEventListener('click', validarYEmpezar);
    
    // Feedback visual inputs (actualizar puntos restantes)
    const inputs = document.querySelectorAll('#escena-creacion input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const a = parseInt(document.getElementById('input-ataque').value)||0;
            const d = parseInt(document.getElementById('input-defensa').value)||0;
            const v = parseInt(document.getElementById('input-vida').value)||100;
            
            const restantes = 10 - (a + d + (v - 100));
            const span = document.getElementById('puntos-restantes');
            if(span) {
                span.textContent = restantes;
                span.style.color = restantes < 0 ? 'var(--color-acento-rojo)' : 'var(--color-exito)';
            }
        });
    });
});