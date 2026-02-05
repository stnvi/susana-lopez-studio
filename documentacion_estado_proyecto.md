# Documentación Técnica - Susana López Studio

## 1. Estructura del Proyecto

### Rutas Principales (src/app)
- **Landing Page** (`/`) - Página principal con video hero, servicios, instalaciones, sobre mí y FAQ
- **Servicios** (`/services`) - Catálogo de servicios con pestañas presencial/online
- **Dashboard Alumna** (`/dashboard`) - Área personal de clienta con calendario, bono y perfil
- **Admin Panel** (`/admin`) - Panel de administración con KPIs, gestión de alumnas y acciones
- **Login** (`/login`) - Formulario de autenticación con validación
- **Register** (`/register`) - Registro con checkbox de exención de responsabilidad
- **Color Test** (`/color-test`) - Página de prueba de paleta de colores

### Componentes Globales Clave
- **Header** (`src/components/layout/Header.tsx`) - Navegación dinámica con menú móvil y botón según autenticación
- **Footer** (`src/components/footer.tsx`) - Información de contacto, horario y redes sociales
- **Hero** (`src/components/landing/Hero.tsx`) - Componente hero para landing (no usado actualmente en la página principal)
- **Layout** (`src/app/layout.tsx`) - Layout raíz con fuentes Lato y Playfair Display

## 2. Funcionalidades por Página (Estado Actual)

### Landing Page (`/`)
**Secciones implementadas:**
1. **Hero con Video** - Video de fondo con overlay y CTA "ÚNETE AL EQUIPO"
2. **Servicios** - Dos tarjetas grandes (Presencial/Online) con enlaces a `/services?tab=...`
3. **Así Trabajamos** - Video con overlay y texto explicativo
4. **Instalaciones** - Grid de 3 fotos verticales con efectos hover
5. **Sobre Mí** - Biografía con foto y lista de certificaciones
6. **FAQ** - Acordeón nativo con 4 preguntas frecuentes
7. **WhatsApp Flotante** - Botón fijo con número real (+34634038545)

**Interactividad:**
- FAQ con acordeón nativo (details/summary)
- Hover effects en tarjetas e imágenes
- Navegación suave a secciones internas
- Botón WhatsApp con enlace real

**Datos reales:**
- Número de teléfono: 634 038 545
- Email: info@susanalopezstudio.com
- Dirección: Centro Comercial Los Cipreses, Salamanca
- Horario: L-V 09:30-10:30 y 17:00-21:00
- Instagram: @susanalopezstudio

### Servicios (`/services`)
**Funcionalidades:**
- **Tabs Presencial/Online** - Selector tipo cápsula con estado persistente vía query params
- **Grid de Tarjetas** - 3 servicios presenciales y 2 online con precios y características
- **Badges** - "Recomendado" y "Nuevo Lanzamiento" con estilos diferenciados
- **CTA** - Botón "Reservar Ahora" que redirige a `/login`
- **Navegación** - Enlace "Volver al Inicio" a `/`

**Datos mock:**
- Presencial: Clase Suelta (15€), Bono 5 Sesiones (65€), Bono 10 Sesiones (120€)
- Online: Curso Hipopresivos (49€), Suelo Pélvico Total (89€)

### Dashboard Alumna (`/dashboard`)
**Funcionalidades implementadas:**
- **Resumen KPIs** - Bono activo (3 sesiones disponibles), Próxima clase, Acciones rápidas
- **Calendario de Reservas** - Grid de 30 días con slots disponibles (15, 16, 18, 22)
- **Modal de Reserva** - Confirmación al hacer clic en slot disponible
- **Edición de Perfil** - Modal con campos nombre, email y contraseña
- **Autenticación** - Botón "Cerrar Sesión" que llama a logout y redirige a `/`
- **Navegación** - Enlace "Volver al Inicio"

**Estado simulado:**
- Bono: 10 Sesiones (3 disponibles, caduca en 2 semanas)
- Próxima clase: 12 Oct 18:00 Pilates Máquina
- Slots disponibles: días 15, 16, 18, 22 de octubre

### Admin Panel (`/admin`)
**Funcionalidades:**
- **Protección de Ruta** - Verifica autenticación y rol 'admin' (email: admin@susanalopez.com)
- **KPIs Command Center** - Alumnas activas, pagos pendientes, ingresos totales, ticket medio
- **Tabla de Gestión** - 8 alumnas mock con nombre, plan, estado, pago e ingresos
- **Acciones Rápidas** - Confirmar pago, Regalar clase, Activar usuario (con notificaciones)
- **Búsqueda** - Filtrado por nombre o email
- **Edición de Perfil** - Modal similar al dashboard
- **Acciones Masivas** - Botones para recordatorios, reportes y actualización de planes

**Datos mock:**
- 8 alumnas con planes variados (Premium Mensual, Bono 10 Clases, Online Trimestral, etc.)
- Estados: active/pending, paymentStatus: paid/pending
- Ingresos totales: 1,518.98€

### Auth: Login & Register
**Login (`/login`):**
- Formulario con email y contraseña
- Validación básica de campos
- Redirección según rol: admin → `/admin`, client → `/dashboard`
- Enlaces: "Volver al Inicio", "¿Olvidaste contraseña?", "Regístrate aquí"
- Placeholder para login social (Google, Apple)

**Register (`/register`):**
- Campos: nombre, email, contraseña, confirmar contraseña
- **Checkbox de exención de responsabilidad** (requerido)
- Validación: contraseña ≥6 caracteres, coincidencia de contraseñas
- Registro automático y redirección a `/dashboard`

**Hook useAuth:**
- Persistencia en localStorage (usuarios y sesión)
- Roles: 'admin' (email: admin@susanalopez.com) o 'client'
- Funciones: login, logout, register

## 3. Estado de los Tests

### Cobertura Actual
**Total archivos de test: 12** (basado en estructura de directorios)

**Áreas cubiertas:**
1. **Autenticación** (`auth.test.tsx`) - 337 líneas, 11 tests
   - Redirección acceso no autorizado
   - Formularios login/register
   - Validación checkbox legal
   - Seguridad (longitud contraseña, roles)
   - Redirección post-login

2. **Dashboard** (`dashboard.test.tsx`) - 270 líneas, 15+ tests
   - Renderizado saludo y calendario
   - Interacción con slots
   - Modal de reserva
   - Edición de perfil
   - Botón cerrar sesión

3. **Admin Panel** (`admin.test.tsx`) - 303 líneas, 20+ tests
   - KPIs y tabla de alumnas
   - Acciones rápidas (confirmar pago, regalar clase)
   - Protección por rol
   - Navegación y edición de perfil

4. **Servicios** (`services.test.tsx`) - 72 líneas, 5 tests
   - Renderizado título y tabs
   - Cambio entre presencial/online
   - Badges de marketing
   - Navegación a home

5. **Otros tests**:
   - `header.test.tsx` - Navegación y responsive
   - `landing-page.test.tsx` - Componentes landing
   - `footer-simple.test.tsx` - Footer básico
   - `layout.test.tsx` - Layout general
   - `lms.test.tsx`, `facturacion.test.tsx` - Funcionalidades específicas

**Configuración de testing:**
- **Vitest** con ambiente jsdom
- **Testing Library** para React
- Setup global en `test/setup.ts`
- Aliases `@/` configurados

## 4. Stack Tecnológico & Estilos

### Stack Principal
- **Next.js 16.1.6** - App Router, React Compiler habilitado
- **React 19.2.3** - con React Compiler (babel-plugin-react-compiler)
- **TypeScript** - Tipado estricto en todos los componentes
- **Tailwind CSS v4** - Configuración con PostCSS
- **Vitest** + **Testing Library** - Suite de testing

### Estilos y Diseño
**Paleta de colores (Gold & Black):**
- `primary: #C5A059` (Dorado)
- `primary-dark: #A68545` (Dorado oscuro)
- `secondary: #1C1917` (Negro)
- `background: #FAFAF9` (Crema suave)
- `foreground: #1C1917` (Texto negro)
- `accent: #F5F0E6` (Beige claro)

**Tipografías:**
- `--font-playfair-display` (Playfair Display) - Títulos, serif
- `--font-lato` (Lato) - Texto general, sans-serif

**Configuración responsive:**
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Diseño mobile-first en todos los componentes
- Menú hamburguesa en móvil, navegación horizontal en desktop

**Componentes estilizados:**
- Border radius: `rounded-3xl`, `rounded-full`
- Shadows: `shadow-lg`, `shadow-2xl`, `shadow-xl`
- Transiciones: `transition-all`, `duration-300`, `hover:scale-105`
- Gradientes: `bg-gradient-to-br`, `from-primary/30 to-secondary/30`

### Configuraciones Técnicas
- **Tailwind config**: Colores personalizados y fuentes extendidas
- **ESLint**: Configuración Next.js
- **PostCSS**: Con plugin Tailwind
- **Alias**: `@/` apunta a `src/`

## 5. Observaciones y Mejoras Potenciales

### Funcionalidades Implementadas vs. Pendientes
✅ **Completado:**
- Landing page completa con todas las secciones
- Sistema de autenticación con roles
- Dashboard funcional con calendario simulado
- Panel de administración con gestión básica
- Tests extensivos para componentes clave

⚠️ **Mejoras identificadas:**
1. **Protección de rutas** - El dashboard actualmente se muestra sin autenticación
2. **Integración backend** - Datos mock en servicios, dashboard y admin
3. **Responsive refinado** - Algunos componentes podrían optimizarse en móvil
4. **Accesibilidad** - Mejoras en ARIA labels y navegación por teclado

### Estado General del Proyecto
El proyecto tiene una **base sólida y funcional** con:
- Arquitectura limpia y componentes reutilizables
- Sistema de diseño consistente (Gold & Black)
- Testing robusto con buena cobertura
- Experiencia de usuario fluida y atractiva

**Próximos pasos recomendados:**
1. Conectar a backend real (API)
2. Implementar protección de rutas completa
3. Añadir pagos reales (Stripe/MercadoPago)
4. Sistema de reservas en tiempo real
5. Panel de administración con CRUD completo

---

*Documentación generada el 05/02/2026 - Análisis basado en código actual del repositorio*