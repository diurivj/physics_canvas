const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let gameStarted = false
const keys = []
const friction = 0.8
const gravity = 0.98
const platforms = []
const platform_width = 120
const platform_height = 10
let interval

// player
const player = {
  x: 5,
  y: canvas.height - 50,
  width: 20,
  height: 20,
  speed: 5,
  velX: 0,
  velY: 0,
  color: '#ff0000',
  jumping: false,
  jumpStrength: 7,
  grounded: false,
  draw: function() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

// platforms
platforms.push({
  x: canvas.width - 170,
  y: 400,
  width: platform_width,
  height: platform_height
})

platforms.push({
  x: 200,
  y: canvas.height - 50,
  width: platform_width,
  height: platform_height
})

platforms.push({
  x: 400,
  y: 400,
  width: platform_width,
  height: platform_height
})

platforms.push({
  x: canvas.width - 170,
  y: canvas.height - 50,
  width: platform_width,
  height: platform_height
})

platforms.push({
  x: -canvas.width,
  y: canvas.height - 5,
  width: canvas.width + canvas.width * 2,
  height: platform_height
})

document.body.addEventListener('keydown', e => {
  if (e.keyCode == 13 && !gameStarted) {
    startGame()
  }
  //para movimiento
  keys[e.keyCode] = true
})

//para movimiento
document.body.addEventListener('keyup', e => {
  keys[e.keyCode] = false
})

function intro_screen() {
  ctx.font = '20px Arial'
  ctx.fillText('Press Enter To Start', canvas.width / 2, canvas.height / 2 + 50)
}

function startGame() {
  gameStarted = true
  if (interval) return // tal vez aqui
  interval = setInterval(update, 1000 / 60)
}

// platforms
function drawPlatforms() {
  ctx.fillStyle = '#333333'
  platforms.map(platform =>
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
  )
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawPlatforms()
  player.draw()

  //jump
  if (keys[38] || keys[32]) {
    if (!player.jumping) {
      player.velY = -player.jumpStrength * 2
      player.jumping = true
    }
  }

  //movimiento
  if (keys[39]) {
    if (player.velX < player.speed) {
      player.velX++
    }
  }

  if (keys[37]) {
    if (player.velX > -player.speed) {
      player.velX--
    }
  }

  //jump
  player.y += player.velY
  player.velY += gravity

  //movimiento
  player.x += player.velX
  player.velX *= friction

  //collition
  player.grounded = false
  platforms.map(platform => {
    const direction = collisionCheck(player, platform)
    if (direction == 'left' || direction == 'right') {
      player.velX = 0
    } else if (direction == 'bottom') {
      player.jumping = false
      player.grounded = true
    } else if (direction == 'top') {
      player.velY *= -1
    }
  })

  if (player.grounded) {
    player.velY = 0
  }
}

function collisionCheck(char, plat) {
  const vectorX = char.x + char.width / 2 - (plat.x + plat.width / 2)
  const vectorY = char.y + char.height / 2 - (plat.y + plat.height / 2)

  const halfWidths = char.width / 2 + plat.width / 2
  const halfHeights = char.height / 2 + plat.height / 2

  let collisionDirection = null

  if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
    var offsetX = halfWidths - Math.abs(vectorX)
    var offsetY = halfHeights - Math.abs(vectorY)
    if (offsetX < offsetY) {
      if (vectorX > 0) {
        collisionDirection = 'left'
        char.x += offsetX
      } else {
        collisionDirection = 'right'
        char.x -= offsetX
      }
    } else {
      if (vectorY > 0) {
        collisionDirection = 'top'
        char.y += offsetY
      } else {
        collisionDirection = 'bottom'
        char.y -= offsetY
      }
    }
  }
  return collisionDirection
}

intro_screen()
