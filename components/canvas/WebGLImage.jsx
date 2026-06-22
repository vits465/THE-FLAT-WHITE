"use client";

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Create a custom WebGL shader material for the hover distortion effect
const LiquidImageMaterial = shaderMaterial(
  {
    uTime: 0,
    uHover: 0,
    uTexture: new THREE.Texture(),
    uMouse: new THREE.Vector2(0.5, 0.5),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform float uHover;
    uniform sampler2D uTexture;
    uniform vec2 uMouse;
    varying vec2 vUv;

    void main() {
      vec2 p = vUv;
      
      // Calculate distance from mouse
      float dist = distance(p, uMouse);
      
      // Distortion effect based on hover and mouse proximity
      float wave = sin(dist * 10.0 - uTime * 3.0) * 0.05 * uHover;
      
      vec2 distortedUv = p + wave;
      
      vec4 color = texture2D(uTexture, distortedUv);
      
      // Add slight RGB shift on hover
      float r = texture2D(uTexture, distortedUv + vec2(0.01 * uHover, 0.0)).r;
      float b = texture2D(uTexture, distortedUv - vec2(0.01 * uHover, 0.0)).b;
      
      gl_FragColor = vec4(r, color.g, b, 1.0);
    }
  `
);

extend({ LiquidImageMaterial });

import { useThree } from '@react-three/fiber';

function ImageMesh({ url }) {
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const texture = useTexture(url);
  const { viewport } = useThree();
  
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      // Smoothly interpolate the hover state
      materialRef.current.uHover = THREE.MathUtils.lerp(
        materialRef.current.uHover,
        hovered ? 1 : 0,
        0.1
      );
      // Pass mouse coordinates
      materialRef.current.uMouse = new THREE.Vector2(
        (state.pointer.x + 1) / 2,
        (state.pointer.y + 1) / 2
      );
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[viewport.width, viewport.height, 32, 32]} />
      <liquidImageMaterial ref={materialRef} uTexture={texture} />
    </mesh>
  );
}

import { Suspense } from 'react';

export default function WebGLImage({ src, alt }) {
  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* Background image establishes intrinsic height and acts as fallback */}
      <img 
        src={src} 
        alt={alt} 
        style={{ 
          width: '100%', 
          height: 'auto', 
          display: 'block'
        }} 
      />
      
      {/* WebGL Canvas Overlay covering the exact dimensions of the image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Suspense fallback={null}>
            <ImageMesh url={src} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
