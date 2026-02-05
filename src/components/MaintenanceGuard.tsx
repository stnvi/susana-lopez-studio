'use client'

import { useDevSection } from '@/context/DevControlContext'
import { usePathname } from 'next/navigation'
import MaintenanceMode from './MaintenanceMode'

interface MaintenanceGuardProps {
    children: React.ReactNode
}

export default function MaintenanceGuard({ children }: MaintenanceGuardProps) {
    const systemConfig = useDevSection('system')
    const pathname = usePathname()

    // Si estamos en modo mantenimiento y NO estamos en la ruta del panel de desarrollador
    // entonces bloqueamos el contenido normal
    if (systemConfig.maintenanceMode && pathname !== '/dev-panel') {
        // En este caso, MaintenanceMode ya se renderizará (porque maintenanceMode es true)
        // y no renderizamos children
        return null
    }

    // En cualquier otro caso, renderizamos el contenido normal
    return <>{children}</>
}