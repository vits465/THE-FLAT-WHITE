"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Center, Float } from '@react-three/drei';
import { Suspense, useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Moka Pot ── */
function MokaPot() {
  const { scene } = useGLTF('/models/moka_pot_draco.glb', '/draco/');
  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = 0.22;
          child.material.metalness = 0.85;
          child.material.envMapIntensity = 2.5;
          child.material.color = new THREE.Color('#E0DCD3');
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
}

/* ── Coffee Machine ── */
function CoffeeMachine() {
  const { scene } = useGLTF('/models/canarian_cafe_-_coffee_machine_draco.glb', '/draco/');
  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 2.2;
          child.material.roughness = Math.min(child.material.roughness || 0.3, 0.4);
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
}

/* ── Coffee Cup ── */
function CoffeeCup() {
  const { scene } = useGLTF('/models/base_coffee_cup_draco.glb', '/draco/');
  useMemo(() => {
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
  }, [scene]);
  return <primitive object={scene} />;
}

/* ── Coffee Maker (About Section) ── */
function CoffeeMaker() {
  const { scene } = useGLTF('/models/coffee_maker_low_poly_draco.glb', '/draco/');
  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 2.2;
          child.material.roughness = 0.3;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
}

/* ── Cartoon Coffee Cup (Menu Section) ── */
function MenuCup() {
  const { scene } = useGLTF('/models/catoon_coffe_draco.glb', '/draco/');
  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 2.2;
          child.material.roughness = 0.25;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);
  return <primitive object={scene} />;
}

/* Preload models to warm up cache */
useGLTF.preload('/models/base_coffee_cup_draco.glb', '/draco/');
useGLTF.preload('/models/moka_pot_draco.glb', '/draco/');
useGLTF.preload('/models/canarian_cafe_-_coffee_machine_draco.glb', '/draco/');
useGLTF.preload('/models/coffee_maker_low_poly_draco.glb', '/draco/');
useGLTF.preload('/models/catoon_coffe_draco.glb', '/draco/');

/* ── Liquid coffee surface inside cup ── */
function CoffeeLiquid() {
  const liquidRef = useRef(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
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
      <mesh>
        <circleGeometry args={[0.35, 48]} />
        <meshStandardMaterial color="#E8D5B0" roughness={0.7} metalness={0} envMapIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <shapeGeometry args={[heartShape]} />
        <meshStandardMaterial color="#C8702A" roughness={0.5} transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

/* ── Volumetric Steam Particles ── */
function SteamParticles({ count = 40, size = 0.08, speed = 1.0, yStart = 0.45, position = [0, 0, 0] }) {
  const ptsRef = useRef(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 0.28;
      pos[i * 3 + 1] = yStart + Math.random() * 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.28;
      vel[i] = {
        x: (Math.random() - 0.5) * 0.001 * speed,
        y: (0.005 + Math.random() * 0.004) * speed,
        life: Math.random(),
        maxLife: 0.6 + Math.random() * 0.7,
        swirl: Math.random() * Math.PI * 2,
      };
    }
    return [pos, vel];
  }, [count, speed, yStart]);

  useFrame((state) => {
    if (!ptsRef.current) return;
    const t = state.clock.getElapsedTime();
    const arr = ptsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const v = velocities[i];
      v.life += 0.015;
      if (v.life >= v.maxLife) {
        arr[i * 3]     = (Math.random() - 0.5) * 0.28;
        arr[i * 3 + 1] = yStart + Math.random() * 0.1;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.28;
        v.life = 0;
        v.x = (Math.random() - 0.5) * 0.001 * speed;
        v.maxLife = 0.6 + Math.random() * 0.7;
        v.swirl = Math.random() * Math.PI * 2;
        continue;
      }
      const prog = v.life / v.maxLife;
      const swirlAmt = prog * 0.28;
      arr[i * 3]     += v.x + Math.cos(t * 1.2 + v.swirl) * swirlAmt * 0.003;
      arr[i * 3 + 1] += v.y * (1 - prog * 0.2);
      arr[i * 3 + 2] += Math.sin(t * 0.9 + v.swirl) * swirlAmt * 0.003;
    }
    ptsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={position}>
      <points ref={ptsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#FAF4EE"
          size={size}
          sizeAttenuation
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ── Orbiting Coffee Beans ── */
function OrbitingBeans({ scaleFactor = 1.0 }) {
  const beansRef = useRef([]);
  const beanDefs = [
    { r: 1.8, a: 0.3,  y: 0.1,  s: 0.15 * scaleFactor, speed: 0.0015 },
    { r: 2.0, a: 2.2,  y: -0.1, s: 0.12 * scaleFactor, speed: 0.0019 },
    { r: 1.6, a: 4.1,  y: 0.2,  s: 0.14 * scaleFactor, speed: 0.0017 },
    { r: 2.1, a: 1.2,  y: -0.2, s: 0.11 * scaleFactor, speed: 0.0022 },
  ];
  const anglesRef = useRef(beanDefs.map(b => b.a));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    beanDefs.forEach((b, i) => {
      const g = beansRef.current[i];
      if (!g) return;
      anglesRef.current[i] += b.speed;
      const a = anglesRef.current[i];
      g.position.x = Math.cos(a) * b.r;
      g.position.z = Math.sin(a) * b.r;
      g.position.y = b.y + Math.sin(t * 0.5 + i) * 0.06;
      g.rotation.y += 0.012;
      g.rotation.x = Math.sin(t * 0.4 + i * 1.2) * 0.25;
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
          <mesh castShadow scale={[b.s, b.s * 1.5, b.s * 0.6]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial
              color="#422213"
              roughness={0.35}
              metalness={0.05}
              envMapIntensity={1.2}
            />
          </mesh>
          <mesh scale={[b.s * 0.8, b.s * 0.8, b.s * 0.8]}>
            <boxGeometry args={[0.04, 1.5, 0.1]} />
            <meshStandardMaterial color="#1E0E06" roughness={0.7} />
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
      <mesh castShadow>
        <capsuleGeometry args={[0.018, 0.55, 8, 16]} />
        <meshStandardMaterial color="#C8C0B0" roughness={0.15} metalness={0.85} envMapIntensity={2.5} />
      </mesh>
      <mesh position={[0, -0.32, 0]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.065, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#D0C8B8" roughness={0.1} metalness={0.9} envMapIntensity={3} />
      </mesh>
    </group>
  );
}

/* ── Caustic ground glow ── */
function CausticGround() {
  const ringRef = useRef(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.material.opacity = 0.05 + Math.sin(t * 0.8) * 0.015;
    }
  });
  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
      <ringGeometry args={[0, 2.5, 64]} />
      <meshBasicMaterial color="#C8702A" transparent opacity={0.06} depthWrite={false} />
    </mesh>
  );
}

/* ── Scene Content with GSAP ScrollTrigger ── */
function SceneContent() {
  const mokaRef = useRef(null);
  const machineRef = useRef(null);
  const cupRef = useRef(null);
  const makerRef = useRef(null);
  const menuCupRef = useRef(null);

  const mokaOpacity = useRef({ value: 0.0 });
  const machineOpacity = useRef({ value: 0.0 });
  const cupOpacity = useRef({ value: 0.0 });
  const makerOpacity = useRef({ value: 0.0 });
  const menuCupOpacity = useRef({ value: 0.0 });

  const mokaMaterials = useRef([]);
  const machineMaterials = useRef([]);
  const cupMaterials = useRef([]);
  const makerMaterials = useRef([]);
  const menuCupMaterials = useRef([]);

  const getMaterials = (group, cacheRef) => {
    if (cacheRef.current.length > 0) return cacheRef.current;
    if (!group) return [];
    
    const mats = [];
    group.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          mats.push({ mat, isPoints: false, originalOpacity: mat.opacity ?? 1 });
        });
      }
      if (child.isPoints && child.material) {
        mats.push({ mat: child.material, isPoints: true, originalOpacity: 0.35 });
      }
    });
    
    if (mats.length > 0) {
      cacheRef.current = mats;
    }
    return mats;
  };

  const applyGroupOpacity = (group, opacity, cacheRef) => {
    const materials = getMaterials(group, cacheRef);
    materials.forEach(({ mat, isPoints, originalOpacity }) => {
      mat.transparent = opacity < 0.99;
      mat.opacity = opacity * originalOpacity;
    });
  };

  useFrame((state) => {
    applyGroupOpacity(mokaRef.current, mokaOpacity.current.value, mokaMaterials);
    applyGroupOpacity(machineRef.current, machineOpacity.current.value, machineMaterials);
    applyGroupOpacity(cupRef.current, cupOpacity.current.value, cupMaterials);
    applyGroupOpacity(makerRef.current, makerOpacity.current.value, makerMaterials);
    applyGroupOpacity(menuCupRef.current, menuCupOpacity.current.value, menuCupMaterials);

    // Cinematic camera sway (idle parallax)
    const t = state.clock.getElapsedTime();
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(t * 0.4) * 0.1, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.2 + Math.cos(t * 0.3) * 0.08, 0.05);
  });

  useEffect(() => {
    if (!mokaRef.current || !machineRef.current || !cupRef.current || !makerRef.current || !menuCupRef.current) return;

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)"
      }, (context) => {
        const { isDesktop } = context.conditions;

        // Configuration positions for cinematic section layouts
        const cupHero = isDesktop 
          ? { x: 1.25, y: -0.15, scale: 0.9 } 
          : { x: 0, y: -0.35, scale: 0.7 };

        const mokaShowcase = isDesktop
          ? { x: 0, y: 0.05, scale: 1.0 }
          : { x: 0, y: 0.05, scale: 0.75 };

        const makerAbout = isDesktop
          ? { x: 1.3, y: -0.1, scale: 0.8 }
          : { x: 0, y: -0.2, scale: 0.6 };

        const machineSauce = isDesktop 
          ? { x: -1.25, y: -0.15, scale: 0.85 } 
          : { x: 0, y: -0.5, scale: 0.65 };

        const menuCupSpecial = isDesktop
          ? { x: 1.25, y: -0.15, scale: 0.95 }
          : { x: 0, y: -0.3, scale: 0.75 };

        // 1. Initialize Starting Positions and Opacities
        // Cup (Hero) starts off-screen (above right)
        gsap.set(cupRef.current.position, { x: cupHero.x + 1.2, y: cupHero.y - 0.5, z: -1.5 });
        gsap.set(cupRef.current.scale, { x: 0.01, y: 0.01, z: 0.01 });
        gsap.set(cupRef.current.rotation, { x: 0.4, y: Math.PI * 1.5, z: -0.2 });
        cupOpacity.current.value = 0.0;
        
        // Moka starts hidden
        gsap.set(mokaRef.current.position, { x: 0, y: -3.0, z: 0 });
        gsap.set(mokaRef.current.scale, { x: 0.01, y: 0.01, z: 0.01 });
        mokaOpacity.current.value = 0.0;

        // Maker starts hidden
        gsap.set(makerRef.current.position, { x: 0, y: -3.0, z: 0 });
        gsap.set(makerRef.current.scale, { x: 0.01, y: 0.01, z: 0.01 });
        makerOpacity.current.value = 0.0;
        
        // Machine starts hidden
        gsap.set(machineRef.current.position, { x: 0, y: -3.0, z: 0 });
        gsap.set(machineRef.current.scale, { x: 0.01, y: 0.01, z: 0.01 });
        machineOpacity.current.value = 0.0;

        // MenuCup starts hidden
        gsap.set(menuCupRef.current.position, { x: 0, y: -3.0, z: 0 });
        gsap.set(menuCupRef.current.scale, { x: 0.01, y: 0.01, z: 0.01 });
        menuCupOpacity.current.value = 0.0;

        gsap.set(".persistent-canvas-container", { opacity: 1, visibility: 'visible' });

        // Intro entrance animation for Coffee Cup
        gsap.timeline({ delay: 3.3 })
          .to(cupRef.current.position, { x: cupHero.x, y: cupHero.y, z: 0, duration: 1.2, ease: "power3.out" }, 0)
          .to(cupRef.current.scale, { x: cupHero.scale, y: cupHero.scale, z: cupHero.scale, duration: 1.2, ease: "power3.out" }, 0)
          .to(cupRef.current.rotation, { x: 0.2, y: Math.PI * 0.45, z: 0, duration: 1.2, ease: "power3.out" }, 0)
          .to(cupOpacity.current, { value: 1.0, duration: 0.8, ease: "power2.out" }, 0);

        // ── Timeline 1: Hero to Showcase ──
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: "#showcase",
            start: "top bottom",
            end: "top top",
            scrub: 1.2,
          }
        });

        tl1.to(cupRef.current.position, { x: -1.2, y: 1.2, z: -1.0, ease: "power2.inOut" }, 0)
           .to(cupRef.current.scale, { x: 0.01, y: 0.01, z: 0.01, ease: "power2.inOut" }, 0)
           .to(cupRef.current.rotation, { x: 0.5, y: Math.PI * 2.2, z: 0.2, ease: "power2.inOut" }, 0)
           .to(cupOpacity.current, { value: 0.0, ease: "power2.inOut" }, 0);

        tl1.to(mokaRef.current.position, { x: mokaShowcase.x, y: mokaShowcase.y, z: 0, ease: "power3.out" }, 0.2)
           .to(mokaRef.current.scale, { x: mokaShowcase.scale, y: mokaShowcase.scale, z: mokaShowcase.scale, ease: "power3.out" }, 0.2)
           .to(mokaRef.current.rotation, { x: 0.1, y: Math.PI * 1.5, z: 0.05, ease: "power3.out" }, 0.2)
           .to(mokaOpacity.current, { value: 1.0, ease: "power2.out" }, 0.2);

        // ── Timeline 2: Showcase to About ──
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "top top",
            scrub: 1.2,
          }
        });

        tl2.to(mokaRef.current.position, { x: -1.0, y: -1.8, z: -0.8, ease: "power2.inOut" }, 0)
           .to(mokaRef.current.scale, { x: 0.01, y: 0.01, z: 0.01, ease: "power2.inOut" }, 0)
           .to(mokaRef.current.rotation, { x: -0.2, y: Math.PI * 2.5, z: -0.1, ease: "power2.inOut" }, 0)
           .to(mokaOpacity.current, { value: 0.0, ease: "power2.inOut" }, 0);

        tl2.to(makerRef.current.position, { x: makerAbout.x, y: makerAbout.y, z: 0, ease: "power3.out" }, 0.2)
           .to(makerRef.current.scale, { x: makerAbout.scale, y: makerAbout.scale, z: makerAbout.scale, ease: "power3.out" }, 0.2)
           .to(makerRef.current.rotation, { x: 0.15, y: -Math.PI * 0.4, z: 0, ease: "power3.out" }, 0.2)
           .to(makerOpacity.current, { value: 1.0, ease: "power2.out" }, 0.2);

        // ── Timeline 3: About to Secret Sauce ──
        const tl3 = gsap.timeline({
          scrollTrigger: {
            trigger: "#secretSauce",
            start: "top bottom",
            end: "top top",
            scrub: 1.2,
          }
        });

        tl3.to(makerRef.current.position, { x: 1.2, y: 1.5, z: -1.0, ease: "power2.inOut" }, 0)
           .to(makerRef.current.scale, { x: 0.01, y: 0.01, z: 0.01, ease: "power2.inOut" }, 0)
           .to(makerRef.current.rotation, { x: 0.3, y: Math.PI * 0.5, z: 0.1, ease: "power2.inOut" }, 0)
           .to(makerOpacity.current, { value: 0.0, ease: "power2.inOut" }, 0);

        tl3.to(machineRef.current.position, { x: machineSauce.x, y: machineSauce.y, z: 0, ease: "power3.out" }, 0.2)
           .to(machineRef.current.scale, { x: machineSauce.scale, y: machineSauce.scale, z: machineSauce.scale, ease: "power3.out" }, 0.2)
           .to(machineRef.current.rotation, { x: 0.05, y: Math.PI * 0.35, z: 0.05, ease: "power3.out" }, 0.2)
           .to(machineOpacity.current, { value: 1.0, ease: "power2.out" }, 0.2);

        // ── Timeline 4: Secret Sauce to Menu ──
        const tl4 = gsap.timeline({
          scrollTrigger: {
            trigger: "#menu",
            start: "top bottom",
            end: "top top",
            scrub: 1.2,
          }
        });

        tl4.to(machineRef.current.position, { x: -1.5, y: -2.0, z: -1.2, ease: "power2.inOut" }, 0)
           .to(machineRef.current.scale, { x: 0.01, y: 0.01, z: 0.01, ease: "power2.inOut" }, 0)
           .to(machineRef.current.rotation, { x: -0.1, y: Math.PI * 0.8, z: -0.05, ease: "power2.inOut" }, 0)
           .to(machineOpacity.current, { value: 0.0, ease: "power2.inOut" }, 0);

        tl4.to(menuCupRef.current.position, { x: menuCupSpecial.x, y: menuCupSpecial.y, z: 0, ease: "power3.out" }, 0.2)
           .to(menuCupRef.current.scale, { x: menuCupSpecial.scale, y: menuCupSpecial.scale, z: menuCupSpecial.scale, ease: "power3.out" }, 0.2)
           .to(menuCupRef.current.rotation, { x: 0.2, y: Math.PI * 1.6, z: -0.1, ease: "power3.out" }, 0.2)
           .to(menuCupOpacity.current, { value: 1.0, ease: "power2.out" }, 0.2);

        // ── Timeline 5: Menu to Reviews (Fade out canvas) ──
        const tl5 = gsap.timeline({
          scrollTrigger: {
            trigger: "#reviews",
            start: "top bottom",
            end: "top top",
            scrub: 1.2,
          }
        });

        tl5.to(menuCupRef.current.position, { x: 0.8, y: -1.8, z: -0.8, ease: "power2.inOut" }, 0)
           .to(menuCupRef.current.scale, { x: 0.01, y: 0.01, z: 0.01, ease: "power2.inOut" }, 0)
           .to(menuCupRef.current.rotation, { x: -0.2, y: Math.PI * 2.2, z: 0.15, ease: "power2.inOut" }, 0)
           .to(menuCupOpacity.current, { value: 0.0, ease: "power2.inOut" }, 0)
           .to(".persistent-canvas-container", { opacity: 0, visibility: 'hidden', ease: "power1.inOut" }, 0);

      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Group 1: Moka Pot (Showcase) */}
      <group ref={mokaRef}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <Suspense fallback={null}>
            <Center scale={1.05}>
              <MokaPot />
            </Center>
          </Suspense>
        </Float>
        <OrbitingBeans scaleFactor={0.8} />
      </group>

      {/* Group 2: Espresso Coffee Machine (Secret Sauce) */}
      <group ref={machineRef}>
        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.15}>
          <Suspense fallback={null}>
            <Center scale={0.7}>
              <CoffeeMachine />
            </Center>
          </Suspense>
        </Float>
        <SteamParticles count={50} size={0.075} speed={1.8} yStart={-0.3} position={[0.45, -0.1, 0.4]} />
      </group>

      {/* Group 3: Coffee Cup with Plate (Hero) */}
      <group ref={cupRef}>
        <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.25}>
          <Suspense fallback={null}>
            <Center scale={1.25}>
              <CoffeeCup />
              <CoffeeLiquid />
              <LatteArt />
            </Center>
          </Suspense>
          <Saucer />
          <Spoon />
        </Float>
        <SteamParticles count={25} size={0.065} speed={0.4} yStart={0.38} position={[0, 0, 0]} />
        <CausticGround />
        <OrbitingBeans scaleFactor={0.9} />
      </group>

      {/* Group 4: Coffee Maker (About) */}
      <group ref={makerRef}>
        <Float speed={1.3} rotationIntensity={0.08} floatIntensity={0.2}>
          <Suspense fallback={null}>
            <Center scale={0.8}>
              <CoffeeMaker />
            </Center>
          </Suspense>
        </Float>
        <OrbitingBeans scaleFactor={0.75} />
      </group>

      {/* Group 5: Menu Coffee Cup (Menu) */}
      <group ref={menuCupRef}>
        <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.22}>
          <Suspense fallback={null}>
            <Center scale={1.1}>
              <MenuCup />
            </Center>
          </Suspense>
        </Float>
        <SteamParticles count={20} size={0.06} speed={0.5} yStart={0.3} position={[0, 0, 0]} />
        <OrbitingBeans scaleFactor={0.85} />
      </group>
    </>
  );
}

export default function ScrollCanvas() {
  return (
    <div className="persistent-canvas-container">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.2, 5.5], fov: 42 }}
        shadows={{ type: 'PCFSoftShadowMap' }}
        gl={{
          antialias: true,
          alpha: true,
          toneMappingExposure: 1.35,
          outputColorSpace: 'srgb',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <hemisphereLight skyColor="#FFF5EE" groundColor="#7A5040" intensity={1.0} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.001}
        />
        <directionalLight position={[-4, 3, -4]} intensity={1.1} color="#C8702A" />
        <pointLight position={[2, 1, 3]} intensity={1.2} color="#FFD580" />
        <pointLight position={[-2, 2, -2]} intensity={0.6} color="#FF8844" />
        <spotLight position={[0, 6, 0]} intensity={0.8} angle={0.4} penumbra={0.8} color="#FFF5EE" castShadow />

        <Environment preset="apartment" environmentIntensity={0.6} />

        <ContactShadows
          frames={1}
          resolution={512}
          position={[0, -0.95, 0]}
          opacity={0.5}
          scale={5}
          blur={2.5}
          far={2}
          color="#3A1A08"
        />

        <SceneContent />
      </Canvas>
    </div>
  );
}
