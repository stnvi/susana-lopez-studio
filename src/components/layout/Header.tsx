'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { isAuthenticated, user } = useAuth()

    const navLinks = [
        { label: 'Inicio', href: '/' },
        { label: 'Servicios', href: '#servicios' },
        { label: 'Sobre mí', href: '#sobre-mi' },
        { label: 'Contacto', href: '#contacto' },
    ]

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const closeMenu = () => setIsMenuOpen(false)

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleMenu()
        }
        if (e.key === 'Escape') {
            closeMenu()
        }
    }

    // Determinar botón según estado de autenticación y rol
    let buttonText = ''
    let buttonHref = ''
    if (!isAuthenticated) {
        buttonText = 'Iniciar Sesión'
        buttonHref = '/login'
    } else if (user?.role === 'admin') {
        buttonText = 'Área Administración'
        buttonHref = '/admin'
    } else {
        // client o cualquier otro rol
        buttonText = 'Área Clienta'
        buttonHref = '/dashboard'
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-gradient-to-b from-black/30 to-transparent text-white">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
                {/* Logo - Texto Vertical */}
                <div className="flex items-center">
                    <Link href="/" className="block">
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-xl font-serif font-bold text-white">SUSANA LÓPEZ</span>
                            <span className="text-[10px] font-sans tracking-[0.3em] text-primary">STUDIO</span>
                        </div>
                    </Link>
                </div>

                {/* Navegación Desktop */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-white transition-colors hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Botón dinámico + Menú móvil */}
                <div className="flex items-center gap-4">
                    <Link
                        href={buttonHref}
                        className="hidden md:inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-secondary transition-colors hover:bg-primary-dark shadow-lg"
                    >
                        {buttonText}
                    </Link>

                    {/* Menú Hamburguesa (solo móvil) */}
                    <button
                        className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-white hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        onClick={toggleMenu}
                        onKeyDown={handleKeyDown}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Menú móvil desplegable (oculto por defecto) */}
            {isMenuOpen && (
                <div
                    id="mobile-menu"
                    className="md:hidden border-t border-primary/20 bg-secondary px-4 py-3"
                    role="menu"
                    aria-label="Menú de navegación"
                >
                    <div className="flex flex-col space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="py-2 text-base font-medium text-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded"
                                onClick={closeMenu}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        closeMenu()
                                    }
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href={buttonHref}
                            className="mt-4 w-full rounded-full bg-primary py-3 text-base font-medium text-secondary hover:bg-primary-dark text-center focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
                            onClick={closeMenu}
                        >
                            {buttonText}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}