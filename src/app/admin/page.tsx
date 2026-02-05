'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDevSection } from '@/context/DevControlContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
    id: number
    name: string
    email: string
    plan: string
    status: 'Conectada' | 'Desconectada'
    paymentStatus: 'paid' | 'pending'
    lastPayment: string
    totalSpent: number
}

interface ClassSession {
    id: number
    day: number
    students: number
    max: number
    time: string
    active: boolean
}

const INITIAL_USERS: User[] = [
    { id: 1, name: 'Laura Martínez', email: 'laura@example.com', plan: 'Premium Mensual', status: 'Conectada', paymentStatus: 'paid', lastPayment: '2026-02-01', totalSpent: 85.00 },
    { id: 2, name: 'Ana García', email: 'ana@example.com', plan: 'Bono 10 Clases', status: 'Conectada', paymentStatus: 'pending', lastPayment: '2026-01-15', totalSpent: 250.00 },
    { id: 3, name: 'Sofía López', email: 'sofia@example.com', plan: 'Online Trimestral', status: 'Desconectada', paymentStatus: 'paid', lastPayment: '2026-02-03', totalSpent: 149.99 },
    { id: 4, name: 'Elena Rodríguez', email: 'elena@example.com', plan: 'Presencial Suelto', status: 'Desconectada', paymentStatus: 'pending', lastPayment: '2026-01-20', totalSpent: 25.00 },
    { id: 5, name: 'María Fernández', email: 'maria@example.com', plan: 'Premium Anual', status: 'Desconectada', paymentStatus: 'paid', lastPayment: '2026-02-01', totalSpent: 999.00 },
    { id: 6, name: 'Carla Ruiz', email: 'carla@example.com', plan: 'Bono 5 Clases', status: 'Desconectada', paymentStatus: 'pending', lastPayment: '2026-01-28', totalSpent: 125.00 },
    { id: 7, name: 'Patricia Gómez', email: 'patricia@example.com', plan: 'Online Mensual', status: 'Desconectada', paymentStatus: 'paid', lastPayment: '2026-02-02', totalSpent: 49.99 },
    { id: 8, name: 'Isabel Sánchez', email: 'isabel@example.com', plan: 'Presencial Suelto', status: 'Desconectada', paymentStatus: 'pending', lastPayment: '2026-01-25', totalSpent: 25.00 },
]

export default function AdminPage() {
    const { isAuthenticated, user, logout } = useAuth()
    const router = useRouter()
    const adminConfig = useDevSection('admin')
    const [users, setUsers] = useState<User[]>(INITIAL_USERS)
    const [searchTerm, setSearchTerm] = useState('')
    const [notification, setNotification] = useState<string | null>(null)
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
    const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false)
    const [editingClass, setEditingClass] = useState<{ id: number, date: string, time: string, status: string } | null>(null)
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Administrador',
        email: user?.email || 'admin@susanalopezstudio.com',
        password: ''
    })
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
    const [openMenuId, setOpenMenuId] = useState<number | null>(null)
    const [classes, setClasses] = useState<ClassSession[]>([
        { id: 1, day: 2, students: 8, max: 10, time: '10:00', active: true },
        { id: 2, day: 5, students: 10, max: 10, time: '12:00', active: true },
        { id: 3, day: 7, students: 6, max: 10, time: '16:00', active: true },
        { id: 4, day: 9, students: 9, max: 10, time: '18:00', active: true },
        { id: 5, day: 12, students: 10, max: 10, time: '10:00', active: true },
        { id: 6, day: 14, students: 7, max: 10, time: '12:00', active: true },
        { id: 7, day: 16, students: 8, max: 10, time: '16:00', active: true },
        { id: 8, day: 19, students: 5, max: 10, time: '18:00', active: true },
        { id: 9, day: 21, students: 10, max: 10, time: '10:00', active: true },
        { id: 10, day: 23, students: 6, max: 10, time: '12:00', active: true },
        { id: 11, day: 26, students: 10, max: 10, time: '16:00', active: true },
        { id: 12, day: 28, students: 8, max: 10, time: '18:00', active: true },
        { id: 13, day: 30, students: 7, max: 10, time: '10:00', active: true },
    ])
    const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null)

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    // Si no está autenticado o no tiene rol de admin, mostrar acceso denegado
    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white border border-primary/20 rounded-2xl shadow-2xl p-8 text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                    <p className="text-secondary/70 mb-6">Solo para administradores. Debes iniciar sesión con una cuenta de administrador para acceder a esta página.</p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-primary text-secondary font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-lg"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        )
    }

    // KPIs
    const activeUsers = users.filter(u => u.status === 'Conectada').length
    const pendingPayments = users.filter(u => u.paymentStatus === 'pending').length
    const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0)
    const avgRevenuePerUser = activeUsers > 0 ? totalRevenue / activeUsers : 0

    // Función para normalizar texto (eliminar acentos, convertir a minúsculas)
    const normalizeText = (text: string): string => {
        return text
            .toLowerCase()
            .normalize('NFD') // Descomponer acentos
            .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos
            .replace(/[^a-z0-9\s]/g, '') // Eliminar caracteres especiales (opcional)
    }

    // Filtrar usuarios por búsqueda con normalización
    const filteredUsers = users.filter(user => {
        if (!searchTerm.trim()) return true

        const normalizedSearch = normalizeText(searchTerm)
        const normalizedName = normalizeText(user.name)
        const normalizedEmail = normalizeText(user.email)
        const normalizedPlan = normalizeText(user.plan)

        return (
            normalizedName.includes(normalizedSearch) ||
            normalizedEmail.includes(normalizedSearch) ||
            normalizedPlan.includes(normalizedSearch)
        )
    })

    // Funciones de acción rápida
    const handleConfirmPayment = (userId: number) => {
        setUsers(prev => prev.map(user =>
            user.id === userId ? { ...user, paymentStatus: 'paid' } : user
        ))
        const userName = users.find(u => u.id === userId)?.name || 'Usuario'
        alert(`Pago confirmado para ${userName}`)
        showNotification(`✅ Pago confirmado para ${userName}`)
    }

    const handleGiftClass = (userId: number) => {
        const userName = users.find(u => u.id === userId)?.name || 'Usuario'
        alert('¡Clase de regalo añadida al perfil de la alumna!')
        showNotification(`🎁 Clase regalada a ${userName}`)
    }

    const handleEditClass = (userId: number) => {
        const userName = users.find(u => u.id === userId)?.name || 'Usuario'
        setEditingClass({
            id: userId,
            date: '2026-02-10',
            time: '18:00',
            status: 'confirmada'
        })
        setIsEditClassModalOpen(true)
    }

    const handleActivateUser = (userId: number) => {
        setUsers(prev => prev.map(user =>
            user.id === userId ? { ...user, status: 'Conectada' } : user
        ))
        const userName = users.find(u => u.id === userId)?.name || 'Usuario'
        alert(`Usuario ${userName} activado`)
        showNotification(`✅ Usuario ${userName} activado`)
    }

    const showNotification = (message: string) => {
        setNotification(message)
        setTimeout(() => setNotification(null), 3000)
    }

    // Funciones de selección masiva
    const toggleSelectUser = (userId: number) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }

    const toggleSelectAll = () => {
        if (selectedUserIds.length === filteredUsers.length) {
            setSelectedUserIds([])
        } else {
            setSelectedUserIds(filteredUsers.map(user => user.id))
        }
    }

    const clearSelection = () => {
        setSelectedUserIds([])
    }

    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfileData(prev => ({ ...prev, [name]: value }))
    }

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        showNotification('✅ Perfil actualizado correctamente')
        setIsEditProfileModalOpen(false)
        // Aquí normalmente se enviaría a una API
    }

    // Funciones para gestión de clases del calendario
    const handleCancelClass = (classId: number) => {
        setClasses(prev => prev.map(c =>
            c.id === classId ? { ...c, active: false } : c
        ))
        showNotification('🗑️ Clase anulada')
        setSelectedClass(null)
    }

    const handleMoveClass = (classId: number, newDay: number) => {
        if (newDay < 1 || newDay > 31) {
            alert('El día debe estar entre 1 y 31')
            return
        }
        
        setClasses(prev => prev.map(c =>
            c.id === classId ? { ...c, day: newDay } : c
        ))
        showNotification(`📅 Clase movida al día ${newDay}`)
        setSelectedClass(null)
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                {adminConfig.layout.showHeader && (
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                        <div>
                            {adminConfig.layout.showHomeLink && (
                                <Link
                                    href="/"
                                    className="text-xs md:text-sm text-primary hover:text-secondary font-medium transition-colors"
                                    data-testid="home-link"
                                >
                                    ← Volver al Inicio
                                </Link>
                            )}
                            {adminConfig.layout.showTitle && (
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mt-2">Hola, {user?.name || 'Susana'}</h1>
                            )}
                            {adminConfig.layout.showSubtitle && (
                                <p className="text-secondary/70 mt-2 text-sm md:text-base">Panel de Administración • Susana López Studio</p>
                            )}
                        </div>
                        <div className="flex items-center gap-4 md:gap-6">
                            {adminConfig.layout.showEditProfileBtn && (
                                <button
                                    onClick={() => setIsEditProfileModalOpen(true)}
                                    className="text-xs md:text-sm font-bold text-stone-400 hover:text-primary transition-colors uppercase tracking-wider"
                                    data-testid="edit-profile-button"
                                >
                                    Editar Perfil
                                </button>
                            )}
                            {adminConfig.layout.showLogoutBtn && (
                                <button
                                    onClick={handleLogout}
                                    className="text-xs md:text-sm font-bold text-stone-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                                >
                                    Cerrar Sesión
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Notificación temporal */}
                {notification && adminConfig.layout.showNotificationToast && (
                    <div className="fixed top-4 right-4 bg-secondary text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in">
                        {notification}
                    </div>
                )}

                {/* KPIs - Command Center */}
                <div className={`grid gap-4 md:gap-6 mb-8 md:mb-10 ${adminConfig.widgets.showRevenueCard ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
                    {adminConfig.widgets.showActiveUsersCard && (
                        <div className="bg-secondary rounded-xl shadow-2xl p-4 md:p-6 border border-primary/30">
                            <h3 className="text-base md:text-lg font-semibold text-white">Alumnas Activas</h3>
                            <p className="text-2xl md:text-3xl font-serif font-bold text-primary mt-2">{activeUsers}</p>
                            <p className="text-white/70 text-xs md:text-sm mt-1">de {users.length} total</p>
                        </div>
                    )}
                    {adminConfig.widgets.showPendingPaymentsCard && (
                        <div className="bg-secondary rounded-xl shadow-2xl p-4 md:p-6 border border-primary/30">
                            <h3 className="text-base md:text-lg font-semibold text-white">Pagos Pendientes</h3>
                            <p className="text-2xl md:text-3xl font-serif font-bold text-primary mt-2">{pendingPayments}</p>
                            <p className="text-white/70 text-xs md:text-sm mt-1">requieren atención</p>
                        </div>
                    )}
                    {adminConfig.widgets.showRevenueCard && adminConfig.showRevenue && (
                        <div className="bg-secondary rounded-xl shadow-2xl p-4 md:p-6 border border-primary/30">
                            <h3 className="text-base md:text-lg font-semibold text-white">Ingresos Totales</h3>
                            <p className="text-2xl md:text-3xl font-serif font-bold text-primary mt-2">{totalRevenue.toFixed(2)} €</p>
                            <p className="text-white/70 text-xs md:text-sm mt-1">este mes</p>
                        </div>
                    )}
                    {adminConfig.widgets.showAvgRevenueCard && adminConfig.showRevenue && (
                        <div className="bg-secondary rounded-xl shadow-2xl p-4 md:p-6 border border-primary/30">
                            <h3 className="text-base md:text-lg font-semibold text-white">Ticket Medio</h3>
                            <p className="text-2xl md:text-3xl font-serif font-bold text-primary mt-2">{avgRevenuePerUser.toFixed(2)} €</p>
                            <p className="text-white/70 text-xs md:text-sm mt-1">por alumna</p>
                        </div>
                    )}
                </div>

                {/* Búsqueda y Filtros */}
                {(adminConfig.tools.showSearch || adminConfig.tools.showExportBtn || adminConfig.tools.showCreateBtn) && (
                    <div className="bg-white border border-primary/20 rounded-xl shadow-lg p-4 md:p-6 mb-8 md:mb-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {adminConfig.tools.showSearch && (
                                <div className="flex-1">
                                    <label htmlFor="search" className="block text-sm font-medium text-secondary mb-2">
                                        Buscar alumna
                                    </label>
                                    <input
                                        type="text"
                                        id="search"
                                        placeholder="Buscar por nombre, email o plan (sin acentos)..."
                                        className="w-full px-3 py-2 md:px-4 md:py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="flex gap-2 md:gap-3">
                                {/* Botones eliminados para demo */}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabla de Alumnas */}
                <div className="bg-white border border-primary/20 rounded-xl shadow-lg overflow-hidden mb-8 md:mb-10">
                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-primary/30 bg-secondary text-white">
                        <h2 className="text-xl md:text-2xl font-bold">Gestión de Alumnas</h2>
                        <p className="text-white/90 text-xs md:text-sm">Administra las clientas registradas en el sistema</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-primary/20">
                            <thead className="bg-secondary text-white">
                                <tr>
                                    {adminConfig.allowBulkActions && (
                                        <th scope="col" className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                                <span className="ml-2">Seleccionar</span>
                                            </div>
                                        </th>
                                    )}
                                    {adminConfig.table.showStudentCol && (
                                        <th scope="col" className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            Alumna
                                        </th>
                                    )}
                                    {adminConfig.table.showPlanCol && (
                                        <th scope="col" className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            Plan
                                        </th>
                                    )}
                                    {adminConfig.table.showStatusCol && (
                                        <th scope="col" className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            Estado
                                        </th>
                                    )}
                                    {adminConfig.table.showPaymentCol && (
                                        <th scope="col" className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            Pago
                                        </th>
                                    )}
                                    {adminConfig.table.showRevenueCol && adminConfig.showRevenue && (
                                        <th scope="col" className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            Ingresos
                                        </th>
                                    )}
                                    {adminConfig.table.showActionsCol && (
                                        <th scope="col" className="px-3 md:px-4 lg:px-6 py-2 md:py-3 text-left text-xs font-semibold uppercase tracking-wider">
                                            Acciones Rápidas
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-primary/10">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-primary/5 even:bg-background">
                                        {adminConfig.allowBulkActions && (
                                            <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUserIds.includes(user.id)}
                                                    onChange={() => toggleSelectUser(user.id)}
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                            </td>
                                        )}
                                        {adminConfig.table.showStudentCol && (
                                            <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 bg-primary/20 rounded-full flex items-center justify-center">
                                                        <span className="text-primary font-bold text-xs md:text-sm">
                                                            {user.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="ml-3 md:ml-4">
                                                        <div className="text-xs md:text-sm font-medium text-secondary">{user.name}</div>
                                                        <div className="text-xs text-secondary/50">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        {adminConfig.table.showPlanCol && (
                                            <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap">
                                                <div className="text-xs md:text-sm text-secondary">{user.plan}</div>
                                                <div className="text-xs text-secondary/50">Último pago: {user.lastPayment}</div>
                                            </td>
                                        )}
                                        {adminConfig.table.showStatusCol && (
                                            <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${user.status === 'Conectada'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {user.status === 'Conectada' ? (
                                                        <>
                                                            <span className="relative flex h-2 w-2 mr-1">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                            </span>
                                                            Conectada
                                                        </>
                                                    ) : 'Desconectada'}
                                                </span>
                                            </td>
                                        )}
                                        {adminConfig.table.showPaymentCol && (
                                            <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.paymentStatus === 'paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-pink-100 text-pink-800'
                                                    }`}>
                                                    {user.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                                                </span>
                                            </td>
                                        )}
                                        {adminConfig.table.showRevenueCol && adminConfig.showRevenue && (
                                            <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-secondary">
                                                {user.totalSpent.toFixed(2)} €
                                            </td>
                                        )}
                                        {adminConfig.table.showActionsCol && (
                                            <td className="px-3 md:px-4 lg:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium relative">
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg transition-colors flex items-center gap-1"
                                                    >
                                                        Acciones
                                                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                        </svg>
                                                    </button>
                                                </div>

                                                {openMenuId === user.id && (
                                                    <>
                                                        {/* Overlay para cerrar al hacer click fuera */}
                                                        <div
                                                            className="fixed inset-0 z-40"
                                                            onClick={() => setOpenMenuId(null)}
                                                        />

                                                        <div className="absolute right-0 mt-2 z-50 bg-white border border-gray-100 shadow-xl rounded-lg w-48 overflow-hidden">
                                                            {user.paymentStatus === 'pending' && adminConfig.actions.showConfirmPaymentBtn && adminConfig.allowEdit && (
                                                                <button
                                                                    onClick={() => {
                                                                        handleConfirmPayment(user.id)
                                                                        setOpenMenuId(null)
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                                                                >
                                                                    <span className="text-green-600">✓</span>
                                                                    Confirmar Pago
                                                                </button>
                                                            )}
                                                            {adminConfig.actions.showGiftClassBtn && adminConfig.allowEdit && (
                                                                <button
                                                                    onClick={() => {
                                                                        handleGiftClass(user.id)
                                                                        setOpenMenuId(null)
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                                                                >
                                                                    <span className="text-primary">🎁</span>
                                                                    Regalar Clase
                                                                </button>
                                                            )}
                                                            {adminConfig.actions.showEditClassBtn && adminConfig.allowEdit && (
                                                                <button
                                                                    onClick={() => {
                                                                        handleEditClass(user.id)
                                                                        setOpenMenuId(null)
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                                                                >
                                                                    <span>✏️</span>
                                                                    Editar Clase
                                                                </button>
                                                            )}
                                                            {adminConfig.actions.showDeleteBtn && adminConfig.allowDelete && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) {
                                                                            setUsers(prev => prev.filter(u => u.id !== user.id))
                                                                            showNotification(`🗑️ ${user.name} eliminada`)
                                                                            setOpenMenuId(null)
                                                                        }
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2 text-red-600"
                                                                >
                                                                    <span>🗑️</span>
                                                                    Eliminar
                                                                </button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {adminConfig.table.showTableFooter && (
                        <div className="px-4 md:px-6 py-3 md:py-4 bg-secondary/5 border-t border-primary/30 text-xs md:text-sm text-secondary/50">
                            Mostrando {filteredUsers.length} de {users.length} alumnas
                        </div>
                    )}
                </div>

                {/* Barra de selección masiva (Flotante) */}
                {adminConfig.allowBulkActions && selectedUserIds.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-4 animate-fade-in">
                        <span className="font-bold">
                            {selectedUserIds.length} alumna(s) seleccionada(s)
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (confirm(`¿Eliminar ${selectedUserIds.length} alumna(s) seleccionadas? Esta acción no se puede deshacer.`)) {
                                        setUsers(prev => prev.filter(user => !selectedUserIds.includes(user.id)))
                                        showNotification(`🗑️ ${selectedUserIds.length} alumna(s) eliminada(s)`)
                                        clearSelection()
                                    }
                                }}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                            >
                                Eliminar seleccionadas
                            </button>
                            <button
                                onClick={clearSelection}
                                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                            >
                                Limpiar selección
                            </button>
                        </div>
                    </div>
                )}

                {/* --- SECCIÓN DE ACCIONES Y ESTADÍSTICAS --- */}
                {/* AHORA CABLEADO CORRECTAMENTE CON LOS FLAGS DEL DEV PANEL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">

                    {/* CALENDARIO INTERACTIVO */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">Calendario de Ocupación - Octubre 2026</h3>
                            <span className="text-sm text-gray-500">Vista Mensual</span>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                                <div key={d} className="font-bold text-gray-400">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 31 }, (_, i) => {
                                const day = i + 1;
                                const classSession = classes.find(c => c.day === day && c.active);
                                const isFull = classSession && classSession.students >= classSession.max;
                                const hasClass = !!classSession;
                                
                                return (
                                    <div
                                        key={day}
                                        onClick={() => classSession && setSelectedClass(classSession)}
                                        className={`h-10 flex flex-col items-center justify-center rounded-lg border cursor-pointer transition-all ${isFull ? 'bg-red-50 border-red-200 hover:bg-red-100' : hasClass ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-gray-50 border-transparent hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className={`text-xs font-medium ${isFull ? 'text-red-700' : hasClass ? 'text-green-700' : 'text-gray-500'}`}>
                                            {day}
                                        </span>
                                        {hasClass && (
                                            <div className="text-[10px] mt-0.5 font-semibold">
                                                {classSession.students}/{classSession.max}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tarjeta 2: Estadísticas Rápidas */}
                    {adminConfig.bulkActions.showQuickStatsSection && (
                        <div className="bg-white border border-primary/20 rounded-xl shadow-lg p-4 md:p-6">
                            <h3 className="text-lg md:text-xl font-bold text-secondary mb-3 md:mb-4">Estadísticas Rápidas</h3>
                            <ul className="space-y-2 md:space-y-3">
                                <li className="flex justify-between items-center">
                                    <span className="text-secondary/70 text-sm md:text-base">Plan más popular</span>
                                    <span className="font-semibold text-secondary text-sm md:text-base">Premium Mensual</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-secondary/70 text-sm md:text-base">Retención mensual</span>
                                    <span className="font-semibold text-primary text-sm md:text-base">94%</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-secondary/70 text-sm md:text-base">Nuevas alumnas (30d)</span>
                                    <span className="font-semibold text-secondary text-sm md:text-base">12</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-secondary/70 text-sm md:text-base">Satisfacción media</span>
                                    <span className="font-semibold text-primary text-sm md:text-base">4.8/5</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Tarjeta 3: Próximas Tareas */}
                    {adminConfig.bulkActions.showUpcomingTasksSection && (
                        <div className="bg-white border border-primary/20 rounded-xl shadow-lg p-4 md:p-6">
                            <h3 className="text-lg md:text-xl font-bold text-secondary mb-3 md:mb-4">Próximas Tareas</h3>
                            <ul className="space-y-2 md:space-y-3">
                                <li className="flex items-center">
                                    <div className="h-2 w-2 bg-primary rounded-full mr-2 md:mr-3"></div>
                                    <span className="text-secondary text-sm md:text-base">Revisar pagos pendientes</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="h-2 w-2 bg-primary rounded-full mr-2 md:mr-3"></div>
                                    <span className="text-secondary text-sm md:text-base">Actualizar planes de alumnas inactivas</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="h-2 w-2 bg-primary rounded-full mr-2 md:mr-3"></div>
                                    <span className="text-secondary text-sm md:text-base">Preparar informe mensual para Susana</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="h-2 w-2 bg-primary rounded-full mr-2 md:mr-3"></div>
                                    <span className="text-secondary text-sm md:text-base">Programar recordatorios de renovación</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>


                {/* Modal de Edición de Perfil */}
                {isEditProfileModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6 border border-primary/30 mx-4">
                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                <h2 className="text-xl md:text-2xl font-bold text-secondary">Editar Perfil</h2>
                                <button
                                    onClick={() => setIsEditProfileModalOpen(false)}
                                    className="text-secondary/50 hover:text-secondary text-xl md:text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleProfileSubmit}>
                                <div className="space-y-3 md:space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileInputChange}
                                            placeholder="Tu nombre"
                                            className="w-full px-3 py-2 md:px-4 md:py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base"
                                            data-testid="name-input"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileInputChange}
                                            placeholder="tu@email.com"
                                            className="w-full px-3 py-2 md:px-4 md:py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base"
                                            data-testid="email-input"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-secondary mb-1">
                                            Nueva Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={profileData.password}
                                            onChange={handleProfileInputChange}
                                            placeholder="Dejar en blanco para no cambiar"
                                            className="w-full px-3 py-2 md:px-4 md:py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base"
                                            data-testid="password-input"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 md:gap-3 mt-6 md:mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditProfileModalOpen(false)}
                                        className="flex-1 px-3 py-2 md:px-4 md:py-3 border-2 border-primary text-secondary font-medium rounded-lg hover:bg-primary/10 transition-colors text-sm md:text-base"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-primary text-secondary font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-lg text-sm md:text-base"
                                    >
                                        Actualizar Datos
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de Edición de Clase */}
                {isEditClassModalOpen && editingClass && adminConfig.modals.showEditClassModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6 border border-primary/30 mx-4">
                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                <h2 className="text-xl md:text-2xl font-bold text-secondary">Editar Clase</h2>
                                <button
                                    onClick={() => setIsEditClassModalOpen(false)}
                                    className="text-secondary/50 hover:text-secondary text-xl md:text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        value={editingClass.date}
                                        onChange={(e) => setEditingClass({ ...editingClass, date: e.target.value })}
                                        className="w-full px-3 py-2 md:px-4 md:py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Hora</label>
                                    <input
                                        type="time"
                                        value={editingClass.time}
                                        onChange={(e) => setEditingClass({ ...editingClass, time: e.target.value })}
                                        className="w-full px-3 py-2 md:px-4 md:py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Estado</label>
                                    <select
                                        value={editingClass.status}
                                        onChange={(e) => setEditingClass({ ...editingClass, status: e.target.value })}
                                        className="w-full px-3 py-2 md:px-4 md:py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base"
                                    >
                                        <option value="confirmada">Confirmada</option>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="cancelada">Cancelada</option>
                                        <option value="completada">Completada</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2 md:gap-3 mt-6 md:mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsEditClassModalOpen(false)}
                                    className="flex-1 px-3 py-2 md:px-4 md:py-3 border-2 border-primary text-secondary font-medium rounded-lg hover:bg-primary/10 transition-colors text-sm md:text-base"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        showNotification('✅ Clase actualizada')
                                        setIsEditClassModalOpen(false)
                                    }}
                                    className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-primary text-secondary font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-lg text-sm md:text-base"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Gestión de Clase del Calendario */}
                {selectedClass && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6 border border-primary/30 mx-4">
                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                <h2 className="text-xl md:text-2xl font-bold text-secondary">Gestión de Clase</h2>
                                <button
                                    onClick={() => setSelectedClass(null)}
                                    className="text-secondary/50 hover:text-secondary text-xl md:text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="space-y-4 md:space-y-5">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-2">Clase del día {selectedClass.day} - {selectedClass.time}</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-sm text-gray-600">Ocupación</p>
                                            <p className={`text-lg font-bold ${selectedClass.students >= selectedClass.max ? 'text-red-600' : 'text-green-600'}`}>
                                                {selectedClass.students}/{selectedClass.max}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Estado</p>
                                            <p className="text-lg font-bold text-primary">
                                                {selectedClass.active ? 'Activa' : 'Inactiva'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        Mover al día (1-31)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            max="31"
                                            defaultValue={selectedClass.day}
                                            id="moveDay"
                                            className="flex-1 px-3 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                                        />
                                        <button
                                            onClick={() => {
                                                const input = document.getElementById('moveDay') as HTMLInputElement
                                                const newDay = parseInt(input.value)
                                                handleMoveClass(selectedClass.id, newDay)
                                            }}
                                            className="px-4 py-2 bg-primary text-secondary font-medium rounded-lg hover:bg-primary-dark transition-colors"
                                        >
                                            Mover
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 md:gap-3 mt-6 md:mt-8">
                                <button
                                    type="button"
                                    onClick={() => setSelectedClass(null)}
                                    className="flex-1 px-3 py-2 md:px-4 md:py-3 border-2 border-primary text-secondary font-medium rounded-lg hover:bg-primary/10 transition-colors text-sm md:text-base"
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleCancelClass(selectedClass.id)}
                                    className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-lg text-sm md:text-base"
                                >
                                    Anular Clase
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}