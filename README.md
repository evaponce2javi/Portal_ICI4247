# Portal de Transparencia y Gestión Financiera — Santo Domingo

Sistema completo para la gestión y publicación de información financiera municipal bajo la Ley 20.285 de Chile. Incluye un BackEnd con API REST y un FrontEnd con portal ciudadano y panel administrativo.

Los datos sembrados se basan en información pública oficial verificada de la I. Municipalidad de Santo Domingo, Región de Valparaíso (ver `Otros/FUENTES_DATOS.md`).

| Capa | Tecnología |
| --- | --- |
| FrontEnd | React 18, Vite, TypeScript, Tailwind CSS, React Router |
| BackEnd | Node.js, Express, Prisma ORM, JWT (autenticación), bcrypt (hashing) |
| Base de datos | PostgreSQL 15 |
| Infraestructura | Docker & Docker Compose |

---

## Estructura del repositorio

```
Portal_ICI4247-main/
├── README.md                   ← este archivo
├── BackEnd/                    ← API REST + base de datos
│   ├── compose.yaml
│   ├── dockerfile
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── src/
│   ├── .env.example
│   └── .gitignore
├── FrontEnd/                   ← Portal ciudadano + panel admin
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── src/
│   ├── .env.example
│   └── .gitignore
└── Otros/                      ← Material complementario
    └── FUENTES_DATOS.md        ← Trazabilidad de los datos del seed
```

---

## Requisitos previos

Antes de empezar, instala lo siguiente:

### 1. Docker Desktop
Empaqueta y ejecuta el servidor Express y la base PostgreSQL en contenedores aislados.

- Descarga: [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
- Después de instalar, **ábrelo siempre antes de trabajar**. El ícono de la ballena en la barra de tareas debe estar en verde.

### 2. Node.js (versión 18 o superior)
Ejecuta el FrontEnd e instala sus dependencias.

- Descarga el LTS: [nodejs.org](https://nodejs.org/)
- Incluye `npm` automáticamente.

### 3. Un editor de código
[VS Code](https://code.visualstudio.com/) es buena opción, pero cualquiera sirve.

### Verifica la instalación

Abre **PowerShell** (busca "PowerShell" en el menú de inicio) y ejecuta:

```powershell
docker --version
node --version
npm --version
```

Si los tres responden con un número de versión, estás listo.

---

## Puesta en marcha — Paso a paso

Necesitarás **dos terminales de PowerShell** abiertas al mismo tiempo: una para el BackEnd y otra para el FrontEnd.

### Parte A — BackEnd (Terminal 1)

#### A.1 Abre Docker Desktop

Confirma que el ícono de la ballena esté en verde antes de seguir.

#### A.2 Entra a la carpeta del BackEnd

En la **Terminal 1**, navega a la carpeta del backend. Reemplaza la ruta por la que corresponda a tu computador:

```powershell
cd C:\Users\TuUsuario\Desktop\Portal_ICI4247-main\BackEnd
```

> **Truco:** en el Explorador de Windows puedes hacer clic en la barra de direcciones para ver la ruta completa y copiarla.

#### A.3 Crea el archivo `.env`

Este paso es **obligatorio**. El archivo `.env` contiene las credenciales de la base de datos. No viene en el repositorio por seguridad. La carpeta incluye un `.env.example` que muestra qué variables se necesitan.

La forma más segura en Windows es crear el archivo desde PowerShell:

```powershell
notepad .env
```

Notepad se abrirá. Pega este contenido tal cual:

```env
PORT=3000
JWT_SECRET="supersecretjwtkey_municipalidad2026"

DB_USER="admin"
DB_PASSWORD="adminpassword"
DB_NAME="transparencia_db"

DATABASE_URL="postgresql://admin:adminpassword@db:5432/transparencia_db?schema=public"
```

Guarda (Ctrl+S) y cierra Notepad. Verifica que el archivo existe:

```powershell
dir -Force .env
```

Debe aparecer en la lista.

> **Cuidado con la extensión oculta de Windows:** si creas el archivo con clic derecho → "Nuevo documento de texto", Windows le pone `.txt` invisible y queda como `.env.txt`. Por eso usa `notepad .env` desde PowerShell.

#### A.4 Levanta los contenedores

```powershell
docker compose up -d --build
```

Esto descarga las imágenes, construye la API y levanta dos contenedores:
- `transparencia_db` — la base de datos PostgreSQL.
- `api_transparencia` — el servidor Express.

La primera vez tarda alrededor de **30 segundos**. Confirma que ambos están corriendo:

```powershell
docker ps
```

Debes ver los dos contenedores con estado `Up`.

#### A.5 Crea las tablas en la base de datos

La base existe pero está vacía. Aplica las migraciones de Prisma para crear las tablas (`Usuario`, `Departamento`, `Presupuesto`, `Contrato`):

```powershell
docker compose exec api npx prisma migrate deploy
```

Debes ver un mensaje parecido a `1 migration applied`.

#### A.6 Carga datos reales de Santo Domingo (seed)

Las tablas existen pero están vacías. Para que el portal se vea con contenido desde el primer momento, ejecuta el script de seed. Crea:

- 1 usuario administrador con credenciales conocidas.
- 18 direcciones municipales reales (Alcaldía, DOM, DAEM, DIDECO, etc.).
- 22 presupuestos basados en las cifras BEP 2025 oficiales del SINIM.
- 12 contratos públicos con títulos reales de Mercado Público.

```powershell
docker compose exec api npm run seed
```

Al finalizar verás un resumen con las **credenciales del usuario administrador**:

```
  Seed completado correctamente.
───────────────────────────────────────────────
   Credenciales de prueba:
     Email:      admin@santodomingo.cl
     Contraseña: clave123
───────────────────────────────────────────────
```

> El seed es **idempotente**: si lo ejecutas dos veces, la segunda detecta los datos ya cargados y no hace nada. Para reiniciar a un estado limpio, ver la sección "Reiniciar todo desde cero" más abajo.
>
> Para conocer las fuentes y la trazabilidad de cada dato sembrado, consulta `Otros/FUENTES_DATOS.md`.

#### A.7 Verifica que la API responde

Abre tu navegador y entra a:

```
http://localhost:3000/api/health
```

Debe responder:

```json
{"status":"success","message":"API del Portal de Transparencia operando correctamente"}
```

Si llegas aquí, **el BackEnd está listo**. Deja la Terminal 1 abierta y pasa a la siguiente parte.

---

### Parte B — FrontEnd (Terminal 2)

#### B.1 Abre una segunda terminal de PowerShell

Déjala separada de la del BackEnd.

#### B.2 Entra a la carpeta del FrontEnd

```powershell
cd C:\Users\TuUsuario\Desktop\Portal_ICI4247-main\FrontEnd
```

#### B.3 Crea el archivo `.env`

Igual que en el BackEnd, el FrontEnd necesita su propio `.env`. Créalo con:

```powershell
notepad .env
```

Pega:

```
VITE_API_URL=http://localhost:3000/api
```

Guarda y cierra.

#### B.4 Instala las dependencias

```powershell
npm install
```

Tarda alrededor de un minuto. Es normal que aparezcan algunos `warning`; ignóralos mientras no haya `error`.

#### B.5 Levanta el servidor de desarrollo

```powershell
npm run dev
```

Verás algo como:

```
  VITE v6.3.5  ready in 800 ms

  ➜  Local:   http://localhost:5173/
```

Abre esa URL en el navegador.

---

## Cómo probar que la unión FrontEnd ↔ BackEnd funciona

> **Si ya ejecutaste el seed (paso A.6)**, ya tienes el usuario administrador y datos reales cargados. Inicia sesión directamente en `/login` con `admin@santodomingo.cl` / `clave123` para ver el portal lleno.

Sigue este guion completo. Si todos los pasos funcionan, la integración está correcta.

### 1. Registrar un nuevo funcionario (opcional)

1. Ve a `http://localhost:5173/registro`
2. Llena el formulario:
   - **Nombre:** `Juan Pérez`
   - **RUT:** `12345678-9`
   - **Email:** `jperez@santodomingo.cl`
   - **Región / Comuna:** Valparaíso / Santo Domingo
   - **Contraseña:** `clave123` (mínimo 6 caracteres)
   - Acepta términos.
3. Haz clic en **"Registrarse"**. Debe mostrar "¡Registro Exitoso!" y redirigir a `/login`.

> Si abres las DevTools del navegador (F12 → Network), verás la petición `POST http://localhost:3000/api/auth/register` con código `201`.

### 2. Iniciar sesión

1. En `/login`, usa las credenciales del seed: `admin@santodomingo.cl` / `clave123`.
2. Te redirige a `/admin`. En el encabezado verás "Sesión: Encargado de Transparencia Municipal (ADMIN)".

> La petición `POST /api/auth/login` devuelve un **token JWT real** (tres segmentos separados por puntos) que se guarda en `localStorage`.

### 3. Explorar el panel administrativo

En `/admin` hay tres pestañas:

- **Departamentos** — 18 direcciones municipales reales.
- **Presupuestos** — 22 presupuestos por dirección (2025 y 2026 parcial).
- **Contratos** — 12 contratos públicos.

Desde aquí puedes crear, editar o eliminar registros. Cada acción dispara una llamada al backend con el JWT.

### 4. Ver los datos en las páginas públicas

Navega a:

- `http://localhost:5173/estructura` → 18 direcciones.
- `http://localhost:5173/presupuesto` → gráfico de torta con la distribución del presupuesto 2025.
- `http://localhost:5173/contrataciones` → tabla y gráfico con los contratos.

Arriba a la derecha de cada página verás un badge verde **"Datos en vivo (API)"**. Esa es la confirmación visual de que los datos vienen del BackEnd real.

### 5. Prueba de seguridad

1. Cierra sesión (botón en el header).
2. Intenta ir directo a `http://localhost:5173/admin` → te redirige a `/login` (ruta protegida).
3. Las páginas públicas siguen funcionando.

### 6. Prueba del respaldo de demostración

Para confirmar que las páginas dependen realmente del BackEnd, apágalo desde la Terminal 1:

```powershell
docker compose stop api
```

Refresca `/estructura` en el navegador. Ahora el badge verde se vuelve **ámbar: "Datos de demostración"**. Vuelve a levantarlo:

```powershell
docker compose start api
```

Refresca → vuelve el badge verde. ✅

---

## Referencia rápida de la API

### Autenticación (público)
| Método | Endpoint | Descripción |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Registra un funcionario municipal (rol ADMIN por defecto) |
| `POST` | `/api/auth/login` | Valida credenciales y devuelve un JWT |

> Tras correr el seed, el usuario administrador está disponible: `admin@santodomingo.cl` / `clave123`.

### Datos públicos
| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/departamentos` | Lista direcciones municipales |
| `GET` | `/api/presupuestos` | Lista presupuestos con su departamento |
| `GET` | `/api/contratos` | Lista contratos con su departamento |

### Administración (requiere JWT con rol ADMIN)
| Método | Endpoint | Descripción |
| --- | --- | --- |
| `POST` / `PUT` | `/api/admin/departamentos[/:id]` | Crear o actualizar departamento |
| `POST` / `PUT` | `/api/admin/presupuestos[/:id]` | Crear o actualizar presupuesto |
| `POST` / `PUT` / `DELETE` | `/api/admin/contratos[/:id]` | Crear, actualizar o eliminar contrato |

---

## Comandos útiles

### BackEnd (Docker)

```powershell
# Ver logs en vivo de la API
docker logs -f api_transparencia

# Reiniciar solo la API
docker compose restart api

# Detener todo (los datos se mantienen)
docker compose stop

# Reanudar todo
docker compose start

# Borrar todo, incluida la base de datos (reiniciar todo desde cero)
docker compose down -v
```

### Reiniciar todo desde cero

Si quieres volver a un estado completamente limpio con los datos del seed:

```powershell
cd ...\Portal_ICI4247-main\BackEnd
docker compose down -v
docker compose up -d --build
docker compose exec api npx prisma migrate deploy
docker compose exec api npm run seed
```

### FrontEnd (Vite)

Mientras `npm run dev` esté corriendo, los cambios en archivos `.tsx` se recargan automáticamente en el navegador. Para detenerlo presiona `Ctrl+C` en la Terminal 2.

Para compilar la versión de producción:

```powershell
npm run build
```

Los archivos finales quedan en la carpeta `dist/`.

---

## Solución de problemas comunes

### `The "DB_USER" variable is not set. Defaulting to a blank string.`
Te falta crear el archivo `.env` en la carpeta del BackEnd. Vuelve al paso **A.3**.

Si ya lo creaste pero sigue fallando:
- Verifica que se llama exactamente `.env` (no `.env.txt` ni `env`).
- Está en la **misma carpeta** que `compose.yaml`.
- Usa `notepad .env` desde PowerShell para crearlo sin extensiones ocultas.

### `P1000: Authentication failed against database server`
La base arrancó la primera vez sin el `.env` y guardó esa configuración en su volumen. Hay que borrar el volumen y empezar limpio:

```powershell
docker compose down -v
# Asegúrate de que el .env existe y tiene el contenido correcto
docker compose up -d --build
docker compose exec api npx prisma migrate deploy
docker compose exec api npm run seed
```

### `port is already allocated` o el puerto 3000 / 5432 está ocupado
Otro programa está usando ese puerto. Opciones:
- Detén el otro programa.
- Edita `compose.yaml` y cambia `"3000:3000"` por `"3001:3000"`, luego actualiza el `.env` del FrontEnd a `VITE_API_URL=http://localhost:3001/api`.

### El FrontEnd dice "No se pudo conectar con el servidor"
- Confirma que `http://localhost:3000/api/health` responde en el navegador.
- Confirma que Docker Desktop está corriendo (ícono verde).
- Revisa los logs: `docker logs api_transparencia`.

### `npm install` falla
- Verifica que tienes Node 18 o superior con `node --version`.
- Borra `node_modules` y `package-lock.json` y reintenta:
  ```powershell
  Remove-Item -Recurse -Force node_modules
  Remove-Item package-lock.json
  npm install
  ```

### "Las tablas no existen" o errores Prisma `P2021`
No ejecutaste las migraciones del paso **A.5**. Hazlo:

```powershell
docker compose exec api npx prisma migrate deploy
```

### El portal aparece vacío al entrar
No ejecutaste el seed del paso **A.6**. Hazlo:

```powershell
docker compose exec api npm run seed
```

---

## Notas finales

- El archivo `.env` **nunca debe subirse a Git** (está en el `.gitignore`). Cada persona que clone el proyecto debe crear el suyo siguiendo los pasos A.3 y B.3.
- El primer usuario registrado queda automáticamente con rol `ADMIN`. En un sistema productivo conviene cambiar esa política.
- Las fuentes de los datos del seed están documentadas en `Otros/FUENTES_DATOS.md`.

---

**Proyecto desarrollado en el marco del cumplimiento de la Ley 20.285 sobre Acceso a la Información Pública — I. Municipalidad de Santo Domingo, Región de Valparaíso, Chile.**
