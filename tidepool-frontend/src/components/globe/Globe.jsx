import { useRef, useMemo, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

// Helper: convert lat/lng to 3D position on sphere
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

const STATUS_COLORS = {
  open: '#D4640A',
  funded: '#10B981',
  failed: '#DC2626',
};

function formatAmount(cents, currency = 'GBP') {
  const amount = cents / 100;
  const symbols = { GBP: '\u00A3', USD: '$', EUR: '\u20AC' };
  const symbol = symbols[currency] || '\u00A3';
  return `${symbol}${amount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Atmosphere glow effect around the globe
function Atmosphere() {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2.15, 64, 64]}>
      <meshBasicMaterial
        color="#2D6A4F"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </Sphere>
  );
}

// Outer glow ring
function GlowRing() {
  return (
    <Sphere args={[2.3, 64, 64]}>
      <meshBasicMaterial
        color="#10B981"
        transparent
        opacity={0.03}
        side={THREE.BackSide}
      />
    </Sphere>
  );
}

function Pin({ initiative, radius, onPinClick }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);

  const position = useMemo(
    () => latLngToVector3(initiative.location.lat, initiative.location.lng, radius),
    [initiative.location.lat, initiative.location.lng, radius]
  );

  const color = STATUS_COLORS[initiative.status] || STATUS_COLORS.open;

  useFrame((state) => {
    if (!meshRef.current) return;
    const target = hovered ? 1.8 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);

    // Subtle pulse for open initiatives
    if (glowRef.current && initiative.status === 'open') {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + initiative.id.charCodeAt(initiative.id.length - 1)) * 0.15 + 0.85;
      glowRef.current.scale.set(pulse * 2.5, pulse * 2.5, pulse * 2.5);
    }
  });

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback((e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onPinClick?.(initiative);
  }, [initiative, onPinClick]);

  return (
    <group position={position}>
      {/* Glow sphere behind pin */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Pin sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Tooltip on hover */}
      {hovered && (
        <Html
          distanceFactor={6}
          zIndexRange={[100, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="bg-white rounded-xl shadow-xl px-4 py-3 min-w-[160px] max-w-[200px] border border-sand"
            style={{ pointerEvents: 'none' }}
          >
            <p className="font-semibold text-sm text-ink truncate">
              {initiative.title}
            </p>
            <p className="font-mono text-xs text-stone mt-1">
              {formatAmount(initiative.heldTotalCents, initiative.currency)} /{' '}
              {formatAmount(initiative.goalCents, initiative.currency)}
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-sand overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (initiative.heldTotalCents / initiative.goalCents) * 100)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function GlobeMesh({ initiatives, onPinClick }) {
  const globeRef = useRef();

  return (
    <>
      {/* Solid inner sphere — slightly brighter */}
      <Sphere ref={globeRef} args={[1.98, 64, 64]}>
        <meshStandardMaterial
          color="#163B2B"
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>

      {/* Wireframe outer sphere */}
      <Sphere args={[2, 48, 48]}>
        <meshStandardMaterial
          color="#2D6A4F"
          wireframe
          transparent
          opacity={0.2}
        />
      </Sphere>

      {/* Second wireframe for depth */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial
          color="#34D399"
          wireframe
          transparent
          opacity={0.04}
        />
      </Sphere>

      {/* Atmosphere layers */}
      <Atmosphere />
      <GlowRing />

      {/* Pins */}
      {initiatives.map((initiative) => (
        <Pin
          key={initiative.id}
          initiative={initiative}
          radius={2.04}
          onPinClick={onPinClick}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        enableZoom
        minDistance={3}
        maxDistance={8}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

function GlobeScene({ initiatives, onPinClick }) {
  return (
    <>
      {/* Lighting — key + fill + rim for depth */}
      <ambientLight intensity={0.6} color="#FAF6F1" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        color="#FFFFFF"
      />
      <directionalLight
        position={[-5, -2, -5]}
        intensity={0.4}
        color="#2D6A4F"
      />
      <pointLight
        position={[0, 8, 0]}
        intensity={0.6}
        color="#FAF6F1"
        distance={20}
      />

      <GlobeMesh initiatives={initiatives} onPinClick={onPinClick} />
    </>
  );
}

export default function Globe({ initiatives = [], onPinClick }) {
  return (
    <div className="globe-canvas w-full h-full" style={{ minHeight: '400px' }}>
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 42 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <GlobeScene initiatives={initiatives} onPinClick={onPinClick} />
        </Suspense>
      </Canvas>
    </div>
  );
}
