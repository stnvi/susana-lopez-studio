# 🎯 Guion de Demostración - Susana López Studio
*Guía estructurada para presentar la versatilidad de la plataforma usando los 4 perfiles de acceso*

---

## 📋 La Tabla de Credenciales (El "Chuletario")

| Perfil | Email | Contraseña | Características |
|--------|-------|------------|-----------------|
| **ADMIN** | `admin@susanalopez.com` | `123456` | Control total del negocio, gestión de usuarias, ingresos, acciones masivas. |
| **PERFIL 1 (NUEVO)** | `nuevo@demo.com` | `123456` | Sin bonos, sin cursos. Dashboard vacío que invita a la compra. |
| **PERFIL 2 (HÍBRIDO)** | `presencial@demo.com` | `123456` | Con bonos activos para clases físicas, sin cursos online. |
| **PERFIL 3 (PREMIUM)** | `full@demo.com` | `123456` | Todo desbloqueado: Bonos + Academia Online + Reservas. |
| **GOD MODE** | Acceso: `/dev-panel` | PIN: `DeV2001$` | Control en tiempo real de la web (apagar/encender secciones). |

**URL principal:** https://susana-lopez-studio.vercel.app

---

## 🎤 El Guion de la Demo (Storytelling)

### Escenario A: La Captación (Usuario Público)
**Objetivo:** Mostrar cómo la web atrae y convierte a nuevas clientas.

1. **Landing Page – Impacto visual**
   - **Hero Video**: "Mira cómo el video de fondo transmite profesionalidad y emoción desde el primer segundo."
   - **Slider "Así Trabajamos"**: "Este slider sincronizado texto/video demuestra que no eres una instructora más; eres una experta con metodología propia."

2. **CTA Inteligente**
   - **Botón "ÚNETE AL EQUIPO"**: "Para quien aún no te conoce: la invita a registrarse y descubrir tu mundo."
   - **Botón "ÁREA CLIENTA"**: "Para tu alumnado actual: acceso directo a su área personal. **La web distingue entre captación y fidelización automáticamente.**"

### Escenario B: La Experiencia Personalizada (Login con los 3 perfiles)
**Objetivo:** Demostrar que el sistema se adapta a cada tipo de clienta.

1. **Perfil 1 – `nuevo@demo.com` (NUEVO)**
   - **Dashboard vacío**: "Mira, la plataforma detecta que aún no ha comprado nada y le muestra invitaciones a tus servicios. **La web vende por ti a quien aún no es cliente.**"
   - **Call‑to‑action destacado**: "Aquí puede comprar su primer bono o suscribirse a la academia online."

2. **Perfil 2 – `presencial@demo.com` (HÍBRIDO)**
   - **Reservas físicas**: "Ve sus bonos activos, las clases que ha reservado esta semana, el historial de asistencia."
   - **Argumento clave**: "**Gestión automática de tu estudio físico.** La plataforma le recuerda las clases, libera plazas si no viene, y tú no pierdes tiempo en llamadas o WhatsApp."

3. **Perfil 3 – `full@demo.com` (PREMIUM)**
   - **Academia Online (Netflix‑style)**: "Catálogo completo de videos organizados por niveles, con progreso visual. Ella puede entrenar a las 3 a.m. si quiere."
   - **Argumento clave**: "**Tu negocio escala digitalmente sin límite de horario ni de espacio.** Mientras duermes, la plataforma genera ingresos recurrentes."

### Escenario C: El Control Total (Admin Panel)
**Objetivo:** Enseñar cómo gestionas todo el negocio desde un solo panel.

1. **Acceder como `admin@susanalopez.com`**.
2. **Listado de usuarias**: "Filtra por tipo, fecha de registro, estado de suscripción."
3. **KPIs de ingresos**: "Gráficos de crecimiento, ingresos mensuales, ocupación del estudio."
4. **Acciones masivas**: "Envía un anuncio a todas las alumnas de hipopresivos en dos clics. Programa una promoción de verano que se active automáticamente."
5. **Mensaje final**: "**Tú mandas, la plataforma ejecuta.**"

### Escenario D: La Seguridad (God Mode)
**Objetivo:** Sorprender con el control técnico absoluto.

1. **Navegar a `/dev-panel`** e introducir PIN `DeV2001$`.
2. **Demostración en vivo**:
   - Apagar la sección "Servicios" (toggle `showServicesPreview`).
   - Recargar la página en el móvil (o simular vista móvil en el navegador).
   - **¡La sección desaparece al instante!**
3. **Argumento de venta**: "**Tienes control total sobre cada elemento de tu web, sin depender de un desarrollador.** Puedes activar/desactivar secciones según campañas, temporadas o pruebas A/B. Esto es poder real."

---

## 💼 Cierre de Venta – Beneficios Técnicos que Venden

### 🔒 **Seguridad**
- Autenticación JWT con tokens seguros.
- Protección de rutas por roles (admin, user, público).
- Validación de formularios en frontend y backend.

### 🚀 **Velocidad (Next.js 15)**
- Renderizado híbrido (SSR + CSR) para máxima velocidad.
- Carga en < 2 s gracias a Critical CSS, code splitting y lazy loading.
- Optimización automática de imágenes.

### 📈 **Escalabilidad**
- Arquitectura modular: añade e‑commerce, blog, foro sin tocar el núcleo.
- API RESTful lista para conectar con Stripe (pagos), Mailchimp (email), Google Calendar.
- Base de datos PostgreSQL (ACID, backups automáticos).

### 🔍 **SEO Optimizado**
- Metadatos dinámicos por página.
- Sitemap.xml y robots.txt generados automáticamente.
- Estructura semántica HTML5 para mejor posicionamiento.

### 📱 **Mobile‑First**
- Diseño 100% responsive (Tailwind CSS).
- Touch‑friendly: botones grandes, gestos de swipe.
- PWA ready (instalable como app nativa).

---

## ✨ **Resumen de la Oferta**

1. **No es una web, es un sistema** que gestiona todo tu estudio desde un solo panel.
2. **Ahorra tiempo** automatizando reservas, recordatorios, facturación.
3. **Aumenta ingresos** con upsell (academia online, merchandising, workshops).
4. **Control total** – modifica tu web en tiempo real sin tocar código.
5. **Listo para crecer** – desde 10 a 10.000 alumnas, la plataforma escala contigo.

---

**Fecha de creación:** 5 de febrero de 2026  
**Última actualización:** 5 de febrero de 2026  
**Responsable:** Equipo de Desarrollo Susana López Studio

> **Nota para el comercial:** Este guion está diseñado para una demostración de 30‑45 minutos. Sigue el orden de escenarios y usa los argumentos en negrita para enfatizar los beneficios que más importan a la clienta.