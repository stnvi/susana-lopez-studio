import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import Footer from '@/components/footer'

// Mock simple para lucide-react
vi.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin">📍</div>,
  Phone: () => <div data-testid="phone">📞</div>,
  Mail: () => <div data-testid="mail">✉️</div>,
  Clock: () => <div data-testid="clock">⏰</div>,
  Instagram: () => <div data-testid="instagram">📷</div>,
}))

describe('Footer Component', () => {
  test('renders the business name', () => {
    render(<Footer />)
    expect(screen.getByText(/SUSANA LÓPEZ STUDIO/i)).toBeInTheDocument()
  })

  test('renders the Salamanca address', () => {
    render(<Footer />)
    expect(screen.getByText(/Centro Comercial Los Cipreses/i)).toBeInTheDocument()
    expect(screen.getByText(/Av. de los Cipreses, s\/n/i)).toBeInTheDocument()
    expect(screen.getByText(/37004 Salamanca/i)).toBeInTheDocument()
  })

  test('renders the phone number', () => {
    render(<Footer />)
    expect(screen.getByText(/634 038 545/i)).toBeInTheDocument()
  })

  test('renders the email', () => {
    render(<Footer />)
    expect(screen.getByText(/info@susanalopezstudio.com/i)).toBeInTheDocument()
  })

  test('renders the schedule', () => {
    render(<Footer />)
    expect(screen.getByText(/09:30 - 10:30/i)).toBeInTheDocument()
    expect(screen.getByText(/17:00 - 21:00/i)).toBeInTheDocument()
  })

  test('renders the Instagram link', () => {
    render(<Footer />)
    expect(screen.getByText(/@susanalopezstudio/i)).toBeInTheDocument()
  })

  test('has links with correct attributes', () => {
    render(<Footer />)
    
    // Verificar enlace de teléfono
    const phoneLink = screen.getByText(/634 038 545/i).closest('a')
    expect(phoneLink).toHaveAttribute('href', 'tel:34634038545')
    
    // Verificar enlace de email
    const emailLink = screen.getByText(/info@susanalopezstudio.com/i).closest('a')
    expect(emailLink).toHaveAttribute('href', 'mailto:info@susanalopezstudio.com')
    
    // Verificar enlace de Instagram
    const instagramLink = screen.getByText(/@susanalopezstudio/i).closest('a')
    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/susanalopezstudio')
    expect(instagramLink).toHaveAttribute('target', '_blank')
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})