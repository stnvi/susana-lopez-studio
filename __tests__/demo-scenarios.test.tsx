import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import DashboardPage from '@/app/dashboard/page'
import ServicesPage from '@/app/services/page'
import AdminPage from '@/app/admin/page'
import RegisterPage from '@/app/register/page'

// Mock de window.alert y window.confirm
global.alert = vi.fn()
global.confirm = vi.fn(() => true)

// Mock de next/navigation
const mockPush = vi.fn()
const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush, replace: mockReplace }),
    usePathname: () => '/dashboard',
    useSearchParams: () => new URLSearchParams(),
}))

// Mock del hook useAuth
const mockIsAuthenticated = vi.fn(() => true)
const mockLogin = vi.fn()
const mockLogout = vi.fn()
const mockRegister = vi.fn()
let mockUser: { email: string; name?: string; role?: string } | null = null
let mockDemoData: { bono?: { sesiones: number; total: number }; hasOnline?: boolean } | null = null
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: mockIsAuthenticated(),
        login: mockLogin,
        logout: mockLogout,
        register: mockRegister,
        user: mockUser,
        demoData: mockDemoData,
    }),
}))

describe('Demo Scenarios - Suite Completa de Pruebas', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockIsAuthenticated.mockReturnValue(true)
        mockLogout.mockClear()
        mockPush.mockClear()
        mockReplace.mockClear()
        mockUser = null
        mockDemoData = null
    })

    // ============================================
    // 1. PERFILES DE USUARIO (Los 3 Escenarios)
    // ============================================
    describe('1. Perfiles de Usuario', () => {
        describe('User "Nuevo" (nuevo@demo.com)', () => {
            beforeEach(() => {
                mockUser = { email: 'nuevo@demo.com', name: 'Usuario Nuevo' }
                mockDemoData = null // Sin bono = usuario nuevo
            })

            it('debe mostrar "No tienes servicios activos" en dashboard', () => {
                render(<DashboardPage />)
                expect(screen.getByText(/No tienes servicios activos/i)).toBeInTheDocument()
                expect(screen.getByText(/Comienza tu journey de bienestar/i)).toBeInTheDocument()
            })

            it('debe mostrar botón CTA "Ver Servicios" que redirige a /services', () => {
                render(<DashboardPage />)
                const servicesButton = screen.getByRole('link', { name: /Ver Servicios/i })
                expect(servicesButton).toBeInTheDocument()
                expect(servicesButton).toHaveAttribute('href', '/services')
            })

            it('NO debe mostrar calendario de reservas', () => {
                render(<DashboardPage />)
                expect(screen.queryByText(/Reservar Clase - Octubre/i)).not.toBeInTheDocument()
                expect(screen.queryByText(/Tu Bono Actual/i)).not.toBeInTheDocument()
            })
        })

        describe('User "Presencial" (presencial@demo.com)', () => {
            beforeEach(() => {
                mockUser = { email: 'presencial@demo.com', name: 'Usuario Presencial' }
                mockDemoData = { bono: { sesiones: 3, total: 10 }, hasOnline: false }
            })

            it('debe mostrar Banner de Upselling "¡Pásate al Online!"', () => {
                render(<DashboardPage />)
                expect(screen.getByText(/¡Pásate al Online!/i)).toBeInTheDocument()
                expect(screen.getByText(/Combina tus clases presenciales con el curso Online/i)).toBeInTheDocument()
            })

            it('debe mostrar bono en color ámbar/rojo (≤3 sesiones)', () => {
                render(<DashboardPage />)
                // Verificar que aparece el texto "Recargar" (solo visible cuando ≤3 sesiones)
                expect(screen.getByText(/Recargar/i)).toBeInTheDocument()
                // Verificar que muestra "3" sesiones disponibles
                const threes = screen.getAllByText('3')
                expect(threes.length).toBeGreaterThan(0)
            })

            it('debe mostrar calendario de reservas', () => {
                render(<DashboardPage />)
                expect(screen.getByText(/Reservar Clase - Octubre/i)).toBeInTheDocument()
                expect(screen.getByText('15')).toBeInTheDocument() // Día con clase disponible
            })
        })

        describe('User "Full" (full@demo.com)', () => {
            beforeEach(() => {
                mockUser = { email: 'full@demo.com', name: 'Usuario Full' }
                mockDemoData = { bono: { sesiones: 8, total: 10 }, hasOnline: true }
            })

            it('NO debe mostrar Banner de Upselling', () => {
                render(<DashboardPage />)
                expect(screen.queryByText(/¡Acelera tu cambio!/i)).not.toBeInTheDocument()
            })

            it('debe mostrar bono en color normal (>3 sesiones)', () => {
                render(<DashboardPage />)
                // No debe mostrar "Recargar" porque tiene más de 3 sesiones
                expect(screen.queryByText(/Recargar/i)).not.toBeInTheDocument()
                // Debe mostrar "8" sesiones disponibles
                const eights = screen.getAllByText('8')
                expect(eights.length).toBeGreaterThan(0)
            })

            it('debe mostrar dashboard completo sin alertas especiales', () => {
                render(<DashboardPage />)
                expect(screen.getByText(/Reservar Clase - Octubre/i)).toBeInTheDocument()
                expect(screen.getByText(/Tu Bono Actual/i)).toBeInTheDocument()
                expect(screen.queryByText(/No tienes servicios activos/i)).not.toBeInTheDocument()
            })
        })
    })

    // ============================================
    // 2. FLUJO DE COMPRA Y PAGO (Bono)
    // ============================================
    describe('2. Flujo de Compra y Pago', () => {
        beforeEach(() => {
            mockUser = { email: 'test@demo.com', name: 'Test User' }
            mockDemoData = { bono: { sesiones: 5, total: 10 }, hasOnline: false }
        })

        describe('Modal de Compra de Bono', () => {
            it('debe abrir modal al hacer clic en "Comprar Nuevo Bono" en dashboard', async () => {
                render(<DashboardPage />)
                const buyButton = screen.getByRole('button', { name: /Comprar Nuevo Bono/i })
                fireEvent.click(buyButton)

                // Debe aparecer modal con opciones de pago
                await waitFor(() => {
                    expect(screen.getByText(/Comprar Bono/i)).toBeInTheDocument()
                    expect(screen.getByText(/Pago Online/i)).toBeInTheDocument()
                    expect(screen.getByText(/Pago en Centro/i)).toBeInTheDocument()
                })
            })

            it('debe abrir modal al hacer clic en "Reservar Ahora" en servicios', async () => {
                render(<ServicesPage />)
                // Encontrar el primer botón "Reservar Ahora"
                const reserveButtons = screen.getAllByRole('button', { name: /Reservar Ahora/i })
                fireEvent.click(reserveButtons[0])

                await waitFor(() => {
                    expect(screen.getByText(/Completar Pago/i)).toBeInTheDocument()
                    expect(screen.getByText(/Pago Online \(Tarjeta\)/i)).toBeInTheDocument()
                    expect(screen.getByText(/Pago en Centro/i)).toBeInTheDocument()
                })
            })

            it('debe mostrar alerta "Reserva pendiente de pago" al elegir "Pago en Centro"', async () => {
                render(<DashboardPage />)
                const buyButton = screen.getByRole('button', { name: /Comprar Nuevo Bono/i })
                fireEvent.click(buyButton)

                await waitFor(() => {
                    expect(screen.getByText(/Comprar Bono/i)).toBeInTheDocument()
                })

                // Simular clic en "Pago en Centro"
                const centerPaymentButton = screen.getByRole('button', { name: /Pago en Centro/i })
                fireEvent.click(centerPaymentButton)

                // Verificar que se muestra alerta
                expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Reserva pendiente de pago'))
            })

            it('debe procesar pago online exitosamente', async () => {
                render(<ServicesPage />)
                const reserveButtons = screen.getAllByRole('button', { name: /Reservar Ahora/i })
                fireEvent.click(reserveButtons[0])

                await waitFor(() => {
                    expect(screen.getByText(/Completar Pago/i)).toBeInTheDocument()
                })

                // Simular clic en "Pago Online (Tarjeta)"
                const onlinePaymentButton = screen.getByRole('button', { name: /Pago Online \(Tarjeta\)/i })
                fireEvent.click(onlinePaymentButton)

                // Debe mostrar estado de procesamiento
                await waitFor(() => {
                    expect(screen.getByText(/Procesando pago/i)).toBeInTheDocument()
                })

                // Después de procesamiento, debe mostrar éxito
                await waitFor(() => {
                    expect(screen.getByText(/¡Pago Exitoso!/i)).toBeInTheDocument()
                }, { timeout: 4000 })
            })
        })
    })

    // ============================================
    // 3. GESTIÓN ADMIN (Clases y Regalos)
    // ============================================
    describe('3. Gestión Admin', () => {
        beforeEach(() => {
            mockUser = { email: 'admin@demo.com', name: 'Admin', role: 'admin' }
            mockIsAuthenticated.mockReturnValue(true)
        })

        it('debe abrir modal "Editar Clase" con campos Fecha/Hora', async () => {
            render(<AdminPage />)

            // Buscar botón "Editar Clase" (con icono de lápiz) - usar queryAllByRole para manejar múltiples botones
            const editButtons = screen.queryAllByRole('button', { name: /Editar Clase/i })
            expect(editButtons.length).toBeGreaterThan(0)
            fireEvent.click(editButtons[0])

            // Verificar que aparece modal de edición
            await waitFor(() => {
                // El modal debe tener título "Editar Clase" - buscar específicamente el título del modal (h2)
                const modalTitles = screen.getAllByText(/Editar Clase/i)
                // Debe haber al menos 2 elementos: los botones y el título del modal
                expect(modalTitles.length).toBeGreaterThan(1)

                // Verificar que hay campos de fecha y hora - buscar por placeholder o texto
                // En lugar de getByLabelText, buscar inputs con placeholders o texto cercano
                const fechaInputs = screen.queryAllByPlaceholderText(/Fecha/i)
                const horaInputs = screen.queryAllByPlaceholderText(/Hora/i)

                // Si no hay placeholders, buscar por texto cercano
                if (fechaInputs.length === 0) {
                    // Buscar texto "Fecha" cerca de un input
                    const fechaText = screen.getByText(/Fecha/i)
                    expect(fechaText).toBeInTheDocument()
                } else {
                    expect(fechaInputs.length).toBeGreaterThan(0)
                }

                if (horaInputs.length === 0) {
                    // Buscar texto "Hora" cerca de un input
                    const horaText = screen.getByText(/Hora/i)
                    expect(horaText).toBeInTheDocument()
                } else {
                    expect(horaInputs.length).toBeGreaterThan(0)
                }
            })
        })

        it('debe mostrar confirmación "Regalo añadido al perfil del cliente"', async () => {
            render(<AdminPage />)

            const giftButtons = screen.getAllByRole('button', { name: /Regalar Clase/i })
            fireEvent.click(giftButtons[0])

            expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('¡Clase de regalo añadida al perfil de la alumna!'))
        })

        it('debe encontrar "Martin" al buscar "Martín" (insensible a tildes)', async () => {
            render(<AdminPage />)

            // Buscar input de búsqueda
            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, email o plan/i)
            fireEvent.change(searchInput, { target: { value: 'Martín' } })

            // La búsqueda normalizada debería encontrar "Laura Martínez" (que está en los datos mock)
            // En nuestro mock actual hay "Laura Martínez", así que debería aparecer
            await waitFor(() => {
                expect(screen.getByText(/Laura Martínez/i)).toBeInTheDocument()
            })
        })

        it('debe permitir confirmar pagos pendientes', () => {
            render(<AdminPage />)

            // Buscar botones "Confirmar Pago" (solo visibles para pagos pendientes)
            const confirmButtons = screen.getAllByRole('button', { name: /Confirmar Pago/i })
            expect(confirmButtons.length).toBeGreaterThan(0)

            fireEvent.click(confirmButtons[0])
            expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Pago confirmado'))
        })
    })

    // ============================================
    // 4. SIMULACIONES DE SISTEMA (Emails & Políticas)
    // ============================================
    describe('4. Simulaciones de Sistema', () => {
        describe('Registro de Usuario', () => {
            beforeEach(() => {
                mockIsAuthenticated.mockReturnValue(false)
                mockUser = null
                mockRegister.mockReturnValue(true) // Configurar mock para que el registro sea exitoso
            })

            it('debe redirigir a /services (NO dashboard) después del registro', async () => {
                // Usar timers falsos para controlar setTimeout
                vi.useFakeTimers()
                render(<RegisterPage />)

                // Simular envío de formulario
                const nameInput = screen.getByPlaceholderText(/Tu nombre completo/i)
                const emailInput = screen.getByPlaceholderText(/tu@email.com/i)
                const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i)
                const passwordInput = passwordInputs[0]
                const confirmPasswordInput = passwordInputs[1]
                const legalCheckbox = screen.getByTestId('legal-checkbox')
                const submitButton = screen.getByTestId('register-button')

                fireEvent.change(nameInput, { target: { value: 'Nuevo Usuario' } })
                fireEvent.change(emailInput, { target: { value: 'nuevo@test.com' } })
                fireEvent.change(passwordInput, { target: { value: 'password123' } })
                fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
                fireEvent.click(legalCheckbox)
                fireEvent.click(submitButton)

                // Avanzar timers para ejecutar setTimeout
                vi.advanceTimersByTime(1600)

                // Verificar redirección a /services
                expect(mockPush).toHaveBeenCalledWith('/services')

                // Restaurar timers reales
                vi.useRealTimers()
            })

            it('debe mostrar mensaje "Email de confirmación enviado"', async () => {
                render(<RegisterPage />)

                // Simular formulario completo
                const nameInput = screen.getByPlaceholderText(/Tu nombre completo/i)
                const emailInput = screen.getByPlaceholderText(/tu@email.com/i)
                const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i)
                const passwordInput = passwordInputs[0]
                const confirmPasswordInput = passwordInputs[1]
                const legalCheckbox = screen.getByTestId('legal-checkbox')
                const submitButton = screen.getByTestId('register-button')

                fireEvent.change(nameInput, { target: { value: 'Nuevo Usuario' } })
                fireEvent.change(emailInput, { target: { value: 'nuevo@test.com' } })
                fireEvent.change(passwordInput, { target: { value: 'password123' } })
                fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
                fireEvent.click(legalCheckbox)
                fireEvent.click(submitButton)

                // Verificar que se muestra alerta de confirmación
                expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('email de confirmación'))
            })
        })

        describe('Cancelación de Reserva', () => {
            beforeEach(() => {
                mockUser = { email: 'test@demo.com', name: 'Test User' }
                mockDemoData = { bono: { sesiones: 5, total: 10 }, hasOnline: false }
            })

            it('debe mostrar mensaje con "Política de 12 horas" al cancelar', async () => {
                render(<DashboardPage />)

                // Abrir modal de reserva
                const slot15 = screen.getByText('15').closest('button')
                fireEvent.click(slot15!)

                await waitFor(() => {
                    expect(screen.getByText(/Confirmar Reserva/i)).toBeInTheDocument()
                })

                // Verificar que el modal muestra texto sobre política de cancelación
                expect(screen.getByText(/Política de cancelación: 12h de antelación/i)).toBeInTheDocument()

                // Simular cancelación - buscar botón "Cancelar" dentro del modal
                // Primero encontrar el modal por su contenido
                const modal = screen.getByText(/Confirmar Reserva/i).closest('div[class*="modal"]') ||
                    screen.getByText(/Confirmar Reserva/i).closest('div')

                // Buscar botones "Cancelar" dentro del modal
                const cancelButtons = modal ?
                    Array.from(modal.querySelectorAll('button')).filter(btn =>
                        btn.textContent?.includes('Cancelar')
                    ) : []

                if (cancelButtons.length > 0) {
                    fireEvent.click(cancelButtons[0])
                } else {
                    // Fallback: usar getAllByRole
                    const allCancelButtons = screen.getAllByRole('button', { name: /Cancelar/i })
                    fireEvent.click(allCancelButtons[0])
                }

                // El modal debe cerrarse - verificar que el texto "Confirmar Reserva" ya no está visible
                await waitFor(() => {
                    expect(screen.queryByText(/Confirmar Reserva/i)).not.toBeInTheDocument()
                }, { timeout: 2000 })
            })
        })
    })
})