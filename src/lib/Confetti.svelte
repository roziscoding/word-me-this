<script lang="ts">
  import { onMount } from 'svelte'

  interface Props {
    active: boolean
  }

  let { active }: Props = $props()

  let canvas: HTMLCanvasElement
  let particles: Particle[] = []
  let animationId: number | null = null

  interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    color: string
    size: number
    rotation: number
    rotationSpeed: number
    opacity: number
    shape: 'rect' | 'circle'
  }

  const COLORS = [
    '#22c55e', '#3b82f6', '#eab308', '#ef4444', '#a855f7',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
  ]

  function spawn() {
    const w = window.innerWidth
    const h = window.innerHeight
    const corners = [
      { x: 0, y: 0, dx: 1, dy: 1 },
      { x: w, y: 0, dx: -1, dy: 1 },
      { x: 0, y: h, dx: 1, dy: -1 },
      { x: w, y: h, dx: -1, dy: -1 },
    ]

    for (const corner of corners) {
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 0.5
        const speed = 8 + Math.random() * 16
        particles.push({
          x: corner.x + (Math.random() - 0.5) * 20,
          y: corner.y + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed * corner.dx,
          vy: Math.sin(angle) * speed * corner.dy * 0.7 - Math.random() * 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 4 + Math.random() * 6,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          opacity: 1,
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
        })
      }
    }
  }

  function animate() {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.25
      p.vx *= 0.99
      p.rotation += p.rotationSpeed
      p.opacity -= 0.004

      if (p.opacity <= 0) {
        particles.splice(i, 1)
        continue
      }

      ctx.save()
      ctx.globalAlpha = p.opacity
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate)
    } else {
      animationId = null
    }
  }

  let prevActive = false

  $effect(() => {
    if (active && !prevActive) {
      spawn()
      if (!animationId) {
        animationId = requestAnimationFrame(animate)
      }
    }
    prevActive = active
  })

  onMount(() => {
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  })
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 pointer-events-none"
  style="z-index: 9999;"
></canvas>
