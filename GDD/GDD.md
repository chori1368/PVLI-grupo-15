# ***Souls’ Arena***

##### *Documento de Diseño*

#### *Grupo 15 - Gehena Games*

##### Andrés Bartolomé Clap Tomás Arévalo Almagro Carlos Dochao Moreno 

### **Descripción:** 

Juego de lucha estilo “smash-bros” en el que dos jugadores pelean entre sí de forma local para determinar quien cruza la frontera del inframundo y regresa al mundo de los vivos. Ciertos eventos y plataformas podrán determinarán el curso de las partidas. 

### **Género:** 

El juego se clasifica dentro del género de lucha 2Dl, con características de scroll lateral con plataformas. 

### **Público objetivo:** 

El público objetivo es amplio, enfocado tanto a jugadores casuales como a jugadores competitivos que disfrutan de la complejidad de los juegos de lucha. 

### **Setting:** 

Encarnas a un alma en pena destinada al infierno, donde Hades te ofrece una oportunidad para cruzar la frontera del mundo de los muertos y volver a la vida. Tendrás que luchar cuerpo a cuerpo contra otros gladiadores en un coliseo donde multitud de eventos pueden surgir para finalmente determinar el ganador de la batalla y cruzar la frontera del inframundo. 

### **Características principales:** 

- Lucha cuerpo a cuerpo 
- Eventos adversos (el suelo se convierte en lava y sube poco a poco…) 
- Multijugador local (un único dispositivo) 

### **Objetivo del juego:** 

El objetivo del juego es luchar contra tu oponente en un tiempo límite hasta dejarle sin vida, ganando así el combate y logrando cruzar al mundo de los vivos de nuevo. 

### **Flujo del juego:** 

![](flujodeljuego.png)

### **Inicio:** 

![](inicio.png)

El juego empieza en el menú de inicio, donde se podrá acceder a la selección de personajes (tras una breve animación) por medio del botón “JUGAR”. 

### **Selección de personajes:** 

![](seleccionpersonajes.png)

En la selección de personajes cada jugador podrá elegir un personaje con los controles mostrados y ver la habilidad correspondiente al personaje seleccionado. Una vez confirmadas las selecciones por ambos se procederá a la pantalla de controles. 

### **Controles:** 

![](controles.png)

En la visualización de controles cada jugador podrá ver y probar sus controles correspondientes antes de proceder al combate. Se podrá regresar a la pantalla de selección si se desea. 

### **Combate:** 

![](combate.png)

En la pantalla de combate se encuentra el nivel principal (coliseo infernal). Ambos jugadores jugarán y una vez finalizada la partida pasarán (tras una breve animación) a la pantalla de resultado. 

### **Resultado:** 

![](resultado.png)

### **Estética y contenido:** 

El apartado visual se inspira en los clásicos juegos de lucha arcade, utilizando un estilo pixel-art de baja resolución para transmitir una estética retro. Se utilizará una paleta de tonos oscuro-rojizos-morados para transmitir esa atmósfera de infierno caótico y oscuro que se pretende reflejar. 

Los jugadores serán representados como gladiadores romanos con prendas perjudicadas y suciedad en el cuerpo, distinguiéndose entre sí un jugador de otro por la diferencia del color de su ropaje y sus armas únicas a cada uno. 

En cuanto al escenario, este se sitúa sobre un puente del río Estigia que funciona como coliseo horizontal, por este río circula lava que puede verse en el inferior de la pantalla bajo el puente, en el fondo y alrededor del puente se sitúan las gradas de lo que conforma un gran coliseo. Por último, se ve en el fondo central del coliseo a Hades, que aparece como gran figura divina orquestando el combate. 

### **Narrativa:** 

Destinado a la condena eterna, Hades, deidad del infierno, te concede una gran oportunidad: salir victorioso en un combate impredecible sobre el río Estigia para volver a la vida cruzando la frontera del inframundo.

### **Mecánicas:** 

- #### **Gladiador espadachín:**
  
  - Movimiento horizontal (A - D) 
  - Salto (W) 
  - Salto doble (W x2) 
  - Estocada horizontal (E) 
  - Corte horizontal (R)
 
- #### **Gladiador con lanza:**
  
  - Movimiento horizontal (Izquierda - Derecha) 
  - Salto (Flecha Arriba) 
  - "Dash" con lanza (flecha arriba x2) 
  - Golpe de lanza horizontal (Shift Derecho) 
  - Golpe de lanza vertical (Guión)
    
- #### **Floor is lava:** 

Cada partida tiene un tiempo limitado de juego de 2 minutos. Al alcanzarse el minuto y medio de partida la lava comenzará a subir por 30 segundos). Desaparecerán las plataformas existentes y aparecerán progresivamente plataformas en forma de columnas y estructuras (conectadas al suelo) que permitirán a los jugadores evitar la lava, estas estructuras se irán sumergiendo y reapareciendo en distintas localicaciones de forma aleatoria a lo largo del evento floor is lava hasta que finalmente se sumergan y no reaparezcan más (al final del contador de tiempo).

![](https://i.imgur.com/Caj0Z8r.jpeg)
  
### **Interfaz:** 

La interfaz es la básica de un juego de lucha, contando con dos barras de vida y una imagen de cada personaje, en el centro superior un temporizador con el tiempo que queda de juego.

### **Personajes:** 

- Gladiador espadachín: Este gladiador posee una espada en sus manos con la que podrá atacar a corta-media distancia con un intervalo medio de ataque. Este personaje cuenta con la habilidad de doble salto, con la que podrá pulsar repetidamente la tecla de salto para realizar un segundo salto sin necesidad de tocar ninguna superficie. Esto le beneficiará en eventos de juego donde el salto entre plataformas sea prioritario (como el de suelo es lava), el salto doble tiene un ligero cooldown al realizarse, por lo que se evita que el jugador pueda sacar una ventaja injusta con esta habilidad. Este personaje cuenta con la ventaja de un ataque más rápido y un rango de salto y movimiento más variado.

- Gladiador con lanza: Este gladiador cuenta con una lanza de largo alcance con la que podrá atacar a corta-media-larga distancia con un intervalo de ataque sensiblemente mayor que el espadachín. Como habilidad, este personaje podrá lanzarse (valga la redundancia) haciendo un dash con la lanza, pudiendo no solo inlingir daño al enemigo sino también llegar más lejos que con un salto corriente. El "dash" se verá afectado por un cooldown similar al del salto doble del gladiador espadachín. Este personaje cuenta con la ventaja de poder llegar más legos a la hora de saltar realizando un "dash", así como la posibilidad de atacar en un rango más amplio.

### **Niveles:** 

Al ser un videojuego de lucha solo hay un nivel que consiste en un escenario con plataformas en el que se pelearán el uno contra el otro hasta que empiece a subir la lava y tendrán que pelear mientras van subiendo por el escenario para que no les toque.

### **Referencias:** 

En cuanto a las referencias, podemos encontrar las claras inspiraciones en los juegos de lucha antiguos como el street fighter, mortal kombat o tekken, pero también en su plataforma podemos encontrar inspiración de los juegos de super smash bros. En cuanto a la ambientación, se inspira en el infierno de Hades. Por último, el apartado visual imita el arte pixel art de las máquinas recreativas antiguas.
