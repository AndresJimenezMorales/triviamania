//Constantes 

const BotonJugar = document.getElementById("btn-jugar");
const MenuBienvenida = document.getElementById("Bienvenido");
const MenuModoJuego = document.getElementById("ModoJuego");
const BotonesCategoria = document.querySelectorAll("#ModoJuego button");
const BotonMusica = document.getElementById("btn-musica");
const SeccionJuego = document.getElementById("SeccionJuego");
const SeccionResultados = document.getElementById("SeccionResultados");
const CategoriaSeleccionada = document.getElementById("CategoriaSeleccionada");
const BarraProgreso = document.getElementById("BarraProgreso");
const Pregunta = document.getElementById("Pregunta");
const Opciones = document.getElementById("Opciones");
const MensajeRespuesta = document.getElementById("MensajeRespuesta");
const SiguientePregunta = document.getElementById("SiguientePregunta");
const VerResultados = document.getElementById("VerResultados");
const PuntuacionFinal = document.getElementById("PuntuacionFinal");
const JugarDeNuevo = document.getElementById("JugarDeNuevo");


//Eventos al hacer click
BotonJugar.addEventListener('click', () => IniciarJuego());
BotonMusica.addEventListener('click', () => Musica());
SiguientePregunta.addEventListener('click', () => MostrarSiguientePregunta());
VerResultados.addEventListener('click', () => MostrarResultados());
JugarDeNuevo.addEventListener('click', () => ReiniciarJuego());


//Escuchar el click de cada boton y pasarle el parametro a la funcion
BotonesCategoria.forEach(Boton => {
    Boton.addEventListener('click', () => {
        IniciarTrivia(Boton.id);
    });
});


//Ocultar menu principal, Mostrar menu de seleccion de categoria
function IniciarJuego() {
    MenuBienvenida.style.display = "none";
    MenuModoJuego.style.display = "block";
}

//Funcion para iniciar las preguntas
function IniciarTrivia(Categoria) {
    if (Categoria == "Volver") {
        MenuModoJuego.style.display = "none";
        MenuBienvenida.style.display = "block";
    }

    categoriaActual = Categoria;
    indicePreguntaActual = 0;
    puntuacion = 0;
    
    // Mostrar la sección de juego y ocultar el menú de categorías
    MenuModoJuego.style.display = "none";
    SeccionJuego.style.display = "block";
    
    // Actualizar el título de la categoría
    CategoriaSeleccionada.textContent = "Categoría: " + Categoria;
    
    // Cargar las preguntas
    CargarPreguntas(Categoria)
        .then(preguntas => {
            preguntasActuales = preguntas;
            MostrarPregunta(0);
        })
        .catch(error => {
            Pregunta.textContent = "Error al cargar las preguntas: " + error;
        });
}

// Función para cargar las preguntas
function CargarPreguntas(categoria) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (triviaPreguntas[categoria]) {
                resolve(triviaPreguntas[categoria]);
            } else {
                reject("Categoría no encontrada");
            }
        }, 500); // Pequeño retraso para simular carga
    });
}

// Función para mostrar una pregunta específica
function MostrarPregunta(indice) {
    if (indice >= preguntasActuales.length) {
        MostrarResultados();
        return;
    }
    
    const preguntaActual = preguntasActuales[indice];
    
    // Actualizar la barra de progreso
    const progreso = ((indice + 1) / preguntasActuales.length) * 100;
    BarraProgreso.style.width = progreso+"%";
    
    // Mostrar la pregunta
    Pregunta.textContent = preguntaActual.pregunta;
    
    // Limpiar las opciones anteriores
    Opciones.innerHTML = "";
    
    // Mostrar las opciones
    preguntaActual.opciones.forEach(opcion => {
        const botonOpcion = document.createElement("button");
        botonOpcion.textContent = opcion;
        botonOpcion.className = "btn btn-outline-primary mb-2 w-100";
        botonOpcion.addEventListener("click", () => VerificarRespuesta(opcion));
        Opciones.appendChild(botonOpcion);
    });
    
    // Limpiar mensaje de respuesta y ocultar botones
    MensajeRespuesta.textContent = "";
    MensajeRespuesta.className = "mb-3";
    SiguientePregunta.style.display = "none";
    VerResultados.style.display = "none";
}

// Función para verificar la respuesta seleccionada
function VerificarRespuesta(opcionSeleccionada) {
    const preguntaActual = preguntasActuales[indicePreguntaActual];
    const esCorrecta = opcionSeleccionada === preguntaActual.respuesta;
    
    // Deshabilitar todas las opciones
    const botonesOpciones = Opciones.querySelectorAll("button");
    botonesOpciones.forEach(boton => {
        boton.disabled = true;
        
        // Colorear el botón de la respuesta correcta
        if (boton.textContent === preguntaActual.respuesta) {
            boton.className = "btn btn-success mb-2 w-100";
        }
        // Colorear el botón de la respuesta incorrecta seleccionada
        else if (boton.textContent === opcionSeleccionada && !esCorrecta) {
            boton.className = "btn btn-danger mb-2 w-100";
        }
    });
    
    // Actualizar mensaje y puntuación
    if (esCorrecta) {
        MensajeRespuesta.textContent = "¡Correcto!";
        MensajeRespuesta.className = "mb-3 text-success";
        puntuacion++;
    } else {
        MensajeRespuesta.textContent = `Incorrecto. La respuesta correcta es: ${preguntaActual.respuesta}`;
        MensajeRespuesta.className = "mb-3 text-danger";
    }
    
    // Mostrar botón para la siguiente pregunta o para ver resultados
    if (indicePreguntaActual < preguntasActuales.length - 1) {
        SiguientePregunta.style.display = "inline-block";
    } else {
        VerResultados.style.display = "inline-block";
    }
}

// Función para mostrar la siguiente pregunta
function MostrarSiguientePregunta() {
    indicePreguntaActual++;
    MostrarPregunta(indicePreguntaActual);
}

// Función para mostrar los resultados
function MostrarResultados() {
    SeccionJuego.style.display = "none";
    SeccionResultados.style.display = "block";
    PuntuacionFinal.textContent = puntuacion;
}

// Función para reiniciar el juego
function ReiniciarJuego() {
    SeccionResultados.style.display = "none";
    MenuModoJuego.style.display = "block";
}

let Musica1 = new Audio('audio/Eric Skiff - Underclocked ♫ NO COPYRIGHT 8-bit Music + Background - Free Music.mp3');
let MusicaActiva = false;

function Musica() {
    if (MusicaActiva) {
        Musica1.pause();
        MusicaActiva = false;
        BotonMusica.textContent = "🔇 Música: OFF";
    } else {
        Musica1.loop = true;
        Musica1.play();
        MusicaActiva = true;
        BotonMusica.textContent = "🔊 Música: ON";
    }
}

// JSON con las preguntas
const triviaPreguntas = {
    "Geografía": [
        {
            "pregunta": "¿Cuál es el río más largo del mundo?",
            "opciones": ["Amazonas", "Nilo", "Yangtsé", "Misisipi"],
            "respuesta": "Nilo"
        },
        {
            "pregunta": "¿Qué país tiene la mayor cantidad de islas en el mundo?",
            "opciones": ["Filipinas", "Indonesia", "Suecia", "Japón"],
            "respuesta": "Suecia"
        },
        {
            "pregunta": "¿Cuál es el país más pequeño del mundo?",
            "opciones": ["Mónaco", "Vaticano", "San Marino", "Liechtenstein"],
            "respuesta": "Vaticano"
        },
        {
            "pregunta": "¿Qué país está entre Perú y Colombia?",
            "opciones": ["Ecuador", "Bolivia", "Venezuela", "Brasil"],
            "respuesta": "Ecuador"
        },
        {
            "pregunta": "¿Qué país es el más grande de África?",
            "opciones": ["Egipto", "Nigeria", "Argelia", "Sudáfrica"],
            "respuesta": "Argelia"
        }
    ],
    "Historia": [
        {
            "pregunta": "¿En qué año comenzó la Primera Guerra Mundial?",
            "opciones": ["1912", "1914", "1916", "1918"],
            "respuesta": "1914"
        },
        {
            "pregunta": "¿Quién fue el primer presidente de los Estados Unidos?",
            "opciones": ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
            "respuesta": "George Washington"
        },
        {
            "pregunta": "¿Qué civilización construyó Machu Picchu?",
            "opciones": ["Azteca", "Maya", "Inca", "Olmeca"],
            "respuesta": "Inca"
        },
        {
            "pregunta": "¿En qué año cayó el Muro de Berlín?",
            "opciones": ["1987", "1989", "1991", "1993"],
            "respuesta": "1989"
        },
        {
            "pregunta": "¿Quién fue el líder de la Revolución Cubana?",
            "opciones": ["Che Guevara", "Fidel Castro", "Fulgencio Batista", "Raúl Castro"],
            "respuesta": "Fidel Castro"
        }
    ],
    "Ciencia": [
        {
            "pregunta": "¿Cuál es el elemento químico más abundante en el universo?",
            "opciones": ["Hidrógeno", "Helio", "Oxígeno", "Carbono"],
            "respuesta": "Hidrógeno"
        },
        {
            "pregunta": "¿Cuál es la unidad básica de la herencia?",
            "opciones": ["Célula", "ADN", "Gen", "Cromosoma"],
            "respuesta": "Gen"
        },
        {
            "pregunta": "¿Cuál es el hueso más largo del cuerpo humano?",
            "opciones": ["Húmero", "Fémur", "Tibia", "Radio"],
            "respuesta": "Fémur"
        },
        {
            "pregunta": "¿Qué planeta es conocido como el planeta rojo?",
            "opciones": ["Venus", "Júpiter", "Marte", "Saturno"],
            "respuesta": "Marte"
        },
        {
            "pregunta": "¿Qué vitamina se produce cuando la piel se expone al sol?",
            "opciones": ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina E"],
            "respuesta": "Vitamina D"
        }
    ],
    "Deportes": [
        {
            "pregunta": "¿En qué deporte se utiliza un tee?",
            "opciones": ["Golf", "Béisbol", "Tenis", "Polo"],
            "respuesta": "Golf"
        },
        {
            "pregunta": "¿Cuántos jugadores hay en un equipo de voleibol?",
            "opciones": ["5", "6", "7", "8"],
            "respuesta": "6"
        },
        {
            "pregunta": "¿Qué país ganó el primer Mundial de Fútbol?",
            "opciones": ["Brasil", "Argentina", "Uruguay", "Italia"],
            "respuesta": "Uruguay"
        },
        {
            "pregunta": "¿Cuál es el único deporte que se ha jugado en la luna?",
            "opciones": ["Frisbee", "Golf", "Fútbol", "Tenis"],
            "respuesta": "Golf"
        },
        {
            "pregunta": "¿En qué ciudad se celebraron los primeros Juegos Olímpicos modernos?",
            "opciones": ["Atenas", "París", "Londres", "Roma"],
            "respuesta": "Atenas"
        }
    ]
};