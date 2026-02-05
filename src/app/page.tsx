'use client'

import { useState, useRef, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useDevSection } from '@/context/DevControlContext'

const VIDEO_URL = '/hero.mp4'

const WORK_FEATURES = [
  {
    title: "Enfoque Personalizado",
    description: "Adaptamos cada ejercicio a tu anatomía y necesidades.",
    video: "/trabajamos2.mp4"
  },
  {
    title: "Metodología Holística",
    description: "Combinamos respiración, postura y consciencia corporal.",
    video: "/trabajamos1.mp4"
  },
]

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const landingConfig = useDevSection('landing')
  const [activeIndex, setActiveIndex] = useState(0)

  const handleHeroButtonClick = () => {
    if (user) {
      router.push('/services')
    } else {
      router.push('/register')
    }
  }

  const handleClientAreaClick = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  // Auto-scroll para carrusel móvil de instalaciones
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollContainerRef.current) return

    const interval = setInterval(() => {
      const container = scrollContainerRef.current
      if (!container) return

      const { scrollLeft, scrollWidth, clientWidth } = container
      // Si llega al final, vuelve al principio, si no, avanza
      const isEnd = scrollLeft + clientWidth >= scrollWidth - 10
      const newScroll = isEnd ? 0 : scrollLeft + clientWidth

      container.scrollTo({ left: newScroll, behavior: 'smooth' })
    }, 3000) // Cada 3 segundos

    return () => clearInterval(interval)
  }, [])

  // Auto-play para slider de características
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % WORK_FEATURES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleFeatureClick = (index: number) => {
    setActiveIndex(index)
    // Nota: En una implementación real, reiniciaríamos el intervalo aquí
    // pero para simplificar, el efecto se encargará de ello en el próximo ciclo
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />

      <main role="main">
        {/* Hero Section con Video */}
        {landingConfig.showHero && (
          <section className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-32 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              data-testid="hero-video"
              className="absolute inset-0 w-full h-full object-cover z-0"
              src={VIDEO_URL}
              poster="/hero-poster.jpg"
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="container mx-auto max-w-6xl text-center relative z-20">
              <h1 className="text-4xl md:text-6xl font-serif font-medium text-white tracking-wide leading-none mb-8">
                SUSANA LÓPEZ
              </h1>
              <p className="text-primary uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-10 max-w-2xl mx-auto">
                Hipopilates & Suelo Pélvico
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleHeroButtonClick}
                  className="px-8 py-4 md:px-10 md:py-5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl text-lg md:text-xl cursor-pointer"
                >
                  ÚNETE AL EQUIPO
                </button>
                <button
                  onClick={handleClientAreaClick}
                  className="px-8 py-4 md:px-10 md:py-5 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-secondary transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl text-lg md:text-xl cursor-pointer"
                >
                  ÁREA CLIENTA
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Sección Servicios - Dos Grandes Categorías */}
        {landingConfig.showServicesPreview && (
          <section id="servicios" className="py-16 px-4 bg-foreground/5">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 text-secondary">Servicios</h2>
              <p className="text-foreground/70 text-center mb-8 md:mb-12 max-w-2xl mx-auto">
                Ofrezco sesiones personalizadas y grupales diseñadas para tus objetivos específicos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Tarjeta 1: Clases Presenciales */}
                <Link href="/services?tab=presencial" className="group relative overflow-hidden rounded-3xl h-[400px] md:h-[500px] block shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 z-0" />
                  <div
                    className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)' }}
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                  <div className="relative z-20 h-full flex flex-col items-center justify-center text-center p-6 md:p-8">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">Clases Presenciales</h3>
                    <p className="text-white/90 text-base md:text-lg font-sans mb-6 md:mb-8 max-w-md">Entrena con nosotros en Salamanca</p>
                    <button className="px-6 py-2 md:px-8 md:py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-primary-dark transition-colors shadow-lg text-sm md:text-base">
                      Ver Horarios y Precios
                    </button>
                  </div>
                </Link>

                {/* Tarjeta 2: Cursos Online */}
                <Link href="/services?tab=online" className="group relative overflow-hidden rounded-3xl h-[400px] md:h-[500px] block shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-green-500/20 z-0" />
                  <div
                    className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)' }}
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500 z-10" />

                  {/* Badge NOVEDAD */}
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
                    <span className="bg-primary text-secondary font-bold px-3 py-1 md:px-4 md:py-2 rounded-full animate-pulse shadow-lg text-xs md:text-sm">
                      NOVEDAD
                    </span>
                  </div>

                  <div className="relative z-20 h-full flex flex-col items-center justify-center text-center p-6 md:p-8">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">Academia Online</h3>
                    <p className="text-white/90 text-base md:text-lg font-sans mb-6 md:mb-8 max-w-md">Tu bienestar, donde tú quieras</p>
                    <button className="px-6 py-2 md:px-8 md:py-3 bg-primary text-secondary font-semibold rounded-full hover:bg-primary-dark transition-colors shadow-lg text-sm md:text-base">
                      Ver Catálogo Online
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Sección HipoPilates - Dark Mode Luxury */}
        {landingConfig.showHipoPilates && (
          <section id="hipopilates" className="py-16 px-4 bg-secondary">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-center mb-8 md:mb-12 text-primary">
                DESCUBRE EL MÉTODO HIPOPILATES
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Columna 1: ¿Qué es? */}
                <div className="md:pr-8 md:border-r md:border-primary/30">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-primary">
                    ¿Qué es HipoPilates?
                  </h3>
                  <p className="text-stone-300 text-base md:text-lg mb-6">
                    HipoPilates une la técnica hipopresiva, el método Pilates y el método TAD. Una práctica completa que:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">✓</span>
                      <span className="text-stone-300">Aumenta la conciencia corporal.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">✓</span>
                      <span className="text-stone-300">Disminuye la presión intraabdominal.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">✓</span>
                      <span className="text-stone-300">Proporciona protección lumbo-pélvica.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">✓</span>
                      <span className="text-stone-300">Tonifica en profundidad sin impacto.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">✓</span>
                      <span className="text-stone-300">Fortalece el suelo pélvico.</span>
                    </li>
                  </ul>
                </div>

                {/* Columna 2: Principales Beneficios */}
                <div className="md:pl-8">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-primary">
                    Principales Beneficios
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">★</span>
                      <span className="text-stone-300">Mejora la movilidad y estabilidad articular.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">★</span>
                      <span className="text-stone-300">Mejora la postura y alivia dolores de espalda.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">★</span>
                      <span className="text-stone-300">Previene hernias, incontinencia y prolapsos.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">★</span>
                      <span className="text-stone-300">Aumenta la flexibilidad, equilibrio y coordinación.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">★</span>
                      <span className="text-stone-300">Mejora el rendimiento deportivo.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">★</span>
                      <span className="text-stone-300">Mejora la capacidad respiratoria.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">★</span>
                      <span className="text-stone-300">Reduce el perímetro abdominal.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-3 mt-1 flex-shrink-0">★</span>
                      <span className="text-stone-300">Disminuye el estrés y las tensiones.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cierre de sección */}
              <div className="text-center mt-12 md:mt-16">
                <a
                  href="https://wa.me/34634038545"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 md:px-10 md:py-5 bg-primary text-secondary font-semibold rounded-full hover:bg-primary-dark transition-colors shadow-2xl text-lg md:text-xl"
                >
                  Solicitar más información
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Sección Así Trabajamos - Slider Sincronizado de Características */}
        {landingConfig.showWorkMethod && (
          <section id="asi-trabajamos" className="py-16 px-4 bg-background/50 mb-24">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8 md:mb-12 text-secondary">Así trabajamos</h2>

              {/* Contenedor principal flexbox con layout responsive */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* BLOQUE 1 (Izquierda en PC / Arriba en Móvil) - Cajas de texto */}
                <div className="w-full md:w-1/2 space-y-6">
                  {WORK_FEATURES.map((feature, index) => (
                    <div
                      key={index}
                      onClick={() => handleFeatureClick(index)}
                      className={`cursor-pointer rounded-2xl p-6 md:p-8 border transition-all duration-300 ${index === activeIndex
                        ? 'bg-white border-primary shadow-lg scale-105'
                        : 'bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'
                        }`}
                    >
                      <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 text-secondary">
                        {feature.title}
                      </h3>
                      <p className="text-foreground/70 text-sm md:text-base">
                        {feature.description}
                      </p>
                      {/* Indicador de activo */}
                      {index === activeIndex && (
                        <div className="mt-4 flex items-center">
                          <div className="w-3 h-3 bg-primary rounded-full animate-pulse mr-2"></div>
                          <span className="text-xs text-primary font-semibold">ACTIVO</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* BLOQUE 2 (Derecha en PC / Debajo en Móvil) - Reproductor de Video */}
                <div className="w-full md:w-1/2">
                  <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black relative">
                    <video
                      key={activeIndex}
                      src={WORK_FEATURES[activeIndex].video}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    {/* Overlay informativo */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white mb-2">
                        {WORK_FEATURES[activeIndex].title}
                      </h3>
                      <p className="text-white/90 text-sm md:text-base">
                        {WORK_FEATURES[activeIndex].description}
                      </p>
                    </div>
                  </div>

                  {/* Indicadores de navegación */}
                  <div className="flex justify-center mt-6 space-x-3">
                    {WORK_FEATURES.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleFeatureClick(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex
                          ? 'bg-primary scale-125'
                          : 'bg-gray-400 hover:bg-gray-300'
                          }`}
                        aria-label={`Ir a característica ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Contador */}
                  <div className="text-center mt-4 text-sm text-foreground/60">
                    {activeIndex + 1} / {WORK_FEATURES.length}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sección Instalaciones - Fotografías verticales premium */}
        {landingConfig.showInstallations && (
          <section id="instalaciones" className="py-16 px-4 bg-background">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8 md:mb-12 text-secondary">Instalaciones</h2>
              <div
                ref={scrollContainerRef}
                className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 px-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible"
              >
                {[
                  {
                    src: '/instalaciones1.jpg',
                    title: 'Estudio Principal',
                    desc: 'Espacio amplio y luminoso con equipos de última generación.',
                    gradient: 'from-primary/40 to-secondary/40'
                  },
                  {
                    src: '/instalaciones2.jpg',
                    title: 'Zona de Relax',
                    desc: 'Ambiente tranquilo para la recuperación y meditación.',
                    gradient: 'from-primary/30 to-green-500/30'
                  },
                  {
                    src: '/instalaciones3.jpg',
                    title: 'Equipamiento Profesional',
                    desc: 'Reformers, barras, balones y accesorios de alta calidad.',
                    gradient: 'from-primary/50 to-amber-500/30'
                  }
                ].map((item, index) => (
                  <div key={index} className="group relative rounded-3xl overflow-hidden shadow-2xl h-[450px] md:h-[600px] transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 min-w-[85vw] md:min-w-0 snap-center flex-shrink-0">
                    {/* Contenedor de imagen con altura fija para fotos verticales */}
                    <div className="absolute inset-0">
                      <img
                        src={item.src}
                        alt={`${item.title} - ${item.desc}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradiente premium overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-500`} />
                      {/* Gradiente de acento sutil */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 mix-blend-overlay`} />
                    </div>

                    {/* Contenido superpuesto */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-white/90 text-xs md:text-sm lg:text-base font-sans max-w-xs">{item.desc}</p>
                    </div>

                    {/* Borde sutil en hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-3xl transition-colors duration-500" />
                  </div>
                ))}
              </div>

              {/* Nota sobre las instalaciones */}
              <div className="text-center mt-8 md:mt-12 max-w-2xl mx-auto">
                <p className="text-foreground/60 text-xs md:text-sm italic">
                  Nuestro estudio de HipoPilates en Salamanca está diseñado para ofrecerte una experiencia premium.
                  Cada espacio ha sido cuidadosamente pensado para tu bienestar y comodidad.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Sección Sobre Mí */}
        <section id="sobre-mi" className="py-16 px-4 container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Columna izquierda con foto y tarjeta flotante */}
            <div className="lg:w-1/2 relative">
              {/* Contenedor de imagen sin overflow-hidden */}
              <div className="relative h-[400px] md:h-[500px] w-full">
                {/* Imagen real con overflow-hidden y rounded-3xl aplicados solo a la imagen */}
                <div className="overflow-hidden rounded-3xl h-full w-full">
                  <img
                    src="/sobremi.jpg"
                    alt="Susana López"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Tarjeta flotante */}
                <div className="absolute bottom-4 -right-2 md:bottom-8 md:-right-4 lg:-right-8 bg-white/95 backdrop-blur-sm border border-primary/30 shadow-xl p-4 md:p-6 max-w-xs z-20">
                  <p className="text-stone-700 italic text-xs md:text-sm leading-relaxed">
                    RESPIRA, FORTALECE Y TRANSFORMA
                  </p>
                </div>
              </div>
            </div>

            {/* Columna derecha con biografía */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 md:mb-6 text-secondary">Sobre Mí</h2>
              <p className="text-base md:text-lg text-foreground/80 mb-4 md:mb-6">
                Hola, soy <strong className="text-foreground">Susana López</strong>, instructora certificada en Pilates y bienestar integral con más de 10 años de experiencia especializada en hipopresivos y suelo pélvico.
              </p>
              <p className="text-foreground/70 text-sm md:text-base mb-4 md:mb-6">
                Mi misión es acompañarte en un viaje de reconexión con tu cuerpo, utilizando métodos que respetan tu ritmo y necesidades individuales. Creo en un enfoque holístico donde la técnica se fusiona con la consciencia corporal.
              </p>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-sm md:text-base">Certificación nacional en Pilates Contemporáneo e Hipopresivos</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-sm md:text-base">Especializada en rehabilitación postural y prevención de lesiones</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-sm md:text-base">Más de 200 clientas transformadas a través de un trabajo personalizado</span>
                </div>
              </div>
              {/* Botones circulares de redes sociales */}
              <div className="flex gap-4 mt-6 md:mt-8">
                <a
                  href="https://www.instagram.com/susanalopezstudio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full w-10 h-10 md:w-12 md:h-12 bg-secondary text-white flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <button className="rounded-full w-10 h-10 md:w-12 md:h-12 bg-secondary text-white flex items-center justify-center hover:bg-primary transition-colors">
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sección FAQ - Acordeón nativo */}
        <section id="faq" className="py-16 px-4 container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8 md:mb-12 text-secondary">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {[
              {
                q: "¿Necesito tener experiencia previa en Pilates?",
                a: "No, mis clases están adaptadas a todos los niveles, desde principiantes hasta avanzados. Cada sesión se personaliza según tus capacidades y objetivos."
              },
              {
                q: "¿Qué debo llevar a la primera sesión?",
                a: "Ropa cómoda que permita movimiento, una botella de agua y toalla pequeña. Todo el equipo necesario lo proporciono en el estudio."
              },
              {
                q: "¿Cuántas sesiones se recomiendan para ver resultados?",
                a: "Depende de tus objetivos, pero generalmente se notan mejoras en postura y bienestar a partir de la 4ª-6ª sesión. La consistencia es clave."
              },
              {
                q: "¿Cuánto dura una sesión?",
                a: "Las sesiones tienen una duración de 50 minutos para garantizar un trabajo completo y efectivo."
              }
            ].map((item, idx) => (
              <details key={idx} className="group border-b border-foreground/10 pb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none py-4 text-base md:text-lg font-semibold text-foreground hover:text-foreground/80 transition-colors">
                  <span className="pr-4">{item.q}</span>
                  <span className="text-xl md:text-2xl text-primary transition-transform duration-300 group-open:rotate-45 flex-shrink-0">+</span>
                </summary>
                <div className="mt-2 pl-4 text-foreground/70 text-sm md:text-base">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>



      {/* Botón flotante WhatsApp - Premium con número real */}
      <a
        href="https://wa.me/34634038545"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-primary hover:bg-primary-dark text-white rounded-full shadow-2xl z-50 transition-transform duration-300 hover:scale-110 flex items-center justify-center border-2 border-white/30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
        </svg>
      </a>
    </div>
  )
}
