'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [acceptLegal, setAcceptLegal] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const { register, isAuthenticated } = useAuth()
    const router = useRouter()

    // Redirección si ya está autenticado (usando useEffect)
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/services')
        }
    }, [isAuthenticated, router])

    // Si ya está autenticado, no renderizar nada (o un loader)
    if (isAuthenticated) {
        return null
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validaciones básicas
        if (!name || !email || !password) {
            setError('Por favor, completa todos los campos.')
            return
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.')
            return
        }

        if (!acceptLegal) {
            setError('Debes aceptar la exención de responsabilidad para registrarte.')
            return
        }

        // Simular registro
        const success = register(name, email, password)
        if (success) {
            setSuccess(true)
            // Mostrar toast/alert simulado
            alert('¡Bienvenida! Hemos enviado un email de confirmación a tu correo.')
            // Redirigir después de un breve delay
            setTimeout(() => {
                router.push('/services')
            }, 1500)
        } else {
            setError('Error en el registro. Intenta nuevamente.')
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white border border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-secondary p-6 text-center">
                    <h1 className="text-3xl font-bold text-primary">Registro de Clienta</h1>
                    <p className="text-white/90 mt-2">Crea tu cuenta para acceder a recursos exclusivos</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            ¡Registro exitoso! Redirigiendo a servicios...
                        </div>
                    )}

                    {/* Nombre Completo */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            placeholder="Tu nombre completo"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary mb-2">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Legal Checkbox */}
                    <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/30">
                        <input
                            type="checkbox"
                            id="legal-checkbox"
                            data-testid="legal-checkbox"
                            checked={acceptLegal}
                            onChange={(e) => setAcceptLegal(e.target.checked)}
                            className="mt-1 h-5 w-5 text-primary focus:ring-primary"
                        />
                        <label htmlFor="legal-checkbox" className="text-sm text-secondary">
                            <span className="font-medium">Acepto la Exención de Responsabilidad por salud y lesiones.</span>
                            <p className="text-secondary/70 mt-1">
                                Reconozco que participo en las actividades de Susana Lopez Studio bajo mi propia responsabilidad y eximo al estudio de cualquier daño físico que pudiera ocurrir durante las sesiones.
                            </p>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        data-testid="register-button"
                        disabled={!acceptLegal}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${acceptLegal
                            ? 'bg-primary text-secondary hover:bg-primary-dark shadow-lg'
                            : 'bg-secondary/20 text-secondary/50 cursor-not-allowed'
                            }`}
                    >
                        Registrarse
                    </button>

                    {/* Volver al Inicio */}
                    <div className="text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center text-secondary/70 hover:text-secondary transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al Inicio
                        </Link>
                    </div>

                    {/* Links */}
                    <div className="text-center pt-4 border-t border-primary/30">
                        <p className="text-secondary/70">
                            ¿Ya tienes cuenta?{' '}
                            <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                                Inicia Sesión
                            </Link>
                        </p>
                        <p className="text-secondary/50 text-sm mt-4">
                            Al registrarte, aceptas nuestros{' '}
                            <Link href="#" className="text-primary hover:underline">Términos de Uso</Link> y{' '}
                            <Link href="#" className="text-primary hover:underline">Política de Privacidad</Link>.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}