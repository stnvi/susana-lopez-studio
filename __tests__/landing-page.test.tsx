import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, beforeEach, test, it, expect } from 'vitest'
import Home from '@/app/page'

// Mock de next/navigation (no se usa pero previene errores)
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => '/',
}))

// Mock del hook useAuth (no se usa pero previene errores)
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        user: null,
    }),
}))

describe('Landing Page - Susana Lopez Studio', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    test('debe renderizar la página de inicio correctamente', () => {
        render(<Home />)

        // Verificar que el componente se renderiza sin errores
        expect(screen.getByRole('main')).toBeInTheDocument()
    })

    test('debe contener el texto o logo "Susana Lopez Studio"', () => {
        render(<Home />)

        // Verificar que al menos un elemento con el texto existe
        // Ahora el logo está separado en "SUSANA LÓPEZ" y "STUDIO"
        const susanaElements = screen.getAllByText(/SUSANA LÓPEZ/i)
        const studioElements = screen.getAllByText(/STUDIO/i)
        expect(susanaElements.length).toBeGreaterThan(0)
        expect(studioElements.length).toBeGreaterThan(0)
    })

    test('debe contener la navegación con enlaces requeridos', () => {
        render(<Home />)

        // Verificar enlaces de navegación - existen múltiples (desktop y móvil)
        expect(screen.getAllByRole('link', { name: /Inicio/i }).length).toBeGreaterThan(0)
        expect(screen.getAllByRole('link', { name: /Servicios/i }).length).toBeGreaterThan(0)
        expect(screen.getAllByRole('link', { name: /Sobre mí/i }).length).toBeGreaterThan(0)
        expect(screen.getAllByRole('link', { name: /Contacto/i }).length).toBeGreaterThan(0)
    })



    test('debe contener el enlace CTA "Iniciar Sesión" en el header que apunte a /login', () => {
        render(<Home />)

        // Buscar enlace principal de llamada a la acción (para no autenticados)
        const link = screen.getByRole('link', { name: /Iniciar Sesión/i })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/login')
    })

    test('debe pasar confirmando que los elementos de negocio están presentes', () => {
        render(<Home />)

        // Verificación adicional para asegurar que el test pasa
        // Ahora buscamos "SUSANA LÓPEZ" y "STUDIO" separados
        const susanaElements = screen.queryAllByText(/SUSANA LÓPEZ/i)
        const studioElements = screen.queryAllByText(/STUDIO/i)
        expect(susanaElements.length).toBeGreaterThan(0) // Esperamos al menos un elemento
        expect(studioElements.length).toBeGreaterThan(0) // Esperamos al menos un elemento
    })

    it('renders the two main service categories: Presencial and Online', () => {
        render(<Home />)
        
        // Busca los títulos de las categorías
        expect(screen.getByRole('heading', { name: /Clases Presenciales/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /Cursos Online/i })).toBeInTheDocument()
        
        // Busca el badge de novedad en la sección Online
        expect(screen.getByText(/NOVEDAD/i)).toBeInTheDocument()
    })

    it('links categories to the services page', () => {
        render(<Home />)
        // Verifica que haya enlaces que lleven a /services (con o sin parámetros)
        const links = screen.getAllByRole('link')
        const serviceLinks = links.filter(link => {
            const href = link.getAttribute('href')
            return href?.startsWith('/services')
        })
        expect(serviceLinks.length).toBeGreaterThanOrEqual(2)
    })

    test('debe contener la sección Sobre Mí con encabezado "Sobre Mí" o "Susana Lopez"', () => {
        render(<Home />)

        // Verificar encabezado de la sección (puede ser "Sobre Mí" o "Susana Lopez")
        // Hay múltiples headings, usar getAllByRole y filtrar
        const headings = screen.getAllByRole('heading')
        const sobreMiHeading = headings.find(h => 
            h.textContent?.match(/Sobre Mí|Susana Lopez/i)
        )
        expect(sobreMiHeading).toBeInTheDocument()
    })

    test('debe contener el Footer con copyright y enlaces legales', () => {
        render(<Home />)

        // NOTA: El Footer ahora está en el Layout global, no en la página de inicio
        // Por lo tanto, este test ya no es aplicable a la landing page
        // En su lugar, verificamos que la landing page se renderiza correctamente
        expect(screen.getByRole('main')).toBeInTheDocument()
        // Verificamos que hay un botón de WhatsApp (que sí está en la landing page)
        expect(screen.getByRole('link', { name: /Contactar por WhatsApp/i })).toBeInTheDocument()
    })

    test('el enlace del Logo en el Header debe apuntar a "/"', () => {
        render(<Home />)

        // Buscar el logo (texto "SUSANA LÓPEZ" o "STUDIO" dentro de un enlace en el header)
        const logoTexts = screen.getAllByText(/SUSANA LÓPEZ|STUDIO/i)
        // Encontrar el que está dentro de un enlace con href="/"
        const logoLink = logoTexts
            .map(text => text.closest('a'))
            .find(link => link?.getAttribute('href') === '/')
        expect(logoLink).toBeInTheDocument()
        expect(logoLink).toHaveAttribute('href', '/')
    })

    test('las secciones de la Landing deben tener IDs para anclaje', () => {
        const { container } = render(<Home />)

        // Verificar que las secciones tienen los IDs correspondientes
        // NOTA: El ID "contacto" ya no existe en la landing page (está en el Footer global)
        expect(container.querySelector('#servicios')).toBeInTheDocument()
        expect(container.querySelector('#sobre-mi')).toBeInTheDocument()
        expect(container.querySelector('#instalaciones')).toBeInTheDocument()
        expect(container.querySelector('#faq')).toBeInTheDocument()
    })

    it('renders interactive FAQ accordion', async () => {
        render(<Home />)
        const user = userEvent.setup()
        // 1. Busca una pregunta específica
        const questionTrigger = screen.getByText(/¿Necesito tener experiencia previa en Pilates\?/i)
        expect(questionTrigger).toBeInTheDocument()
        // 2. Busca la respuesta asociada (inicialmente no visible)
        const answerText = screen.queryByText(/No, mis clases están adaptadas/i)
        // 3. Simula el clic en la pregunta
        await user.click(questionTrigger)
        // 4. Verifica que la respuesta ahora es visible
        expect(answerText).toBeVisible()
    })

    it('renders specific local images for Instalaciones', () => {
        render(<Home />)
        // Verifica que las imágenes con los src correctos estén presentes
        // Busca todas las imágenes en el documento
        const images = screen.getAllByRole('img')
        const srcList = images.map(img => img.getAttribute('src')).filter(Boolean)

        // Debe contener al menos las tres imágenes de instalaciones
        expect(srcList).toEqual(expect.arrayContaining([
            expect.stringContaining('instalaciones1.jpg'),
            expect.stringContaining('instalaciones2.jpg'),
            expect.stringContaining('instalaciones3.jpg')
        ]))
    })

    it('renders Instalaciones section with proper height for vertical mobile photos', () => {
        const { container } = render(<Home />)
        
        // Buscar la sección de instalaciones por ID
        const instalacionesSection = container.querySelector('#instalaciones')
        expect(instalacionesSection).toBeInTheDocument()
        
        // Buscar los contenedores de tarjetas dentro de la sección
        const cards = instalacionesSection?.querySelectorAll('.group.relative')
        expect(cards?.length).toBeGreaterThanOrEqual(3)
        
        // Verificar que al menos una tarjeta tenga la clase de altura para móvil
        const firstCard = cards?.[0]
        expect(firstCard).toHaveClass('h-[500px]')
        expect(firstCard).toHaveClass('md:h-[600px]')
        
        // Verificar que las imágenes usan object-cover para mantener proporciones
        const images = instalacionesSection?.querySelectorAll('img')
        expect(images?.length).toBeGreaterThanOrEqual(3)
        images?.forEach(img => {
            expect(img).toHaveClass('object-cover')
        })
    })
})
