"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Center, Environment, ContactShadows, Float, useAnimations } from '@react-three/drei';
import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

/* ── Coffee Cup with premium PBR materials ── */
function CoffeeCup({ onLoad }) {
  const { scene, animations } = useGLTF('/models/base_coffee_cup_draco.glb', '/draco/');
  
  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);
  const meshRef = useRef(null);
  const { actions } = useAnimations(animations, meshRef);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach(action => {
        action.reset().fadeIn(0.5).play();
      });
    }
  }, [actions]);

  const { scale, position } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleAmt = 2.2 / maxDim;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = 0.25;
          child.material.metalness = 0.05;
          child.material.envMapIntensity = 2.8;
          if (!child.material.map) child.material.color = new THREE.Color('#F9F2EA');
          child.material.needsUpdate = true;
        }
      }
    });

    return { scale: scaleAmt, position: [0, -0.1, 0] };
  }, [scene]);

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

/* ── Liquid coffee surface inside cup ── */
function CoffeeLiquid() {
  const liquidRef = useRef(null);
  const rippleRef = useRef(0);

  useFrame((state) => {
    state.invalidate(); // perf: invalidate on animation tween
    const t = state.clock.getElapsedTime();
    rippleRef.current = t;
    if (liquidRef.current?.material) {
      liquidRef.current.material.opacity = 0.92 + Math.sin(t * 2) * 0.04;
    }
  });

  return (
    <mesh ref={liquidRef} position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.38, 64]} />
      <meshStandardMaterial
        color="#3A1A08"
        roughness={0.05}
        metalness={0.1}
        transparent
        opacity={0.92}
        envMapIntensity={3}
      />
    </mesh>
  );
}

/* ── Latte art foam layer ── */
function LatteArt() {
  const foamRef = useRef(null);
  useFrame((state) => {
    state.invalidate(); // perf: invalidate on animation tween
    const t = state.clock.getElapsedTime();
    if (foamRef.current) foamRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
  });

  const heartShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.12);
    s.bezierCurveTo(0, 0.18, 0.1, 0.22, 0.15, 0.12);
    s.bezierCurveTo(0.22, 0.0, 0.1, -0.1, 0, -0.2);
    s.bezierCurveTo(-0.1, -0.1, -0.22, 0.0, -0.15, 0.12);
    s.bezierCurveTo(-0.1, 0.22, 0, 0.18, 0, 0.12);
    return s;
  }, []);

  return (
    <group ref={foamRef} position={[0, 0.395, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Foam base */}
      <mesh>
        <circleGeometry args={[0.35, 48]} />
        <meshStandardMaterial color="#E8D5B0" roughness={0.7} metalness={0} envMapIntensity={0.5} />
      </mesh>
      {/* Latte art heart */}
      <mesh position={[0, 0, 0.001]}>
        <shapeGeometry args={[heartShape]} />
        <meshStandardMaterial color="#C8702A" roughness={0.5} transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

/* ── Volumetric-style steam particles ── */
function SteamParticles() {
  const COUNT = 80;
  const ptsRef = useRef(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = [];
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 0.32;
      pos[i * 3 + 1] = 0.45 + Math.random() * 0.3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.32;
      vel[i] = {
        x: (Math.random() - 0.5) * 0.0015,
        y: 0.007 + Math.random() * 0.005,
        life: Math.random(),
        maxLife: 0.7 + Math.random() * 0.8,
        swirl: Math.random() * Math.PI * 2,
      };
    }
    return [pos, vel];
  }, []);

  useFrame((state) => {
    if (!ptsRef.current) return;
    state.invalidate(); // perf: invalidate on animation tween
    const t = state.clock.getElapsedTime();
    const arr = ptsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      const v = velocities[i];
      v.life += 0.014;
      if (v.life >= v.maxLife) {
        arr[i * 3]     = (Math.random() - 0.5) * 0.32;
        arr[i * 3 + 1] = 0.45 + Math.random() * 0.15;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.32;
        v.life = 0;
        v.x = (Math.random() - 0.5) * 0.0015;
        v.maxLife = 0.7 + Math.random() * 0.8;
        v.swirl = Math.random() * Math.PI * 2;
        continue;
      }
      const prog = v.life / v.maxLife;
      const swirlAmt = prog * 0.35;
      arr[i * 3]     += v.x + Math.cos(t * 0.8 + v.swirl) * swirlAmt * 0.003;
      arr[i * 3 + 1] += v.y * (1 - prog * 0.3);
      arr[i * 3 + 2] += Math.sin(t * 0.6 + v.swirl) * swirlAmt * 0.003;
    }
    ptsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ptsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#F8F0E8"
        size={0.1}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Premium coffee beans orbiting ── */
function OrbitingBeans() {
  const beansRef = useRef([]);
  const beanDefs = [
    { r: 2.1, a: 0.3,  y: 0.2,  s: 0.20, tilt: 0.4,  speed: 0.0014 },
    { r: 2.3, a: 2.1,  y: -0.15, s: 0.16, tilt: -0.7, speed: 0.0019 },
    { r: 1.9, a: 4.2,  y: 0.3,  s: 0.18, tilt: 0.9,  speed: 0.0017 },
    { r: 2.4, a: 1.1,  y: -0.3,  s: 0.14, tilt: -0.3, speed: 0.0022 },
    { r: 2.0, a: 3.5,  y: 0.1,  s: 0.22, tilt: 0.6,  speed: 0.0018 },
    { r: 2.2, a: 5.3,  y: -0.1,  s: 0.17, tilt: -0.5, speed: 0.0016 },
  ];
  const anglesRef = useRef(beanDefs.map(b => b.a));

  useFrame((state) => {
    state.invalidate(); // perf: invalidate on animation tween
    const t = state.clock.getElapsedTime();
    beanDefs.forEach((b, i) => {
      const g = beansRef.current[i];
      if (!g) return;
      anglesRef.current[i] += b.speed;
      const a = anglesRef.current[i];
      g.position.x = Math.cos(a) * b.r;
      g.position.z = Math.sin(a) * b.r;
      g.position.y = b.y + Math.sin(t * 0.5 + i) * 0.1;
      g.rotation.y += 0.01;
      g.rotation.x = Math.sin(t * 0.4 + i * 1.4) * 0.3;
    });
  });

  return (
    <>
      {beanDefs.map((b, i) => (
        <group
          key={i}
          ref={el => (beansRef.current[i] = el)}
          position={[Math.cos(b.a) * b.r, b.y, Math.sin(b.a) * b.r]}
        >
          {/* Bean body */}
          <mesh castShadow scale={[b.s, b.s * 1.55, b.s * 0.65]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial
              color="#3D1A08"
              roughness={0.35}
              metalness={0.05}
              envMapIntensity={1.5}
            />
          </mesh>
          {/* Bean crease */}
          <mesh scale={[b.s * 0.9, b.s * 0.9, b.s * 0.9]}>
            <boxGeometry args={[0.04, 1.65, 0.1]} />
            <meshStandardMaterial color="#1A0A00" roughness={0.7} />
          </mesh>
          {/* Bean gloss highlight */}
          <mesh position={[-b.s * 0.2, b.s * 0.4, b.s * 0.55]} scale={[b.s * 0.4, b.s * 0.6, b.s * 0.05]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#FFF0E0" roughness={0} metalness={0} transparent opacity={0.18} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ── Saucer / plate ── */
function Saucer() {
  return (
    <group position={[0, -0.62, 0]}>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[0.85, 0.75, 0.06, 64]} />
        <meshStandardMaterial color="#F5EDE0" roughness={0.2} metalness={0.05} envMapIntensity={2} />
      </mesh>
      {/* Rim ring */}
      <mesh position={[0, 0.04, 0]}>
        <torusGeometry args={[0.82, 0.025, 16, 64]} />
        <meshStandardMaterial color="#E8D5B0" roughness={0.3} metalness={0.05} />
      </mesh>
    </group>
  );
}

/* ── Spoon ── */
function Spoon() {
  return (
    <group position={[0.7, -0.58, 0.3]} rotation={[0, -0.4, 0.15]}>
      {/* Handle */}
      <mesh castShadow>
        <capsuleGeometry args={[0.018, 0.55, 8, 16]} />
        <meshStandardMaterial color="#C8C0B0" roughness={0.15} metalness={0.85} envMapIntensity={2.5} />
      </mesh>
      {/* Bowl */}
      <mesh position={[0, -0.32, 0]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.065, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#D0C8B8" roughness={0.1} metalness={0.9} envMapIntensity={3} />
      </mesh>
    </group>
  );
}

/* ── Caustic-style ground glow ── */
function CausticGround() {
  const ringRef = useRef(null);
  useFrame((state) => {
    state.invalidate(); // perf: invalidate on animation tween
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.material.opacity = 0.06 + Math.sin(t * 0.8) * 0.02;
    }
  });
  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
      <ringGeometry args={[0, 2.5, 64]} />
      <meshBasicMaterial color="#C8702A" transparent opacity={0.07} depthWrite={false} />
    </mesh>
  );
}

/* ── Scene wrapper with gentle bob ── */
function SceneContent({ onLoad }) {
  const groupRef = useRef(null);
  useFrame((state) => {
    state.invalidate(); // perf: invalidate on animation tween
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = -0.45 + Math.sin(t * 0.7) * 0.06;
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.45, 0]}>
      <Suspense fallback={null}>
        <Center scale={1.9}>
          <CoffeeCup onLoad={onLoad} />
          <CoffeeLiquid />
          <LatteArt />
        </Center>
      </Suspense>
      <Saucer />
      <Spoon />
      <SteamParticles />
    </group>
  );
}

export default function HeroModel() {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    // Delay rendering until the preloader finishes (3.4 seconds)
    const timer = setTimeout(() => {
      setShouldRender(true);
      setTimeout(() => setVisible(true), 50);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: visible ? 1 : 0,
      transition: 'opacity 1.0s ease'
    }}>
      {!modelLoaded && shouldRender && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(248, 246, 242, 0.4)',
          borderRadius: 'inherit',
          zIndex: 5,
          pointerEvents: 'none'
        }}>
          <style>{`
            @keyframes heroSpinner {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2.5px solid rgba(166, 123, 91, 0.2)',
            borderTop: '2.5px solid #A67B5B',
            borderRadius: '50%',
            animation: 'heroSpinner 0.8s linear infinite'
          }}></div>
        </div>
      )}
      {shouldRender && (
        <Canvas
          dpr={[1, 1.5]}
          frameloop="demand"
          performance={{ min: 0.5 }}
          camera={{ position: [0, 1.5, 5.8], fov: 40 }}
          shadows={{ type: 'PCFSoftShadowMap' }}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true,
            toneMappingExposure: 1.35,
            outputColorSpace: 'srgb',
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
          {/* Premium lighting rig */}
          <hemisphereLight skyColor="#FFF5EE" groundColor="#7A5040" intensity={0.9} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={30}
            shadow-bias={-0.001}
          />
          <directionalLight position={[-4, 3, -4]} intensity={1.0} color="#C8702A" />
          <pointLight position={[2, 1, 3]} intensity={1.2} distance={10} color="#FFD580" />
          <pointLight position={[-2, 2, -2]} intensity={0.6} distance={8} color="#FF8844" />
          <spotLight position={[0, 6, 0]} intensity={0.8} angle={0.4} penumbra={0.8} color="#FFF5EE" castShadow />

          {/* Environment map for reflections */}
          <Environment preset="apartment" environmentIntensity={0.6} />

          {/* Contact shadow for grounding */}
          <ContactShadows
            frames={1}
            resolution={512}
            position={[0, -0.95, 0]}
            opacity={0.55}
            scale={5}
            blur={2.5}
            far={2}
            color="#3A1A08"
          />

          <CausticGround />
          <SceneContent onLoad={() => setModelLoaded(true)} />
          <OrbitingBeans />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1.2}
            enableDamping
            dampingFactor={0.04}
            target={[0, 0.2, 0]}
            minPolarAngle={Math.PI * 0.25}
            maxPolarAngle={Math.PI * 0.65}
            onChange={(e) => {
              if (e && e.target && e.target.context && e.target.context.invalidate) {
                e.target.context.invalidate();
              }
            }}
          />
        </Canvas>
      )}
    </div>
  );
}
