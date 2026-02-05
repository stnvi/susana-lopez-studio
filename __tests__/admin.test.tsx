import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import AdminPage from '@/app/admin/page'

// Mock de next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => '/admin',
}))

// Mock del hook useAuth (no se usa pero previene errores)
let mockIsAuthenticated = true
let mockUser: { name: string; email: string; role: string } | null = { name: 'Admin', email: 'admin@example.com', role: 'admin' }
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: mockIsAuthenticated,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        user: mockUser,
    }),
}))

describe('Panel de Administración', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('debe renderizar el título "Command Center"', () => {
        render(<AdminPage />)

        expect(screen.getByText(/Command Center/i)).toBeInTheDocument()
    })

    test('debe mostrar KPIs de resumen rápido', () => {
        render(<AdminPage />)

        expect(screen.getAllByText(/Alumnas Activas/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Pagos Pendientes/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Ingresos Totales/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Ticket Medio/i).length).toBeGreaterThan(0)
    })

    test('debe contener una tabla de alumnas con al menos 8 registros', () => {
        render(<AdminPage />)

        // Verificar que existe la tabla
        const table = screen.getByRole('table')
        expect(table).toBeInTheDocument()

        // Verificar que hay al menos 8 filas de datos (excluyendo header)
        const rows = screen.getAllByRole('row')
        // 1 fila de header + al menos 8 filas de datos
        expect(rows.length).toBeGreaterThanOrEqual(9)
    })

    test('debe mostrar acciones rápidas "Confirmar Pago", "Regalar Clase", "Activar"', () => {
        render(<AdminPage />)

        // Verificar que existen botones de acciones rápidas (hay múltiples, usar getAll)
        expect(screen.getAllByRole('button', { name: /Confirmar Pago/i }).length).toBeGreaterThan(0)
        expect(screen.getAllByRole('button', { name: /Regalar Clase/i }).length).toBeGreaterThan(0)
        expect(screen.getAllByRole('button', { name: /Activar/i }).length).toBeGreaterThan(0)
    })

    test('al hacer clic en "Confirmar Pago", debe mostrar notificación temporal', () => {
        render(<AdminPage />)

        // Encontrar el primer botón "Confirmar Pago"
        const confirmButtons = screen.getAllByRole('button', { name: /Confirmar Pago/i })
        expect(confirmButtons.length).toBeGreaterThan(0)
        const firstConfirmButton = confirmButtons[0]

        // Hacer clic
        fireEvent.click(firstConfirmButton)

        // Verificar que aparece notificación "Pago confirmado"
        expect(screen.getByText(/Pago confirmado/i)).toBeInTheDocument()
    })

    test('al hacer clic en "Regalar Clase", debe mostrar notificación temporal', () => {
        render(<AdminPage />)

        // Encontrar el primer botón "Regalar Clase"
        const giftButtons = screen.getAllByRole('button', { name: /Regalar Clase/i })
        expect(giftButtons.length).toBeGreaterThan(0)
        const firstGiftButton = giftButtons[0]

        // Hacer clic
        fireEvent.click(firstGiftButton)

        // Verificar que aparece notificación "Clase regalada"
        expect(screen.getByText(/Clase regalada/i)).toBeInTheDocument()
    })

    test('debe mostrar estados de pago "Pendiente" y "Pagado"', () => {
        render(<AdminPage />)

        // Verificar que existen ambos estados
        const pendienteElements = screen.getAllByText(/Pendiente/i)
        const pagadoElements = screen.getAllByText(/Pagado/i)
        
        expect(pendienteElements.length).toBeGreaterThan(0)
        expect(pagadoElements.length).toBeGreaterThan(0)
    })

    test('debe mostrar planes "Mensual", "Trimestral", "Anual"', () => {
        render(<AdminPage />)

        // Verificar que existen los planes (hay múltiples, usar getAll)
        expect(screen.getAllByText(/Mensual/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Trimestral/i).length).toBeGreaterThan(0)
        expect(screen.getAllByText(/Anual/i).length).toBeGreaterThan(0)
    })

    test('si el usuario NO está autenticado, debe mostrar "Acceso Denegado" o redirigir', () => {
        // Simular usuario no autenticado
        mockIsAuthenticated = false
        mockUser = null

        render(<AdminPage />)

        // El componente actualmente NO muestra "Acceso Denegado" ni redirige,
        // por lo que este test debe fallar (RED) hasta que se implemente la protección.
        // Buscamos cualquier texto que indique acceso denegado o redirección.
        // Si no lo encuentra, el test fallará (lo cual es lo esperado).
        expect(screen.getByText(/Acceso Denegado|Acceso restringido|Redirigiendo/i)).toBeInTheDocument()
    })

    test('Security: debe denegar el acceso si el usuario está autenticado pero tiene role: "client"', () => {
        // Simular usuario autenticado con rol client
        mockIsAuthenticated = true
        mockUser = { name: 'Cliente', email: 'cliente@example.com', role: 'client' }

        render(<AdminPage />)

        // El componente actualmente permite el acceso a cualquier usuario autenticado,
        // por lo que este test debe fallar (RED) hasta que se implemente la protección por rol.
        // Buscamos cualquier texto que indique acceso denegado o redirección.
        // Si no lo encuentra, el test fallará (lo cual es lo esperado).
        expect(screen.getByText(/Acceso Denegado|Acceso restringido|Redirigiendo|No tienes permisos/i)).toBeInTheDocument()
    })

    test('Security: debe permitir el acceso si el usuario tiene role: "admin"', () => {
        // Simular usuario autenticado con rol admin
        mockIsAuthenticated = true
        mockUser = { name: 'Admin', email: 'admin@example.com', role: 'admin' }

        render(<AdminPage />)

        // El componente actualmente permite el acceso a cualquier usuario autenticado,
        // por lo que este test debe pasar (VERDE) si el admin puede ver el panel.
        // Verificamos que se muestra el título del panel de administración.
        expect(screen.getByText(/Command Center/i)).toBeInTheDocument()
    })

    test('should render navigation controls (Home link and Logout button)', () => {
        // Simular usuario admin
        mockIsAuthenticated = true
        mockUser = { name: 'Admin', email: 'admin@example.com', role: 'admin' }

        render(<AdminPage />)

        // Verificar que existe un enlace/botón con texto "Volver al Inicio" (href /)
        const homeLink = screen.getByRole('link', { name: /Volver al Inicio/i })
        expect(homeLink).toBeInTheDocument()
        expect(homeLink).toHaveAttribute('href', '/')

        // Verificar que existe un botón con texto "Cerrar Sesión"
        const logoutButton = screen.getByRole('button', { name: /Cerrar Sesión/i })
        expect(logoutButton).toBeInTheDocument()
    })

    test('logout button redirects to home page', () => {
        // Simular usuario admin
        mockIsAuthenticated = true
        mockUser = { name: 'Admin', email: 'admin@example.com', role: 'admin' }

        render(<AdminPage />)

        // Encontrar botón "Cerrar Sesión"
        const logoutButton = screen.getByRole('button', { name: /Cerrar Sesión/i })
        expect(logoutButton).toBeInTheDocument()

        // Hacer clic en el botón
        fireEvent.click(logoutButton)

        // VERIFICACIÓN CLAVE: Redirección a página principal
        expect(mockPush).toHaveBeenCalledWith('/')
    })

    // --- Nuevos tests de integración para Panel de Administración (QA Engineer) ---
    describe('Admin Panel Integration Tests', () => {
        beforeEach(() => {
            // Resetear mocks para cada test
            mockIsAuthenticated = true
            mockUser = { name: 'Admin', email: 'admin@example.com', role: 'admin' }
        })

        test('renders the Command Center KPIs', () => {
            render(<AdminPage />)
            
            // Verifica que existan las tarjetas de métricas (hay múltiples, usar getAll)
            expect(screen.getAllByText(/Alumnas Activas/i).length).toBeGreaterThan(0)
            expect(screen.getAllByText(/Pagos Pendientes/i).length).toBeGreaterThan(0)
            expect(screen.getAllByText(/Ingresos Totales/i).length).toBeGreaterThan(0)
            expect(screen.getAllByText(/Ticket Medio/i).length).toBeGreaterThan(0)
        })

        test('displays the Students Table', () => {
            render(<AdminPage />)

            // Verificar que existe la tabla
            const table = screen.getByRole('table')
            expect(table).toBeInTheDocument()

            // Verificar que hay columnas esperadas (hay múltiples, usar getAll)
            expect(screen.getAllByText(/Alumna/i).length).toBeGreaterThan(0)
            expect(screen.getAllByText(/Plan/i).length).toBeGreaterThan(0)
            expect(screen.getAllByText(/Estado/i).length).toBeGreaterThan(0)
            expect(screen.getAllByText(/Pago/i).length).toBeGreaterThan(0)
            expect(screen.getAllByText(/Ingresos/i).length).toBeGreaterThan(0)
            expect(screen.getAllByText(/Acciones Rápidas/i).length).toBeGreaterThan(0)
        })

        test('allows confirming a pending payment', async () => {
            render(<AdminPage />)

            // Busca un botón de confirmar pago
            const confirmButtons = screen.getAllByRole('button', { name: /Confirmar Pago/i })
            expect(confirmButtons.length).toBeGreaterThan(0)
            
            // Hacemos click en el primer botón
            fireEvent.click(confirmButtons[0])
            
            // Verificar que aparece notificación
            expect(screen.getByText(/Pago confirmado/i)).toBeInTheDocument()
        })

        test('allows gifting a class', async () => {
            render(<AdminPage />)

            // Busca un botón de regalar clase
            const giftButtons = screen.getAllByRole('button', { name: /Regalar Clase/i })
            expect(giftButtons.length).toBeGreaterThan(0)
            
            // Hacemos click en el primer botón
            fireEvent.click(giftButtons[0])
            
            // Verificar que aparece notificación
            expect(screen.getByText(/Clase regalada/i)).toBeInTheDocument()
        })
    })

    // --- Nuevos tests de navegación y edición de perfil (QA Engineer) ---
    describe('Navegación y Edición de Perfil en Admin', () => {
        beforeEach(() => {
            // Resetear mocks para cada test
            mockIsAuthenticated = true
            mockUser = { name: 'Admin', email: 'admin@example.com', role: 'admin' }
        })

        test('contains a link to navigate back to Home/Landing', () => {
            render(<AdminPage />)
            
            // Verificar que existe un enlace con texto "Volver al Inicio" y href="/"
            const homeLink = screen.getByRole('link', { name: /Volver al Inicio/i })
            expect(homeLink).toBeInTheDocument()
            expect(homeLink).toHaveAttribute('href', '/')
            
            // También verificar por test-id
            const homeLinkByTestId = screen.getByTestId('home-link')
            expect(homeLinkByTestId).toBeInTheDocument()
        })

        test('contains an Edit Profile button', () => {
            render(<AdminPage />)
            
            // Verificar que existe un botón con texto "Editar Perfil"
            const editProfileButton = screen.getByRole('button', { name: /Editar Perfil/i })
            expect(editProfileButton).toBeInTheDocument()
            
            // También verificar por test-id
            const editProfileButtonByTestId = screen.getByTestId('edit-profile-button')
            expect(editProfileButtonByTestId).toBeInTheDocument()
        })

        test('opens the real Edit Profile modal with inputs', async () => {
            render(<AdminPage />)
            
            const profileButton = screen.getByText(/Editar Perfil/i)
            fireEvent.click(profileButton)

            // Ahora esperamos que aparezcan los inputs, igual que en el dashboard
            await waitFor(() => {
                expect(screen.getByPlaceholderText(/Tu nombre/i)).toBeInTheDocument()
                expect(screen.getByPlaceholderText(/tu@email.com/i)).toBeInTheDocument()
                expect(screen.getByPlaceholderText(/Dejar en blanco para no cambiar/i)).toBeInTheDocument()
            })
        })
    })
})