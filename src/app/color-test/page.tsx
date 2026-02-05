export default function ColorTestPage() {
  return (
    <div className="min-h-screen p-10 space-y-8 bg-white">
      <h1 className="text-3xl font-bold text-black">Test de Diagnóstico de Color</h1>
      {/* ZONA 1: COLORES HARDCODED (CONTROL) */}
      <div className="p-4 border">
        <p>1. Control (Debería ser Rojo):</p>
        <div className="w-full h-10 bg-red-500"></div>
      </div>
      {/* ZONA 2: VARIABLES DE TAILWIND */}
      <div className="p-4 border">
        <p>2. Variable PRIMARY (Debería ser Dorado #C5A059):</p>
        <div className="w-full h-10 bg-primary"></div>
        
        <p className="mt-4">3. Variable SECONDARY (Debería ser Negro #1C1917):</p>
        <div className="w-full h-10 bg-secondary"></div>
      </div>
      {/* ZONA 3: VARIABLES DE FONDO Y TEXTO */}
      <div className="p-4 border">
        <p>4. Variable BACKGROUND (Debería ser Crema #FAFAF9):</p>
        <div className="w-full h-10 bg-background border border-gray-300"></div>
        
        <p className="mt-4">5. Variable FOREGROUND (Debería ser Negro #1C1917):</p>
        <div className="w-full h-10 text-foreground border border-gray-300 p-2">Texto de prueba</div>
      </div>
      {/* ZONA 4: CLASES DE TEXTO */}
      <div className="p-4 border">
        <p>6. Texto con clases de color:</p>
        <p className="text-primary">Este texto debería ser dorado (primary).</p>
        <p className="text-secondary">Este texto debería ser negro (secondary).</p>
        <p className="text-foreground">Este texto debería ser negro (foreground).</p>
      </div>
    </div>
  );
}