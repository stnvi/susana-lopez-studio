'use client'

import { usePathname } from 'next/navigation'
import { Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()

  // Rutas que deben mostrar solo el copyright (Footer Lite)
  const liteRoutes = ['/login', '/register', '/admin']
  const isLiteFooter = liteRoutes.includes(pathname)

  return (
    <footer className="bg-stone-950 text-stone-300 py-16 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Contenido principal del Footer (oculto en rutas lite) */}
        {!isLiteFooter && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* COLUMNA 1: CONTACTO */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary mb-6">SUSANA LÓPEZ STUDIO</h3>

              <a
                href="https://maps.app.goo.gl/9v1UVv8UHm1i2ASf8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-white transition-colors group"
              >
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>
                  Centro Comercial Los Cipreses<br />
                  Av. de los Cipreses, s/n<br />
                  37004 Salamanca
                </span>
              </a>
              <a href="tel:+34634038545" className="flex items-center gap-3 hover:text-white transition-colors group">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>634 038 545</span>
              </a>
              <a href="mailto:info@susanalopezstudio.com" className="flex items-center gap-3 hover:text-white transition-colors group">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>info@susanalopezstudio.com</span>
              </a>
            </div>

            {/* COLUMNA 2: HORARIO */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary mb-6">HORARIO</h3>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="space-y-2 text-sm">
                  <p>
                    <strong className="text-white block">Mañanas (L-V)</strong>
                    09:30 - 10:30
                  </p>
                  <p>
                    <strong className="text-white block">Tardes (L-V)</strong>
                    17:00 - 21:00
                  </p>
                </div>
              </div>
            </div>

            {/* COLUMNA 3: SOCIAL */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif text-primary mb-6">SÍGUENOS</h3>
              <p className="mb-4 text-sm">Conecta con nosotros para ver novedades y tips de bienestar.</p>
              <a
                href="https://www.instagram.com/susanalopezstudio/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
                @susanalopezstudio
              </a>
            </div>
          </div>
        )}

        {/* COPYRIGHT (siempre visible) */}
        <div className={`border-t border-stone-800 ${isLiteFooter ? 'mt-0 pt-8' : 'mt-16 pt-8'} text-center text-xs text-stone-600 flex flex-col md:flex-row justify-between items-center gap-4`}>
          <p>© 2026 Susana López Studio. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-stone-400">Aviso Legal</span>
            <span className="cursor-pointer hover:text-stone-400">Privacidad</span>
            <span className="cursor-pointer hover:text-stone-400">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  )
}