import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import DashboardPage from '@/app/dashboard/page'

// Mock de next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => '/dashboard',
}))

// Mock del hook useAuth
const mockIsAuthenticated = vi.fn(() => true)
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: mockIsAuthenticated(),
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        user: null,
    }),
}))

describe('LMS - Escuela Online', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockIsAuthenticated.mockReturnValue(true)
    })

    test.skip('al entrar al Área Online, el sistema debe mostrar por defecto la sección "Mis Compras"', () => {
        render(<DashboardPage />)

        // Acceder a la pestaña Online (hacer clic en el tab "Online")
        const onlineTab = screen.getByRole('tab', { name: /Online/i })
        fireEvent.click(onlineTab)

        // Verificar que la pestaña "Online" está activa
        expect(onlineTab).toHaveAttribute('aria-selected', 'true')

        // Verificar que existe una sección "Mis Compras" (heading o título)
        expect(screen.getByRole('heading', { name: /Mis Compras/i })).toBeInTheDocument()
    })

    test.skip('debe existir un curso llamado "Pilates para Principiantes" con una barra de progreso que indique un porcentaje (ej: "45% completado")', () => {
        render(<DashboardPage />)

        // Acceder a la pestaña Online
        const onlineTab = screen.getByRole('tab', { name: /Online/i })
        fireEvent.click(onlineTab)

        // Verificar que existe el curso "Pilates para Principiantes"
        expect(screen.getByText(/Pilates para Principiantes/i)).toBeInTheDocument()

        // Verificar que hay una barra de progreso (elemento con role "progressbar" o texto de porcentaje)
        const progressText = screen.getByText(/45% completado/i)
        expect(progressText).toBeInTheDocument()

        // Verificar que el porcentaje es 45% (o al menos un número)
        expect(progressText).toHaveTextContent(/45%/)
    })

    test.skip('debe existir un botón "Ver curso" que, al pulsarlo, simule la apertura de un reproductor o lista de lecciones (puedes buscar el texto "Lección 1: Respiración")', () => {
        render(<DashboardPage />)

        // Acceder a la pestaña Online
        const onlineTab = screen.getByRole('tab', { name: /Online/i })
        fireEvent.click(onlineTab)

        // Encontrar el botón "Ver curso" (puede haber varios, tomamos el primero)
        const verCursoButtons = screen.getAllByRole('button', { name: /Ver curso/i })
        expect(verCursoButtons.length).toBeGreaterThan(0)
        const firstButton = verCursoButtons[0]

        // Hacer clic en el botón
        fireEvent.click(firstButton)

        // Verificar que aparece el texto "Lección 1: Respiración" (simulación de apertura)
        const leccionElements = screen.getAllByText(/Lección 1: Respiración/i)
        expect(leccionElements.length).toBeGreaterThan(0)
    })
})