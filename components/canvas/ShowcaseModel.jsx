"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Float, ContactShadows, Environment, useAnimations } from '@react-three/drei';
import { Suspense, useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

function Model({ url, scaleAdjust, yOffset }) {
  const { scene, animations } = useGLTF(url, '/draco/');
  const ref = useRef(null);
  const { actions } = useAnimations(animations, ref);

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
    const scaleAmt = maxDim > 0 ? (2.2 / maxDim) * scaleAdjust : scaleAdjust;

    // Center the scaled scene
    const center = box.getCenter(new THREE.Vector3());
    const posX = -center.x * scaleAmt;
    const posY = -center.y * scaleAmt + yOffset;
    const posZ = -center.z * scaleAmt;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 2.5;
          child.material.roughness = Math.min(child.material.roughness || 0.3, 0.35);
          child.material.needsUpdate = true;
        }
      }
    });

    return { scale: scaleAmt, position: [posX, posY, posZ] };
  }, [scene, scaleAdjust, yOffset]);

  return (
    <group ref={ref} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

/* Mini steam for showcase models */
function MiniSteam() {
  const COUNT = 30;
  const ptsRef = useRef(null);
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = [];
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 0.25;
      pos[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
      vel[i] = { y: 0.006 + Math.random() * 0.004, life: Math.random(), maxLife: 0.6 + Math.random() * 0.6 };
    }
    return [pos, vel];
  }, []);

  useFrame((state) => {
    if (!ptsRef.current) return;
    const t = state.clock.getElapsedTime();
    const arr = ptsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      const v = velocities[i];
      v.life += 0.016;
      if (v.life >= v.maxLife) {
        arr[i * 3]     = (Math.random() - 0.5) * 0.25;
        arr[i * 3 + 1] = 0.8 + Math.random() * 0.1;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
        v.life = 0;
        v.maxLife = 0.6 + Math.random() * 0.6;
        continue;
      }
      arr[i * 3]     += Math.sin(t + i) * 0.001;
      arr[i * 3 + 1] += v.y;
      arr[i * 3 + 2] += Math.cos(t * 0.7 + i) * 0.001;
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
        size={0.09}
        sizeAttenuation
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ShowcaseModel({ modelUrl, scaleAdjust = 1.0, yOffset = 0 }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.2, 4.8], fov: 36 }}
      shadows={{ type: 'PCFSoftShadowMap' }}
      gl={{
        antialias: true,
        alpha: true,
        toneMappingExposure: 1.4,
        outputColorSpace: 'srgb',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <hemisphereLight skyColor="#FFF5EE" groundColor="#6B4030" intensity={1.0} />
      <directionalLight position={[4, 6, 4]} intensity={2.8} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-3, 2, -3]} intensity={1.1} color="#C8702A" />
      <pointLight position={[0, 3, 2]} intensity={1.0} color="#FFE4C4" />
      <spotLight position={[0, 5, 2]} angle={0.5} penumbra={0.9} intensity={1.5} castShadow color="#FFF5EE" />

      <Environment preset="apartment" environmentIntensity={0.8} />

      <ContactShadows
        frames={1}
        resolution={512}
        position={[0, -1.1, 0]}
        opacity={0.45}
        scale={4}
        blur={2}
        far={2}
        color="#3A1A08"
      />

      <Suspense fallback={null}>
        <Float speed={1.8} rotationIntensity={0.05} floatIntensity={0.4}>
          <Model url={modelUrl} scaleAdjust={scaleAdjust} yOffset={yOffset} />
          <MiniSteam />
        </Float>
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={2.5}
        enableDamping
        dampingFactor={0.05}
        target={[0, 0, 0]}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.7}
      />
    </Canvas>
  );
}
