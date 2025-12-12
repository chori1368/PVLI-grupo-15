## ***Especificación Técnica de Juego***

### **Diagrama de arquitectura:**

![](https://i.imgur.com/ILgNifi.png) 

### **Descripción:** 
En este documento se describen los detalles técnicos de los diferentes objetos y escenas del juego.

### **Puente:** 
El puente será la base del nivel y plataforma principal, va desde un extremos de la pantalla (1200px provisional) al otro. Este puente tendrá una colision sólida en su parte superior de extremo a extremo. El puente estará desde el comienzo del nivel dividido en sus partes para el evento de "floor is lava" donde estas subiran y bajaran a distindas velocidades en funcion de un número ramdom sacado del phaser.math.between().

Clase: Bridge

Métodos:
 - Constructor[]: se construye el puente creando varios segmentos de tipo ground (se calcula cuantos segmetos se han de construir en función del tamaño de la imagen del segmeto y el tamaño del nivle) y alineandolos para que quede una plataforma recta.
 - Break(interval): por cada segmento se llamara el método move con el el segmento, la posicion a la que baja y el tiempo que tarda en hazerlo.
 - move(segment,height,interval): con estos valores haze un tween que subira o bajara el puente.
 - destroy(): destruye el objeto.

### **Plataforma:**
Las plataformas del nivel serán columnas fijas con una superficie sólida en su extremo superior. El sprite de la plataforma irá compuesto por una base rectangular (sólida) y una columna de una altura de 600px (no sólida). Estas plataformas estarán colocadas de forma manual al inicio del combate. Tambien existen plataformas que se destruyen al estar un reto encima de ellas.
Clase: Platform

Métodos:
 - Constructor[]: se construye un gameobject de phaser y se modifica su collider para que solo ocupe la parte superior de la plataforma, para que sea tipo smash bros y se pueda subir desde debajo de la plataforma se pone en false el body.checkCollision.down. (this.body.checkCollision.down = false;)

Clase: floating

Métodos:
 -addCollision(player): se crea collider con el jugador y al cabo de un tiempo se activa un tween para que se destruya.

### **Lava:**
Estará presente desde el inicio del combate con un sprite y colisión situada debajo del puente. Cualquier contacto entre un jugador y este objeto hará que el jugador pierda bastante vida.

Clase: Lava

Métodos:
 - Constructor[]: se crea un sprite de lava.
 - addCollision(player): recibe un player y crea un overlap entre este y su sprite donde si ocurre se llama a una función que resta vida al player y lo hace rebotar.

### **Personaje:**
Se podrá elegir entre dos tipos de jugadores uno con espada y otro con lanza la mayoría del funcionamiento enta en una clase común player de la que heredaran y cambiaran los métodos y variables necesarias.

Clase: Player

Variables:
 - attackbox: son dos la hattackbox y la vatttackbox, son una zona invisible de phaser cada una con su tamaño correspondiente y son las que colisionan con el otro jugador para producir daño.
 - h/x offset: son offset para que las attackbox se coloquen en la posicion correcta en función del player.
 - healthbar: se llama con document.querySelector porque al igual que el tiempo son parte del index.html.
 - además de algunas basicas como speed, life, jumpspeed, etc.

Métodos:
 - constructor[side]: se crea el sprite con sus físicas, se le dan valor a todas sus variables, se crean la animaciones, se le asignan teclas,arma,barra de vida en función del side dado al constructor.
 - handleinput(): se comprueba todo el movimiento del player tanto al pulsar las diferentes teclas como cuando toca el suelo y las animaciones. llamando a diferentes metodos para que al sobrescribir en las clases hijas sea más sencillo.
 - attack(): hay dos métodos de este tipo el horizontal y el vertical. en estos metodos se cumprueba el colldown del ataque, se posiciona la zona de hitbox con su offset correspondiente y reproduce su animación de ataque.
 - addcollision(player): añade overlap con el otro player que es el que recibe y sus dos zonas de hitbox implementando la logica de cuando se produce un golpe entre el ataque y el otro jugador.
 - varios métodos getter y setter.

Clase: PlayerSword

solo sobrescribe el metodo de doblesalto.

Clase: PlayerSpear

ajusta los offset de los attackbox ya que estas son más grandes.
sobreescribe el doble salto y el addcollision para añadir el dash.

### **Ardilla y té:**
La ardilla se movera por el coliseo y lanzara té cada cierto tiempo.

Clase: Squirrel

Métodos:
- La mayoría son tweens excepto throwTea(): que crea un objeto Tea y llama a sus métodos.
- Cuando dissapear() acaba la ardilla se destruye sola.

Clase: Tea

Metodos:
- enablePhysics(): para que el té empieze a caer.
- flyToTarget(): tween para que el té se mueva hacia en sitio donde la ardilla lo lanza.
- addcollision(player): collision con el player.

### **Caja:**
una caja que los jugadores pueden mover. Es un sprite de caja con físicas y colliders.

### **Scenas:**
Hay cuatro escenas pero la mas importante es la de level que es la que tiene la gran mayoría del codigo.

Clase: intro

- Tween que muesta el logo del grupo y que al acabar o al saltarse con espacio o enter se pasa a la seleccion de personajes.

Clase: selection

- varios imagenes,textos y un botón de continuar para pasar al level. En esta escena se guarda de que tipo es cada jugador para pasarselo al level cuando se pulse continuar.

Clase: result

- recibe un data en el create que le indica que jugador ha ganado y crea todos los textos, imagenes y el botón de continuar.

Clase: level

Variables: 

 - Todos los objetos del nivel: players,suelo,plataformas,cajas,el tiempo y las barras de vida.

Métodos:
 - create(data): recibe el tipo de cada jugador y crea todos los objetos de la escena, habilita el timer y las barras de vida, les da sus colisiones e inicia los temporizadores para el "floor is lava" y la destruccion total del puente.
 - isGameover(): comprueba si uno de los dos jugadores a muerto y si es así cambia a resultados dandole el jugador que ha ganado y deshabilita las barras de vida y el timer.
 - update(): llama a los démas metodos, a los handleinput de los jugadores, al update de las plataformas y si ha pasado el cooldown del spawn del té llama a spawnSquirrel.
 - spawnSquirrel(): crea una ardilla en la derecha o izquierda y reinicia el timer para spawnear el té. 
 - updateClock(): actualiza el timer a los segundo restantes.
 - cameraFollow(): hace los calculos para que la cámara siga a los dos jugadores tipo smash bros.

### **UI:**
El menu de inicio, el de pausa, el timer y las barras de vida se crean en el styles.css y se colocan en el index.html.

Por eso a las barras de vida y al times se asignan con document.querySelector.

Y tampoco existe un menudeinicio.js y un menudepause.js por eso mismo.
