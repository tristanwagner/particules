const Particules = function (id, mouseRadiusScale, nbOfParticlesScale) {
  id = id || 'particules'
  const canvas = document.getElementById(id)
  const ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  let particles = []

  mouseRadiusScale = mouseRadiusScale || 0.009
  nbOfParticlesScale = nbOfParticlesScale || 0.00009

  let mouse = {
    x: null,
    y: null,
    radius: (canvas.height * mouseRadiusScale) * (canvas.width * mouseRadiusScale)
  }

  window.addEventListener('mousemove', function (event) {
    mouse.x = event.x
    mouse.y = event.y
  })

  window.addEventListener('resize', function () {
    canvas.width = innerWidth
    canvas.height = innerHeight
    mouse.radius = (canvas.height * mouseRadiusScale) * (canvas.width * mouseRadiusScale)
  })

  window.addEventListener('mouseout', function () {
    mouse.x = null
    mouse.y = null
  })

  class Particle {
    constructor(x, y, directionX, directionY, radius, color) {
      this.x = x
      this.y = y
      this.directionX = directionX
      this.directionY = directionY
      this.radius = radius
      this.color = color
      this.distance = null
    }

    update() {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y

      this.distance = Math.sqrt((dx * dx) + (dy * dy))

      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX
      }

      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY
      }

      if (this.distance < mouse.radius + this.radius) {
        if (mouse.x < this.x && this.x < canvas.width - this.radius * 10) {
          this.x += 10
        }
        if (mouse.x > this.x && this.x > this.radius * 10) {
          this.x -= 10
        }
        if (mouse.y < this.y && this.y < canvas.height - this.radius * 10) {
          this.y += 10
        }
        if (mouse.y > this.y && this.y > this.radius * 10) {
          this.y -= 10
        }
      }

      this.x += this.directionX
      this.y += this.directionY

      this.draw()
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      ctx.fillStyle = this.color
      ctx.fill()
    }
  }

  function init() {
    particles = []
    nbOfParticles = (canvas.height * canvas.width) * nbOfParticlesScale
    for (let i = 0;i < nbOfParticles; i++) {
      let radius = (Math.random() * 5) + 1

      let x = (Math.random() * ((innerWidth - radius * 2) - (radius * 2)) + radius * 2)
      let y = (Math.random() * ((innerHeight - radius * 2) - (radius * 2)) + radius * 2)

      let directionX = (Math.random() * 5) - 2.5
      let directionY = (Math.random() * 5) - 2.5

      let color = '#8C5523'

      particles.push(new Particle(x, y, directionX, directionY, radius, color))
    }
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const p1 = particles[a]
        const p2 = particles[b]
        const distance = ((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
        if (distance < (canvas.width / 7) * (canvas.height / 7)) {
          ctx.strokeStyle = 'rgba(140, 85, 31, ' + (1 - (distance/20000)) + ')'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    }
  }

  function make() {
    ctx.clearRect(0, 0, innerWidth, innerHeight)

    for (let i = 0;i < particles.length; i++) {
      particles[i].update()
    }
    connect()
    requestAnimationFrame(make)
  }

  init()
  make()

}
