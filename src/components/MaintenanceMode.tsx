'use client'

import { useDevSection } from '@/context/DevControlContext'
import { usePathname } from 'next/navigation'

export default function MaintenanceMode() {
    const systemConfig = useDevSection('system')
    const pathname = usePathname()

    // No mostrar mantenimiento si estamos en la ruta del panel de desarrollador
    if (!systemConfig.maintenanceMode || pathname === '/dev-panel') {
        return null
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-2xl mx-auto">
                {/* Icono de mantenimiento */}
                <div className="mb-8">
                    <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Título y mensaje */}
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-4">
                    Sitio en Mantenimiento
                </h1>
                <p className="text-lg text-foreground/70 mb-6 max-w-xl mx-auto">
                    Estamos realizando mejoras en nuestra plataforma para ofrecerte una mejor experiencia.
                    El sitio estará disponible nuevamente en breve.
                </p>

                {/* Información adicional */}
                <div className="bg-foreground/5 border border-primary/20 rounded-xl p-6 mb-8 max-w-md mx-auto">
                    <h2 className="text-xl font-serif font-bold text-secondary mb-3">
                        ¿Qué está pasando?
                    </h2>
                    <ul className="text-left space-y-2 text-foreground/70">
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>Actualización de seguridad y rendimiento</span>
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>Mejoras en la experiencia de usuario</span>
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>Implementación de nuevas funcionalidades</span>
                        </li>
                    </ul>
                </div>

                {/* Contacto de emergencia */}
                <div className="text-sm text-foreground/50">
                    <p>
                        Para consultas urgentes, puedes contactarnos en{' '}
                        <a
                            href="mailto:info@susanalopezstudio.com"
                            className="text-primary hover:underline"
                        >
                            info@susanalopezstudio.com
                        </a>
                    </p>
                    <p className="mt-2">
                        O a través de WhatsApp:{' '}
                        <a
                            href="https://wa.me/34634038545"
                            className="text-primary hover:underline"
                        >
                            +34 634 038 545
                        </a>
                    </p>
                </div>


            </div>
        </div>
    )
}