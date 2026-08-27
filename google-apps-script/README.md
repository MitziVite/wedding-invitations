# Backend de RSVP (Google Sheets + Apps Script)

Pasos únicos para dejar el backend funcionando. `Code.gs` en esta carpeta es
el código fuente de referencia — se pega en un proyecto de Apps Script
aparte, no lo ejecuta Next.js.

## 1. Crea el Google Sheet

Un Sheet nuevo con una pestaña **`Responses`** (Apps Script la llena sola —
solo crea la fila de encabezados):

```
contactName | attending | plusOneName | childrenCount | message | contactEmail | submittedAt
```

No hay códigos de invitación ni lista previa de invitados: cualquiera que
llene el formulario en el sitio queda registrado directamente aquí, una fila
por envío. Cada quien puede confirmar para sí mismo, un acompañante
adicional (opcional) y hasta 10 niños. `childrenCount` es solo un número
(0–10) — no pedimos los nombres de los niños, solo cuántos vienen. No se
pide restricción alimenticia: solo habrá opción sin gluten y sin lácteos en
la fiesta, y se van a mencionar los ingredientes para que cada quien decida.

## 2. Crea el proyecto de Apps Script

1. Con el Sheet abierto: **Extensiones → Apps Script**.
2. Borra el contenido de `Code.gs` que aparece por defecto y pega el contenido de `google-apps-script/Code.gs` de este repo.
3. Guarda el proyecto.

## 3. Genera el secreto compartido

En tu terminal:

```bash
openssl rand -base64 32
```

Copia el resultado — es tu `RSVP_SHARED_SECRET`. Lo necesitas en dos lugares (paso 4 y paso 6).

## 4. Guarda el secreto en Apps Script

En el editor de Apps Script: **Configuración del proyecto (ícono de engrane) → Propiedades del script → Agregar propiedad del script**.

- Propiedad: `RSVP_SHARED_SECRET`
- Valor: el mismo string que generaste en el paso 3

## 5. Despliega como Web App

1. En el editor de Apps Script: **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Ejecutar como: **Yo (tu cuenta)**.
4. Quién tiene acceso: **Cualquier usuario**.
5. Despliega y copia la **URL de la aplicación web** — es larga y termina en `/exec`.

(Este "cualquier usuario" suena más abierto de lo que es: nadie puede hacer nada sin también mandar el secreto del paso 3, que solo vive en tu `.env.local`/Vercel y en esta propiedad del script.)

## 6. Configura las variables de entorno en Next.js

Copia `.env.local.example` a `.env.local` y llena:

```
RSVP_APPS_SCRIPT_URL=<la URL que copiaste en el paso 5>
RSVP_SHARED_SECRET=<el mismo secreto del paso 3>
```

En Vercel: **Project Settings → Environment Variables**, agrega las mismas dos.

## 7. Prueba

1. Corre el sitio localmente (`npm run dev`) o abre tu URL de Vercel.
2. Llena el formulario de RSVP y confirma que aparece una fila nueva en `Responses`.

## Actualizar el código ya desplegado

Editar `Code.gs` en el editor (o hacer `clasp push`) no actualiza la URL en
vivo por sí solo — hay que cortar una nueva versión de la misma
implementación: **Implementar → Gestionar implementaciones → ✏️ en la fila
existente → Nueva versión → Implementar**. Esto mantiene la misma URL/ID de
implementación.

## Notas de seguridad

- El secreto nunca sale del servidor: el navegador del invitado solo habla con `/api/rsvp` (tu propio sitio); esa ruta es la única que conoce la URL de Apps Script y el secreto, y ambos viven solo en variables de entorno del servidor.
- Cualquier campo de texto libre (nombre, mensaje) se sanitiza antes de escribirse en el Sheet, para que un valor que empiece con `=`, `+`, `-` o `@` no se interprete como fórmula.
- El límite de niños (0–10) se valida en Apps Script, no solo en el navegador.
