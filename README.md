# DevTutor Bot

Una interfaz de mentoría para Angular y TypeScript: un tutor de chat cuyas
respuestas se fundamentan en un corpus markdown indexado, con vistas para la
base de conocimiento y las ejecuciones de evaluación.

Construido sobre Next.js 16 (App Router) y React 19 con CSS Modules. La interfaz
está en español; la recuperación entiende preguntas en español y en inglés.

## La recuperación es local

**No se llama a ningún modelo.** A pesar de la marca Llama 3 en la interfaz, las
respuestas no se generan: se recuperan de cuatro documentos markdown definidos
en [`src/lib/corpus.ts`](src/lib/corpus.ts) mediante coincidencia léxica de
palabras clave, y se devuelven tal cual. No hay clave de API, ni backend, ni
ninguna petición de red.

Esto es deliberado, no un apaño: la interfaz está construida para *mostrar* de
dónde sale cada respuesta, y solo puede hacerlo con honestidad sobre un corpus
que realmente tiene. Cada respuesta lleva las secciones de las que procede y una
puntuación de coincidencia, y una pregunta que el corpus no cubre lo dice en
lugar de inventarse la respuesta.

Si conectas esto a un modelo real, lo que hay que conservar es el contrato de
citación: la interfaz promete fundamentación en cada respuesta, así que la vía
de generación tiene que poder producirla.

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

| Script | Hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build de producción |
| `npm run lint` | ESLint |

## Las tres vistas

**Tutor de chat** — Haz una pregunta o elige una de las cuatro sugerencias. La
traza de recuperación llena una barra por documento indexado mostrando cuánto de
la pregunta cayó en cada uno, y después llega la respuesta con sus fragmentos de
origen.

**Base de conocimiento** — El corpus indexado: archivo, secciones y resumen de
cada documento, incluidos los que añadas en caliente.

**Ajuste y evaluación** — Métricas de los adaptadores. Son datos de muestra
estáticos de [`src/lib/eval-runs.ts`](src/lib/eval-runs.ts); no consultan ningún
entrenamiento en curso. El delta destacado se calcula a partir de las
ejecuciones, así que la insignia de la barra lateral y la tabla no pueden
contradecirse.

El chat sigue montado detrás de `Activity` de React mientras estás en otra
vista, así que cambiar de vista no descarta la conversación.

## Recuperación bilingüe

Las preguntas se normalizan quitando acentos antes de tokenizarlas, así que
«genéricos» y «genericos» son el mismo token y la «ñ» sobrevive como «n». Cada
documento indexa términos en los dos idiomas, y los plurales se resuelven
probando a quitar `-es` y `-s`.

Esto importa si traduces la interfaz: una interfaz en un idioma con términos
indexados en otro parece funcionar hasta que alguien escribe una pregunta real.

## Añadir un documento

**Añadir doc** en la barra superior indexa un archivo `.md` o `.txt` (hasta
500 KB) en el corpus de la sesión. Queda consultable de inmediato y aparece en la
base de conocimiento. Los términos salen de las palabras repetidas y del nombre
del archivo.

Esto vive solo en memoria: al recargar vuelves a los cuatro documentos de
partida. Para añadir uno de forma permanente, agrega un `CorpusDoc` a
`INDEXED_CORPUS` en [`src/lib/corpus.ts`](src/lib/corpus.ts) con los términos que
deban encaminar una pregunta hacia él.

## Estructura

```
src/
  app/            layout (fuentes, tokens), shell de página, CSS global
  lib/
    corpus.ts     los cuatro documentos + recuperación léxica
    chat.ts       modelo de mensajes, marcas de tiempo, construcción de respuestas
    markdown.ts   lector de markdown reducido (párrafos, listas, bloques de código)
    eval-runs.ts  métricas de muestra de los adaptadores
  components/
    providers.tsx estado del corpus y de la vista activa
    shell/        barra lateral, barra superior, Añadir doc
    chat/         panel de chat, redactor, mensajes, traza de recuperación
    panels/       conmutador de vistas, base de conocimiento, evaluación
```

Los componentes de servidor renderizan todo lo que pueden: la estructura de la
barra lateral y la vista de evaluación entera se renderizan en el servidor, y
esta última se pasa como prop a través de la frontera de cliente para que no
envíe nada de JavaScript. Las islas de cliente se limitan a lo que realmente
guarda estado.

## Notas de diseño

Tres tipografías, cada una con un papel en lugar de decorar:

- **Sora** — la voz del producto (marca, titulares)
- **Manrope** — la voz del mentor (prosa, respuestas)
- **JetBrains Mono** — la voz de la máquina (modelos, versiones, citas, trazas)

Los tokens están al principio de
[`src/app/globals.css`](src/app/globals.css). El único color de acento, el verde
azulado, se gasta casi entero en la traza de recuperación y sus citas; todo lo
demás se mantiene callado.

### Una trampa de CSS que conviene conocer

`.hero` lleva `overflow: hidden` para recortar su marca de agua, y eso anula el
tamaño mínimo automático de un elemento flex. Sin el `flex: none` explícito, una
ventana baja aplasta la tarjeta en lugar de dejar que el registro haga scroll.
La misma protección está en `.log`. Ambas llevan comentario en
[`chat.module.css`](src/components/chat/chat.module.css): quitarlas reintroduce
el fallo en silencio, y solo con ventanas de poca altura.
