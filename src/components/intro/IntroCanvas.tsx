"use client";

import React, { useEffect } from "react";
import * as THREE from "three";

interface IntroCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  sceneRef: React.MutableRefObject<THREE.Scene | null>;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
  particlesRef: React.MutableRefObject<THREE.Points | null>;
  ringRef: React.MutableRefObject<THREE.LineSegments | null>;
  libraryGroupRef: React.MutableRefObject<THREE.Group | null>;
  lensFlareRef: React.MutableRefObject<THREE.Mesh | null>;
  ambientLightRef: React.MutableRefObject<THREE.AmbientLight | null>;
}

export default function IntroCanvas({
  canvasRef,
  sceneRef,
  cameraRef,
  rendererRef,
  particlesRef,
  ringRef,
  libraryGroupRef,
  lensFlareRef,
  ambientLightRef
}: IntroCanvasProps) {
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Dynamic blue and gold point lights
    const blueLight = new THREE.PointLight(0x0055ff, 2, 40);
    blueLight.position.set(0, 0, 2);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xffaa00, 0, 30);
    goldLight.position.set(0, 0, 5);
    scene.add(goldLight);

    // Particle Texture Generator
    const createParticleTexture = () => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 32;
      pCanvas.height = 32;
      const ctx = pCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.2, "rgba(100, 180, 255, 0.8)");
        grad.addColorStop(0.5, "rgba(0, 50, 200, 0.2)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(pCanvas);
    };
    const particleTex = createParticleTexture();

    // 1. Starfield / Particles System
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.0,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // 2. Central Energy Ring
    const ringGeo = new THREE.TorusGeometry(3.5, 0.05, 8, 80);
    const ringMesh = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.0,
        wireframe: true,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(ringMesh);
    
    const ringLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(ringGeo),
      new THREE.LineBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(ringLines);
    ringRef.current = ringLines;

    // 3. Lens Flare mesh
    const flareGeo = new THREE.PlaneGeometry(12, 1);
    
    const createFlareTexture = () => {
      const fCanvas = document.createElement("canvas");
      fCanvas.width = 256;
      fCanvas.height = 32;
      const ctx = fCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 16, 256, 16);
        grad.addColorStop(0, "rgba(255, 230, 150, 0)");
        grad.addColorStop(0.4, "rgba(255, 255, 255, 0.4)");
        grad.addColorStop(0.5, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.6, "rgba(255, 255, 255, 0.4)");
        grad.addColorStop(1, "rgba(255, 230, 150, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 32);
      }
      return new THREE.CanvasTexture(fCanvas);
    };
    
    const flareMat = new THREE.MeshBasicMaterial({
      map: createFlareTexture(),
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const flare = new THREE.Mesh(flareGeo, flareMat);
    flare.position.set(-15, 0, 2.5);
    scene.add(flare);
    lensFlareRef.current = flare;

    // 4. Procedural 3D Library Scene
    const libraryGroup = new THREE.Group();
    scene.add(libraryGroup);
    libraryGroupRef.current = libraryGroup;

    const buildLibraryScene = () => {
      const shelfWidth = 60;
      
      const buildShelf = (xPos: number) => {
        const shelfGrp = new THREE.Group();
        shelfGrp.position.set(xPos, 0, 0);

        const borderMat = new THREE.MeshStandardMaterial({
          color: 0x071122,
          roughness: 0.8,
          metalness: 0.1,
        });

        for (let y = -4; y <= 4; y += 3) {
          const plank = new THREE.Mesh(new THREE.BoxGeometry(2, 0.15, shelfWidth), borderMat);
          plank.position.y = y;
          shelfGrp.add(plank);

          const bookColors = [0x0e1b30, 0x1d3557, 0x457b9d, 0xd4af37, 0x3d3425, 0x5e503f, 0x8a1c14];
          const bookDensity = 0.5;
          
          for (let z = -shelfWidth / 2 + 1; z < shelfWidth / 2 - 1; z += bookDensity + Math.random() * 0.2) {
            const bookCount = Math.floor(Math.random() * 3) + 1;
            const tilt = Math.random() > 0.85 ? (Math.random() - 0.5) * 0.3 : 0;
            
            for (let b = 0; b < bookCount; b++) {
              const bookHeight = 0.9 + Math.random() * 0.7;
              const bookWidth = 0.12 + Math.random() * 0.15;
              const bookDepth = 1.0 + Math.random() * 0.4;
              
              const bMat = new THREE.MeshStandardMaterial({
                color: bookColors[Math.floor(Math.random() * bookColors.length)],
                roughness: 0.6,
                metalness: 0.15,
              });

              if (Math.random() > 0.8) {
                bMat.emissive = new THREE.Color(0xd4af37);
                bMat.emissiveIntensity = 0.25;
              }

              const bookMesh = new THREE.Mesh(new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth), bMat);
              bookMesh.position.set(0, y + bookHeight / 2 + 0.08, z);
              if (tilt !== 0) {
                bookMesh.rotation.z = tilt;
                bookMesh.position.x += tilt * 0.2;
              }
              shelfGrp.add(bookMesh);
            }
          }
        }
        
        libraryGroup.add(shelfGrp);
      };

      buildShelf(-7.5);
      buildShelf(7.5);

      // Floating Pages
      const pageCount = 35;
      
      const createPageTexture = (idx: number) => {
        const pCanvas = document.createElement("canvas");
        pCanvas.width = 128;
        pCanvas.height = 128;
        const pCtx = pCanvas.getContext("2d");
        if (pCtx) {
          pCtx.fillStyle = "#fff8e7";
          pCtx.fillRect(0, 0, 128, 128);
          pCtx.strokeStyle = "rgba(100, 50, 0, 0.4)";
          pCtx.lineWidth = 1.5;
          
          if (idx % 3 === 0) {
            pCtx.beginPath();
            pCtx.arc(64, 64, 40, 0, Math.PI * 2);
            pCtx.stroke();
            pCtx.beginPath();
            pCtx.arc(64, 64, 20, 0, Math.PI * 2);
            pCtx.stroke();
            pCtx.beginPath();
            pCtx.moveTo(24, 64); pCtx.lineTo(104, 64);
            pCtx.moveTo(64, 24); pCtx.lineTo(64, 104);
            pCtx.stroke();
          } else if (idx % 3 === 1) {
            pCtx.beginPath();
            pCtx.moveTo(20, 20); pCtx.quadraticCurveTo(50, 40, 70, 20);
            pCtx.quadraticCurveTo(90, 80, 110, 50);
            pCtx.stroke();
            pCtx.fillStyle = "rgba(150, 50, 0, 0.3)";
            pCtx.font = "8px serif";
            pCtx.fillText("TERRA", 40, 80);
          } else {
            pCtx.font = "6px serif";
            pCtx.fillStyle = "rgba(20, 20, 20, 0.6)";
            for (let l = 15; l < 115; l += 8) {
              pCtx.fillText("Lorem ipsum dolor sit amet, cosectetur.", 10, l);
            }
          }
        }
        return new THREE.CanvasTexture(pCanvas);
      };

      for (let i = 0; i < pageCount; i++) {
        const pageMat = new THREE.MeshStandardMaterial({
          map: createPageTexture(i),
          roughness: 0.9,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.0,
        });

        const pageMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.6), pageMat);
        
        pageMesh.position.set(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 45 - 5
        );
        pageMesh.rotation.set(
          Math.random() * Math.PI * 0.2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 0.1
        );
        
        libraryGroup.add(pageMesh);
      }

      // Constellation Wireframes
      const constellationGrp = new THREE.Group();
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < 20; i++) {
        points.push(new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30,
          -45 + (Math.random() - 0.5) * 10
        ));
      }

      const lineMat = new THREE.LineBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
      });

      const lineGeometry = new THREE.BufferGeometry();
      const linePositions: number[] = [];
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          if (points[i].distanceTo(points[j]) < 12) {
            linePositions.push(points[i].x, points[i].y, points[i].z);
            linePositions.push(points[j].x, points[j].y, points[j].z);
          }
        }
      }
      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      const lines = new THREE.LineSegments(lineGeometry, lineMat);
      constellationGrp.add(lines);

      const dotGeo = new THREE.BufferGeometry();
      const dotPositions = new Float32Array(points.length * 3);
      points.forEach((pt, k) => {
        dotPositions[k * 3] = pt.x;
        dotPositions[k * 3 + 1] = pt.y;
        dotPositions[k * 3 + 2] = pt.z;
      });
      dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
      const dotMat = new THREE.PointsMaterial({
        color: 0xd4af37,
        size: 0.25,
        map: particleTex,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const dots = new THREE.Points(dotGeo, dotMat);
      constellationGrp.add(dots);

      libraryGroup.add(constellationGrp);
      libraryGroup.position.z = -10;
    };

    buildLibraryScene();

    // RENDER LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (particles.material instanceof THREE.PointsMaterial) {
        particles.rotation.y = elapsedTime * 0.008;
        particles.rotation.x = elapsedTime * 0.004;
      }

      ringMesh.rotation.z = elapsedTime * 0.15;
      ringMesh.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;
      
      ringLines.rotation.z = -elapsedTime * 0.22;
      ringLines.rotation.x = Math.cos(elapsedTime * 0.1) * 0.1;

      libraryGroup.children.forEach((child) => {
        if (child instanceof THREE.Group) {
          child.rotation.y = Math.sin(elapsedTime * 0.05) * 0.02;
        } else if (child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry) {
          child.position.y += Math.sin(elapsedTime * 0.8 + child.position.x) * 0.0015;
          child.rotation.y += Math.cos(elapsedTime * 0.4 + child.position.z) * 0.0008;
        }
      });

      blueLight.intensity = 1.5 + Math.sin(elapsedTime * 1.5) * 0.4;
      goldLight.intensity = Math.max(0, Math.cos(elapsedTime * 0.8) * 0.8);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [canvasRef, sceneRef, cameraRef, rendererRef, particlesRef, ringRef, libraryGroupRef, lensFlareRef, ambientLightRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full block z-0"
    />
  );
}
