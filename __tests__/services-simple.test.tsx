import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ServicesPage from '@/app/services/page'
import '@testing-library/jest-dom'

// Mock de navegación sin parámetros (por defecto presencial)
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/services',
  useSearchParams: () => new URLSearchParams(), // Sin parámetros
}))

// Mock del hook useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    user: null,
  }),
}))

describe('Services Page - Navegación Inteligente', () => {
  it('muestra servicios presenciales por defecto', () => {
    render(<ServicesPage />)
    
    // Debe mostrar servicios presenciales
    expect(screen.getByText(/Clase Suelta/i)).toBeInTheDocument()
    expect(screen.getByText(/Bono 5 Sesiones/i)).toBeInTheDocument()
    
    // No debe mostrar servicios online inicialmente
    expect(screen.queryByText(/Curso Hipopresivos/i)).not.toBeInTheDocument()
  })

  it('cambia a online al hacer clic en la pestaña', () => {
    render(<ServicesPage />)
    
    // Hacer clic en la pestaña online
    fireEvent.click(screen.getByText('online'))
    
    // Ahora debe mostrar servicios online
    expect(screen.getByText(/Curso Hipopresivos/i)).toBeInTheDocument()
    expect(screen.getByText(/Suelo Pélvico Total/i)).toBeInTheDocument()
  })

  it('muestra badge "Nuevo Lanzamiento" en servicios online', () => {
    render(<ServicesPage />)
    
    // Cambiar a online
    fireEvent.click(screen.getByText('online'))
    
    // Verificar badge
    expect(screen.getByText(/Nuevo Lanzamiento/i)).toBeInTheDocument()
  })
})