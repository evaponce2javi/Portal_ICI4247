# Prompt para IA Generativa de Figma: Diseño UI/UX Portal de Transparencia Municipal

**Rol del Sistema:**
Actúa como un Diseñador UI/UX Senior experto en sistemas de diseño responsivos y arquitectura de componentes para Ionic + React.

**Contexto Técnico y Framework:**
- **Frontend:** Ionic con React.
- **Componentes Nativos a utilizar explícitamente:** IonPage, IonHeader, IonContent, IonTabs, IonMenu.
- **Enfoque de Diseño:** Mobile-first estricto (mínimo 320px) perfectamente escalable a resoluciones de escritorio.
- **Accesibilidad:** Cumplimiento de estándar WCAG 2.1 AA (alto contraste, jerarquía tipográfica legible y navegación clara).
- **Estructura de Archivos (Reflejada en la UI):** Agrupación lógica simulando `pages`, `components`, `routes` y `services`.

**Instrucciones Generales de Prototipado:**
Genera un prototipo navegable con al menos 7 pantallas distintas (con versiones web y móvil explícitas). El diseño visual debe transmitir confianza, claridad institucional, transparencia y utilidad pública. 

---

## Especificaciones de Pantallas (Mockups)

### 1. Pantalla Principal (Home)
- **Header:** Logo "Municipalidad Santo Domingo", título "Portal de Transparencia Municipal", y un enlace muy discreto de [Login] en la esquina superior derecha.
- **Hero Section:** Diseño limpio con el lema "Conoce cómo se administran tus recursos". Debe incluir un único llamado a la acción principal: un filtro dual destacado (Selectores: "Mes" y "Año") y un botón primario "Ver Información". En la versión móvil, este filtro debe ocupar el ancho completo.
- **Sección Educativa:** Una tarjeta fija debajo del hero con el título "¿Qué es la Ley de Transparencia?" y un texto explicativo de tres líneas en lenguaje ciudadano, junto a un enlace de "Leer más".
- **Panel de KPIs:** 3 tarjetas horizontales de métricas rápidas: "Presupuesto ejecutado", "Personal activo" y "Transferencias del mes".
- **Footer:** Logos institucionales (Municipio y Consejo para la Transparencia), enlaces de políticas de privacidad, términos de uso y contacto.

### 2. Menú de Categorías (Post-Filtro)
- **Estado de Navegación:** Incluir un Breadcrumb superior mostrando el período activo (ej. "Julio 2025").
- **Grid de Menú:** Cuadrícula de 3 columnas para escritorio, transformable a lista vertical en móvil.
- **Contenido (CRÍTICO - Obligatorio incluir las 10 categorías de la Ley 20.285):**
  Cada tarjeta debe contener un ícono representativo, título y una breve descripción de una línea para:
  1. Estructura y Organización.
  2. Remuneraciones del Personal.
  3. Contrataciones y Compras.
  4. Transferencias de Fondos.
  5. Ejecución Presupuestaria.
  6. Subsidios y Beneficios Sociales.
  7. Actos y Resoluciones Municipales.
  8. Auditorías e Informes de Control.
  9. Trámites y Servicios.
  10. Mecanismos de Participación Ciudadana.

### 3. Vista de Remuneraciones
- **Componente Principal:** Tabla de datos con cabeceras. Columnas: Nombre, Cargo, Grado/Escala, Sueldo Bruto, Sueldo Líquido.
- **Herramientas de Interfaz:** Barra de búsqueda por texto, selector de orden de columnas, y botón de descarga (CSV/PDF).
- **Responsividad:** En móvil, ocultar columnas secundarias e implementar un desplazamiento (scroll) horizontal de la tabla, manteniendo fijos el Nombre y Cargo.

### 4. Vista de Ejecución Presupuestaria
- **Visualización:** Gráfico interactivo (torta o barras) detallando la distribución de los ítems de gasto.
- **Bajada Ciudadana:** Panel destacado con un color institucional suave que traduzca y explique los datos mostrados en el gráfico usando lenguaje coloquial.
- **Respaldo:** Acordeón o tabla colapsable debajo del gráfico con el detalle financiero exacto y botón de descarga.

### 5. Vista de Transferencias de Fondos
- **Diseño Híbrido:** Combinación de una tabla de datos (Institución Beneficiaria, Monto Transferido, Fecha, Objetivo) acompañada de un gráfico de torta ilustrativo para la distribución por beneficiario. Debe incluir también el panel contextual de bajada ciudadana.

### 6. Formularios de Acceso de Usuarios
- **Login de Administrador:** Diseño sumamente minimalista. Logo municipal, leyenda "Acceso exclusivo para funcionarios municipales", inputs de "Correo Electrónico" y "Contraseña", y botón primario "Iniciar Sesión". Diseñar un estado de validación de error visible en rojo (ej. "Credenciales inválidas").
- **Registro Ciudadano:** Formulario completo con inputs para: Nombre de usuario, RUT, Correo Electrónico, Región, Comuna, Contraseña, Confirmación de Contraseña, y un Checkbox interactivo de Aceptación de Términos y Condiciones.

### 7. Panel de Administrador (Gestión de Datos)
- **Interfaz Interna:** Mensaje de bienvenida con el nombre del funcionario y un botón claro para "Cerrar sesión".
- **Componente de Carga:** Área central amplia de "Drag & Drop" (arrastrar y soltar) específica para archivos CSV, con selectores del período al que corresponde la carga.
- **Feedback del Sistema:** Barra circular o lineal de progreso de procesamiento del archivo y una tabla inferior mostrando el historial de cargas recientes (Fecha, Categoría, Estado de éxito o error).

---

## Flujos e Interacciones Requeridas en el Prototipo
1. **Flujo de Usuario (Ciudadano):** `Home` -> `Interacción con Filtro de Fecha` -> `Menú de Categorías` -> `Seleccionar 'Remuneraciones'` -> `Interacción (Hover) en botón de descarga`.
2. **Flujo de Usuario (Administrador):** `Login` -> `Estado de Error / Validación` -> `Ingreso exitoso a Panel Admin` -> `Subir CSV en Drag & Drop` -> `Notificación modal de éxito`.
3. **Microinteracciones:** Generar los estados visuales *Default*, *Hover* y *Active* para todas las tarjetas del menú de categorías y botones principales de la plataforma.