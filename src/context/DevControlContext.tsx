'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Definición de tipos para la configuración
export interface DevControlConfig {
    system: {
        maintenanceMode: boolean
        enableAuthBypass: boolean
        enablePayments: boolean
    }
    landing: {
        showHero: boolean
        showServicesPreview: boolean
        showHipoPilates: boolean
        showWorkMethod: boolean
        showInstallations: boolean
        showTestimonials: boolean
        showFooter: boolean
    }
    services: {
        showTabPresencial: boolean
        showTabOnline: boolean
        highlightNewBadge: boolean
        allowBooking: boolean
    }
    dashboard: {
        showPromoBanner: boolean
        showMetrics: boolean
        showCalendar: boolean
        allowCancellation: boolean
    }
    admin: {
        // Configuración existente
        allowDelete: boolean
        allowEdit: boolean
        showRevenue: boolean
        allowBulkActions: boolean

        // Layout
        layout: {
            showHeader: boolean
            showHomeLink: boolean
            showTitle: boolean
            showSubtitle: boolean
            showEditProfileBtn: boolean
            showLogoutBtn: boolean
            showNotificationToast: boolean
            showFooter: boolean
        }

        // Widgets/KPIs
        widgets: {
            showActiveUsersCard: boolean
            showPendingPaymentsCard: boolean
            showRevenueCard: boolean
            showAvgRevenueCard: boolean
        }

        // Herramientas (Tools)
        tools: {
            showSearch: boolean
            showExportBtn: boolean
            showCreateBtn: boolean
        }

        // Tabla
        table: {
            showStudentCol: boolean
            showPlanCol: boolean
            showStatusCol: boolean
            showPaymentCol: boolean
            showRevenueCol: boolean
            showActionsCol: boolean
            showTableFooter: boolean
        }

        // Acciones por fila
        actions: {
            showConfirmPaymentBtn: boolean
            showGiftClassBtn: boolean
            showEditClassBtn: boolean
            showActivateBtn: boolean
            showDeleteBtn: boolean
        }

        // Acciones masivas
        bulkActions: {
            showBulkActionsSection: boolean
            showPaymentReminderBtn: boolean
            showMonthlyReportBtn: boolean
            showUpdatePlansBtn: boolean
            showQuickStatsSection: boolean
            showUpcomingTasksSection: boolean
        }

        // Modales
        modals: {
            showEditProfileModal: boolean
            showEditClassModal: boolean
        }
    }
}

// Configuración por defecto
const DEFAULT_CONFIG: DevControlConfig = {
    system: {
        maintenanceMode: false,
        enableAuthBypass: false,
        enablePayments: true,
    },
    landing: {
        showHero: true,
        showServicesPreview: true,
        showHipoPilates: true,
        showWorkMethod: true,
        showInstallations: true,
        showTestimonials: true,
        showFooter: true,
    },
    services: {
        showTabPresencial: true,
        showTabOnline: true,
        highlightNewBadge: true,
        allowBooking: true,
    },
    dashboard: {
        showPromoBanner: true,
        showMetrics: true,
        showCalendar: true,
        allowCancellation: true,
    },
    admin: {
        // Configuración existente
        allowDelete: true,
        allowEdit: true,
        showRevenue: true,
        allowBulkActions: true,

        // Layout
        layout: {
            showHeader: true,
            showHomeLink: true,
            showTitle: true,
            showSubtitle: true,
            showEditProfileBtn: true,
            showLogoutBtn: true,
            showNotificationToast: true,
            showFooter: true,
        },

        // Widgets/KPIs
        widgets: {
            showActiveUsersCard: true,
            showPendingPaymentsCard: true,
            showRevenueCard: true,
            showAvgRevenueCard: true,
        },

        // Herramientas (Tools)
        tools: {
            showSearch: true,
            showExportBtn: true,
            showCreateBtn: true,
        },

        // Tabla
        table: {
            showStudentCol: true,
            showPlanCol: true,
            showStatusCol: true,
            showPaymentCol: true,
            showRevenueCol: true,
            showActionsCol: true,
            showTableFooter: true,
        },

        // Acciones por fila
        actions: {
            showConfirmPaymentBtn: true,
            showGiftClassBtn: true,
            showEditClassBtn: true,
            showActivateBtn: true,
            showDeleteBtn: true,
        },

        // Acciones masivas
        bulkActions: {
            showBulkActionsSection: true,
            showPaymentReminderBtn: true,
            showMonthlyReportBtn: true,
            showUpdatePlansBtn: true,
            showQuickStatsSection: true,
            showUpcomingTasksSection: true,
        },

        // Modales
        modals: {
            showEditProfileModal: true,
            showEditClassModal: true,
        },
    }
}

// Presets predefinidos para enlaces cortos
const PRESETS: Record<string, Partial<DevControlConfig>> = {
    'demo': { // El escenario perfecto para la venta
        system: {
            maintenanceMode: false,
            enableAuthBypass: false,
            enablePayments: true,
        },
        landing: {
            showHero: true,
            showServicesPreview: true,
            showHipoPilates: true,
            showWorkMethod: true,
            showInstallations: true,
            showTestimonials: true,
            showFooter: true,
        },
        services: {
            showTabPresencial: true,
            showTabOnline: true,
            highlightNewBadge: true,
            allowBooking: true,
        },
        dashboard: {
            showPromoBanner: true,
            showMetrics: true,
            showCalendar: true,
            allowCancellation: true,
        },
        admin: {
            allowDelete: true,
            allowEdit: true,
            showRevenue: true,
            allowBulkActions: true,
            layout: {
                showHeader: true,
                showHomeLink: true,
                showTitle: true,
                showSubtitle: true,
                showEditProfileBtn: true,
                showLogoutBtn: true,
                showNotificationToast: true,
                showFooter: true,
            },
            widgets: {
                showActiveUsersCard: true,
                showPendingPaymentsCard: true,
                showRevenueCard: true,
                showAvgRevenueCard: true,
            },
            tools: {
                showSearch: true,
                showExportBtn: true,
                showCreateBtn: true,
            },
            table: {
                showStudentCol: true,
                showPlanCol: true,
                showStatusCol: true,
                showPaymentCol: true,
                showRevenueCol: true,
                showActionsCol: true,
                showTableFooter: true,
            },
            actions: {
                showConfirmPaymentBtn: true,
                showGiftClassBtn: true,
                showEditClassBtn: true,
                showActivateBtn: true,
                showDeleteBtn: true,
            },
            bulkActions: {
                showBulkActionsSection: true,
                showPaymentReminderBtn: true,
                showMonthlyReportBtn: true,
                showUpdatePlansBtn: true,
                showQuickStatsSection: true,
                showUpcomingTasksSection: true,
            },
            modals: {
                showEditProfileModal: true,
                showEditClassModal: true,
            },
        }
    },
    'minimal': { // Para mostrar cómo desaparecen cosas
        system: {
            maintenanceMode: false,
            enableAuthBypass: false,
            enablePayments: true,
        },
        landing: {
            showHero: true,
            showServicesPreview: false, // Oculto
            showHipoPilates: false, // Oculto
            showWorkMethod: true,
            showInstallations: false,
            showTestimonials: false,
            showFooter: true,
        },
        services: {
            showTabPresencial: false,
            showTabOnline: true,
            highlightNewBadge: false,
            allowBooking: false,
        },
        dashboard: {
            showPromoBanner: false,
            showMetrics: false,
            showCalendar: false,
            allowCancellation: false,
        },
        admin: {
            allowDelete: false,
            allowEdit: false,
            showRevenue: false,
            allowBulkActions: false,
            layout: {
                showHeader: true,
                showHomeLink: true,
                showTitle: true,
                showSubtitle: true,
                showEditProfileBtn: false,
                showLogoutBtn: true,
                showNotificationToast: false,
                showFooter: true,
            },
            widgets: {
                showActiveUsersCard: false,
                showPendingPaymentsCard: false,
                showRevenueCard: false,
                showAvgRevenueCard: false,
            },
            tools: {
                showSearch: false,
                showExportBtn: false,
                showCreateBtn: false,
            },
            table: {
                showStudentCol: true,
                showPlanCol: true,
                showStatusCol: false,
                showPaymentCol: false,
                showRevenueCol: false,
                showActionsCol: false,
                showTableFooter: false,
            },
            actions: {
                showConfirmPaymentBtn: false,
                showGiftClassBtn: false,
                showEditClassBtn: false,
                showActivateBtn: false,
                showDeleteBtn: false,
            },
            bulkActions: {
                showBulkActionsSection: false,
                showPaymentReminderBtn: false,
                showMonthlyReportBtn: false,
                showUpdatePlansBtn: false,
                showQuickStatsSection: false,
                showUpcomingTasksSection: false,
            },
            modals: {
                showEditProfileModal: false,
                showEditClassModal: false,
            },
        }
    },
    'maintenance': { // Modo mantenimiento
        system: {
            maintenanceMode: true,
            enableAuthBypass: false,
            enablePayments: false,
        },
        landing: {
            showHero: false,
            showServicesPreview: false,
            showHipoPilates: false,
            showWorkMethod: false,
            showInstallations: false,
            showTestimonials: false,
            showFooter: false,
        },
        services: {
            showTabPresencial: false,
            showTabOnline: false,
            highlightNewBadge: false,
            allowBooking: false,
        },
        dashboard: {
            showPromoBanner: false,
            showMetrics: false,
            showCalendar: false,
            allowCancellation: false,
        },
        admin: {
            allowDelete: false,
            allowEdit: false,
            showRevenue: false,
            allowBulkActions: false,
            layout: {
                showHeader: false,
                showHomeLink: false,
                showTitle: false,
                showSubtitle: false,
                showEditProfileBtn: false,
                showLogoutBtn: false,
                showNotificationToast: false,
                showFooter: false,
            },
            widgets: {
                showActiveUsersCard: false,
                showPendingPaymentsCard: false,
                showRevenueCard: false,
                showAvgRevenueCard: false,
            },
            tools: {
                showSearch: false,
                showExportBtn: false,
                showCreateBtn: false,
            },
            table: {
                showStudentCol: false,
                showPlanCol: false,
                showStatusCol: false,
                showPaymentCol: false,
                showRevenueCol: false,
                showActionsCol: false,
                showTableFooter: false,
            },
            actions: {
                showConfirmPaymentBtn: false,
                showGiftClassBtn: false,
                showEditClassBtn: false,
                showActivateBtn: false,
                showDeleteBtn: false,
            },
            bulkActions: {
                showBulkActionsSection: false,
                showPaymentReminderBtn: false,
                showMonthlyReportBtn: false,
                showUpdatePlansBtn: false,
                showQuickStatsSection: false,
                showUpcomingTasksSection: false,
            },
            modals: {
                showEditProfileModal: false,
                showEditClassModal: false,
            },
        }
    }
}

// Tipo del contexto
interface DevControlContextType {
    config: DevControlConfig
    updateConfig: (updates: Partial<DevControlConfig>) => void
    resetToDefaults: () => void
    clearLocalStorage: () => void
    isSectionEnabled: (section: keyof DevControlConfig, key: string) => boolean
}

// Crear contexto
const DevControlContext = createContext<DevControlContextType | undefined>(undefined)

// Hook para usar el contexto
export function useDevControl() {
    const context = useContext(DevControlContext)
    if (!context) {
        throw new Error('useDevControl debe usarse dentro de DevControlProvider')
    }
    return context
}

// Hook específico para secciones
export function useDevSection<T extends keyof DevControlConfig>(section: T): DevControlConfig[T] {
    const { config } = useDevControl()
    return config[section]
}

// Provider component
interface DevControlProviderProps {
    children: ReactNode
}

export function DevControlProvider({ children }: DevControlProviderProps) {
    const [config, setConfig] = useState<DevControlConfig>(DEFAULT_CONFIG)

    // Cargar configuración desde URL o localStorage al montar
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)

        // 1. Verificar si hay parámetro preset en la URL (enlaces cortos)
        const presetParam = searchParams.get('preset')

        if (presetParam && PRESETS[presetParam]) {
            try {
                const presetConfig = PRESETS[presetParam]

                // Merge con defaults para asegurar que todas las propiedades existan
                const mergedConfig = {
                    ...DEFAULT_CONFIG,
                    ...presetConfig,
                    system: { ...DEFAULT_CONFIG.system, ...presetConfig.system },
                    landing: { ...DEFAULT_CONFIG.landing, ...presetConfig.landing },
                    services: { ...DEFAULT_CONFIG.services, ...presetConfig.services },
                    dashboard: { ...DEFAULT_CONFIG.dashboard, ...presetConfig.dashboard },
                    admin: { ...DEFAULT_CONFIG.admin, ...presetConfig.admin },
                }

                // Sobrescribir estado
                setConfig(mergedConfig)

                // Guardar en localStorage inmediatamente
                localStorage.setItem('god_mode_config', JSON.stringify(mergedConfig))

                // Limpiar la URL visualmente sin recargar
                window.history.replaceState({}, '', window.location.pathname)

                console.log(`✅ Configuración cargada desde preset: ${presetParam}`)
                return // Salir, no cargar de localStorage ni demoConfig
            } catch (error) {
                console.error('Error al cargar preset:', error)
                // Continuar con carga normal
            }
        }

        // 2. Verificar si hay parámetro demoConfig en la URL (enlaces largos legacy)
        const demoConfigParam = searchParams.get('demoConfig')

        if (demoConfigParam) {
            try {
                // Decodificar Base64 -> JSON
                const decodedString = atob(demoConfigParam)
                const urlConfig = JSON.parse(decodedString)

                // Merge con defaults para asegurar que todas las propiedades existan
                const mergedConfig = {
                    ...DEFAULT_CONFIG,
                    ...urlConfig,
                    system: { ...DEFAULT_CONFIG.system, ...urlConfig.system },
                    landing: { ...DEFAULT_CONFIG.landing, ...urlConfig.landing },
                    services: { ...DEFAULT_CONFIG.services, ...urlConfig.services },
                    dashboard: { ...DEFAULT_CONFIG.dashboard, ...urlConfig.dashboard },
                    admin: { ...DEFAULT_CONFIG.admin, ...urlConfig.admin },
                }

                // Sobrescribir estado
                setConfig(mergedConfig)

                // Guardar en localStorage inmediatamente
                localStorage.setItem('god_mode_config', JSON.stringify(mergedConfig))

                // Limpiar la URL visualmente sin recargar
                window.history.replaceState({}, '', window.location.pathname)

                console.log('✅ Configuración cargada desde Magic Link')
                return // Salir, no cargar de localStorage
            } catch (error) {
                console.error('Error al decodificar demoConfig:', error)
                // Continuar con carga normal desde localStorage
            }
        }

        // 3. Si no hay preset ni demoConfig, cargar de localStorage
        const savedConfig = localStorage.getItem('god_mode_config')
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig)
                // Merge con defaults para asegurar que todas las propiedades existan
                setConfig({
                    ...DEFAULT_CONFIG,
                    ...parsed,
                    system: { ...DEFAULT_CONFIG.system, ...parsed.system },
                    landing: { ...DEFAULT_CONFIG.landing, ...parsed.landing },
                    services: { ...DEFAULT_CONFIG.services, ...parsed.services },
                    dashboard: { ...DEFAULT_CONFIG.dashboard, ...parsed.dashboard },
                    admin: { ...DEFAULT_CONFIG.admin, ...parsed.admin },
                })
            } catch (error) {
                console.error('Error al cargar configuración:', error)
                localStorage.removeItem('god_mode_config')
            }
        }
    }, [])

    // Guardar configuración en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('god_mode_config', JSON.stringify(config))
    }, [config])

    // Actualizar configuración
    const updateConfig = (updates: Partial<DevControlConfig>) => {
        setConfig(prev => {
            const newConfig = { ...prev }

            // Merge profundo para cada sección
            Object.keys(updates).forEach(key => {
                const sectionKey = key as keyof DevControlConfig
                if (updates[sectionKey] && typeof updates[sectionKey] === 'object') {
                    newConfig[sectionKey] = {
                        ...prev[sectionKey],
                        ...updates[sectionKey] as any
                    }
                }
            })

            return newConfig
        })
    }

    // Resetear a valores por defecto
    const resetToDefaults = () => {
        setConfig(DEFAULT_CONFIG)
        localStorage.setItem('god_mode_config', JSON.stringify(DEFAULT_CONFIG))
    }

    // Limpiar localStorage
    const clearLocalStorage = () => {
        localStorage.removeItem('god_mode_config')
        setConfig(DEFAULT_CONFIG)
    }

    // Verificar si una sección específica está habilitada
    const isSectionEnabled = (section: keyof DevControlConfig, key: string): boolean => {
        const sectionConfig = config[section] as Record<string, boolean>
        return sectionConfig[key] !== undefined ? sectionConfig[key] : true
    }

    const value: DevControlContextType = {
        config,
        updateConfig,
        resetToDefaults,
        clearLocalStorage,
        isSectionEnabled,
    }

    return (
        <DevControlContext.Provider value={value}>
            {children}
        </DevControlContext.Provider>
    )
}