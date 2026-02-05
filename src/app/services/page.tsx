'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useDevSection } from '@/context/DevControlContext'

// --- MOCK DATA (Simulando Base de Datos) ---
const SERVICES = {
  presencial: [
    {
      id: 'p1',
      title: 'Clase Suelta',
      price: '15€',
      period: '/ sesión',
      desc: 'Ideal para probar el método o para días sueltos.',
      features: ['Acceso a 1 sesión', 'Material incluido', 'Corrección postural', 'Validez 1 mes'],
      recommended: false,
      new: false,
    },
    {
      id: 'p2',
      title: 'Bono 5 Sesiones',
      price: '65€',
      period: '/ bono',
      desc: 'Compromiso a medio plazo para ver resultados.',
      features: ['Ahorras 10€', 'Reserva prioritaria', 'Seguimiento personal', 'Validez 5 semanas'],
      recommended: true, // DESTACADO
      new: false,
    },
    {
      id: 'p3',
      title: 'Bono 10 Sesiones',
      price: '120€',
      period: '/ bono',
      desc: 'La mejor opción para una transformación real.',
      features: ['Máximo ahorro', 'Acceso a talleres', 'Plan personalizado', 'Validez 12 semanas'],
      recommended: false,
      new: false,
    }
  ],
  online: [
    {
      id: 'o1',
      title: 'Curso Hipopresivos',
      price: '49€',
      period: '/ único',
      desc: 'Aprende la técnica base desde tu salón.',
      features: ['10 videos HD', 'Acceso de por vida', 'Guía PDF descargable', 'Soporte email'],
      recommended: true,
      new: false,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Yoga laptop
    },
    {
      id: 'o2',
      title: 'Suelo Pélvico Total',
      price: '89€',
      period: '/ único',
      desc: 'Programa avanzado de recuperación post-parto.',
      features: ['20 sesiones grabadas', 'Valoración inicial video', 'Certificado final', 'Comunidad privada'],
      recommended: false,
      new: true, // NUEVO
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Online fitness
    }
  ]
}

function ServicesContent() {
  const [activeTab, setActiveTab] = useState<'presencial' | 'online'>('presencial')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<typeof SERVICES.presencial[0] | typeof SERVICES.online[0] | null>(null)
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCVC, setCardCVC] = useState('')
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const servicesConfig = useDevSection('services')

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'online') {
      setActiveTab('online')
    } else if (tabParam === 'presencial') {
      setActiveTab('presencial')
    }
  }, [searchParams])

  const handleReserveClick = (service: typeof SERVICES.presencial[0] | typeof SERVICES.online[0]) => {
    // Lógica CTA inteligente
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setSelectedService(service)
    setIsPaymentModalOpen(true)
    setPaymentStep('form')
    setCardNumber('')
    setCardExpiry('')
    setCardCVC('')
  }

  const handlePaymentSubmit = (method: 'online' | 'center') => {
    if (method === 'online') {
      // Opción A: Pago Online
      setPaymentStep('processing')
      setTimeout(() => {
        setPaymentStep('success')
        setTimeout(() => {
          setIsPaymentModalOpen(false)
          alert('Pago Exitoso')
          router.push('/dashboard')
        }, 1500)
      }, 2000)
    } else {
      // Opción B: Pago en Centro
      setIsPaymentModalOpen(false)
      alert('¡Bono Reservado! Pásate por recepción para realizar el pago y activarlo.')
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground py-16 px-4">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16 space-y-4">
        <h1 className="text-3xl md:text-5xl font-serif text-secondary">
          Nuestros Servicios
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto text-base md:text-lg">
          Elige tu camino hacia el bienestar. Ven a nuestro estudio de HipoPilates en Salamanca o entrena a tu ritmo desde cualquier parte del mundo.
        </p>
        {/* Enlace de navegación de retorno */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center text-xs md:text-sm text-stone-500 hover:text-primary transition-colors"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Inicio
          </Link>
        </div>
      </div>

      {/* Selector de Pestañas (Diseño Cápsula) */}
      <div className="flex justify-center mb-12 md:mb-16">
        <div className="bg-white p-1.5 rounded-full shadow-lg border border-primary/20 flex relative w-full max-w-md overflow-visible">
          {[
            { id: 'presencial', label: 'presencial', enabled: servicesConfig.showTabPresencial },
            { id: 'online', label: 'online', enabled: servicesConfig.showTabOnline }
          ].filter(tab => tab.enabled).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 md:px-10 md:py-3 rounded-full text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 flex-1 w-full min-w-0 justify-center relative overflow-visible ${activeTab === tab.id
                ? 'bg-primary text-secondary shadow-md'
                : 'text-stone-400 hover:text-primary'
                }`}
            >
              {tab.label}
              {tab.id === 'online' && servicesConfig.highlightNewBadge && (
                <span className="absolute -top-4 -right-2 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-widest animate-pulse z-50">
                  NUEVO
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Tarjetas - Flex centrado */}
      <div className="flex flex-wrap justify-center gap-8">
        {SERVICES[activeTab].map((service) => (
          <div
            key={service.id}
            className={`relative bg-white rounded-3xl transition-all duration-300 border group flex flex-col h-full ${service.recommended
              ? 'border-primary shadow-2xl scale-105 z-10'
              : 'border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
              }`}
          >
            {/* BADGES (fuera del wrapper interno) */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-20">
              {service.recommended && (
                <span className="bg-secondary text-primary text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                  Recomendado
                </span>
              )}
              {service.new && (
                <span className="bg-primary text-secondary text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase tracking-wider shadow-lg animate-pulse">
                  Nuevo Lanzamiento
                </span>
              )}
            </div>

            {/* Wrapper Interno (maneja el recorte) */}
            <div className="flex flex-col h-full overflow-hidden rounded-3xl">
              {/* Imagen de fondo para tarjetas presenciales */}
              {activeTab === 'presencial' && (
                <div className="absolute inset-0 z-0 opacity-5">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Fondo pilates"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {/* Imagen para servicios Online */}
              {'image' in service && service.image && (
                <div className="w-full h-48 overflow-hidden rounded-t-3xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Contenido Card con padding condicional */}
              <div className={`p-5 md:p-8 flex flex-col flex-grow ${'image' in service && service.image ? '' : 'rounded-t-3xl'}`}>
                {/* Contenido Card */}
                <div className="mb-4 md:mb-6 pt-4">
                  <h3 className="text-xl md:text-2xl font-serif text-secondary mb-2">{service.title}</h3>
                  <p className="text-stone-500 text-xs md:text-sm leading-relaxed min-h-[40px]">{service.desc}</p>
                </div>

                <div className="mb-6 md:mb-8">
                  <span className="text-3xl md:text-4xl font-bold text-secondary">{service.price}</span>
                  <span className="text-stone-400 text-xs md:text-sm">{service.period}</span>
                </div>

                {/* Lista de características */}
                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-grow">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-stone-600 text-xs md:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Botón CTA (Modal de Pago Simulado) */}
                <button
                  onClick={() => handleReserveClick(service)}
                  disabled={!servicesConfig.allowBooking}
                  className={`w-full py-3 md:py-4 rounded-xl font-bold text-center transition-colors uppercase tracking-widest text-xs ${service.recommended
                    ? 'bg-secondary text-primary hover:bg-black'
                    : 'bg-primary/10 text-secondary hover:bg-primary hover:text-white'
                    } ${!servicesConfig.allowBooking ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {servicesConfig.allowBooking ? 'Reservar Ahora' : 'No Disponible'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Pago Simulado */}
      {isPaymentModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-primary/20 animation-fade-in mx-4">
            {paymentStep === 'form' && (
              <>
                <h3 className="text-lg md:text-xl font-serif text-secondary mb-2">Completar Pago</h3>
                <p className="text-stone-600 text-sm md:text-base mb-6">
                  Estás adquiriendo <strong>{selectedService.title}</strong> por <strong>{selectedService.price}</strong>
                </p>

                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => handlePaymentSubmit('online')}
                    className="w-full py-4 border border-primary text-secondary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors text-sm md:text-base flex items-center justify-center gap-2"
                  >
                    <span>💳</span> Pago Online (Tarjeta)
                  </button>
                  <button
                    onClick={() => handlePaymentSubmit('center')}
                    className="w-full py-4 border border-primary text-secondary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors text-sm md:text-base flex items-center justify-center gap-2"
                  >
                    <span>🏢</span> Pago en Centro
                  </button>
                </div>

                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="w-full py-2 md:py-3 text-stone-500 font-bold hover:text-secondary transition-colors text-sm md:text-base"
                >
                  Cancelar
                </button>
                <p className="text-xs text-stone-400 mt-4 text-center">
                  * Este es un pago simulado para demostración. No se realizará ningún cargo real.
                </p>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg md:text-xl font-serif text-secondary mb-2">Procesando pago...</h3>
                <p className="text-stone-600 text-sm">Por favor, espera unos segundos.</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-lg md:text-xl font-serif text-secondary mb-2">¡Pago Exitoso!</h3>
                <p className="text-stone-600 text-sm mb-6">
                  Has adquirido <strong>{selectedService.title}</strong> correctamente.
                </p>
                <p className="text-xs text-stone-400">
                  Redirigiendo al dashboard...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Cargando servicios...</p>
        </div>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  )
}