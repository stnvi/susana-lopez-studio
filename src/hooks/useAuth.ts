import { useState, useCallback, useEffect } from 'react'

type User = {
    name: string
    email: string
    password: string
    role: 'client' | 'admin'
}

// Datos extendidos para perfiles demo
type DemoUserData = {
    bono?: {
        sesiones: number
        total: number
    }
    reservas?: Array<{
        id: number
        date: string
        time: string
        type: string
    }>
    hasOnline?: boolean
}

const STORAGE_KEY_USERS = 'susana-lopez-studio-users'
const STORAGE_KEY_SESSION = 'susana-lopez-studio-auth'

/**
 * Hook para manejar autenticación con persistencia en localStorage.
 * Almacena una lista de usuarios registrados y permite login/registro.
 * Incluye perfiles demo predefinidos para testing.
 */
export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<{ name: string; email: string; role: 'client' | 'admin' } | null>(null)
    const [users, setUsers] = useState<User[]>([])
    const [demoData, setDemoData] = useState<DemoUserData | null>(null)

    // Función para determinar el rol basado en el email
    const determineRole = (email: string): 'client' | 'admin' => {
        return email === 'admin@susanalopez.com' ? 'admin' : 'client'
    }

    // Cargar usuarios desde localStorage al montar
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY_USERS)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setUsers(Array.isArray(parsed) ? parsed : [])
            } catch {
                setUsers([])
            }
        }
        // Verificar si hay sesión activa almacenada
        const session = localStorage.getItem(STORAGE_KEY_SESSION)
        if (session) {
            try {
                const parsed = JSON.parse(session)
                setIsAuthenticated(true)
                setUser({
                    name: parsed.name || '',
                    email: parsed.email,
                    role: parsed.role || determineRole(parsed.email)
                })
                // Cargar demoData si es un perfil demo
                if (parsed.isDemo) {
                    const demoProfiles = {
                        'nuevo@demo.com': {
                            bono: undefined,
                            reservas: [],
                            hasOnline: false
                        },
                        'presencial@demo.com': {
                            bono: { sesiones: 3, total: 10 },
                            reservas: [
                                { id: 1, date: '12 Oct', time: '18:00', type: 'Pilates Máquina' }
                            ],
                            hasOnline: false
                        },
                        'full@demo.com': {
                            bono: { sesiones: 8, total: 10 },
                            reservas: [
                                { id: 1, date: '12 Oct', time: '18:00', type: 'Pilates Máquina' },
                                { id: 2, date: '20 Oct', time: '19:00', type: 'Suelo Pélvico' }
                            ],
                            hasOnline: true
                        }
                    }
                    setDemoData(demoProfiles[parsed.email as keyof typeof demoProfiles] || null)
                }
            } catch {
                // Ignorar error
            }
        }
    }, [])

    const login = useCallback((email: string, password: string) => {
        // Perfiles demo hardcoded (cualquier contraseña funciona)
        const demoProfiles = {
            'nuevo@demo.com': {
                name: 'Usuario Nuevo',
                role: 'client' as const,
                demoData: {
                    bono: undefined,
                    reservas: [],
                    hasOnline: false
                }
            },
            'presencial@demo.com': {
                name: 'Cliente Presencial',
                role: 'client' as const,
                demoData: {
                    bono: { sesiones: 3, total: 10 },
                    reservas: [
                        { id: 1, date: '12 Oct', time: '18:00', type: 'Pilates Máquina' }
                    ],
                    hasOnline: false
                }
            },
            'full@demo.com': {
                name: 'Cliente Premium',
                role: 'client' as const,
                demoData: {
                    bono: { sesiones: 8, total: 10 },
                    reservas: [
                        { id: 1, date: '12 Oct', time: '18:00', type: 'Pilates Máquina' },
                        { id: 2, date: '20 Oct', time: '19:00', type: 'Suelo Pélvico' }
                    ],
                    hasOnline: true
                }
            }
        }

        // Verificar si es un perfil demo
        if (email in demoProfiles) {
            const demoProfile = demoProfiles[email as keyof typeof demoProfiles]
            setIsAuthenticated(true)
            setUser({ name: demoProfile.name, email, role: demoProfile.role })
            setDemoData(demoProfile.demoData)
            // Guardar sesión en localStorage
            localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({
                name: demoProfile.name,
                email,
                role: demoProfile.role,
                isDemo: true
            }))
            return true
        }

        // Comportamiento normal para otros usuarios
        const found = users.find(u => u.email === email && u.password === password)
        if (found) {
            const role = found.role || determineRole(email)
            setIsAuthenticated(true)
            setUser({ name: found.name, email, role })
            setDemoData(null)
            // Guardar sesión en localStorage con nombre y rol
            localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({
                name: found.name,
                email,
                role
            }))
            return true
        }
        return false
    }, [users])

    const logout = useCallback(() => {
        setIsAuthenticated(false)
        setUser(null)
        setDemoData(null)
        localStorage.removeItem(STORAGE_KEY_SESSION)
    }, [])

    const register = useCallback((name: string, email: string, password: string) => {
        // Validación de longitud de contraseña
        if (password.length < 6) {
            return false
        }
        // Verificar si el usuario ya existe
        if (users.some(u => u.email === email)) {
            return false
        }
        const role = determineRole(email)
        const newUser: User = { name, email, password, role }
        const updatedUsers = [...users, newUser]
        setUsers(updatedUsers)
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers))
        // Autenticar automáticamente después del registro
        setIsAuthenticated(true)
        setUser({ name, email, role })
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({ name, email, role }))
        return true
    }, [users])

    return {
        isAuthenticated,
        user,
        demoData,
        login,
        logout,
        register,
    }
}