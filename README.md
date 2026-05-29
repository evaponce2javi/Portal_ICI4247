# 🏛️ Portal de Transparencia y Gestión Financiera — Santo Domingo

Sistema completo para la gestión y publicación de información financiera municipal bajo la Ley 20.285 de Chile. Incluye un BackEnd con API REST y un FrontEnd con portal ciudadano y panel administrativo.

| Capa | Tecnología |
| --- | --- |
| FrontEnd | React 18, Vite, TypeScript, Tailwind CSS, React Router |
| BackEnd | Node.js, Express, Prisma ORM, JWT (autenticación), bcrypt (hashing) |
| Base de datos | PostgreSQL 15 |
| Infraestructura | Docker & Docker Compose |

---

## Estructura del proyecto

Al descomprimir el `.zip` obtendrás dos carpetas:

```
FrontEnd_y_BackEnd_TransparenciaEsa-main/
├── Proyecto_Transparencia_Gestion_Financiera_SantoDomingo_BackEnd-main/
│   └── ... (API REST + base de datos)
└── Proyecto_Transparencia_FrontEnd_Integrado/
    └── ... (Portal ciudadano + panel administrativo)
```

A lo largo de esta guía se les llamará simplemente **BackEnd** y **FrontEnd**.

---

## Requisitos previos

Antes de empezar, instala lo siguiente en tu computador:

### 1. Docker Desktop
Empaqueta y ejecuta el servidor Express y la base PostgreSQL en contenedores aislados, sin que tengas que instalar PostgreSQL en tu sistema.

- Descarga: [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
- Después de instalar, **ábrelo siempre antes de trabajar**. El ícono de la ballena en la barra de tareas debe estar en verde (status: "Engine running").

### 2. Node.js (versión 18 o superior)
Ejecuta el FrontEnd e instala sus dependencias.

- Descarga el LTS: [nodejs.org](https://nodejs.org/)
- Incluye `npm` automáticamente.

### 3. Un editor de código
[VS Code](https://code.visualstudio.com/) es una buena opción, pero cualquiera sirve.

### Verificar que todo está instalado

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
cd C:\Users\TuUsuario\Desktop\FrontEnd_y_BackEnd_TransparenciaEsa-main\Proyecto_Transparencia_Gestion_Financiera_SantoDomingo_BackEnd-main
```

> **Truco:** en el Explorador de Windows puedes hacer clic en la barra de direcciones para ver la ruta completa y copiarla.

#### A.3 Crea el archivo `.env`

Este paso es **obligatorio**. El archivo `.env` contiene las credenciales de la base de datos y no se incluye en el repositorio por motivos de seguridad. Sin él, los contenedores arrancan con configuración vacía y la API falla con `Authentication failed`.

En la misma carpeta del BackEnd, crea un archivo llamado exactamente **`.env`** (con el punto adelante, sin ninguna extensión). La forma más segura en Windows:

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

Guarda (Ctrl+S) y cierra. Verifica que el archivo existe:

```powershell
dir -Force .env
```

Debe aparecer en la lista.

> **Cuidado con la extensión oculta:** si creas el archivo con clic derecho → "Nuevo documento de texto", Windows le pone `.txt` invisible y queda como `.env.txt`. Si te pasa, usa `notepad .env` desde PowerShell para crearlo correctamente.

#### A.4 Levanta los contenedores

```powershell
docker compose up -d --build
```

Esto descarga las imágenes, construye la API y levanta dos contenedores:
- `transparencia_db` — la base de datos PostgreSQL
- `api_transparencia` — el servidor Express

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

#### A.6 Carga datos de demostración (seed)

Las tablas existen pero están vacías. Para que el portal se vea con contenido realista desde el primer momento, ejecuta el script de seed. Crea un usuario administrador, 8 departamentos municipales, presupuestos del año 2026 y contratos públicos variados:

```powershell
docker compose exec api npm run seed
```

Al finalizar verás un resumen con las **credenciales del usuario administrador** sembrado:

```
🎉 Seed completado correctamente.
───────────────────────────────────────────────
   Credenciales de prueba:
     Email:      admin@santodomingo.cl
     Contraseña: clave123
───────────────────────────────────────────────
```

> El seed es **idempotente**: si lo ejecutas dos veces, la segunda detecta los datos ya cargados y no hace nada. Para reiniciar a un estado limpio, ver la sección "Reiniciar todo desde cero" más abajo.

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
cd C:\Users\TuUsuario\Desktop\FrontEnd_y_BackEnd_TransparenciaEsa-main\Proyecto_Transparencia_FrontEnd_Integrado
```

#### B.3 Verifica el archivo `.env`

El FrontEnd ya incluye su propio `.env` con la URL del backend. Confirma su contenido:

```powershell
type .env
```

Debe mostrar:

```
VITE_API_URL=http://localhost:3000/api
```

Si por alguna razón no existe, créalo con `notepad .env` y pega esa línea.

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

> **Si ya ejecutaste el seed (paso A.6)**, ya tienes un usuario administrador y datos de muestra cargados. Puedes saltarte el registro e iniciar sesión directamente en `/login` con `admin@santodomingo.cl` / `clave123` para ver el portal lleno. El guion completo de abajo es útil si quieres probar el flujo de registro desde cero.

Sigue este guion completo. Si todos los pasos funcionan, la integración está correcta.

### 1. Registrar un funcionario

1. Ve a `http://localhost:5173/registro`
2. Llena el formulario:
   - **Nombre:** `Admin Demo`
   - **RUT:** `12345678-9` (formato libre, es solo validación del FrontEnd)
   - **Email:** `admin@santodomingo.cl`
   - **Región / Comuna:** cualquiera
   - **Contraseña:** `clave123` (mínimo 6 caracteres)
   - **Confirmar contraseña:** `clave123`
   - Acepta los términos.
3. Haz clic en **"Registrarse"**. Debe mostrar "¡Registro Exitoso!" y redirigir a `/login`.

> Si abres las DevTools del navegador (F12 → pestaña Network), verás la petición `POST http://localhost:3000/api/auth/register` respondiendo con código `201`.

### 2. Iniciar sesión

1. En `/login`, usa el email y contraseña que registraste.
2. Te redirige a `/admin`. En el encabezado verás "Sesión: Admin Demo (ADMIN)".

> La petición `POST /api/auth/login` devuelve un **token JWT real** (tres segmentos separados por puntos) que se guarda en `localStorage` con la clave `auth_token`.

### 3. Crear datos desde el panel administrativo

En `/admin` hay tres pestañas. **El orden importa** porque los presupuestos y contratos dependen de los departamentos.

**Pestaña Departamentos:**
- "Dirección de Obras Municipales" — descripción libre
- "Educación Municipal"
- "Aseo y Ornato"

**Pestaña Presupuestos:**
- Departamento: Obras Municipales, año 2026, monto asignado `171190000`
- Departamento: Educación Municipal, año 2026, monto asignado `112625000`

**Pestaña Contratos:**
- Título: "Construcción Plaza Norte"
- Proveedor: "Constructora Demo SpA"
- Monto: `45000000`
- Departamento: Obras Municipales
- Fecha de inicio: cualquier fecha de 2026

Cada acción dispara una llamada `POST /api/admin/*` con el JWT en el header `Authorization: Bearer ...`.

### 4. Ver los datos en las páginas públicas

Sin cerrar sesión, navega a:

- `http://localhost:5173/estructura` → muestra los departamentos
- `http://localhost:5173/presupuesto` → muestra el gráfico de torta con los presupuestos
- `http://localhost:5173/contrataciones` → muestra la tabla y el gráfico de barras con los contratos

Arriba a la derecha de cada página debe aparecer un badge verde **"Datos en vivo (API)"**. Esa es la confirmación visual de que los datos vienen del BackEnd real.

### 5. Prueba de seguridad

1. Cierra sesión (botón en el header).
2. Intenta ir directo a `http://localhost:5173/admin` → te redirige a `/login` (la ruta está protegida).
3. Las páginas públicas siguen funcionando porque consumen endpoints sin autenticación.

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

> Tras correr el seed, el usuario administrador queda disponible: `admin@santodomingo.cl` / `clave123`.

### Datos públicos
| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/departamentos` | Lista departamentos municipales |
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

# Reiniciar solo la API (tras un cambio en el código del backend)
docker compose restart api

# Detener todo (los datos se mantienen)
docker compose stop

# Reanudar todo
docker compose start

# Borrar todo, incluida la base de datos (volver a estado limpio)
docker compose down -v
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

Si ya lo creaste pero sigue fallando, asegúrate de que:
- Se llama exactamente `.env` (no `.env.txt` ni `env`).
- Está en la **misma carpeta** que `compose.yaml`.
- Lo creaste con `notepad .env` desde PowerShell para evitar extensiones ocultas.

### `P1000: Authentication failed against database server`
La base de datos arrancó la primera vez sin el `.env` y guardó esa configuración en su volumen. Hay que borrar el volumen y empezar limpio:

```powershell
docker compose down -v
# Asegúrate de que el .env existe y tiene el contenido correcto
docker compose up -d --build
docker compose exec api npx prisma migrate deploy
```

La opción `-v` borra los datos. Como aún no había nada importante, no se pierde nada útil.

### `port is already allocated` o el puerto 3000 / 5432 está ocupado
Otro programa está usando ese puerto. Dos opciones:
- Detén el otro programa.
- Edita `compose.yaml` en el BackEnd y cambia `"3000:3000"` por `"3001:3000"`, luego actualiza el `.env` del FrontEnd a `VITE_API_URL=http://localhost:3001/api`.

### El FrontEnd dice "No se pudo conectar con el servidor"
- Confirma que `http://localhost:3000/api/health` responde en el navegador. Si no, el problema está en el BackEnd.
- Confirma que Docker Desktop está corriendo (ícono verde).
- Mira los logs: `docker logs api_transparencia`.

### `npm install` falla
- Verifica que tienes Node 18 o superior con `node --version`.
- Borra `node_modules` y `package-lock.json` y reintenta:
  ```powershell
  Remove-Item -Recurse -Force node_modules
  Remove-Item package-lock.json
  npm install
  ```

### La página queda en blanco después de hacer cambios
Detén el FrontEnd (`Ctrl+C` en la Terminal 2) y vuelve a ejecutar `npm run dev`.

### "Las tablas no existen" o errores Prisma `P2021`
No ejecutaste las migraciones del paso **A.5**. Hazlo:

```powershell
docker compose exec api npx prisma migrate deploy
```

---

## Notas finales

- El archivo `.env` del BackEnd **nunca debe subirse a Git** (ya está en el `.gitignore`). Cada persona que clone el proyecto debe crear el suyo siguiendo el paso A.3.
- El primer usuario registrado queda automáticamente con rol `ADMIN`. En un sistema productivo conviene cambiar esa política.
- Para reiniciar todo desde cero (base de datos limpia, sin usuarios ni datos):
  ```powershell
  docker compose down -v
  docker compose up -d --build
  docker compose exec api npx prisma migrate deploy
  docker compose exec api npm run seed
  ```

---

**Proyecto desarrollado en el marco del cumplimiento de la Ley 20.285 sobre Acceso a la Información Pública — Municipalidad de Santo Domingo.**