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
const mockLogin = vi.fn()
const mockRegister = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: mockIsAuthenticated(),
        login: mockLogin,
        logout: vi.fn(),
        register: mockRegister,
        user: null,
    }),
}))

describe('Facturación - Dashboard de Clienta', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockIsAuthenticated.mockReturnValue(true)
    })

    test.skip('debe existir una sección o pestaña llamada "Mis Facturas"', () => {
        render(<DashboardPage />)

        // Verificar que existe una pestaña (tab) con el texto "Mis Facturas"
        expect(screen.getByRole('tab', { name: /Mis Facturas/i })).toBeInTheDocument()
    })

    test.skip('debe renderizar una tabla con las columnas "Fecha", "Concepto", "Importe" y "Acciones"', () => {
        render(<DashboardPage />)

        // Seleccionar la pestaña "Mis Facturas"
        const facturasTab = screen.getByRole('tab', { name: /Mis Facturas/i })
        fireEvent.click(facturasTab)

        // Verificar que la tabla existe (role="table" o "grid")
        const table = screen.getByRole('table')
        expect(table).toBeInTheDocument()

        // Verificar que las columnas están presentes
        expect(screen.getByText(/Fecha/i)).toBeInTheDocument()
        expect(screen.getByText(/Concepto/i)).toBeInTheDocument()
        expect(screen.getByText(/Importe/i)).toBeInTheDocument()
        expect(screen.getByText(/Acciones/i)).toBeInTheDocument()
    })

    test.skip('debe existir al menos un botón con el texto "Descargar PDF"', () => {
        render(<DashboardPage />)

        // Seleccionar la pestaña "Mis Facturas"
        const facturasTab = screen.getByRole('tab', { name: /Mis Facturas/i })
        fireEvent.click(facturasTab)

        // Verificar que hay al menos un botón "Descargar PDF"
        const downloadButtons = screen.getAllByRole('button', { name: /Descargar PDF/i })
        expect(downloadButtons.length).toBeGreaterThan(0)
    })

    test.skip('al hacer clic en "Descargar PDF" debe llamar a una función de descarga', () => {
        // Mock de la función global para descargar
        const mockDownload = vi.fn()
        vi.stubGlobal('downloadFactura', mockDownload)

        render(<DashboardPage />)

        // Seleccionar la pestaña "Mis Facturas"
        const facturasTab = screen.getByRole('tab', { name: /Mis Facturas/i })
        fireEvent.click(facturasTab)

        // Hacer clic en el primer botón "Descargar PDF"
        const downloadButton = screen.getAllByRole('button', { name: /Descargar PDF/i })[0]
        fireEvent.click(downloadButton)

        // Verificar que se llamó a la función de descarga
        expect(mockDownload).toHaveBeenCalledTimes(1)

        // Limpiar stub
        vi.unstubAllGlobals()
    })
})