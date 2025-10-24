## ***Especificación Técnica de Juego***

### **Descripción:** 

En este documento se describen los detalles técnicos de los diferentes objetos y escenas del juego.

### **Puente:** 

El puente será la base del nivel y plataforma principal, va desde un extremos de la pantalla (1200px provisional) al otro. Este puente tendrá una colision sólida en su parte superior de extremo a extremo. El puente estará desde el comienzo del nivel hasta el momento "Floor is Lava", momento en el cúal se reemplazará la instancia del puente por una réplica compuesta de trozos de puente (BridgeSpan).

Clase: Bridge

Métodos:

 - Constructor[]
 - Replace() ?
 - Destroy() ?

### **Plataforma:**

Las plataformas del nivel serán columnas fijas con una superficie sólida en su extremo superior. El sprite de la plataforma irá compuesto por una base rectangular (sólida) y una columna de una altura de 600px (no sólida). Estas plataformas estarán colocadas de forma manual al inicio del combate y deberán de desaparecer (sumergirse) junto con el puente en el momento "The floor is lava".

Clase: Platform

Métodos:
 
 - Constructor[]
 - HideDown() // Cambia su posición Y hasta que no se vea en pantalla y se destruye
 - Destroy() ?

### **Sección de puente:**

Al iniciarse el evento "Floor is Lava" se creará una réplica del puente en su misma posición (no debe ser perceptible este cambio) conformada por varios BridgeSpan, a continuación desaparecerán rápidamente secciones de forma aleatoria dejando una o dos secciones en el nivel. Cuando se hayan hundido todas menos unas cuantas, empezarán a sumergirse lentamente estas secciones restantes y al mismo tiempo saldrán de la lava hacia arriba otras secciones del puente previemante sumergidas, llegando poco a poco a su altura final (aleatoria dentro del rango jugable) y conforme se llegue a su altura target se volverán a hundir conforme suben otras. Este proceso se repetirá hasta el final del evento "Floor is Lava" (duración 30 seg) si no ha muerto ningún jugador, cuando el evento llega a su final las plataformas que estén en ese momento subiendo hasta su altura target, serán las últimas plataformas en mostrarse (se hundirán permanentemente y no saldrán de la lava otras secciones).

Clase: BridgeSpan

Métodos:

 - Constructor[]
 - HideDown() // Cambia su posición Y hasta que no se vea en pantalla
 - ShowUp(int y) //
 - Destroy() ?

### **Lava:**

Estará presente desde el inicio del combate con un sprite y colisión situada debajo del puente. Al iniciarse el evento "Floor is Lava" el sprite (animación) de agua cambiará (progresivamente o directamente) al sprite (animación) de lava. Cualquier contacto entre un jugador y este objeto hará que pierda el total de su vida

Clase: Lava

Métodos:

 - Constructor[]
 - ChangeToLava()

### ***Personaje 1:***
Hacer personaje

### ***Personaje 2:***
Hacer personaje