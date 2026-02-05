import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import DashboardPage from '@/app/dashboard/page'

// Mock de window.alert
global.alert = vi.fn()

// Mock de next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => '/dashboard',
}))

// Mock del hook useAuth
const mockIsAuthenticated = vi.fn(() => true)
const mockLogin = vi.fn()
const mockLogout = vi.fn()
const mockRegister = vi.fn()
let mockUser: { email: string; name?: string } | null = null
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

describe('Dashboard de Clienta - Gold & Black', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockIsAuthenticated.mockReturnValue(true)
        mockLogout.mockClear()
        mockUser = null // Reset user
        mockDemoData = { bono: { sesiones: 3, total: 10 }, hasOnline: false } // Usuario no nuevo
    })

    test('debe renderizar el saludo "Hola, Alumna" cuando no hay usuario', () => {
        render(<DashboardPage />)
        // Verificar que aparece el saludo por defecto
        expect(screen.getByText(/Hola, Alumna/i)).toBeInTheDocument()
    })

    test('debe mostrar el calendario de reservas', () => {
        render(<DashboardPage />)
        // Verificar que el calendario está visible
        expect(screen.getByText(/Reservar Clase - Octubre/i)).toBeInTheDocument()
        // Verificar que hay días del mes (ej. día 1)
        expect(screen.getByText('1')).toBeInTheDocument()
        // Verificar que hay slots disponibles (días 15, 16, 18, 22)
        expect(screen.getByText('15')).toBeInTheDocument()
        expect(screen.getByText('16')).toBeInTheDocument()
    })

    test('debe mostrar el resumen del bono activo', () => {
        render(<DashboardPage />)
        // Verificar que aparece el bono
        expect(screen.getByText(/Tu Bono Actual/i)).toBeInTheDocument()
        expect(screen.getByText(/Bono 10 Sesiones/i)).toBeInTheDocument()
        // Verificar que muestra sesiones disponibles (número 3) - hay múltiples elementos con "3"
        const threes = screen.getAllByText('3')
        expect(threes.length).toBeGreaterThan(0)
        // Verificar que al menos uno está dentro del bono (podemos buscar por contexto)
        expect(screen.getByText(/Sesiones disponibles/i)).toBeInTheDocument()
    })

    test('debe mostrar la próxima clase reservada', () => {
        render(<DashboardPage />)
        // Verificar que aparece la sección de próxima clase
        expect(screen.getByText(/Próxima Clase/i)).toBeInTheDocument()
        // Verificar que muestra la clase reservada (mock data)
        expect(screen.getByText('12 Oct')).toBeInTheDocument()
        expect(screen.getByText('18:00')).toBeInTheDocument()
        expect(screen.getByText(/Pilates Máquina/i)).toBeInTheDocument()
    })

    test('debe abrir modal al hacer clic en un slot disponible', async () => {
        render(<DashboardPage />)
        // Buscar botón del día 15 (slot disponible)
        const slot15 = screen.getByText('15').closest('button')
        expect(slot15).toBeInTheDocument()

        // Hacer clic
        fireEvent.click(slot15!)

        // Debe aparecer el modal de confirmación
        await waitFor(() => {
            expect(screen.getByText(/Confirmar Reserva/i)).toBeInTheDocument()
            // Verificar que aparece el botón "Confirmar" en el modal
            expect(screen.getByRole('button', { name: /Confirmar/i })).toBeInTheDocument()
        })
    })

    test('debe confirmar reserva y cerrar modal', async () => {
        render(<DashboardPage />)
        // Hacer clic en slot 15
        const slot15 = screen.getByText('15').closest('button')
        fireEvent.click(slot15!)

        // Esperar a que aparezca el modal
        await waitFor(() => {
            expect(screen.getByText(/Confirmar Reserva/i)).toBeInTheDocument()
        })

        // Hacer clic en botón Confirmar
        const confirmButton = screen.getByRole('button', { name: /Confirmar/i })
        fireEvent.click(confirmButton)

        // El modal debe cerrarse
        await waitFor(() => {
            expect(screen.queryByText(/Confirmar Reserva/i)).not.toBeInTheDocument()
        })
    })

    test('debe mostrar botones de acción rápida', () => {
        render(<DashboardPage />)
        // Verificar botones de acción rápida
        expect(screen.getByRole('button', { name: /Comprar Nuevo Bono/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Ver Historial/i })).toBeInTheDocument()
    })

    test('debe mostrar el nombre real del usuario cuando está autenticado', () => {
        // Simular que el usuario tiene nombre "Juan"
        mockUser = { email: 'juan@example.com', name: 'Juan' }
        render(<DashboardPage />)
        // Buscamos el saludo con el nombre real
        expect(screen.getByText(/Hola, Juan/i)).toBeInTheDocument()
    })

    // --- Nuevos tests de integración para Dashboard de la Alumna (QA) ---
    describe('Dashboard Alumna', () => {
        beforeEach(() => {
            // Configurar mock del hook de autenticación con usuario "Maria"
            mockUser = { name: 'Maria', email: 'maria@test.com' }
            mockIsAuthenticated.mockReturnValue(true)
            mockDemoData = { bono: { sesiones: 3, total: 10 }, hasOnline: false } // Usuario no nuevo
        })

        it('renders personalized welcome', () => {
            render(<DashboardPage />)
            expect(screen.getByText(/Hola, Maria/i)).toBeInTheDocument()
        })

        it('displays active plan/bono summary', () => {
            render(<DashboardPage />)
            // Debe mostrar cuántas sesiones quedan
            expect(screen.getByText(/Sesiones disponibles/i)).toBeInTheDocument()
            // Buscar el número 3 (sesiones disponibles) - hay múltiples elementos
            const threes = screen.getAllByText('3')
            expect(threes.length).toBeGreaterThan(0)
            // Verificar que aparece "Bono 10 Sesiones"
            expect(screen.getByText(/Bono 10 Sesiones/i)).toBeInTheDocument()
        })

        it('renders the Booking Calendar', () => {
            render(<DashboardPage />)
            // El dashboard muestra "Reservar Clase - Octubre"
            expect(screen.getByText(/Reservar Clase - Octubre/i)).toBeInTheDocument()
            // Verifica que se rendericen días del mes (ej. día 15)
            expect(screen.getByText('15')).toBeInTheDocument()
            // Verificar que hay slots con data-testid="calendar-slot"
            const slots = screen.getAllByTestId('calendar-slot')
            expect(slots.length).toBe(30) // 30 días del mes
        })

        it('opens booking modal when clicking a slot', async () => {
            render(<DashboardPage />)
            // Buscar slot del día 15 (disponible)
            const slot15 = screen.getByText('15').closest('button')
            expect(slot15).toBeInTheDocument()
            fireEvent.click(slot15!)

            // Debe aparecer el modal de confirmación
            await waitFor(() => {
                expect(screen.getByText(/Confirmar Reserva/i)).toBeInTheDocument()
            })
        })
    })

    // --- Nuevos tests de navegación y edición de perfil (QA Engineer) ---
    describe('Navegación y Edición de Perfil', () => {
        beforeEach(() => {
            mockUser = { name: 'Maria', email: 'maria@test.com' }
            mockIsAuthenticated.mockReturnValue(true)
        })

        it('contains a link to navigate back to Home/Landing', () => {
            render(<DashboardPage />)
            const homeLink = screen.getByRole('link', { name: /Volver al Inicio/i })
            expect(homeLink).toBeInTheDocument()
            expect(homeLink).toHaveAttribute('href', '/')
        })

        it('opens Edit Profile modal with correct fields', async () => {
            render(<DashboardPage />)
            const profileButton = screen.getByTestId('edit-profile-button')
            fireEvent.click(profileButton)

            // Verifica campos
            await waitFor(() => {
                expect(screen.getByTestId('name-input')).toBeInTheDocument()
                expect(screen.getByTestId('email-input')).toBeInTheDocument()
                expect(screen.getByTestId('password-input')).toBeInTheDocument()
            })

            // Verificar que los campos tienen los placeholders correctos
            expect(screen.getByPlaceholderText(/Tu nombre/i)).toBeInTheDocument()
            expect(screen.getByPlaceholderText(/tu@email.com/i)).toBeInTheDocument()
            expect(screen.getByPlaceholderText(/Dejar en blanco para no cambiar/i)).toBeInTheDocument()
        })

        it('allows updating profile data', async () => {
            render(<DashboardPage />)
            const profileButton = screen.getByTestId('edit-profile-button')
            fireEvent.click(profileButton)

            await waitFor(() => {
                expect(screen.getByTestId('name-input')).toBeInTheDocument()
            })

            // Cambiar valores en los campos
            const nameInput = screen.getByTestId('name-input') as HTMLInputElement
            const emailInput = screen.getByTestId('email-input') as HTMLInputElement
            const passwordInput = screen.getByTestId('password-input') as HTMLInputElement

            fireEvent.change(nameInput, { target: { value: 'Maria Actualizada' } })
            fireEvent.change(emailInput, { target: { value: 'maria.nueva@test.com' } })
            fireEvent.change(passwordInput, { target: { value: 'nueva123' } })

            expect(nameInput.value).toBe('Maria Actualizada')
            expect(emailInput.value).toBe('maria.nueva@test.com')
            expect(passwordInput.value).toBe('nueva123')

            // Hacer clic en el botón de actualizar
            const updateButton = screen.getByTestId('update-profile-button')
            fireEvent.click(updateButton)

            // Verificar que se muestra el alert de confirmación
            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith('Perfil actualizado correctamente')
            })
        })
    })

    // --- Test para botón de Cerrar Sesión (TDD) ---
    describe('Botón de Cerrar Sesión', () => {
        beforeEach(() => {
            mockUser = { name: 'Maria', email: 'maria@test.com' }
            mockIsAuthenticated.mockReturnValue(true)
            mockLogout.mockClear()
        })

        it('calls logout and redirects to home page', () => {
            render(<DashboardPage />)

            // Verificar que existe un botón con texto "Cerrar Sesión"
            const logoutButton = screen.getByRole('button', { name: /Cerrar Sesión/i })
            expect(logoutButton).toBeInTheDocument()

            // Hacer clic en el botón
            fireEvent.click(logoutButton)

            // Verificar que se llamó a la función logout del hook useAuth
            expect(mockLogout).toHaveBeenCalledTimes(1)

            // VERIFICACIÓN CLAVE: Redirección
            expect(mockPush).toHaveBeenCalledWith('/')
        })
    })
})
