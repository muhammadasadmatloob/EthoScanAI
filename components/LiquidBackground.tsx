'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function LiquidBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.5, 32);
    const material = new THREE.MeshNormalMaterial({
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 3;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const animate = (time: number) => {
      sphere.rotation.x = time * 0.0002;
      sphere.rotation.y = time * 0.0003;
      
      sphere.scale.x = 1 + Math.sin(time * 0.001) * 0.2;
      sphere.scale.y = 1 + Math.cos(time * 0.001) * 0.2;
      sphere.scale.z = 1 + Math.sin(time * 0.002) * 0.2;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    const container = containerRef.current;
    return () => {
      window.removeEventListener('resize', handleResize);
      container?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={containerRef} className="liquid-bg opacity-40" aria-hidden="true" />;
}
