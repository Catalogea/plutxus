

## CONTEXTO DEL PROYECTO

Quiero construir una app móvil multiplataforma (iOS + Android) de **IA local (on-device)** la app se llama Plutxus, sin dependencia de internet para el funcionamiento principal. Es la base de un "hub" de IA al que después iré agregando módulos (coach personal, escáner de comida/calorías, rutinas de ejercicio, etc.), pero **por ahora el alcance es solo dos cosas**:

1. **Módulo de Chat** con modelos de lenguaje corriendo 100% localmente en el dispositivo.
2. **Gestor de descarga de modelos** (biblioteca de modelos GGUF descargables, con progreso, pausa/reanudación y eliminación).

No quiero backend, no quiero cuenta de usuario, no quiero llamadas a APIs externas de IA (excepto opcionalmente, como feature futura, la posibilidad de que el usuario conecte su propia API key — pero eso NO es parte de este alcance inicial).

## STACK TÉCNICO OBLIGATORIO

- **Expo SDK (última estable) con Development Build / EAS Build** — NO uses Expo Go, porque llama.rn requiere código nativo. El proyecto debe soportar `npx expo prebuild` y `eas build`.
- **React Native** con **TypeScript** (estricto).
- **llama.rn** (`https://github.com/mybigday/llama.rn`) como motor de inferencia local (bindings de llama.cpp). Configura el config plugin de Expo en `app.json`:
  ```json
  {
    "expo": {
      "plugins": [
        ["llama.rn", {
          "enableEntitlements": true,
          "entitlementsProfile": "production",
          "forceCxx20": true,
          "enableOpenCL": true
        }]
      ]
    }
  }
  ```
- **expo-file-system** para descarga y almacenamiento de los archivos .gguf en el dispositivo (con progreso de descarga).
- **expo-sqlite** (o similar) para persistir: historial de chats, mensajes, perfil del usuario, lista de modelos descargados y su metadata.
- **Zustand** (o Context API si prefieres algo más simple) para manejo de estado global: modelo activo, estado de descarga, lista de chats.
- **React Navigation** (drawer + stack) para la navegación tipo sidebar.
- **expo-router** si prefieres file-based routing (opcional, pero recomendado por consistencia con el ecosistema Expo).
- Diseño con **tema oscuro** por defecto (con soporte claro/auto), usando estilos nativos o NativeWind (Tailwind para RN) — tu elección, pero mantén consistencia.

## MODELOS DE IA A SOPORTAR (formato GGUF, cuantizados Q4/Q5)

Incluye una lista inicial curada de modelos descargables desde Hugging Face, pensada para dispositivos móviles (2-4GB de RAM libre aprox.):
- Gemma 3n / Gemma 2 2B
- Qwen2.5 1.5B / 3B Instruct
- Llama 3.2 1B / 3B Instruct
- Phi-4-mini

Cada modelo debe mostrar: nombre, tamaño en disco, tamaño de contexto, y si soporta visión (multimodal) o no.

## DISEÑO A REPLICAR (referencia visual adjunta)

Estructura de 3 pantallas principales, tema oscuro (fondo `#0B0B0D` aprox, texto blanco/gris claro):

### 1. Pantalla principal de Chat
- Header centrado con el nombre de la app/asistente (ej. logo tipo ajolote/mascota, editable).
- Estado vacío: ícono/avatar circular centrado, texto "¿En qué puedo ayudarte hoy?" debajo.
- Input fijo en la parte inferior: campo de texto "Escribe tu mensaje...", con:
  - Ícono de clip (adjuntar archivo/imagen) a la izquierda.
  - Ícono de globo (búsqueda web, deshabilitado/oculto en esta fase ya que no hay internet obligatorio).
  - Selector de modelo activo a la derecha (ej. "GLM-4.6V ▾") — al tocar, abre selector de modelos descargados.
  - Botón de enviar (flecha hacia arriba) circular a la derecha.
- Ícono de "sidebar toggle" arriba a la izquierda y "nuevo chat" (ícono de mensaje+) arriba a la derecha.

### 2. Sidebar / Drawer lateral
- Header con nombre de la app y botones de toggle/nuevo chat.
- Sección "Modelos" (acceso directo a la biblioteca/gestor de descarga) con chevron.
- Sección "Proyectos" (colapsable, con botón + para crear).
- Sección "Chats" (colapsable) — lista de conversaciones guardadas, cada una con menú de opciones (⋯) para renombrar/eliminar.
- Footer con avatar + nombre del usuario, y un ícono de engranaje (⚙) que abre Ajustes.

### 3. Pantalla de Ajustes
- Header "Ajustes" con flecha de regreso.
- Sección "Apariencia": selector de 3 botones (Claro / Oscuro / Auto).
- Sección "Idioma": selector (Sistema / Español / Más ▾).
- Sección "Sobre Ti" (colapsable, "Personaliza tu IA"):
  - Campo "Nombre o Apodo"
  - Campo "¿A qué te dedicas?"
  - Campo "Tus pasiones" (multilinea)
  - Esta info se debe inyectar como contexto/system prompt al modelo local para personalizar respuestas.
- Sección "Modelos" (colapsable) → lleva al gestor de descarga de modelos.
- Sección "API Keys" (colapsable) — dejar la UI preparada pero sin funcionalidad activa en esta fase (placeholder para fase futura).
- Ítems simples: "Conoce al Creador", "Apoya el proyecto", "Califica la app".

## REQUISITOS FUNCIONALES DETALLADOS

### Gestor de descarga de modelos
- Lista de modelos disponibles (catálogo curado, hardcodeado por ahora) con botón de descarga.
- Barra de progreso durante la descarga (usa `expo-file-system` `downloadResumable` para poder pausar/reanudar).
- Verificación de espacio disponible en disco antes de descargar.
- Marcar modelo como "activo" una vez descargado, y permitir cambiarlo desde el chat.
- Opción de eliminar modelos descargados para liberar espacio.

### Chat local
- Inicializar `llama.rn` con el modelo activo (`initLlama`), usando streaming de tokens (respuesta palabra por palabra, no esperar el mensaje completo).
- Multi-turno: mantener contexto de la conversación dentro de la ventana de contexto del modelo (`n_ctx`), con manejo de truncado cuando se exceda.
- Guardar cada chat y sus mensajes en SQLite local.
- Inyectar el "Sobre Ti" del usuario como system prompt.
- Indicador de "generando..." mientras el modelo responde.
- Manejo de errores claro si el dispositivo no tiene suficiente RAM/almacenamiento para el modelo elegido.

### Rendimiento
- Detectar si el dispositivo soporta aceleración GPU (Metal en iOS / OpenCL o Vulkan en Android) y usarla automáticamente vía `n_gpu_layers`.
- Cargar el modelo en background sin bloquear la UI (usa el manejo asíncrono nativo de llama.rn, que ya corre en su propio hilo).

## ESTRUCTURA DE PROYECTO ESPERADA

```
/app                  → rutas (si usas expo-router) o pantallas (Chat, Sidebar/Drawer, Settings, ModelLibrary)
/components           → componentes reutilizables (MessageBubble, ModelSelector, ModelCard, etc.)
/services
  /llm                → wrapper sobre llama.rn (init, generate, stream, unload)
  /storage            → SQLite (chats, mensajes, modelos, perfil de usuario)
  /downloads           → lógica de descarga/gestión de archivos .gguf
/store                → estado global (Zustand)
/constants             → catálogo de modelos, temas de color, textos
/types                 → tipos TypeScript compartidos
```

## ENTREGABLE ESPERADO DE ESTA PRIMERA FASE

1. Proyecto Expo inicializado con Dev Client, TypeScript, y llama.rn correctamente configurado y compilando en ambas plataformas (verifica con `npx expo prebuild` y build local si es posible).
2. Pantalla de Chat funcional: enviar mensaje, recibir respuesta en streaming desde un modelo GGUF cargado localmente.
3. Pantalla de gestión de modelos: ver catálogo, descargar con progreso, eliminar, seleccionar modelo activo.
4. Sidebar y pantalla de Ajustes con la UI descrita (aunque algunas secciones como "API Keys" queden como placeholder no funcional).
5. Persistencia local de chats y perfil del usuario.

No implementes todavía: búsqueda web, análisis de documentos, generación de imágenes, ni conexión a APIs externas — eso vendrá en fases posteriores.

Empieza generando la estructura del proyecto y el archivo `app.json`/`app.config.js` con la configuración de llama.rn, y ve avanzando módulo por módulo, mostrándome el resultado antes de continuar con el siguiente.
