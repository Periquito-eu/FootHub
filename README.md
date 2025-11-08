# ⚽ FootHub - Hub de Juegos de Fútbol

FootHub es una plataforma web interactiva que ofrece juegos y utilidades relacionadas con el fútbol. Actualmente incluye el juego "Adivina el Futbolista" con planes para expandirse con más características.

## 🎮 Juegos Disponibles

### Adivina el Futbolista

Un juego interactivo donde el sistema intenta adivinar el futbolista que estás pensando haciéndote preguntas de sí o no.

#### Características:
- **3 Niveles de Dificultad:**
  - 😊 **Fácil**: 20 preguntas, futbolistas muy populares (⭐)
  - 😎 **Intermedio**: 15 preguntas, futbolistas conocidos (⭐⭐)
  - 🔥 **Difícil**: 10 preguntas, futbolistas menos conocidos (⭐⭐⭐)

- **Base de Datos**: Más de 70 futbolistas con información detallada
- **Sistema Inteligente**: Algoritmo que selecciona las mejores preguntas para adivinar el jugador
- **Historial de Preguntas**: Visualiza todas las preguntas y respuestas durante el juego
- **Información Detallada**: Al finalizar, muestra datos completos del jugador adivinado

## 📁 Estructura del Proyecto

```
FootHub/
│
├── index.html                 # Página principal del hub
├── adivina-futbolista.html   # Página del juego
├── styles.css                 # Estilos globales
├── game.css                   # Estilos específicos del juego
├── app.js                     # JavaScript del hub principal
├── game.js                    # Lógica del juego
├── bdf.csv                    # Base de datos de futbolistas
└── README.md                  # Documentación
```

## 🚀 Cómo Usar

1. **Instalación Local:**
   ```bash
   # Clonar el repositorio
   git clone https://github.com/Periquito-eu/FootHub.git
   
   # Navegar al directorio
   cd FootHub
   ```

2. **Ejecutar:**
   - Simplemente abre `index.html` en tu navegador web
   - No requiere instalación de dependencias ni servidor

3. **Jugar:**
   - Selecciona "Adivina el Futbolista"
   - Elige tu nivel de dificultad
   - Piensa en un futbolista de la base de datos
   - Responde las preguntas con Sí o No
   - ¡Descubre si el sistema adivina correctamente!

## 🎯 Base de Datos de Futbolistas

La base de datos (`bdf.csv`) incluye información de 70+ futbolistas con los siguientes campos:

- **Nombre**: Nombre completo del jugador
- **Edad**: Edad actual
- **Número**: Número de camiseta
- **Posición Principal**: Posición en el campo
- **Otras Posiciones**: Posiciones alternativas
- **Club Actual**: Equipo actual
- **Clubes Anteriores**: Equipos previos
- **Liga Actual**: Liga donde juega
- **Ligas Anteriores**: Ligas donde jugó anteriormente
- **Hitos Destacados**: Logros y reconocimientos
- **Popularidad**: Nivel de 1-5 (1 = más popular, 3 = menos conocido)

### Ejemplos de Jugadores Incluidos:

- ⭐ **Popularidad 1**: Messi, Cristiano Ronaldo, Mbappé, Haaland, Neymar
- ⭐⭐ **Popularidad 2**: Bellingham, Lamine Yamal, Vinícius Jr., Harry Kane
- ⭐⭐⭐ **Popularidad 3**: Khvicha Kvaratskhelia, Mike Maignan, Xavi Simons

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura de las páginas
- **CSS3**: Estilos y animaciones
- **JavaScript (Vanilla)**: Lógica del juego y interactividad
- **CSV**: Base de datos de jugadores

## ✨ Características Técnicas

- **Diseño Responsive**: Funciona en dispositivos móviles, tabletas y escritorio
- **Animaciones Suaves**: Transiciones y efectos visuales agradables
- **Sin Dependencias**: No requiere frameworks o librerías externas
- **Algoritmo Inteligente**: Sistema de filtrado progresivo de jugadores
- **Interfaz Intuitiva**: Diseño limpio y fácil de usar

## 🎨 Personalización

Puedes personalizar FootHub modificando:

1. **Colores**: Edita las variables CSS en `styles.css`
   ```css
   :root {
       --primary-color: #2ecc71;
       --secondary-color: #3498db;
       /* ... más colores */
   }
   ```

2. **Jugadores**: Añade o modifica jugadores en `bdf.csv`

3. **Preguntas**: Agrega nuevas preguntas en el array `questions` de `game.js`

## 🔮 Próximas Características

- 🎲 **Quiz Relámpago**: Preguntas rápidas sobre fútbol
- 🏆 **Carrera de Goles**: Juego de acción y tiempo
- 📊 **Estadísticas de Jugadores**: Consulta datos detallados
- 📅 **Calendario de Partidos**: Próximos encuentros de las principales ligas
- 🏅 **Sistema de Puntuación**: Guarda tu récord y compite
- 👥 **Modo Multijugador**: Juega contra otros usuarios

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado por **Periquito-eu**

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar FootHub:

1. Fork el repositorio
2. Crea una rama para tu característica (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📞 Contacto

Si tienes preguntas o sugerencias, no dudes en abrir un issue en GitHub.

---

**¡Disfruta jugando en FootHub! ⚽🎮**