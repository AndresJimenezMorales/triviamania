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
const btnGuardarPuntuacion = document.getElementById("btnGuardarPuntuacion");

let categoriaActual;
let indicePreguntaActual;
let puntuacion;
let preguntasActuales;

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

//Eventos al hacer click
if (BotonJugar) {
    BotonJugar.addEventListener('click', () => IniciarJuego());
}

if (BotonMusica) {
    BotonMusica.addEventListener('click', () => Musica());
}

if (SiguientePregunta) {
    SiguientePregunta.addEventListener('click', () => MostrarSiguientePregunta());
}

if (VerResultados) {
    VerResultados.addEventListener('click', () => MostrarResultados());
}

if (JugarDeNuevo) {
    JugarDeNuevo.addEventListener('click', () => ReiniciarJuego());
}

if (btnGuardarPuntuacion){
    btnGuardarPuntuacion.addEventListener('click', () => GuardarPuntuacion());
}

//Escuchar el click de cada boton y pasarle el parametro a la funcion
BotonesCategoria.forEach(Boton => {
    Boton.addEventListener('click', () => {
        IniciarTrivia(Boton.id);
    });
});


//Ocultar menu principal, Mostrar menu de seleccion de categoria
function IniciarJuego() {
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
            randomizarPreguntas(preguntasActuales);
            randomizarRespuestas(preguntasActuales);
            preguntasActuales = preguntasActuales.slice(0, 10);
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
        }, 1000); // Pequeño retraso para simular carga
    });
}

function randomizarPreguntas(preguntas) {
    preguntas.sort(() => Math.random() - 0.5);
}

function randomizarRespuestas(preguntas) {
    preguntas.forEach(pregunta => {
        if (Array.isArray(pregunta.opciones)) {
            pregunta.opciones.sort(() => Math.random() - 0.5);
        }
    });
}

// Función para mostrar una pregunta específica
function MostrarPregunta(indice) {
    if (indice >= preguntasActuales.length) {
        MostrarResultados();
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

    const contador = document.getElementById("PreguntaContador");
    contador.textContent = `Pregunta ${indice + 1} de ${preguntasActuales.length}`;
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
            boton.style.backgroundColor = "#28a745";
            boton.style.borderColor = "#28a745";
            boton.style.color = "white";
        }
        // Colorear el botón de la respuesta incorrecta seleccionada
        else if (boton.textContent === opcionSeleccionada && !esCorrecta) {
            boton.style.backgroundColor = "#dc3545";
            boton.style.borderColor = "#dc3545";
            boton.style.color = "white";
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

function GuardarPuntuacion() {
    const nombreJugador = document.getElementById("NombreJugador").value;
    const puntuacion = document.getElementById("PuntuacionFinal").textContent;
    
    if (nombreJugador && puntuacion) {
        const hora = new Date().toLocaleString(); // Obtener la hora actual

        // Crear objeto con la puntuación y hora
        const puntuacionJugador = {
            nombre: nombreJugador,
            puntuacion: puntuacion,
            hora: hora
        };

        // Obtener puntajes guardados de localStorage
        let puntajes = JSON.parse(localStorage.getItem("puntajes")) || [];

        // Añadir la nueva puntuación
        puntajes.push(puntuacionJugador);

        // Guardar nuevamente en localStorage
        localStorage.setItem("puntajes", JSON.stringify(puntajes));

        // Mostrar el mensaje de confirmación
        const modalConfirmacion = new bootstrap.Modal(document.getElementById('ModalConfirmacion'));
        modalConfirmacion.show();

        // Limpiar el campo de nombre después de guardar
        document.getElementById("NombreJugador").value = "";
    }
}


// Función para cargar los puntajes guardados en la tabla
function MostrarPuntajes() {
    const puntajes = JSON.parse(localStorage.getItem("puntajes")) || [];
    const tablaPuntajes = document.getElementById("tablaPuntajes");
    
    tablaPuntajes.innerHTML = "";
    
    puntajes.forEach(puntaje => {
        const fila = document.createElement("tr");
        
        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = puntaje.nombre;
        
        const celdaPuntuacion = document.createElement("td");
        celdaPuntuacion.textContent = puntaje.puntuacion;
        
        const celdaHora = document.createElement("td");
        celdaHora.textContent = puntaje.hora;
        
        
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaPuntuacion);
        fila.appendChild(celdaHora);
        
        
        tablaPuntajes.appendChild(fila);
    });
}

document.addEventListener("DOMContentLoaded", ()=> MostrarPuntajes());
// Función para reiniciar el juego
function ReiniciarJuego() {
    SeccionJuego.style.display = "none";
    SeccionResultados.style.display = "none";
    MenuModoJuego.style.display = "block";
}

// JSON con las preguntas
const triviaPreguntas = {
  "Geografía": [
    {
      "pregunta": "¿Cuál es el río más largo del mundo?",
      "opciones": ["Amazonas", "Nilo", "Yangtsé", "Misisipi"],
      "respuesta": "Amazonas"
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
    },
    {
      "pregunta": "¿En qué continente se encuentra el desierto del Sahara?",
      "opciones": ["África", "Asia", "América", "Oceanía"],
      "respuesta": "África"
    },
    {
      "pregunta": "¿Cuál es la capital de Australia?",
      "opciones": ["Sídney", "Melbourne", "Canberra", "Brisbane"],
      "respuesta": "Canberra"
    },
    {
      "pregunta": "¿Qué océano está al este de Australia?",
      "opciones": ["Atlántico", "Índico", "Pacífico", "Ártico"],
      "respuesta": "Pacífico"
    },
    {
      "pregunta": "¿En qué país se encuentra el Monte Everest?",
      "opciones": ["Nepal", "India", "China", "Pakistán"],
      "respuesta": "Nepal"
    },
    {
      "pregunta": "¿Cuál es la capital de Brasil?",
      "opciones": ["São Paulo", "Brasilia", "Río de Janeiro", "Salvador"],
      "respuesta": "Brasilia"
    },
    {
      "pregunta": "¿Qué país tiene más habitantes del mundo?",
      "opciones": ["India", "China", "EE.UU.", "Indonesia"],
      "respuesta": "India"
    },
    {
      "pregunta": "¿Qué continente tiene más países?",
      "opciones": ["África", "Asia", "Europa", "América"],
      "respuesta": "África"
    },
    {
      "pregunta": "¿Cuál es el país más grande de América del Sur?",
      "opciones": ["Brasil", "Argentina", "Colombia", "Perú"],
      "respuesta": "Brasil"
    },
    {
      "pregunta": "¿Qué país es conocido como la Tierra del Sol Naciente?",
      "opciones": ["Japón", "Corea del Sur", "China", "Tailandia"],
      "respuesta": "Japón"
    },
    {
      "pregunta": "¿Cuál es la capital de Canadá?",
      "opciones": ["Toronto", "Vancouver", "Ottawa", "Montreal"],
      "respuesta": "Ottawa"
    },
    {
      "pregunta": "¿En qué continente se encuentra Egipto?",
      "opciones": ["Asia", "África", "Europa", "Oceanía"],
      "respuesta": "África"
    },
    {
      "pregunta": "¿Qué país tiene el mayor número de volcanes activos?",
      "opciones": ["Indonesia", "México", "Italia", "Chile"],
      "respuesta": "Indonesia"
    },
    {
      "pregunta": "¿Qué ciudad es conocida como la Ciudad de los Canales?",
      "opciones": ["Ámsterdam", "Venecia", "Estocolmo", "Brujas"],
      "respuesta": "Venecia"
    },
    {
      "pregunta": "¿Qué país tiene la mayor población de habla hispana?",
      "opciones": ["México", "España", "Argentina", "Colombia"],
      "respuesta": "México"
    },
    {
      "pregunta": "¿En qué continente se encuentra el desierto de Atacama?",
      "opciones": ["América del Sur", "África", "Asia", "Oceanía"],
      "respuesta": "América del Sur"
    },
    {
      "pregunta": "¿Cuál es la capital de Indonesia?",
      "opciones": ["Bali", "Yakarta", "Bandung", "Surabaya"],
      "respuesta": "Yakarta"
    },
    {
      "pregunta": "¿Qué mar separa África de Europa?",
      "opciones": ["Mar Rojo", "Mar Mediterráneo", "Mar Negro", "Mar Caspio"],
      "respuesta": "Mar Mediterráneo"
    },
    {
      "pregunta": "¿Cuál es la montaña más alta de América?",
      "opciones": ["Monte Everest", "Aconcagua", "Denali", "Monte Blanco"],
      "respuesta": "Aconcagua"
    },
    {
      "pregunta": "¿Qué país no tiene costa marítima?",
      "opciones": ["Paraguay", "Uruguay", "Ecuador", "Panamá"],
      "respuesta": "Paraguay"
    },
    {
      "pregunta": "¿Cuál es el lago más profundo del mundo?",
      "opciones": ["Lago Titicaca", "Lago Baikal", "Lago Victoria", "Lago Superior"],
      "respuesta": "Lago Baikal"
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
    },
    {
      "pregunta": "¿En qué año se firmó la Declaración de Independencia de los Estados Unidos?",
      "opciones": ["1776", "1783", "1790", "1800"],
      "respuesta": "1776"
    },
    {
      "pregunta": "¿Qué imperio cayó en 476 d.C.?",
      "opciones": ["Imperio Romano de Occidente", "Imperio Romano de Oriente", "Imperio Bizantino", "Imperio Otomano"],
      "respuesta": "Imperio Romano de Occidente"
    },
    {
      "pregunta": "¿Quién fue el último faraón de Egipto?",
      "opciones": ["Cleopatra", "Ramsés II", "Tutankamón", "Nefertiti"],
      "respuesta": "Cleopatra"
    },
    {
      "pregunta": "¿En qué año terminó la Segunda Guerra Mundial?",
      "opciones": ["1945", "1944", "1946", "1947"],
      "respuesta": "1945"
    },
    {
      "pregunta": "¿Quién fue el primer emperador de China?",
      "opciones": ["Qin Shi Huang", "Han Wudi", "Kublai Khan", "Li Shimin"],
      "respuesta": "Qin Shi Huang"
    },
    {
      "pregunta": "¿Qué evento histórico ocurrió en 1492?",
      "opciones": ["Descubrimiento de América", "Caída de Constantinopla", "Revolución Francesa", "Fin de la Edad Media"],
      "respuesta": "Descubrimiento de América"
    },
    {
      "pregunta": "¿Qué general romano cruzó el Rubicón en el 49 a.C.?",
      "opciones": ["Julio César", "Pompeyo", "César Augusto", "Marco Antonio"],
      "respuesta": "Julio César"
    },
    {
      "pregunta": "¿Quién fue el líder de la Revolución Francesa?",
      "opciones": ["Napoleón Bonaparte", "Robespierre", "Luis XVI", "Jean-Paul Marat"],
      "respuesta": "Robespierre"
    },
    {
      "pregunta": "¿En qué año se construyó la Gran Muralla China?",
      "opciones": ["221 a.C.", "500 d.C.", "1200 d.C.", "1500 d.C."],
      "respuesta": "221 a.C."
    },
    {
      "pregunta": "¿Quién fue el presidente de Estados Unidos durante la Guerra Civil?",
      "opciones": ["Abraham Lincoln", "Andrew Johnson", "Ulysses S. Grant", "Thomas Jefferson"],
      "respuesta": "Abraham Lincoln"
    },
    {
      "pregunta": "¿En qué año ocurrió el asesinato de Juan F. Kennedy?",
      "opciones": ["1963", "1960", "1965", "1970"],
      "respuesta": "1963"
    },
    {
      "pregunta": "¿Qué faraón egipcio mandó construir las pirámides de Giza?",
      "opciones": ["Keops", "Tutankamón", "Ramsés II", "Amenofis III"],
      "respuesta": "Keops"
    },
    {
      "pregunta": "¿Quién fue el último zar de Rusia?",
      "opciones": ["Nicolás II", "Alejandro III", "Iván IV", "Pedro I"],
      "respuesta": "Nicolás II"
    },
    {
      "pregunta": "¿Quién pintó 'La última cena'?",
      "opciones": ["Miguel Ángel", "Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh"],
      "respuesta": "Leonardo da Vinci"
    },
    {
      "pregunta": "¿En qué año llegó el hombre a la Luna?",
      "opciones": ["1965", "1969", "1972", "1975"],
      "respuesta": "1969"
    },
    {
      "pregunta": "¿Quién escribió 'El Quijote'?",
      "opciones": ["Miguel de Cervantes", "Gabriel García Márquez", "Pablo Neruda", "Federico García Lorca"],
      "respuesta": "Miguel de Cervantes"
    },
    {
      "pregunta": "¿En qué año comenzó la Revolución Mexicana?",
      "opciones": ["1905", "1910", "1915", "1920"],
      "respuesta": "1910"
    },
    {
      "pregunta": "¿Quién descubrió la penicilina?",
      "opciones": ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Albert Einstein"],
      "respuesta": "Alexander Fleming"
    },
    {
      "pregunta": "¿Qué dinastía gobernó China durante la construcción de la Gran Muralla?",
      "opciones": ["Ming", "Qin", "Han", "Tang"],
      "respuesta": "Qin"
    },
    {
      "pregunta": "¿En qué año se fundó la ONU?",
      "opciones": ["1942", "1945", "1950", "1939"],
      "respuesta": "1945"
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
    },
    {
      "pregunta": "¿Quién desarrolló la teoría de la relatividad?",
      "opciones": ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"],
      "respuesta": "Albert Einstein"
    },
    {
      "pregunta": "¿Cuál es la fórmula química del agua?",
      "opciones": ["H2O", "CO2", "O2", "CH4"],
      "respuesta": "H2O"
    },
    {
      "pregunta": "¿En qué parte del cuerpo se encuentra la glándula pineal?",
      "opciones": ["Cerebro", "Corazón", "Estómago", "Hígado"],
      "respuesta": "Cerebro"
    },
    {
      "pregunta": "¿Qué animal es conocido por ser el más grande del mundo?",
      "opciones": ["Ballena azul", "Elefante africano", "Tiburón ballena", "Jirafa"],
      "respuesta": "Ballena azul"
    },
    {
      "pregunta": "¿Cómo se llama el proceso mediante el cual las plantas producen su propio alimento?",
      "opciones": ["Fotosíntesis", "Respiración", "Transpiración", "Fermentación"],
      "respuesta": "Fotosíntesis"
    },
    {
      "pregunta": "¿Cuál es el planeta más grande del sistema solar?",
      "opciones": ["Júpiter", "Saturno", "Neptuno", "Urano"],
      "respuesta": "Júpiter"
    },
    {
      "pregunta": "¿Qué es el ADN?",
      "opciones": ["Ácido desoxirribonucleico", "Ácido ribonucleico", "Proteína", "Carbohidrato"],
      "respuesta": "Ácido desoxirribonucleico"
    },
    {
      "pregunta": "¿Qué es la gravedad?",
      "opciones": ["Fuerza que atrae los objetos hacia el centro de la Tierra", "Fuerza que aleja los objetos del centro de la Tierra", "Fuerza que genera el viento", "Fuerza que produce luz"],
      "respuesta": "Fuerza que atrae los objetos hacia el centro de la Tierra"
    },
    {
      "pregunta": "¿Quién fue el científico que descubrió la penicilina?",
      "opciones": ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Isaac Newton"],
      "respuesta": "Alexander Fleming"
    },
    {
      "pregunta": "¿Cuál es el órgano más grande del cuerpo humano?",
      "opciones": ["Corazón", "Piel", "Hígado", "Cerebro"],
      "respuesta": "Piel"
    },
    {
      "pregunta": "¿Qué animal pone los huevos más grandes?",
      "opciones": ["Tortuga", "Avestruz", "Cocodrilo", "Gallina"],
      "respuesta": "Avestruz"
    },
    {
      "pregunta": "¿Cuál es el gas más abundante en la atmósfera terrestre?",
      "opciones": ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Argón"],
      "respuesta": "Nitrógeno"
    },
    {
      "pregunta": "¿Quién es conocido como el padre de la teoría de la evolución?",
      "opciones": ["Charles Darwin", "Gregor Mendel", "Isaac Newton", "Albert Einstein"],
      "respuesta": "Charles Darwin"
    },
    {
      "pregunta": "¿Qué planeta tiene anillos visibles desde la Tierra?",
      "opciones": ["Júpiter", "Saturno", "Urano", "Neptuno"],
      "respuesta": "Saturno"
    },
    {
      "pregunta": "¿Cuál es el metal líquido a temperatura ambiente?",
      "opciones": ["Plomo", "Mercurio", "Aluminio", "Cobre"],
      "respuesta": "Mercurio"
    },
    {
      "pregunta": "¿Qué tipo de energía usa un panel solar?",
      "opciones": ["Energía eólica", "Energía nuclear", "Energía solar", "Energía geotérmica"],
      "respuesta": "Energía solar"
    },
    {
      "pregunta": "¿Qué partícula subatómica tiene carga positiva?",
      "opciones": ["Electrón", "Protón", "Neutrón", "Fotón"],
      "respuesta": "Protón"
    },
    {
      "pregunta": "¿Cuál es la velocidad de la luz en el vacío?",
      "opciones": ["300,000 km/h", "300,000 m/s", "300,000 km/s", "30,000 km/s"],
      "respuesta": "300,000 km/s"
    },
    {
      "pregunta": "¿Qué científico formuló las tres leyes del movimiento?",
      "opciones": ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"],
      "respuesta": "Isaac Newton"
    }
  ],
  "Deportes": [
    {
      "pregunta": "¿Cuántos jugadores componen un equipo de fútbol?",
      "opciones": ["9", "10", "11", "12"],
      "respuesta": "11"
    },
    {
      "pregunta": "¿En qué deporte se utiliza una raqueta para golpear una pelota sobre una red?",
      "opciones": ["Fútbol", "Tenis", "Baloncesto", "Voleibol"],
      "respuesta": "Tenis"
    },
    {
      "pregunta": "¿Cuál es la distancia de un maratón?",
      "opciones": ["32 km", "35 km", "42 km", "45 km"],
      "respuesta": "42 km"
    },
    {
      "pregunta": "¿En qué deporte se juega el Super Bowl?",
      "opciones": ["Fútbol", "Béisbol", "Fútbol Americano", "Baloncesto"],
      "respuesta": "Fútbol Americano"
    },
    {
      "pregunta": "¿Quién tiene el récord de más goles en la historia de la Copa del Mundo?",
      "opciones": ["Pelé", "Diego Maradona", "Ronaldo", "Miroslav Klose"],
      "respuesta": "Miroslav Klose"
    },
    {
      "pregunta": "¿Cuántos puntos vale una cesta en baloncesto?",
      "opciones": ["1", "2", "3", "4"],
      "respuesta": "2"
    },
    {
      "pregunta": "¿En qué deporte se usa una pelota redonda y se juega en un campo rectangular?",
      "opciones": ["Fútbol", "Hockey", "Béisbol", "Rugby"],
      "respuesta": "Fútbol"
    },
    {
      "pregunta": "¿Quién es conocido como 'La Pulga' en el fútbol?",
      "opciones": ["Cristiano Ronaldo", "Lionel Messi", "Neymar", "Pelé"],
      "respuesta": "Lionel Messi"
    },
    {
      "pregunta": "¿En qué año se celebraron los primeros Juegos Olímpicos modernos?",
      "opciones": ["1896", "1900", "1920", "1944"],
      "respuesta": "1896"
    },
    {
      "pregunta": "¿Cuál es el deporte nacional de Japón?",
      "opciones": ["Judo", "Fútbol", "Béisbol", "Sumo"],
      "respuesta": "Sumo"
    },
    {
      "pregunta": "¿Cuál es el nombre del famoso torneo de tenis que se juega en césped en Londres?",
      "opciones": ["Roland Garros", "US Open", "Australian Open", "Wimbledon"],
      "respuesta": "Wimbledon"
    },
    {
      "pregunta": "¿Qué equipo de fútbol ganó la Copa del Mundo de 2018?",
      "opciones": ["Brasil", "Alemania", "Francia", "España"],
      "respuesta": "Francia"
    },
    {
      "pregunta": "¿Cuántos jugadores hay en un equipo de baloncesto?",
      "opciones": ["5", "6", "7", "8"],
      "respuesta": "5"
    },
    {
      "pregunta": "¿Cuántos jugadores conforman un equipo de béisbol?",
      "opciones": ["8", "9", "10", "11"],
      "respuesta": "9"
    },
    {
      "pregunta": "¿Qué país ganó la Copa del Mundo de Fútbol 2014?",
      "opciones": ["Brasil", "Francia", "Alemania", "Argentina"],
      "respuesta": "Alemania"
    },
    {
      "pregunta": "¿En qué deporte se utiliza una canasta como objetivo?",
      "opciones": ["Fútbol", "Baloncesto", "Béisbol", "Rugby"],
      "respuesta": "Baloncesto"
    },
    {
      "pregunta": "¿Qué deporte consiste en patinar sobre hielo mientras se realizan saltos y acrobacias?",
      "opciones": ["Hockey sobre hielo", "Patinaje artístico", "Curling", "Bobsleigh"],
      "respuesta": "Patinaje artístico"
    },
    {
      "pregunta": "¿En qué deporte se utilizan raquetas y una pelota de pluma?",
      "opciones": ["Tenis", "Bádminton", "Squash", "Ping pong"],
      "respuesta": "Bádminton"
    },
    {
      "pregunta": "¿Quién fue el primer deportista en ganar 5 medallas olímpicas de oro en un solo evento?",
      "opciones": ["Michael Phelps", "Carl Lewis", "Usain Bolt", "Mark Spitz"],
      "respuesta": "Michael Phelps"
    },
    {
      "pregunta": "¿Qué país ganó el primer Mundial de Fútbol en 1930?",
      "opciones": ["Argentina", "Uruguay", "Brasil", "Italia"],
      "respuesta": "Uruguay"
    },
    {
      "pregunta": "¿En qué deporte destaca Simone Biles?",
      "opciones": ["Natación", "Gimnasia", "Atletismo", "Ciclismo"],
      "respuesta": "Gimnasia"
    },
    {
      "pregunta": "¿Cuántos sets se necesitan para ganar un partido de tenis en Grand Slam?",
      "opciones": ["2", "3", "4", "5"],
      "respuesta": "3"
    },
    {
      "pregunta": "¿Qué país ha ganado más Copas del Mundo de Fútbol?",
      "opciones": ["Alemania", "Brasil", "Italia", "Argentina"],
      "respuesta": "Brasil"
    },
    {
      "pregunta": "¿En qué deporte se usa un bate y un guante?",
      "opciones": ["Fútbol", "Béisbol", "Hockey", "Cricket"],
      "respuesta": "Béisbol"
    }
  ],
  "Arte y Cultura": [
    {
      "pregunta": "¿Quién escribió 'Cien años de soledad'?",
      "opciones": ["Pablo Neruda", "Gabriel García Márquez", "Mario Vargas Llosa", "Julio Cortázar"],
      "respuesta": "Gabriel García Márquez"
    },
    {
      "pregunta": "¿Qué instrumento tocaba Beethoven?",
      "opciones": ["Violín", "Piano", "Flauta", "Guitarra"],
      "respuesta": "Piano"
    },
    {
      "pregunta": "¿Quién pintó 'La noche estrellada'?",
      "opciones": ["Pablo Picasso", "Vincent van Gogh", "Salvador Dalí", "Claude Monet"],
      "respuesta": "Vincent van Gogh"
    },
    {
      "pregunta": "¿Qué escritor creó 'Harry Potter'?",
      "opciones": ["J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin", "Stephen King"],
      "respuesta": "J.K. Rowling"
    },
    {
      "pregunta": "¿En qué país nació el tango?",
      "opciones": ["Brasil", "Argentina", "Uruguay", "España"],
      "respuesta": "Argentina"
    },
    {
      "pregunta": "¿Qué compositor escribió 'Las cuatro estaciones'?",
      "opciones": ["Mozart", "Beethoven", "Vivaldi", "Bach"],
      "respuesta": "Vivaldi"
    },
    {
      "pregunta": "¿Qué estilo artístico es conocido por sus formas geométricas?",
      "opciones": ["Impresionismo", "Cubismo", "Surrealismo", "Expresionismo"],
      "respuesta": "Cubismo"
    },
    {
      "pregunta": "¿Qué cantante es conocido como 'El Rey del Rock and Roll'?",
      "opciones": ["Michael Jackson", "Elvis Presley", "Freddie Mercury", "John Lennon"],
      "respuesta": "Elvis Presley"
    },
    {
      "pregunta": "¿Qué obra literaria fue escrita por Miguel de Cervantes?",
      "opciones": ["La Divina Comedia", "Don Quijote", "Cien años de soledad", "El principito"],
      "respuesta": "Don Quijote"
    },
    {
      "pregunta": "¿Qué pintor español es conocido por su período azul?",
      "opciones": ["Salvador Dalí", "Pablo Picasso", "Joan Miró", "Diego Velázquez"],
      "respuesta": "Pablo Picasso"
    },
    {
      "pregunta": "¿Qué ballet cuenta la historia de un hada y un príncipe?",
      "opciones": ["El lago de los cisnes", "La bella durmiente", "Cascanueces", "Giselle"],
      "respuesta": "El lago de los cisnes"
    },
    {
      "pregunta": "¿Qué poeta chileno ganó el Premio Nobel de Literatura?",
      "opciones": ["Gabriel García Márquez", "Pablo Neruda", "Octavio Paz", "Mario Vargas Llosa"],
      "respuesta": "Pablo Neruda"
    },
    {
      "pregunta": "¿Qué arquitecto diseñó la Sagrada Familia en Barcelona?",
      "opciones": ["Antoni Gaudí", "Frank Lloyd Wright", "Le Corbusier", "Óscar Niemeyer"],
      "respuesta": "Antoni Gaudí"
    },
    {
      "pregunta": "¿Qué película ganó el primer Oscar a Mejor Película?",
      "opciones": ["Lo que el viento se llevó", "Alas", "Casablanca", "Cantando bajo la lluvia"],
      "respuesta": "Alas"
    },
    {
      "pregunta": "¿Qué instrumento musical es el más agudo?",
      "opciones": ["Trombón", "Violín", "Flauta", "Piccolo"],
      "respuesta": "Piccolo"
    },
    {
      "pregunta": "¿Qué escritor creó 'Sherlock Holmes'?",
      "opciones": ["Agatha Christie", "Arthur Conan Doyle", "Edgar Allan Poe", "Stephen King"],
      "respuesta": "Arthur Conan Doyle"
    },
    {
      "pregunta": "¿Qué estilo arquitectónico se caracteriza por arcos puntiagudos?",
      "opciones": ["Barroco", "Gótico", "Renacentista", "Neoclásico"],
      "respuesta": "Gótico"
    },
    {
      "pregunta": "¿Qué cantante es conocida como 'La Reina del Pop'?",
      "opciones": ["Madonna", "Beyoncé", "Lady Gaga", "Rihanna"],
      "respuesta": "Madonna"
    },
    {
      "pregunta": "¿Qué pintor mexicano es famoso por sus autorretratos con cejas?",
      "opciones": ["Diego Rivera", "Frida Kahlo", "José Clemente Orozco", "David Alfaro Siqueiros"],
      "respuesta": "Frida Kahlo"
    },
    {
      "pregunta": "¿Qué compositor escribió 'La flauta mágica'?",
      "opciones": ["Beethoven", "Mozart", "Bach", "Haydn"],
      "respuesta": "Mozart"
    },
    {
      "pregunta": "¿Qué obra de Shakespeare trata sobre un príncipe vengativo?",
      "opciones": ["Romeo y Julieta", "Macbeth", "Hamlet", "Otelo"],
      "respuesta": "Hamlet"
    },
    {
      "pregunta": "¿Qué movimiento artístico surgió en Nueva York en los años 50?",
      "opciones": ["Pop Art", "Expresionismo abstracto", "Surrealismo", "Dadaísmo"],
      "respuesta": "Expresionismo abstracto"
    },
    {
      "pregunta": "¿Qué escritor francés escribió 'Los miserables'?",
      "opciones": ["Victor Hugo", "Gustave Flaubert", "Émile Zola", "Albert Camus"],
      "respuesta": "Victor Hugo"
    },
    {
      "pregunta": "¿Qué película de 1997 ganó 11 premios Oscar?",
      "opciones": ["Titanic", "El Señor de los Anillos", "Forrest Gump", "Gladiador"],
      "respuesta": "Titanic"
    },
    {
      "pregunta": "¿Qué banda británica es conocida como 'Los Fab Four'?",
      "opciones": ["The Rolling Stones", "The Beatles", "Led Zeppelin", "Queen"],
      "respuesta": "The Beatles"
    }
  ],
  "Entretenimiento": [
    {
      "pregunta": "¿Qué actor interpretó a Jack Sparrow?",
      "opciones": ["Brad Pitt", "Johnny Depp", "Leonardo DiCaprio", "Tom Cruise"],
      "respuesta": "Johnny Depp"
    },
    {
      "pregunta": "¿Qué serie tiene como protagonista a Walter White?",
      "opciones": ["Breaking Bad", "The Sopranos", "Game of Thrones", "The Wire"],
      "respuesta": "Breaking Bad"
    },
    {
      "pregunta": "¿Qué película ganó el Oscar a Mejor Película en 2020?",
      "opciones": ["Parásitos", "1917", "Joker", "Once Upon a Time in Hollywood"],
      "respuesta": "Parásitos"
    },
    {
      "pregunta": "¿Qué cantante es conocido como 'El Rey del Pop'?",
      "opciones": ["Elvis Presley", "Michael Jackson", "Prince", "Justin Timberlake"],
      "respuesta": "Michael Jackson"
    },
    {
      "pregunta": "¿Qué plataforma de streaming lanzó 'Stranger Things'?",
      "opciones": ["HBO", "Disney+", "Netflix", "Amazon Prime"],
      "respuesta": "Netflix"
    },
    {
      "pregunta": "¿Qué película de Disney tiene como protagonista a Simba?",
      "opciones": ["Aladdín", "El Rey León", "Mulan", "Pocahontas"],
      "respuesta": "El Rey León"
    },
    {
      "pregunta": "¿Qué actor interpreta a Iron Man en el MCU?",
      "opciones": ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
      "respuesta": "Robert Downey Jr."
    },
    {
      "pregunta": "¿Qué serie tiene casas llamadas Stark, Lannister y Targaryen?",
      "opciones": ["The Witcher", "Vikings", "Game of Thrones", "The Crown"],
      "respuesta": "Game of Thrones"
    },
    {
      "pregunta": "¿Qué película tiene la famosa frase 'Yo soy tu padre'?",
      "opciones": ["Star Wars: El Imperio Contraataca", "Indiana Jones", "Volver al futuro", "Matrix"],
      "respuesta": "Star Wars: El Imperio Contraataca"
    },
    {
      "pregunta": "¿Qué cantante colombiana es conocida como 'La Reina del Reggaetón'?",
      "opciones": ["Shakira", "Karol G", "Becky G", "Natti Natasha"],
      "respuesta": "Karol G"
    },
    {
      "pregunta": "¿Qué película animada ganó el Oscar a Mejor Película en 2021?",
      "opciones": ["Soul", "Encanto", "Red", "Luca"],
      "respuesta": "Soul"
    },
    {
      "pregunta": "¿Qué serie sigue las aventuras de los hermanos Winchester?",
      "opciones": ["The Vampire Diaries", "Supernatural", "The Walking Dead", "Lucifer"],
      "respuesta": "Supernatural"
    },
    {
      "pregunta": "¿Qué película tiene como protagonista a Forrest Gump?",
      "opciones": ["Forrest Gump", "The Shawshank Redemption", "Pulp Fiction", "Goodfellas"],
      "respuesta": "Forrest Gump"
    },
    {
      "pregunta": "¿Qué actor interpreta a Spider-Man en el MCU actual?",
      "opciones": ["Tobey Maguire", "Andrew Garfield", "Tom Holland", "Jake Gyllenhaal"],
      "respuesta": "Tom Holland"
    },
    {
      "pregunta": "¿Qué película tiene la canción 'Let It Go'?",
      "opciones": ["Moana", "Frozen", "Coco", "Encanto"],
      "respuesta": "Frozen"
    },
    {
      "pregunta": "¿Qué serie sigue la vida de los miembros de la familia Pearson?",
      "opciones": ["This Is Us", "Modern Family", "The Crown", "Succession"],
      "respuesta": "This Is Us"
    },
    {
      "pregunta": "¿Qué película tiene como protagonista a Elle Woods?",
      "opciones": ["Mean Girls", "Legally Blonde", "Clueless", "The Devil Wears Prada"],
      "respuesta": "Legally Blonde"
    },
    {
      "pregunta": "¿Qué cantante es conocido como 'El Divo de Juárez'?",
      "opciones": ["Juan Gabriel", "Vicente Fernández", "Javier Solís", "Pedro Infante"],
      "respuesta": "Juan Gabriel"
    },
    {
      "pregunta": "¿Qué película tiene la frase 'Hasta el infinito y más allá'?",
      "opciones": ["Toy Story", "Monsters Inc.", "Cars", "Finding Nemo"],
      "respuesta": "Toy Story"
    },
    {
      "pregunta": "¿Qué serie sigue las vidas de los habitantes de Pawnee, Indiana?",
      "opciones": ["The Office", "Parks and Recreation", "Brooklyn Nine-Nine", "Community"],
      "respuesta": "Parks and Recreation"
    }
  ]
};
