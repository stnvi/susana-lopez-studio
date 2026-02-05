import Link from 'next/link'

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-background via-accent/10 to-background/80 px-4 py-20 md:py-32">
            <div className="container mx-auto max-w-4xl text-center">
                {/* Badge o etiqueta */}
                <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary-dark">
                    <span className="mr-2">✨</span> HipoPilates & Danza Contemporánea
                </div>

                {/* Título principal */}
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary sm:text-5xl md:text-6xl lg:text-7xl font-serif">
                    Tu centro de HipoPilates y Danza
                </h1>

                {/* Subtítulo */}
                <p className="mx-auto mb-10 max-w-2xl text-lg text-secondary/70 sm:text-xl">
                    Equilibrio, fuerza y elegancia. Clases personalizadas con Susana López.
                </p>

                {/* Botón CTA principal */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/dashboard"
                        className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:shadow-xl hover:shadow-accent/40 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <span>Área de Clientas</span>
                        <svg
                            className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </Link>

                    <button className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-white px-8 py-4 text-lg font-medium text-secondary transition-all hover:bg-accent/10 hover:scale-105 active:scale-95 cursor-pointer">
                        Conocer más
                    </button>
                </div>

                {/* Elementos decorativos */}
                <div className="mt-20 grid grid-cols-2 gap-8 text-center sm:grid-cols-3">
                    <div className="space-y-2">
                        <div className="text-3xl font-bold text-accent">+500</div>
                        <div className="text-sm text-secondary/50">Clientas transformadas</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-3xl font-bold text-accent">10+</div>
                        <div className="text-sm text-secondary/50">Años de experiencia</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-3xl font-bold text-accent">100%</div>
                        <div className="text-sm text-secondary/50">Enfoque personalizado</div>
                    </div>
                </div>
            </div>

            {/* Ondas decorativas en la parte inferior */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    className="w-full text-accent/20"
                >
                    <path
                        fill="currentColor"
                        fillOpacity="0.4"
                        d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,192C672,181,768,139,864,138.7C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                </svg>
            </div>
        </section>
    )
}