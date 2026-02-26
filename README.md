# Aithena

Aithena es una aplicación web que ayuda a personas con Trastorno del Espectro Autista (TEA) a iniciar y completar tareas del día a día sin paralizarse en el intento.

> Un paso. Ahora. Solo eso.

---

## ¿Por qué existe esta app?

Muchas personas con TEA tienen dificultades con las **funciones ejecutivas**: el conjunto de procesos cognitivos que nos permiten planificar, iniciar, sostener y completar una tarea. No es falta de inteligencia ni de voluntad. Es que el cerebro autista procesa la planificación de forma diferente.

El resultado concreto: una tarea simple como "preparar la mochila" puede convertirse en un muro invisible. Sabés lo que tenés que hacer, pero no podés empezar. O empezás y te perdés. O perdés la noción del tiempo y te das cuenta de que pasaron dos horas.

Las herramientas existentes no resuelven esto. Los gestores de tareas tradicionales (Todoist, Notion, TickTick) asumen que el usuario ya sabe:

- Qué pasos implica cada tarea
- En qué orden ejecutarlos
- Cuánto tiempo va a llevar cada uno
- Cómo retomar si se pierde

Para alguien con dificultades ejecutivas, esa carga de planificación previa **es exactamente el problema**.

---

## ¿Qué son las funciones ejecutivas?

Las funciones ejecutivas son habilidades cognitivas que regulan el comportamiento orientado a metas. Incluyen:

- **Iniciación de tareas**: arrancar a hacer algo, vencer la inercia inicial
- **Planificación y organización**: descomponer un objetivo en pasos concretos
- **Memoria de trabajo**: mantener en mente qué estás haciendo y cuál es el siguiente paso
- **Control del tiempo** (*time awareness*): percibir cuánto tiempo pasa y ajustar el ritmo
- **Flexibilidad cognitiva**: adaptarse si algo cambia o sale mal
- **Inhibición**: no distraerse ni cambiar de tarea a mitad de camino

En personas con TEA, estas funciones suelen estar afectadas en distintos grados. Aithena apunta específicamente a compensar las tres primeras: la iniciación, la planificación y el seguimiento del tiempo.

---

## ¿En qué se diferencia de otros gestores de tareas?

| | Gestores tradicionales | Aithena |
|---|---|---|
| ¿Quién planifica los pasos? | El usuario | La IA |
| ¿Cuántos pasos ves a la vez? | Todos | Uno |
| ¿Tiene timer visual integrado? | No | Sí |
| ¿Pensado para carga cognitiva baja? | No | Sí |
| ¿Requiere configuración previa? | Sí | No |

La diferencia clave es que Aithena **externaliza la planificación**. Vos describís la tarea en lenguaje natural, como si se la contaras a alguien. La IA se encarga de descomponerla en micro-pasos concretos y secuenciales. Después, solo tenés que ejecutar un paso a la vez, con un timer que te indica cuánto tiempo dedicarle.

No es un gestor de proyectos. No es una app de productividad general. Es una herramienta de asistencia cognitiva enfocada en un problema específico.

---

## ¿Cómo funciona?

1. **Ingresá tu tarea** en lenguaje natural (ej: "preparar el bolso para el gym")
2. **La IA la desglosa** en micro-pasos concretos y secuenciales
3. **Ejecutá paso a paso** con un timer visual que te indica cuánto tiempo dedicar a cada uno
4. **Completaste.** Sin sobrecarga cognitiva, sin paralización.

---

## Desarrollo local

```bash
# 1. Clonar el repositorio
git clone https://github.com/ayrtonnacer/aithena.git

# 2. Entrar al directorio
cd aithena

# 3. Instalar dependencias
npm install

# 4. Correr el servidor de desarrollo
npm run dev
```

Requiere Node.js. Se recomienda instalar con [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
