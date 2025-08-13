'use client'

import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export default function Hero3DContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [autoScrollProgress, setAutoScrollProgress] = useState(0)
  const sceneRef = useRef<{
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    renderer?: THREE.WebGLRenderer
    stars: THREE.Points[]
    nebula?: THREE.Mesh
    mountains: THREE.Mesh[]
    animationId?: number
  }>({
    stars: [],
    mountains: []
  })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 800
    const height = container.clientHeight || 600

    console.log('Hero3D Container dimensions:', { width, height })

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.00025)
    sceneRef.current.scene = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000)
    camera.position.z = 300  // Start further back
    camera.position.y = 30
    sceneRef.current.camera = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setClearColor(0x0a0a0a, 1) // Gris très foncé au lieu du noir pur
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.5
    container.appendChild(renderer.domElement)
    sceneRef.current.renderer = renderer

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    // Create star field
    const createStarField = () => {
      const starCount = 2000 // Réduit pour les performances

      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(starCount * 3)
        const colors = new Float32Array(starCount * 3)
        const sizes = new Float32Array(starCount)

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(Math.random() * 2 - 1)

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta)
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
          positions[j * 3 + 2] = radius * Math.cos(phi)

          // Color variation
          const color = new THREE.Color()
          const colorChoice = Math.random()
          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.8 + Math.random() * 0.2)
          } else if (colorChoice < 0.9) {
            color.setHSL(0.08, 0.5, 0.8)
          } else {
            color.setHSL(0.6, 0.5, 0.8)
          }
          
          colors[j * 3] = color.r
          colors[j * 3 + 1] = color.g
          colors[j * 3 + 2] = color.b

          sizes[j] = Math.random() * 2 + 0.5
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              // Slow rotation based on depth
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })

        const stars = new THREE.Points(geometry, material)
        scene.add(stars)
        sceneRef.current.stars.push(stars)
      }
    }

    // Create nebula
    const createNebula = () => {
      const geometry = new THREE.PlaneGeometry(2000, 1000, 50, 50)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0033ff) },
          color2: { value: new THREE.Color(0xff0066) },
          opacity: { value: 0.3 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      })

      const nebula = new THREE.Mesh(geometry, material)
      nebula.position.z = -800  // Plus loin pour l'effet de profondeur
      nebula.position.y = -100
      scene.add(nebula)
      sceneRef.current.nebula = nebula
    }

    // Create mountains
    const createMountains = () => {
      const layers = [
        { distance: -50, height: 30, color: 0x1a1a2e, opacity: 1 },
        { distance: -100, height: 40, color: 0x16213e, opacity: 0.8 },
        { distance: -150, height: 50, color: 0x0f3460, opacity: 0.6 },
        { distance: -200, height: 60, color: 0x0a4668, opacity: 0.4 }
      ]

      layers.forEach((layer, index) => {
        const points = []
        const segments = 30
        
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 500
          const y = Math.sin(i * 0.1) * layer.height + 
                   Math.sin(i * 0.05) * layer.height * 0.5 +
                   Math.random() * layer.height * 0.2 - 100
          points.push(new THREE.Vector2(x, y))
        }
        
        points.push(new THREE.Vector2(250, -150))
        points.push(new THREE.Vector2(-250, -150))

        const shape = new THREE.Shape(points)
        const geometry = new THREE.ShapeGeometry(shape)
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        })

        const mountain = new THREE.Mesh(geometry, material)
        mountain.position.z = layer.distance
        mountain.position.y = -50 + (index * 10)  // Étagement vertical
        mountain.userData = { baseZ: layer.distance, index }
        scene.add(mountain)
        sceneRef.current.mountains.push(mountain)
      })
    }

    // Create atmosphere
    const createAtmosphere = () => {
      const geometry = new THREE.SphereGeometry(300, 32, 32)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
            
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      })

      const atmosphere = new THREE.Mesh(geometry, material)
      scene.add(atmosphere)
    }

    // Initialize all scene elements
    createStarField()
    createNebula()
    createMountains()
    createAtmosphere()

    // Animation
    let frameCount = 0
    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate)
      
      const time = Date.now() * 0.001
      frameCount++

      // Log every 60 frames (about once per second)
      if (frameCount % 60 === 0) {
        console.log('Hero3D Animation running:', {
          time,
          starsCount: sceneRef.current.stars.length,
          mountainsCount: sceneRef.current.mountains.length,
          camera: camera?.position
        })
      }

      // Update stars
      sceneRef.current.stars.forEach((starField) => {
        const material = starField.material as any
        if (material && material.uniforms) {
          material.uniforms.time.value = time
        }
      })

      // Update nebula
      if (sceneRef.current.nebula) {
        const material = sceneRef.current.nebula.material as any
        if (material && material.uniforms) {
          material.uniforms.time.value = time * 0.5
        }
      }

      // Animate camera based on auto-scroll progress
      if (camera) {
        // Use auto-scroll progress to control camera movement
        const progress = autoScrollProgress
        
        // Camera moves from z=300 to z=-700 based on scroll
        const zPosition = 300 - progress * 1000
        const yPosition = 30 + progress * 20 // Rise slightly
        const xPosition = Math.sin(progress * Math.PI * 2) * 20 // Weave side to side
        
        camera.position.z = zPosition
        camera.position.x = xPosition
        camera.position.y = yPosition
        
        // Look ahead into the distance
        camera.lookAt(0, 0, -800)
      }

      // Animate mountains with parallax based on progress
      sceneRef.current.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor
        
        // Move mountains as we travel through them
        const baseZ = mountain.userData.baseZ
        mountain.position.z = baseZ + autoScrollProgress * 500 * parallaxFactor
        
        // Fade mountains as we pass them
        const distanceToCamera = camera ? camera.position.z - mountain.position.z : 0
        const opacity = Math.max(0, Math.min(1, (200 - Math.abs(distanceToCamera)) / 200))
        if (mountain.material) {
          (mountain.material as THREE.MeshBasicMaterial).opacity = opacity
        }
      })
      
      renderer.render(scene, camera)
    }
    
    animate()

    // Debug log
    console.log('Hero3D initialized:', {
      scene: scene,
      camera: camera,
      renderer: renderer,
      stars: sceneRef.current.stars.length,
      mountains: sceneRef.current.mountains.length,
      nebula: sceneRef.current.nebula
    })

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      
      renderer.setSize(width, height)
    }
    
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      
      window.removeEventListener('resize', handleResize)
      
      // Dispose Three.js resources
      sceneRef.current.stars.forEach(starField => {
        starField.geometry.dispose()
        const material = starField.material as any
        if (material && material.dispose) {
          material.dispose()
        }
      })

      sceneRef.current.mountains.forEach(mountain => {
        mountain.geometry.dispose()
        const material = mountain.material as any
        if (material && material.dispose) {
          material.dispose()
        }
      })

      if (sceneRef.current.nebula) {
        sceneRef.current.nebula.geometry.dispose()
        const material = sceneRef.current.nebula.material as any
        if (material && material.dispose) {
          material.dispose()
        }
      }
      
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      
      renderer.dispose()
      scene.clear()
    }
  }, [autoScrollProgress])

  // Auto-scroll effect
  useEffect(() => {
    if (!scrollContainerRef.current) return

    let scrollInterval: NodeJS.Timeout
    let currentScroll = 0
    const scrollSpeed = 0.5 // Pixels per frame
    const maxScroll = 2000 // Total scroll distance

    const autoScroll = () => {
      if (scrollContainerRef.current) {
        currentScroll += scrollSpeed
        
        if (currentScroll >= maxScroll) {
          currentScroll = 0 // Reset to start
        }
        
        scrollContainerRef.current.scrollTop = currentScroll
        
        // Update progress for camera animation
        const progress = currentScroll / maxScroll
        setAutoScrollProgress(progress)
      }
    }

    // Start auto-scrolling
    scrollInterval = setInterval(autoScroll, 16) // ~60fps

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative bg-black overflow-hidden"
      style={{ touchAction: 'none', position: 'relative' }}
    >
      {/* Canvas container */}
      <div className="absolute inset-0">
        {/* This will hold the canvas */}
      </div>

      {/* Scrollable container for auto-scroll effect */}
      <div 
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-y-auto scrollbar-hide"
        style={{ pointerEvents: 'none' }}
      >
        {/* Invisible content to enable scrolling */}
        <div style={{ height: '2500px' }} />
      </div>

      {/* UI overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-[#DC143C] mb-4 animate-pulse">
            CAPTIVEZ
          </h3>
          <p className="text-white text-lg md:text-xl opacity-90">
            Voyagez à travers l'infini
          </p>
          <p className="text-white/60 text-sm mt-4">
            {Math.round(autoScrollProgress * 100)}% du voyage
          </p>
        </div>
      </div>
    </div>
  )
}