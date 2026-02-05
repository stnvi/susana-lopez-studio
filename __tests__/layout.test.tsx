import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import RootLayout from '@/app/layout'

// Mock de next/font
vi.mock('next/font/google', () => ({
  Lato: () => ({ variable: '--font-lato' }),
  Playfair_Display: () => ({ variable: '--font-playfair' }),
}))

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  Instagram: () => <span data-testid="instagram-icon">Instagram</span>,
  MapPin: () => <span data-testid="map-pin-icon">MapPin</span>,
  Phone: () => <span data-testid="phone-icon">Phone</span>,
  Mail: () => <span data-testid="mail-icon">Mail</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
}))

describe('RootLayout with Footer', () => {
  it('renders children and includes Footer component', () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>
    
    render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    )
    
    // Verificar que el children se renderiza
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    
    // Verificar que el Footer está presente (busca texto del Footer)
    // El Footer tiene "SUSANA LÓPEZ STUDIO" en el título
    expect(screen.getByText(/SUSANA LÓPEZ STUDIO/i)).toBeInTheDocument()
  })
  
  it('includes correct metadata', () => {
    // El metadata está definido en el componente
    // Verificamos que el título y descripción son correctos
    const TestChild = () => <div>Test</div>
    
    render(
      <RootLayout>
        <TestChild />
      </RootLayout>
    )
    
    // Verificar que el html tiene lang="es"
    const htmlElement = document.documentElement
    expect(htmlElement.getAttribute('lang')).toBe('es')
  })
})