// ============================================
// EJEMPLO DE USO DEL COMPONENTE PARTICLES
// ============================================

import Particles from './components/effects/Particles';

// Ejemplo 1: Background de página completa (como en LoginPage)
function LoginPageExample() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <Particles
          particleColors={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981']}
          particleCount={300}
          particleSpread={15}
          speed={0.15}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>
      
      {/* Tu contenido aquí */}
      <div className="relative z-10">
        <h1>Contenido de la página</h1>
      </div>
    </div>
  );
}

// Ejemplo 2: Contenedor con altura fija (600px)
function SectionWithParticles() {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <Particles
        particleColors={['#ffffff', '#ffffff']}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
      
      {/* Contenido sobre las partículas */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h2>Título de la sección</h2>
      </div>
    </div>
  );
}

// Ejemplo 3: Hero section con partículas
function HeroSection() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <Particles
          particleColors={['#f59e0b', '#ef4444', '#ec4899']}
          particleCount={250}
          particleSpread={12}
          speed={0.12}
          particleBaseSize={90}
          moveParticlesOnHover={true}
          particleHoverFactor={1.5}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>
      
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-white">
          Bienvenido
        </h1>
      </div>
    </div>
  );
}

// Ejemplo 4: Card con partículas de fondo
function CardWithParticles() {
  return (
    <div className="w-96 h-64 relative rounded-lg overflow-hidden">
      <Particles
        particleColors={['#10b981', '#06b6d4']}
        particleCount={150}
        particleSpread={8}
        speed={0.08}
        particleBaseSize={60}
        moveParticlesOnHover={false}
        alphaParticles={true}
        disableRotation={true}
      />
      
      <div className="relative z-10 p-6">
        <h3 className="text-2xl font-bold">Card Title</h3>
        <p>Contenido del card</p>
      </div>
    </div>
  );
}

export { LoginPageExample, SectionWithParticles, HeroSection, CardWithParticles };



