import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Header from '@/components/layout/Header'

// Mock de next/navigation (no se usa pero previene errores)
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => '/',
}))

// Mock del hook useAuth (variable para controlar estado)
let mockIsAuthenticated = false
let mockUser: { name: string; email: string; role: string } | null = null
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: mockIsAuthenticated,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        user: mockUser,
    }),
}))

describe('Header Inteligente - Susana Lopez Studio', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Resetear valores por defecto (Guest)
        mockIsAuthenticated = false
        mockUser = null
    })

    test('Caso Guest (isAuthenticated: false): debe mostrar botón "Iniciar Sesión" que enlace a /login', () => {
        render(<Header />)

        // Verificar que existe un botón/enlace con texto "Iniciar Sesión"
        const loginButton = screen.getByRole('link', { name: /Iniciar Sesión/i })
        expect(loginButton).toBeInTheDocument()
        expect(loginButton).toHaveAttribute('href', '/login')
        // Verificar que NO aparece "Acceso Clientas" ni "Área Administración"
        expect(screen.queryByRole('link', { name: /Acceso Clientas/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /Área Administración/i })).not.toBeInTheDocument()
    })

    test('Caso Client (isAuthenticated: true, role: "client"): debe mostrar botón "Área Clienta" que enlace a /dashboard', () => {
        mockIsAuthenticated = true
        mockUser = { name: 'Cliente', email: 'cliente@example.com', role: 'client' }

        render(<Header />)

        // Verificar que existe un botón/enlace con texto "Área Clienta"
        const clientButton = screen.getByRole('link', { name: /Área Clienta/i })
        expect(clientButton).toBeInTheDocument()
        expect(clientButton).toHaveAttribute('href', '/dashboard')
        // Verificar que NO aparece "Iniciar Sesión" ni "Área Administración"
        expect(screen.queryByRole('link', { name: /Iniciar Sesión/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /Área Administración/i })).not.toBeInTheDocument()
    })

    test('Caso Admin (isAuthenticated: true, role: "admin"): debe mostrar botón "Área Administración" que enlace a /admin', () => {
        mockIsAuthenticated = true
        mockUser = { name: 'Admin', email: 'admin@example.com', role: 'admin' }

        render(<Header />)

        // Verificar que existe un botón/enlace con texto "Área Administración"
        const adminButton = screen.getByRole('link', { name: /Área Administración/i })
        expect(adminButton).toBeInTheDocument()
        expect(adminButton).toHaveAttribute('href', '/admin')
        // Verificar que NO aparece "Iniciar Sesión" ni "Área Clienta"
        expect(screen.queryByRole('link', { name: /Iniciar Sesión/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /Área Clienta/i })).not.toBeInTheDocument()
    })
})