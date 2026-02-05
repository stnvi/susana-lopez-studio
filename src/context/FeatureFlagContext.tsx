'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Definición de tipos
export type FeatureFlagKey =
    | 'SHOW_PROMO_BANNER'
    | 'ENABLE_ONLINE_PAYMENTS'
    | 'MAINTENANCE_MODE'
    | 'SHOW_DEBUG_INFO'

export type FeatureFlags = Record<FeatureFlagKey, boolean>

// Flags por defecto
const DEFAULT_FLAGS: FeatureFlags = {
    SHOW_PROMO_BANNER: true,
    ENABLE_ONLINE_PAYMENTS: true,
    MAINTENANCE_MODE: false,
    SHOW_DEBUG_INFO: false,
}

// Clave para localStorage
const STORAGE_KEY = 'app_flags'

// Contexto
interface FeatureFlagContextType {
    flags: FeatureFlags
    setFlag: (key: FeatureFlagKey, value: boolean) => void
    resetToDefaults: () => void
    clearAllData: () => void
    isEnabled: (key: FeatureFlagKey) => boolean
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined)

// Hook personalizado
export function useFeatureFlag() {
    const context = useContext(FeatureFlagContext)
    if (!context) {
        throw new Error('useFeatureFlag debe usarse dentro de FeatureFlagProvider')
    }
    return context
}

// Hook de conveniencia para flags individuales
export function useFeature(key: FeatureFlagKey): { isEnabled: boolean } {
    const { isEnabled } = useFeatureFlag()
    return { isEnabled: isEnabled(key) }
}

// Provider
interface FeatureFlagProviderProps {
    children: ReactNode
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
    const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS)

    // Cargar flags desde localStorage al montar
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                // Merge con defaults para asegurar que todos los flags existan
                const merged = { ...DEFAULT_FLAGS, ...parsed }
                setFlags(merged)
            }
        } catch (error) {
            console.error('Error cargando feature flags:', error)
        }
    }, [])

    // Guardar flags en localStorage cuando cambien
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(flags))
        } catch (error) {
            console.error('Error guardando feature flags:', error)
        }
    }, [flags])

    const setFlag = (key: FeatureFlagKey, value: boolean) => {
        setFlags(prev => ({ ...prev, [key]: value }))
    }

    const resetToDefaults = () => {
        setFlags(DEFAULT_FLAGS)
    }

    const clearAllData = () => {
        // Limpiar localStorage
        localStorage.removeItem(STORAGE_KEY)
        // También limpiar otros datos de la app si es necesario
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        // Resetear flags a defaults
        setFlags(DEFAULT_FLAGS)
        // Recargar la página para aplicar cambios
        window.location.href = '/'
    }

    const isEnabled = (key: FeatureFlagKey): boolean => {
        return flags[key] ?? false
    }

    const value: FeatureFlagContextType = {
        flags,
        setFlag,
        resetToDefaults,
        clearAllData,
        isEnabled,
    }

    return (
        <FeatureFlagContext.Provider value={value}>
            {children}
        </FeatureFlagContext.Provider>
    )
}