import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ServicesPage from '@/app/services/page'
import '@testing-library/jest-dom'

// Mock de navegación (sin parámetros por defecto)
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/services',
  useSearchParams: () => new URLSearchParams(), // Sin parámetros
}))

// Mock del hook useAuth (si se usa)
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    user: null,
  }),
}))

describe('Services Page', () => {
  beforeEach(() => {
    // Resetear mocks antes de cada test
    vi.clearAllMocks()
  })

  it('renders main title and toggles', () => {
    render(<ServicesPage />)
    expect(screen.getByRole('heading', { name: /Nuestros Servicios/i })).toBeInTheDocument()
    expect(screen.getByText('presencial')).toBeInTheDocument()
    expect(screen.getByText('online')).toBeInTheDocument()
  })

  it('shows Presencial services by default', () => {
    render(<ServicesPage />)
    // Debería mostrar servicios presenciales por defecto
    expect(screen.getByText(/Clase Suelta/i)).toBeInTheDocument()
    expect(screen.getByText(/Bono 5 Sesiones/i)).toBeInTheDocument()
    // No debería mostrar servicios online aún
    expect(screen.queryByText(/Curso Hipopresivos/i)).not.toBeInTheDocument()
  })

  it('switches to Online content on click', () => {
    render(<ServicesPage />)
    const onlineTab = screen.getByText('online')
    fireEvent.click(onlineTab)

    // Ahora debe verse el contenido online
    expect(screen.getByText(/Curso Hipopresivos/i)).toBeInTheDocument()
  })

  it('displays Marketing Badges (Recommended/New)', () => {
    render(<ServicesPage />)
    // Algún elemento debe tener la etiqueta Recomendado
    expect(screen.getAllByText(/Recomendado/i).length).toBeGreaterThan(0)

    // Cambiamos a online para ver el Nuevo Lanzamiento
    fireEvent.click(screen.getByText('online'))
    expect(screen.getByText(/Nuevo Lanzamiento/i)).toBeInTheDocument()
  })

  it('renders a link to navigate back to Home', () => {
    render(<ServicesPage />)
    // Verificar que existe un enlace para volver al inicio
    const homeLink = screen.getByText(/Volver al Inicio/i)
    expect(homeLink).toBeInTheDocument()
    expect(homeLink.closest('a')).toHaveAttribute('href', '/')
  })

  it('verifies that Online tab cards have visual richness', () => {
    const { container } = render(<ServicesPage />)

    // Cambiar a la pestaña Online
    const onlineTab = screen.getByText('online')
    fireEvent.click(onlineTab)

    // Verificar que se muestra contenido online
    expect(screen.getByText(/Curso Hipopresivos/i)).toBeInTheDocument()

    // Verificar que existen elementos visuales en las tarjetas
    // 1. Badges (Recomendado / Nuevo Lanzamiento)
    const badges = screen.getAllByText(/Recomendado|Nuevo Lanzamiento/i)
    expect(badges.length).toBeGreaterThan(0)

    // 2. Iconos de características (puntos de lista)
    const featureIcons = container.querySelectorAll('span.w-1\\.5.h-1\\.5') // Selector para los puntos de lista
    expect(featureIcons.length).toBeGreaterThan(0)

    // 3. Elementos decorativos (bordes, sombras, etc.)
    const cardsWithShadow = container.querySelectorAll('.shadow-sm, .shadow-xl, .shadow-2xl')
    expect(cardsWithShadow.length).toBeGreaterThan(0)

    // 4. Elementos con colores de la paleta (primary/secondary)
    const coloredElements = container.querySelectorAll('.bg-primary, .bg-secondary, .text-primary, .text-secondary')
    expect(coloredElements.length).toBeGreaterThan(0)
  })
})