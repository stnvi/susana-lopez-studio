'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login, isAuthenticated, user } = useAuth()
    const router = useRouter()

    // Redirección si ya está autenticado (usando useEffect)
    useEffect(() => {
        if (isAuthenticated) {
            const target = user?.role === 'admin' ? '/admin' : '/dashboard'
            router.push(target)
        }
    }, [isAuthenticated, router, user])

    // Si ya está autenticado, no renderizar nada (o un loader)
    if (isAuthenticated) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Validaciones básicas
        if (!email || !password) {
            setError('Por favor, completa todos los campos.')
            setLoading(false)
            return
        }

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500))

        // Intentar login
        const success = login(email, password)
        if (success) {
            // Determinar rol basado en email (igual que el hook)
            const isAdmin = email === 'admin@susanalopez.com'
            const target = isAdmin ? '/admin' : '/dashboard'
            router.push(target)
        } else {
            setError('Credenciales incorrectas. Intenta nuevamente.')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white border border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-secondary p-6 text-center">
                    <h1 className="text-3xl font-bold text-primary">Iniciar Sesión</h1>
                    <p className="text-white/90 mt-2">Accede a tu área personal de clienta</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

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

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-secondary">
                                Recordarme
                            </label>
                        </div>
                        <Link href="#" className="text-sm text-primary hover:text-primary/80">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary text-secondary rounded-lg font-medium hover:bg-primary-dark shadow-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-primary/30"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-secondary/50">O continúa con</span>
                        </div>
                    </div>

                    {/* Social Login (placeholder) */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="py-3 border border-primary/30 rounded-lg text-secondary hover:bg-primary/10 transition-colors font-medium"
                        >
                            Google
                        </button>
                        <button
                            type="button"
                            className="py-3 border border-primary/30 rounded-lg text-secondary hover:bg-primary/10 transition-colors font-medium"
                        >
                            Apple
                        </button>
                    </div>

                    {/* Links */}
                    <div className="text-center pt-4 border-t border-primary/30">
                        <p className="text-secondary/70">
                            ¿No tienes cuenta?{' '}
                            <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                                Regístrate aquí
                            </Link>
                        </p>
                        <p className="text-secondary/50 text-sm mt-4">
                            Al iniciar sesión, aceptas nuestros{' '}
                            <Link href="#" className="text-primary hover:underline">Términos de Uso</Link> y{' '}
                            <Link href="#" className="text-primary hover:underline">Política de Privacidad</Link>.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}