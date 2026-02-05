'use client'

import { useState, useEffect } from 'react'
import { useDevControl } from '@/context/DevControlContext'

type TabType = 'system' | 'landing' | 'services' | 'dashboard' | 'admin'

const ACCESS_PASSWORD = "DeV2001$"

export default function DevPanelPage() {
    // Estados de autenticación
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [passwordInput, setPasswordInput] = useState('')
    const [error, setError] = useState(false)

    // Estados del panel
    const { config, updateConfig, resetToDefaults, clearLocalStorage } = useDevControl()
    const [activeTab, setActiveTab] = useState<TabType>('system')
    const [showConfirm, setShowConfirm] = useState(false)
    const [showToast, setShowToast] = useState(false)

    // Efecto para persistencia en sesión (para no pedirla cada F5)
    useEffect(() => {
        const sessionAuth = sessionStorage.getItem('dev_panel_auth')
        if (sessionAuth === 'true') setIsAuthorized(true)
    }, [])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordInput === ACCESS_PASSWORD) {
            setIsAuthorized(true)
            sessionStorage.setItem('dev_panel_auth', 'true')
            setError(false)
        } else {
            setError(true)
            // Vibración o feedback visual
        }
    }

    const handleToggle = (section: keyof typeof config, key: string, value: boolean) => {
        updateConfig({
            [section]: {
                ...config[section],
                [key]: value
            }
        } as any)
    }

    const handleNestedToggle = (section: keyof typeof config, subSection: string, key: string, value: boolean) => {
        updateConfig({
            [section]: {
                ...config[section],
                [subSection]: {
                    ...(config[section] as any)[subSection],
                    [key]: value
                }
            }
        } as any)
    }

    const handleClearAll = () => {
        clearLocalStorage()
        setShowConfirm(false)
        window.location.reload()
    }

    const handleCopyMagicLink = async () => {
        try {
            // Serializar config actual a Base64
            const encodedString = btoa(JSON.stringify(config))

            // Construir URL
            const magicLink = `${window.location.origin}/?demoConfig=${encodedString}`

            // Copiar al portapapeles
            await navigator.clipboard.writeText(magicLink)

            // Mostrar toast
            setShowToast(true)
            setTimeout(() => setShowToast(false), 3000)

            console.log('🔗 Magic Link copiado:', magicLink)
        } catch (error) {
            console.error('Error al copiar Magic Link:', error)
            alert('Error al copiar el link. Por favor, inténtalo de nuevo.')
        }
    }

    const handleCopyPresetLink = async (presetName: string) => {
        try {
            // Construir URL con parámetro preset
            const presetLink = `${window.location.origin}/?preset=${presetName}`

            // Copiar al portapapeles
            await navigator.clipboard.writeText(presetLink)

            // Mostrar toast
            setShowToast(true)
            setTimeout(() => setShowToast(false), 3000)

            console.log(`🔗 Preset Link copiado (${presetName}):`, presetLink)
        } catch (error) {
            console.error('Error al copiar Preset Link:', error)
            alert('Error al copiar el link. Por favor, inténtalo de nuevo.')
        }
    }

    const tabs: { id: TabType; label: string; icon: string }[] = [
        { id: 'system', label: 'SISTEMA', icon: '⚙️' },
        { id: 'landing', label: 'LANDING', icon: '🏠' },
        { id: 'services', label: 'SERVICIOS', icon: '💼' },
        { id: 'dashboard', label: 'DASHBOARD', icon: '📊' },
        { id: 'admin', label: 'ADMIN', icon: '👑' },
    ]

    const renderSystemTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Configuración del Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(config.system).map(([key, value]) => (
                    <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                <p className="text-gray-400 text-sm mt-1">
                                    {key === 'maintenanceMode' ? 'Bloquea toda la app (excepto /dev-panel)' :
                                        key === 'enableAuthBypass' ? 'Login entra directo sin checkear credenciales' :
                                            'Habilita/Deshabilita botones de pago'}
                                </p>
                            </div>
                            <ToggleSwitch
                                checked={value}
                                onChange={(checked) => handleToggle('system', key, checked)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderLandingTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Secciones de Landing Page</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(config.landing).map(([key, value]) => (
                    <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                <p className="text-gray-400 text-sm mt-1">
                                    {key === 'showHipoPilates' ? 'Muestra sección Hipopilates' :
                                        key === 'showWorkMethod' ? 'Muestra sección "Así trabajamos"' :
                                            key === 'showTestimonials' ? 'Muestra testimonios de clientes' :
                                                `Controla visibilidad de ${key.replace('show', '')}`}
                                </p>
                            </div>
                            <ToggleSwitch
                                checked={value}
                                onChange={(checked) => handleToggle('landing', key, checked)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderServicesTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Configuración de Servicios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(config.services).map(([key, value]) => (
                    <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                <p className="text-gray-400 text-sm mt-1">
                                    {key === 'highlightNewBadge' ? 'Muestra badge "NUEVO" en pestaña Online' :
                                        key === 'allowBooking' ? 'Habilita botones de reserva' :
                                            `Controla ${key.replace('show', '')}`}
                                </p>
                            </div>
                            <ToggleSwitch
                                checked={value}
                                onChange={(checked) => handleToggle('services', key, checked)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderDashboardTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Configuración del Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(config.dashboard).map(([key, value]) => (
                    <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                <p className="text-gray-400 text-sm mt-1">
                                    {key === 'showPromoBanner' ? 'Muestra banner de upselling' :
                                        key === 'allowCancellation' ? 'Habilita botón de cancelar clases' :
                                            `Controla ${key.replace('show', '')}`}
                                </p>
                            </div>
                            <ToggleSwitch
                                checked={value}
                                onChange={(checked) => handleToggle('dashboard', key, checked)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderAdminTab = () => {
        const { admin } = config

        return (
            <div className="space-y-8">
                <h3 className="text-xl font-bold text-white mb-6">Configuración del Admin Panel</h3>

                {/* Configuración existente */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-green-400">⚙️ Configuración General</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {Object.entries({
                            allowDelete: 'Permitir eliminar',
                            allowEdit: 'Permitir editar',
                            showRevenue: 'Mostrar ingresos',
                            allowBulkActions: 'Permitir acciones masivas'
                        }).map(([key, label]) => (
                            <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-white">{label}</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {key === 'showRevenue' ? 'Muestra datos de ingresos en KPIs y tabla' :
                                                key === 'allowBulkActions' ? 'Habilita checkboxes y barra de selección masiva' :
                                                    `Habilita botones de ${key.replace('allow', '')}`}
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        checked={(admin as any)[key] as boolean}
                                        onChange={(checked) => handleToggle('admin', key, checked)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Layout */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-blue-400">🏗️ Layout</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(admin.layout).map(([key, value]) => (
                            <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {key === 'showHomeLink' ? 'Muestra enlace "← Volver al Inicio"' :
                                                key === 'showTitle' ? 'Muestra título "Command Center"' :
                                                    key === 'showSubtitle' ? 'Muestra subtítulo "Panel de Administración"' :
                                                        key === 'showEditProfileBtn' ? 'Muestra botón "Editar Perfil"' :
                                                            key === 'showLogoutBtn' ? 'Muestra botón "Cerrar Sesión"' :
                                                                key === 'showNotificationToast' ? 'Muestra notificaciones temporales' :
                                                                    'Controla visibilidad del elemento'}
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        checked={value}
                                        onChange={(checked) => handleNestedToggle('admin', 'layout', key, checked)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Widgets/KPIs */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-yellow-400">📊 Widgets/KPIs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(admin.widgets).map(([key, value]) => (
                            <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {key === 'showActiveUsersCard' ? 'Tarjeta "Alumnas Activas"' :
                                                key === 'showPendingPaymentsCard' ? 'Tarjeta "Pagos Pendientes"' :
                                                    key === 'showRevenueCard' ? 'Tarjeta "Ingresos Totales"' :
                                                        'Tarjeta "Ticket Medio"'}
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        checked={value}
                                        onChange={(checked) => handleNestedToggle('admin', 'widgets', key, checked)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Herramientas (Tools) */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-purple-400">🔧 Herramientas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(admin.tools).map(([key, value]) => (
                            <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {key === 'showSearch' ? 'Barra de búsqueda' :
                                                key === 'showExportBtn' ? 'Botón "Exportar CSV"' :
                                                    'Botón "Nueva Alumna"'}
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        checked={value}
                                        onChange={(checked) => handleNestedToggle('admin', 'tools', key, checked)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabla */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-pink-400">📋 Tabla</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(admin.table).map(([key, value]) => (
                            <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {key === 'showStudentCol' ? 'Columna "Alumna"' :
                                                key === 'showPlanCol' ? 'Columna "Plan"' :
                                                    key === 'showStatusCol' ? 'Columna "Estado"' :
                                                        key === 'showPaymentCol' ? 'Columna "Pago"' :
                                                            key === 'showRevenueCol' ? 'Columna "Ingresos"' :
                                                                key === 'showActionsCol' ? 'Columna "Acciones"' :
                                                                    'Pie de tabla'}
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        checked={value}
                                        onChange={(checked) => handleNestedToggle('admin', 'table', key, checked)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Acciones por fila */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-red-400">⚡ Acciones por Fila</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {Object.entries(admin.actions).map(([key, value]) => (
                            <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {key === 'showConfirmPaymentBtn' ? 'Botón "Confirmar Pago"' :
                                                key === 'showGiftClassBtn' ? 'Botón "Regalar Clase"' :
                                                    key === 'showEditClassBtn' ? 'Botón "Editar Clase"' :
                                                        key === 'showActivateBtn' ? 'Botón "Activar"' :
                                                            'Botón "Eliminar"'}
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        checked={value}
                                        onChange={(checked) => handleNestedToggle('admin', 'actions', key, checked)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Acciones masivas */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-cyan-400">🚀 Acciones Masivas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(admin.bulkActions).map(([key, value]) => (
                            <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {key === 'showBulkActionsSection' ? 'Sección "Acciones Masivas"' :
                                                key === 'showPaymentReminderBtn' ? 'Botón "Recordatorio de Pago"' :
                                                    key === 'showMonthlyReportBtn' ? 'Botón "Reporte Mensual"' :
                                                        key === 'showUpdatePlansBtn' ? 'Botón "Actualizar Planes"' :
                                                            key === 'showQuickStatsSection' ? 'Sección "Estadísticas"' :
                                                                'Sección "Próximas Tareas"'}
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        checked={value}
                                        onChange={(checked) => handleNestedToggle('admin', 'bulkActions', key, checked)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modales */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-orange-400">📱 Modales</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(admin.modals).map(([key, value]) => (
                            <div key={key} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {key === 'showEditProfileModal' ? 'Modal "Editar Perfil"' :
                                                'Modal "Editar Clase"'}
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        checked={value}
                                        onChange={(checked) => handleNestedToggle('admin', 'modals', key, checked)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Renderizado condicional: Puerta de acceso vs Panel
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
                <div className="max-w-md w-full text-center space-y-8">
                    {/* Icono grande */}
                    <div className="text-8xl animate-pulse">🔒</div>

                    {/* Título */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-pink-400">
                            ÁREA RESTRINGIDA / GOD MODE
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Acceso exclusivo para desarrolladores autorizados
                        </p>
                    </div>

                    {/* Formulario de acceso */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Introduce la contraseña de acceso"
                                className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl text-center text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                autoFocus
                            />
                        </div>

                        {/* Mensaje de error */}
                        {error && (
                            <div className="text-red-400 font-bold animate-shake">
                                ⚠️ Acceso Denegado: Credenciales Inválidas
                            </div>
                        )}

                        {/* Botón de desbloqueo */}
                        <button
                            type="submit"
                            className="w-full px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
                        >
                            🚀 DESBLOQUEAR SISTEMA
                        </button>
                    </form>

                    {/* Información adicional */}
                    <div className="text-gray-500 text-xs pt-8 border-t border-gray-800">
                        <p>🔐 Esta ruta (/dev-panel) está protegida por contraseña.</p>
                        <p className="mt-1">💾 La autenticación persiste durante la sesión del navegador.</p>
                    </div>
                </div>
            </div>
        )
    }

    // Panel autorizado - contenido original
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-mono p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 border-b border-gray-700 pb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                        🎛️ Panel de Control Total - God Mode
                    </h1>
                    <p className="text-gray-400">
                        Controla cada aspecto visual y funcional de la aplicación en tiempo real
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-block px-3 py-1 bg-gray-800 rounded-full text-sm">
                            Ruta secreta: /dev-panel
                        </span>
                        <span className="inline-block px-3 py-1 bg-gray-800 rounded-full text-sm">
                            Config: localStorage (god_mode_config)
                        </span>
                        <span className="inline-block px-3 py-1 bg-gray-800 rounded-full text-sm">
                            {Object.values(config).flatMap(Object.values).filter(v => v).length} opciones activas
                        </span>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
                    {activeTab === 'system' && renderSystemTab()}
                    {activeTab === 'landing' && renderLandingTab()}
                    {activeTab === 'services' && renderServicesTab()}
                    {activeTab === 'dashboard' && renderDashboardTab()}
                    {activeTab === 'admin' && renderAdminTab()}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {tabs.map((tab) => {
                        const section = config[tab.id as keyof typeof config] as Record<string, boolean>
                        const activeCount = Object.values(section).filter(v => v).length
                        const totalCount = Object.keys(section).length
                        return (
                            <div key={tab.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                                <div className="text-2xl mb-2">{tab.icon}</div>
                                <div className="text-lg font-bold text-white">{activeCount}/{totalCount}</div>
                                <div className="text-sm text-gray-400">{tab.label}</div>
                            </div>
                        )
                    })}
                </div>

                {/* Actions */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">⚠️ Acciones del Sistema</h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={resetToDefaults}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-bold flex items-center gap-2"
                        >
                            🔄 Resetear a Valores por Defecto
                        </button>

                        <button
                            onClick={() => setShowConfirm(true)}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold flex items-center gap-2"
                        >
                            🗑️ Limpiar LocalStorage
                        </button>

                        <button
                            onClick={handleCopyMagicLink}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-bold flex items-center gap-2"
                        >
                            🔗 Copiar Magic Link
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-bold flex items-center gap-2"
                        >
                            🔄 Recargar Aplicación
                        </button>

                        <button
                            onClick={() => (window.location.href = '/')}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-bold flex items-center gap-2"
                        >
                            🏠 Volver al Inicio
                        </button>
                    </div>
                </div>

                {/* Presets Rápidos */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">🚀 Presets Rápidos (Enlaces Cortos)</h2>
                    <p className="text-gray-400 mb-6">
                        Genera enlaces cortos y limpios para compartir configuraciones predefinidas. 
                        Ideal para demostraciones rápidas sin URLs largas.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30 rounded-xl p-5">
                            <h3 className="text-lg font-bold text-green-400 mb-2">🎯 Demo Perfecta</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Escenario ideal para ventas: todas las funcionalidades visibles y activas.
                            </p>
                            <button
                                onClick={() => handleCopyPresetLink('demo')}
                                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-bold flex items-center justify-center gap-2"
                            >
                                📋 Copiar Link Demo
                            </button>
                            <p className="text-gray-400 text-xs mt-2 text-center">
                                <code className="bg-gray-900 px-2 py-1 rounded">/?preset=demo</code>
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-xl p-5">
                            <h3 className="text-lg font-bold text-blue-400 mb-2">🧹 Minimalista</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Muestra cómo desaparecen cosas: solo lo esencial visible.
                            </p>
                            <button
                                onClick={() => handleCopyPresetLink('minimal')}
                                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-bold flex items-center justify-center gap-2"
                            >
                                📋 Copiar Link Minimal
                            </button>
                            <p className="text-gray-400 text-xs mt-2 text-center">
                                <code className="bg-gray-900 px-2 py-1 rounded">/?preset=minimal</code>
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/30 rounded-xl p-5">
                            <h3 className="text-lg font-bold text-red-400 mb-2">🔧 Mantenimiento</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Modo mantenimiento: todo oculto excepto mensaje de mantenimiento.
                            </p>
                            <button
                                onClick={() => handleCopyPresetLink('maintenance')}
                                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold flex items-center justify-center gap-2"
                            >
                                📋 Copiar Link Mantenimiento
                            </button>
                            <p className="text-gray-400 text-xs mt-2 text-center">
                                <code className="bg-gray-900 px-2 py-1 rounded">/?preset=maintenance</code>
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <p className="text-gray-400 text-sm">
                            💡 <strong>Ventaja vs Magic Link:</strong> Los presets generan URLs cortas y legibles 
                            (<code className="bg-gray-900 px-2 py-1 rounded text-xs">/?preset=demo</code>) 
                            en lugar de URLs largas con Base64.
                        </p>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-white mb-4">⚠️ Confirmar Acción</h3>
                            <p className="text-gray-300 mb-6">
                                Esta acción eliminará toda la configuración de localStorage (god_mode_config) y recargará la aplicación.
                                <br /><br />
                                <strong className="text-red-400">Esta acción no se puede deshacer.</strong>
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleClearAll}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold"
                                >
                                    Sí, Eliminar Todo
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-bold"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast Notification */}
                {showToast && (
                    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in">
                        <div className="flex items-center gap-2">
                            <span>✅</span>
                            <span>¡Link copiado! Envíalo al móvil del cliente para replicar esta configuración exacta.</span>
                        </div>
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-8 text-sm text-gray-500 border-t border-gray-800 pt-4">
                    <p>🔧 Panel de control total - Cambios aplicados inmediatamente a toda la aplicación</p>
                    <p className="mt-1">📁 Configuración persistida en: <code className="bg-gray-800 px-2 py-1 rounded">localStorage.getItem('god_mode_config')</code></p>
                    <p className="mt-1">🔗 Magic Link: Comparte configuraciones entre dispositivos vía URL</p>
                </div>
            </div>
        </div>
    )
}

// Componente auxiliar para toggle switch
interface ToggleSwitchProps {
    checked: boolean
    onChange: (checked: boolean) => void
}

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`w-14 h-8 rounded-full transition-colors relative ${checked ? 'bg-green-500' : 'bg-gray-700'}`}
        >
            <span
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${checked ? 'left-7' : 'left-1'}`}
            />
        </button>
    )
}