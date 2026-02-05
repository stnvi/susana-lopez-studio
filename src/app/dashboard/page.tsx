'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDevSection } from '@/context/DevControlContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MOCK DATA: Clases disponibles para reservar en el mes actual
const AVAILABLE_SLOTS = [
  { day: 15, time: '18:00', type: 'Pilates Máquina' },
  { day: 16, time: '19:00', type: 'Suelo Pélvico' },
  { day: 18, time: '10:00', type: 'Hipopresivos' },
  { day: 22, time: '18:00', type: 'Pilates Máquina' },
]

export default function DashboardPage() {
  const { user, demoData, logout } = useAuth()
  const dashboardConfig = useDevSection('dashboard')
  const systemConfig = useDevSection('system')
  const router = useRouter()
  const [selectedSlot, setSelectedSlot] = useState<typeof AVAILABLE_SLOTS[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form')
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'center'>('online')
  const [myBookings, setMyBookings] = useState([
    { id: 1, date: '12 Oct', time: '18:00', type: 'Pilates Máquina' } // Clase pasada o futura ya reservada
  ])
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  })

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Lógica condicional para perfiles demo
  const isNewUser = user?.email === 'nuevo@demo.com' || !demoData?.bono
  const isPresencialUser = user?.email === 'presencial@demo.com' || (demoData?.bono && !demoData?.hasOnline)
  const isFullUser = user?.email === 'full@demo.com' || (demoData?.bono && demoData?.hasOnline)

  // Datos del bono basados en demoData o valores por defecto
  const bonoSesiones = demoData?.bono?.sesiones || 3
  const bonoTotal = demoData?.bono?.total || 10
  const bonoColor = bonoSesiones <= 3 ? 'border-amber-500' : 'border-primary'
  const bonoTextColor = bonoSesiones <= 3 ? 'text-amber-600' : 'text-primary'

  // Fecha de caducidad del bono (mock: 12/Oct/2024)
  const caducidadDate = '12/Oct/2024'
  const isProximoVencer = true // Mock: está próximo a vencer (menos de 7 días)

  // Generador simple de días del mes (simulado 30 días)
  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  const handleSlotClick = (day: number) => {
    // Busca si hay clase ese día (lógica simplificada para demo)
    const slot = AVAILABLE_SLOTS.find(s => s.day === day)
    if (slot) {
      setSelectedSlot(slot)
      setIsModalOpen(true)
    }
  }

  const confirmBooking = () => {
    if (selectedSlot) {
      setMyBookings([
        ...myBookings,
        {
          id: Date.now(),
          date: `${selectedSlot.day} Oct`,
          time: selectedSlot.time,
          type: selectedSlot.type
        }
      ])
      setIsModalOpen(false)
      alert('¡Clase reservada con éxito!')
    }
  }

  const handleBuyBono = () => {
    router.push('/services')
  }

  const handlePaymentMethodSelect = (method: 'online' | 'center') => {
    setPaymentMethod(method)
    if (method === 'center') {
      alert('Reserva pendiente de pago. Acude al centro para completar el pago.')
      setIsPaymentModalOpen(false)
    } else {
      setPaymentStep('processing')
      setTimeout(() => {
        setPaymentStep('success')
        setTimeout(() => {
          setIsPaymentModalOpen(false)
          setPaymentStep('form')
        }, 2000)
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
        {/* 1. Header de Bienvenida */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <Link
              href="/"
              className="text-xs md:text-sm text-primary hover:text-secondary font-medium transition-colors"
              data-testid="home-link"
            >
              ← Volver al Inicio
            </Link>
            <h1 className="text-2xl md:text-3xl font-serif text-secondary mt-2">
              Hola, {user?.name || 'Alumna'}
            </h1>
            <p className="text-stone-500 text-sm md:text-base">Bienvenida a tu espacio de bienestar.</p>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-xs md:text-sm font-bold text-stone-400 hover:text-primary transition-colors uppercase tracking-wider"
              data-testid="edit-profile-button"
            >
              Editar Perfil
            </button>
            <button
              onClick={handleLogout}
              className="text-xs md:text-sm font-bold text-stone-400 hover:text-red-500 transition-colors uppercase tracking-wider"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Banner de Upselling para usuarios presenciales */}
        {dashboardConfig.showPromoBanner && isPresencialUser && !isFullUser && (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 p-4 md:p-6 rounded-r-xl mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              <span className="text-2xl">🚀</span>
              <div className="flex-1">
                <h3 className="font-bold text-amber-800">¡Pásate al Online!</h3>
                <p className="text-sm text-amber-700">Combina tus clases presenciales con el curso Online para resultados más rápidos.</p>
              </div>
              <Link
                href="/services?tab=online"
                className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors text-sm"
              >
                Ver Curso
              </Link>
            </div>
          </div>
        )}

        {/* Empty State para nuevos usuarios */}
        {isNewUser && (
          <div className="bg-white border border-primary/20 rounded-2xl p-8 md:p-12 text-center mb-8 md:mb-10">
            <h3 className="text-xl md:text-2xl font-serif text-secondary mb-3">No tienes servicios activos</h3>
            <p className="text-secondary/70 mb-6 max-w-md mx-auto">Comienza tu journey de bienestar explorando nuestros servicios.</p>
            <Link
              href="/services"
              className="inline-block px-6 py-3 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg"
            >
              Ver Servicios
            </Link>
          </div>
        )}

        {/* 2. KPIs / Resumen (Tarjetas Gold Top) - Solo mostrar si no es nuevo usuario */}
        {!isNewUser && dashboardConfig.showMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Bono Activo */}
            <div className={`bg-white p-4 md:p-6 rounded-xl shadow-sm border-t-4 ${bonoColor}`}>
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Tu Bono Actual</p>
                {bonoSesiones <= 3 && (
                  <button className="text-xs font-bold text-amber-600 hover:text-amber-800">Recargar</button>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-serif text-secondary mt-1">Bono {bonoTotal} Sesiones</h3>
              <div className="mt-3 md:mt-4 flex items-end gap-2">
                <span className={`text-3xl md:text-4xl font-bold ${bonoTextColor}`}>{bonoSesiones}</span>
                <span className="text-stone-500 mb-1 text-sm md:text-base">Sesiones disponibles</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full mt-3 md:mt-4">
                <div className={`h-2 rounded-full ${bonoSesiones <= 3 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${(bonoSesiones / bonoTotal) * 100}%` }}></div>
              </div>
              <p className={`text-xs mt-2 ${isProximoVencer ? 'text-red-500 font-medium' : 'text-stone-400'}`}>
                Caduca el: {caducidadDate}
              </p>
            </div>

            {/* Próxima Clase */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border-t-4 border-secondary">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Próxima Clase</p>
              {myBookings.length > 0 ? (
                <>
                  <h3 className="text-xl md:text-2xl font-serif text-secondary mt-1">{myBookings[myBookings.length - 1].date}</h3>
                  <p className="text-base md:text-lg text-primary font-medium">{myBookings[myBookings.length - 1].time}</p>
                  <p className="text-stone-600 mt-2 text-sm md:text-base">{myBookings[myBookings.length - 1].type}</p>
                </>
              ) : (
                <p className="text-stone-500 mt-4 text-sm md:text-base">No tienes clases reservadas.</p>
              )}
            </div>

            {/* Accesos Rápidos */}

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border-t-4 border-stone-200 flex flex-col justify-center space-y-2 md:space-y-3">
              <button
                onClick={handleBuyBono}
                className="w-full py-2 border border-primary text-secondary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors text-sm md:text-base"
              >
                Comprar Nuevo Bono
              </button>
              <button className="w-full py-2 border border-primary text-secondary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors text-sm md:text-base">
                Ver Mi Progreso
              </button>
              <button className="w-full py-2 border border-stone-200 text-stone-500 font-bold rounded-lg hover:border-secondary hover:text-secondary transition-colors text-sm md:text-base">
                Ver Historial
              </button>
            </div>
          </div>

        )}

        {/* 3. Mis Reservas - Solo mostrar si no es nuevo usuario */}
        {!isNewUser && myBookings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 lg:p-8 border border-primary/10">
            <h2 className="text-lg md:text-xl font-serif text-secondary mb-4 md:mb-6">Mis Clases Reservadas</h2>
            <div className="space-y-3 md:space-y-4">
              {myBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 md:p-4 border border-stone-100 rounded-xl hover:bg-stone-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-secondary">{booking.type}</h3>
                    <p className="text-sm text-stone-600">{booking.date} a las {booking.time}</p>
                  </div>
                  {dashboardConfig.allowCancellation ? (
                    <button
                      onClick={() => {
                        if (confirm('¿Seguro? Según la política de cancelación, si faltan menos de 12h perderás la clase.')) {
                          setMyBookings(myBookings.filter(b => b.id !== booking.id))
                          alert('Clase cancelada correctamente.')
                        }
                      }}
                      className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold text-stone-400 bg-stone-100 rounded-lg">
                      No Cancelable
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Mis Cursos Online */}
        {!isNewUser && (
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 lg:p-8 border border-primary/10">
            <h2 className="text-lg md:text-xl font-serif text-secondary mb-4 md:mb-6">Mis Cursos Online</h2>
            {isFullUser ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-stone-100 rounded-xl hover:bg-stone-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-secondary">Curso Hipopresivos</h3>
                    <p className="text-sm text-stone-600">10 videos HD • Acceso de por vida</p>
                  </div>
                  <Link
                    href="/services?tab=online"
                    className="px-4 py-2 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors text-sm"
                  >
                    Ver Curso
                  </Link>
                </div>
                <div className="flex items-center justify-between p-4 border border-stone-100 rounded-xl hover:bg-stone-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-secondary">Suelo Pélvico Total</h3>
                    <p className="text-sm text-stone-600">20 sesiones grabadas • Comunidad privada</p>
                  </div>
                  <Link
                    href="/services?tab=online"
                    className="px-4 py-2 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors text-sm"
                  >
                    Ver Curso
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-secondary/70 mb-4">No tienes cursos activos</p>
                <Link
                  href="/services?tab=online"
                  className="inline-block px-4 py-2 bg-primary text-secondary font-bold rounded-lg hover:bg-primary-dark transition-colors text-sm"
                >
                  Ver Cursos
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 5. Calendario de Reservas (Visual) - Solo mostrar si no es nuevo usuario */}
        {!isNewUser && dashboardConfig.showCalendar && (
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 lg:p-8 border border-primary/10">
            <h2 className="text-lg md:text-xl font-serif text-secondary mb-4 md:mb-6">Reservar Clase - Octubre</h2>

            {/* Grid Semanal Header */}
            <div className="grid grid-cols-7 gap-1 md:gap-2 lg:gap-4 mb-3 md:mb-4 text-center">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                <div key={d} className="text-xs font-bold text-stone-400">{d}</div>
              ))}
            </div>

            {/* Grid Días */}
            <div className="grid grid-cols-7 gap-1 md:gap-2 lg:gap-4">
              {days.map(day => {
                const slot = AVAILABLE_SLOTS.find(s => s.day === day)
                return (
                  <button
                    key={day}
                    data-testid="calendar-slot"
                    onClick={() => handleSlotClick(day)}
                    disabled={!slot}
                    className={`h-10 w-10 md:h-12 md:w-12 lg:aspect-square rounded-lg md:rounded-xl flex flex-col items-center justify-center transition-all duration-300 relative ${slot
                      ? 'bg-secondary text-white hover:bg-primary hover:scale-105 cursor-pointer shadow-md'
                      : 'bg-background text-stone-300 cursor-default'
                      }`}
                  >
                    <span className="text-sm font-bold">{day}</span>
                    {slot && (
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1"></span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 md:mt-4 flex items-center gap-2 text-xs text-stone-500">
              <span className="w-2 h-2 md:w-3 md:h-3 bg-secondary rounded-full"></span> Clases Disponibles
              <span className="w-2 h-2 md:w-3 md:h-3 bg-background border border-stone-200 rounded-full ml-3 md:ml-4"></span> Completo/Sin Clase
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE RESERVA */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-primary/20 animation-fade-in mx-4">
            <h3 className="text-lg md:text-xl font-serif text-secondary mb-2">Confirmar Reserva</h3>
            <p className="text-stone-600 text-sm md:text-base mb-6">
              ¿Quieres reservar la clase de <strong>{selectedSlot.type}</strong> el día <strong>{selectedSlot.day}</strong> a las <strong>{selectedSlot.time}</strong>?
            </p>

            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 md:py-3 text-stone-500 font-bold hover:text-secondary transition-colors text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 py-2 md:py-3 bg-primary text-secondary font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm md:text-base"
              >
                Confirmar
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-4 text-center">
              * Política de cancelación: 12h de antelación.
            </p>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN DE PERFIL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-primary/20 animation-fade-in mx-4">
            <h3 className="text-lg md:text-xl font-serif text-secondary mb-4 md:mb-6">Editar Perfil</h3>

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                  data-testid="name-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                  data-testid="email-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  placeholder="Dejar en blanco para no cambiar"
                  value={profileData.password}
                  onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                  data-testid="password-input"
                />
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 mt-6 md:mt-8">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="flex-1 py-2 md:py-3 text-stone-500 font-bold hover:text-secondary transition-colors text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Perfil actualizado (simulado)')
                  setIsProfileModalOpen(false)
                }}
                className="flex-1 py-2 md:py-3 bg-primary text-secondary font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm md:text-base"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PAGO */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-primary/20 animation-fade-in mx-4">
            {paymentStep === 'form' && (
              <>
                <h3 className="text-lg md:text-xl font-serif text-secondary mb-2">Comprar Bono</h3>
                <p className="text-stone-600 text-sm md:text-base mb-6">
                  Elige tu método de pago para adquirir un bono de 10 sesiones.
                </p>

                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {systemConfig.enablePayments ? (
                    <button
                      onClick={() => handlePaymentMethodSelect('online')}
                      className="w-full py-3 md:py-4 border border-primary text-secondary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors text-sm md:text-base flex items-center justify-center gap-2"
                      data-testid="payment-online"
                    >
                      <span>💳</span> Pago Online (Tarjeta)
                    </button>
                  ) : (
                    <div className="w-full py-3 md:py-4 border border-stone-300 text-stone-400 font-bold rounded-xl bg-stone-50 text-sm md:text-base flex items-center justify-center gap-2">
                      <span>🚫</span> Pago Online Temporalmente Deshabilitado
                    </div>
                  )}
                  <button
                    onClick={() => handlePaymentMethodSelect('center')}
                    className="w-full py-3 md:py-4 border border-primary text-secondary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors text-sm md:text-base flex items-center justify-center gap-2"
                    data-testid="payment-center"
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
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="text-center py-8 md:py-10">
                <div className="text-4xl mb-4">⏳</div>
                <h3 className="text-lg md:text-xl font-serif text-secondary mb-2">Procesando pago...</h3>
                <p className="text-stone-600 text-sm md:text-base">Por favor, espera unos segundos.</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="text-center py-8 md:py-10">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg md:text-xl font-serif text-secondary mb-2">¡Pago Completado!</h3>
                <p className="text-stone-600 text-sm md:text-base mb-6">Tu bono de 10 sesiones ya está activo.</p>
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="w-full py-2 md:py-3 bg-primary text-secondary font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm md:text-base"
                >
                  Continuar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}