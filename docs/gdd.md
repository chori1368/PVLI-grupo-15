***<h1 align="center">Souls’ Arena</h1>***

*<h5 align="center">Documento de Diseño</h5>*

#### *Grupo 15 - Gehena Games*

##### Andrés Bartolomé Clap Tomás Arévalo Almagro Carlos Dochao Moreno 

### **Descripción:** 

Juego de lucha estilo “smash-bros” en el que dos jugadores pelean entre sí de forma local para determinar quien cruza la frontera del inframundo y regresa al mundo de los vivos. Ciertos eventos y plataformas podrán determinarán el curso de las partidas. 

### **Género:** 

El juego se clasifica dentro del género de lucha 2D, con características de scroll lateral y plataformas. 

### **Público objetivo:** 

El público objetivo es amplio, enfocado tanto a jugadores casuales como a jugadores competitivos que disfrutan de la complejidad de los juegos de lucha. 

### **Setting:** 

Encarnas a un alma en pena destinada al infierno, donde Hades te ofrecerá una oportunidad para volver a la vida. Tendrás que luchar contra otros gladiadores en un coliseo-puente donde multitud de eventos pueden alterar las condicio es del combate para finalmente determinar el ganador de la batalla y cruzar la frontera del inframundo. 

### **Características principales:** 

- Lucha 2D con armas de corta-media distancia 
- Dos personajes jugables con habilidades diferentes 
- Plataformas móviles y estáticas
- Eventos adversos dinámicos (the floor is lava...) 
- Multijugador local (en un único ordenador) 

### **Objetivo del juego:** 

El objetivo del juego es acabar con tu oponente por medio de golpes con tu correspondiente arma hasta que reduzcas su barra de vida o cero, para ello ambos jugadores disponen de 2 minutos de partida. Si en 1 min 30 seg ambos jugadores siguen con vida se iniciará el evento de "the floor is lava". Que determinará al cabo de 30 seg el vencedor del combate (ver "Floor is Lava" en mecánicas).

### **Flujo del juego:** 

![](https://i.imgur.com/tUb0vzM.png)

### **Inicio:** 

![](https://i.imgur.com/Sn3kMTo.png)

El juego empieza en el menú de inicio, donde se podrá acceder a la selección de personajes (tras una breve animación¿?) por medio del botón “JUGAR”. 

### **Selección de personajes:** 

![](https://i.imgur.com/9Uyvgc0.png)

En el menú de selección, cada jugador podrá elegir un personaje haciendo uso de los controles mostrados en su lado de pantalla correspondiente, también podrán previsualizar el arma y habilidades concretas de los personajes disponibles. Una vez confirmadas las selecciones por ambos jugadores se pasará a la pantalla de controles. 

### **Controles:** 

![](https://i.imgur.com/iRQwl2j.png)

En la visualización de controles cada jugador podrá ver y probar sus controles correspondientes. Se podrá regresar a la pantalla de selección si se desea por medio del botón “VOLVER”, o iniciar la partida por medio del botón “COMENZAR PARTIDA”.

### **Combate:** 

![](https://i.imgur.com/QQYJY4J.png)

En la pantalla de combate se encuentra el nivel principal (coliseo infernal). Tras una cuenta atrás desde 3 el combate dará comienzo. Tras finalizarse el combate pasarán (tras una breve animación¿?) a la pantalla de resultado. 

### **Resultado:** 

![](https://i.imgur.com/WGTI1JF.png)

En esta pantalla se muestra el ganador del combate. Se podrá retroceder al menú de inicio o volver a jugar (que devolverá a los jugadores a la pantalla de selección de personajes¿?)

### **Estética y contenido:** 

El apartado visual se inspira en los clásicos juegos de lucha arcade, utilizando un estilo pixel-art de baja resolución para transmitir una estética retro. Se utilizará una paleta de tonos oscuro-rojizos-morados para transmitir esa atmósfera de infierno caótico y oscuro que se pretende reflejar.

Los jugadores serán representados como gladiadores romanos con prendas perjudicadas y suciedad en el cuerpo, distinguiéndose entre sí por la diferencia del color de su ropaje (ya qu es posible que ambos jugadores escogan el mismo personaje). 

En cuanto al escenario, este se sitúa sobre un puente del río Estigia y funciona como un coliseo-puente, permitiendo a los jugadores moverse lateralmente por él. El agua del río se tornará en lava  cuando de comienzo el evento de "Floor is Lava", quebrándose el puente en múltiples plataformas que se sumergen y aparecen sobre la lava. En el fondo de la escena y alrededor del puente se sitúan las gradas de lo que conforma un gran coliseo sobre el puente, con Hades sentado en la zona central como gran figura divina orquestando el combate. 

### **Narrativa:** 

Destinado a la condena eterna, Hades, deidad del inframundo, te concede una gran oportunidad: salir victorioso en un combate impredecible sobre el río Estigia para volver a la vida cruzando la frontera del inframundo.

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
  - Golpe de lanza (Shift Derecho) 
  - Golpe de lanza vertical (Guión)
 
    El movimiento de los personajes determinará de forma direccional el ataque de las arams de ambos jugadores en su ataque
    
- #### **Floor is lava:**

  Cada partida tiene un tiempo limitado de juego de 2 minutos. Al alcanzarse el minuto y medio de partida, el puente se quebrará en 5 secciones y el agua del río se volverá lava, dando así comienzo a este evento. Durante los 30 segundos que dura este evento, las múltiples secciones del puente quebrado se sumergirán y aparecerán cada 5 segundos, dejando sobre el campo de juego 2-3 plataformas (distribuidas de forma aleatoria y no-uniforme sobre el nivel) que permitirán a los jugadores evitar tocar la lava mientras siguen luchando. Al finalizar los 30 segundos del evento las plataformas se sumergirán una vez más para no volver a reaparecer. Cabe mencionar que entonces, el primer jugador en tocar la lava, perderá toda su vida restante y el jugador en pie (en el aire en este caso) obtendrá la victoria. Los jugadores podrán identificar el final del evento mirando al temporizador en el centro superior de la pantalla, de igual manera, un sonido (de campanas¿?) y un sutíl gesto de Hades en el fondo del escenario indicarán a los jugadores que el tiempo ha acabado y que por tanto, cuando uno de ellos caiga en la lava se terminará definitivanmente el combate.

  Nota: Si a lo largo del evento un jugador cae en la lava, este perderá de igual manera toda su vida restante, otorgando igualmente la victoria al jugador en pie.

  ![](https://i.imgur.com/Caj0Z8r.jpeg)
  
### **Interfaz:** 

La interfaz de juego es la básica de un juego de lucha, contando con dos barras de vida en la zona superior de la pantalla (una en cada lateral) y en el centro superior un temporizador con el tiempo restante de juego.

### **Personajes:** 

- **Gladiador espadachín:** Este gladiador posee una espada con la que podrá atacar a corta-media distancia con un intervalo corto de ataque. Este personaje cuenta con la habilidad de doble salto, con la que podrá pulsar dos veces la tecla de salto (en un intervalo muy breve de tiempo) para realizar un segundo salto sin necesidad de tocar ninguna superficie. Esto le beneficiará en eventos de juego donde el salto entre plataformas sea prioritario, el salto doble tiene un ligero cooldown al realizarse, por lo que se evita que el jugador pueda sacar una ventaja extrema con esta habilidad. Este personaje cuenta con la ventaja de un ataque más rápido y un rango de salto y movimiento más variado.

![](https://i.imgur.com/8A5Vim2.jpeg)

- **Gladiador con lanza:** Este gladiador cuenta con una lanza de largo alcance con la que podrá atacar a corta-larga distancia con un intervalo de ataque sensiblemente mayor que la del espadachín. Como habilidad, este personaje podrá lanzarse (valga la redundancia) **horizontalmente** haciendo un "dash" tras realizar un salto, pudiendo no solo inlingir daño al enemigo (si se encuentra en su trayectoria) sino también llegar más lejos que con un salto corriente. El "dash" se verá afectado por un cooldown similar al del salto doble del gladiador espadachín. Este personaje cuenta con la ventaja de poder llegar más lejos a la hora de saltar realizando un "dash", así como la posibilidad de atacar en un rango más amplio.

![](https://imgur.com/YV8lzde.jpeg)

### **Niveles:** 

Existe un único nivel que consiste en un escenario con 3 plataformas fijas elevadas a distintas alturas sobre el suelo para que los jugadores puedan no solo desplazarse por toda la superficie del puente, sino saltar entre estas plataformas del nivel. las plataformas fijas del nivel desaparecerán por completo sumergidas en la lava al dar comienzo el evento de "the floor is lava".

### **Referencias:** 

En cuanto a las referencias, podemos encontrar claras inspiraciones en los juegos de lucha antiguos como street fighter, mortal kombat o tekken. También en mecánica de juego con plataformas podemos encontrar inspiración de juegos como el super smash bros. 

En cuanto a la ambientación, se inspira en el infierno de Hades (TODO: poner referencias visuales también). Por último, el apartado visual imita el arte pixel art de las máquinas recreativas antiguas (TODO: poner referencias de pixel arts parecidos)