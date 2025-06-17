import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { onKeyStroke, useUrlSearchParams } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import type { Character, PowerUp, IngamePlayer, PostUserDuelPayload } from '@/types'
import { useCharStore } from './char'
import { useRouter } from 'vue-router'
import { io, Socket } from 'socket.io-client'
import { postUserDuel } from '@/services/dataService'

let socket: Socket | null = null

export const usePlayStore = defineStore('play', () => {
  // Audios
  const gameMusic = ref()
  const pickupSound = ref()
  const endGameSound = ref()

  function setGameMusic(music: HTMLAudioElement) {
    gameMusic.value = music
  }

  function setPickupSound(sound: HTMLAudioElement) {
    pickupSound.value = sound
  }

  function setEndGameSound(sound: HTMLAudioElement) {
    endGameSound.value = sound
  }

  // instellingen opslaan
  const settingsStore = useSettingsStore()
  const charStore = useCharStore()
  //const powerStore = usePowerUpStore()
  const { keybinds, volume } = storeToRefs(settingsStore)

  const numRows = 20 // Aantal rijen
  const numCols = 20 // Aantal kolommen
  const players = ref<IngamePlayer[]>([])
  const playerCount = ref<number>(0)
  const gameGrid = ref<Array<Array<string>>>([]) // Speelveld data
  const snake = ref<Array<{ x: number; y: number }>>([]) // Lichaam van de slang
  const food = ref<{ x: number; y: number }>({ x: 10, y: 10 })
  const direction = ref('up') //richting van de slang
  const score = ref(0)
  const kills = ref(0)
  const gameOver = ref(false)
  const playerAlive = ref<boolean>(true)
  const powerUpAvailable = ref<boolean>(false)
  const powerUpActive = ref<boolean>(false)
  const interval = ref<number>(10)
  const character = ref<Character>()
  const ghosted = ref<boolean>(false)
  const invisible = ref<boolean>(false)

  const winnerName = ref<string>('')
  //time if limited-time mode is selected
  const remainingTime = ref<number>(0)
  //const PowerUp
  const powerUp = ref<PowerUp>({ id: 1, name: 'speedboost', x: 0, y: 0 })
  //init game intervals
  let gameLoopInterval = setInterval(() => {})
  let socketInterval = setInterval(() => {})
  let powerUpTimeOut = setInterval(() => {})
  let timerInterval = setInterval(() => {})

  //kijkt of richting al veranderd is in interval
  const directionChanged = ref<boolean>(false)
  let params = useUrlSearchParams('history')

  //obstakels toevoegen
  const obstacles = ref<Array<{ x: number; y: number }>>([])
  const teleports = ref<boolean>(false)

  /*
  function addObstacle(x: number, y: number) {
    obstacles.value.push({ x, y })
  }
  */

  function initializeSocket(s: Socket) {
    socket = s
  }

  // initialiseren
  function initializeGame() {
    params = useUrlSearchParams('history')
    players.value = JSON.parse(sessionStorage.getItem('players')!)
    players.value.forEach((e) => e.score = 0)
    playerCount.value = players.value.length
    console.log(params.playerId)
    console.log(players.value)
    //Sla de geselecteerde character op
    character.value = charStore.chars[0]
    if (JSON.parse(sessionStorage.getItem('selectCharater')!)) {
      const c = JSON.parse(sessionStorage.getItem('selectCharater')!)
      if (c.attributes.speed > 4 || c.attributes.speed < 1.5 || c.attributes.startLength > 6 || c.attributes.startLength < 1) {
        console.log("tampered char")
        character.value = charStore.chars[0]
      } else {
        character.value = JSON.parse(sessionStorage.getItem('selectCharater')!)
      }
    }
    interval.value = character.value!.attributes.speed
    //in geval dat spel herbegint
    gameOver.value = false
    // Maak een leeg speelveld
    gameGrid.value = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => 'empty')
    )

    // make obstacles ref empty
    obstacles.value = []

    //trying to make sure the powerup is stil not in the grid when not picked up in a game and lobby gets redirected and replayed.
    powerUpAvailable.value = false
    powerUpActive.value = false

    // spawn slang
    let startX = Math.floor(numCols / 2)
    let startY = Math.floor(numRows / 2)

    //CHECKING IF SELECTED GAME MODE IS WALLS TO GENERATE WALLS
    /*
    if (selectedMap.value && selectedMap.value.name === 'walls') {
      console.log('generate walls')
      socket?.emit('generateWalls')
      //generateWalls()
    }*/

    // Spawn players on edges of the grid
    for (let i = 0; i < players.value.length; i++) {
      console.log(players.value[i].id)
      console.log(params.playerId)

      if (players.value[0].id === params.playerId) {
        // startX = Math.floor(numCols / (2 + players.value.length * i))

        startX = Math.floor(0)
        startY = Math.floor(numRows / 2 - 1)
        direction.value = 'up'
      } else if (players.value[1] && players.value[1].id === params.playerId) {
        startX = Math.floor(numCols - 1)
        startY = Math.floor(numRows / 2)
        direction.value = 'down'
      } else if (players.value[2] && players.value[2].id === params.playerId) {
        startX = Math.floor(numCols / 2)
        startY = Math.floor(0)
        direction.value = 'right'
      } else if (players.value[3] && players.value[3].id === params.playerId) {
        startX = Math.floor(numCols / 2 - 1)
        startY = Math.floor(numRows - 1)
        direction.value = 'left'
      }
    }

    snake.value = [{ x: startX, y: startY }]
    for (let i = 1; i < character.value!.attributes.startLength; i++) {
      switch (direction.value) {
        case 'up':
          snake.value.push({ x: startX, y: startY + i })
          break

        case 'down':
          snake.value.push({ x: startX, y: startY - i })
          break

        case 'left':
          snake.value.push({ x: startX + i, y: startY })
          break

        case 'right':
          snake.value.push({ x: startX - i, y: startY })
          break
      }
    }
  }

  //eindigt de game ALLEEN VOOR DE GEBRUIKER en wordt spectator
  const endGame = () => {
    if (playerAlive.value) {
      console.log('game over')
      gameOver.value = true
      playerAlive.value = false
      // clearInterval(gameLoopInterval)
      // clearInterval(socketInterval)
      // clearInterval(timerInterval)
      // Toon een game over bericht of handel het einde van het spel af
      // Pause game music
      gameMusic.value.pause()
      //send player id and game id
      //socket?.emit('playerDied', params.playerId, params.gameId)
      console.log('emitting player died' + params.playerId + ' ' + params.id)
      socket?.emit('playerDied', params.playerId, params.id) // Send player died event to server
      // Play end game sound
      endGameSound.value.currentTime = 0
      endGameSound.value.play().catch(() => {
        console.error('Something went wrong')
      })

      //removePlayer()

      /*alert('game over!')
    restartGame()*/
    } else {
      console.log('player already dead')
    }
  }

  //
  //end game for everyone
  //
  /*
  socket?.on('endGame', (winnerId, gameId) => {
    console.log('game ended')
    if(gameId === params.id)
    endGlobal()
    //socket?.emit('gameOver', params.playerId)
    console.log(`Game Over! Player ${winnerId} wins!`)
  })*/

  const endGlobal = () => {
    console.log('inside endglobal')
    gameOver.value = true
    clearInterval(gameLoopInterval)
    clearInterval(socketInterval)
    clearInterval(timerInterval)

    gameLoopInterval = setInterval(() => {})
    socketInterval = setInterval(() => {})
    timerInterval = setInterval(() => {})
    // players.value.forEach((e) => e.score = -1)

    //check which player is still alive to give back winner
    players.value.forEach((e) => {
      if (e.alive) {
        console.log('winner is ' + e.id)
        winnerName.value = e.username
      }
    })
    // Toon een game over bericht of handel het einde van het spel af
    // Pause game music
    gameMusic.value.pause()

    // Play end game sound
    endGameSound.value.currentTime = 0
    endGameSound.value.play().catch(() => {
      console.error('Something went wrong')
    })

    /*alert('game over!')
    restartGame()*/
  }

  socket?.on('gameOver', (winningPlayerId: string) => {
    console.log('game ended')
    endGlobal()
    console.log(`Game Over! Player ${winningPlayerId} wins!`)
  })

  function removePlayer() {
    //playerAlive.value = false
    console.log('inside removeplayer')
    if (playerAlive.value) {
      endGame()
      console.log('player died')

      //snake.value = [] // Assign an empty array to snake.value
      //socket?.emit('sendPlayerData', snake.value, params.playerId)

      //socket?.emit('playerDied', params.playerId, params.id) // Send player died event to server
    }
  }

  //herstart de game
  const restartGame = () => {
    initializeGame()
    startGameLoop()
  }

  // Genereer een nieuwe positie voor het voedsel op het speelveld
  function generateFood() {
    let foodX, foodY
    do {
      foodX = Math.floor(Math.random() * numCols)
      foodY = Math.floor(Math.random() * numRows)
    } while (gameGrid.value[foodY][foodX] !== 'empty')

    socket?.emit('generateFood', foodX, foodY, params.id, params.playerId)
  }

  /*
  function generateWalls() {
    // Add some obstacles
    const numObstacles = Math.max(15, Math.floor(Math.random() * 6) + 1) // Random number of obstacles between 1 and 6, but at least 15
    for (let i = 0; i < numObstacles; i++) {
      const obstacleX = Math.floor(Math.random() * numCols)
      const obstacleY = Math.floor(Math.random() * numRows)
      addObstacle(obstacleX, obstacleY)
    }
  }*/

  //logica van speedboost powerUp
  const speedBoost = function () {
    console.log('speed boost')
    clearInterval(gameLoopInterval)
    gameLoopInterval = setInterval(
      () => {
        if (!gameOver.value) {
          directionChanged.value = false
          checkCollisions()
          moveSnake()
          checkCollisions()
          if (!gameOver.value) {
            updateGameGrid()
          }
        } else {
          endGame()
        }
      },
      1000 / (interval.value * 2)
    )

    setTimeout(() => {
      console.log('speed boost over')
      clearInterval(gameLoopInterval)
      gameLoopInterval = setInterval(
        () => {
          if (!gameOver.value) {
            directionChanged.value = false
            checkCollisions()
            moveSnake()
            checkCollisions()
            if (!gameOver.value) {
              updateGameGrid()
            }
          } else {
            endGame()
          }
        },
        2000 / (interval.value * 2)
      )
    }, 4000)
  }

  //logica van de magnet powerup
  const magnetApple = function () {
    console.log('magnet apple')

    const isAppleNearby = () => {
      const head = snake.value[0]
      const distanceX = Math.abs(head.x - food.value.x)
      const distanceY = Math.abs(head.y - food.value.y)

      //kijkt naar afstand tussen snake head en food
      return distanceX <= 3 && distanceY <= 3
    }

    const eatApple = () => {
      if (isAppleNearby()) {
        FoodCollision()
      } else {
        snake.value.pop()
      }
    }

    const intervalId = setInterval(
      () => {
        if (!gameOver.value) {
          eatApple()
        } else {
          clearInterval(intervalId)
          powerUpActive.value = false
        }
      },
      2000 / (interval.value * 2)
    )

    // Stop the interval after 10 seconds
    setTimeout(() => {
      clearInterval(intervalId)
      powerUpActive.value = false
    }, 10000)
  }

  const ghost = function () {
    console.log('player ' + params.playerId + ' ghosted')

    socket?.emit('activateGhost', params.playerId, params.id)
    setTimeout(() => {
      console.log('ghost over')
      socket?.emit('deactivateGhost', params.playerId, params.id)
    }, 10000)
  }

  const invisibility = function () {
    console.log('player ' + params.playerId + ' went invisible')

    socket?.emit('activateInvis', params.playerId, params.id)
    setTimeout(() => {
      console.log('invisibility over')
      socket?.emit('deactivateInvis', params.playerId, params.id)
    }, 3000)
  }

  function generatePowerUp() {
    socket?.emit('setPowerUpAvailability', true, params.id)
    // Random positie genereren
    do {
      powerUp.value.x = Math.floor(Math.random() * numCols)
      powerUp.value.y = Math.floor(Math.random() * numRows)
    } while (gameGrid.value[powerUp.value.y][powerUp.value.x] !== 'empty')

    // Random power up genereren
    // const random = Math.floor(Math.random() * 4) + 1 // Adjust if more power-ups are added
    // switch (random) {
    //   case 1:
    //     powerUp.value = { id: 1, name: 'swiftness', x: powerUp.value.x, y: powerUp.value.y }
    //     break
    //   case 2:
    //     powerUp.value = { id: 2, name: 'ghost', x: powerUp.value.x, y: powerUp.value.y }
    //     break
    //   case 3:
    //     powerUp.value = { id: 3, name: 'invisibility', x: powerUp.value.x, y: powerUp.value.y }
    //     break
    //   case 4: // Add this case
    //     powerUp.value = { id: 4, name: 'magnet', x: powerUp.value.x, y: powerUp.value.y }
    //     break
    // }

    socket?.emit('generatePowerUp', powerUp.value.x, powerUp.value.y, params.id)
  }

  function pickupPowerUp() {
    powerUpActive.value = true
    socket?.emit('setPowerUpAvailability', false, params.id)

    switch (powerUp.value.id) {
      case 1:
        speedBoost()
        break
      case 2:
        ghost()
        break
      case 3:
        //getting speed
        speedBoost()
        break
      case 4:
        magnetApple()
        break
    }
  }

  function moveEnemySnake() {
    if (players.value.length > 1) {
      players.value.forEach((e) => {
        if (e.id !== params.playerId) {
          e.data.forEach((segment) => {
            const { x, y } = segment

            if (segment === e.data[0]) {
              gameGrid.value[y][x] = 'enemy-head'
            } else {
              gameGrid.value[y][x] = 'enemy'
            }

            if (e.ghosted) {
              gameGrid.value[y][x] = 'ghostedEnemy'
            }
            if (e.invisible) {
              gameGrid.value[y][x] = 'invisibleEnemy'
            }
          })
        }
      })
    }
    // enemySnake.value.forEach((segment) => {
    //   const { x, y } = segment
    //   gameGrid.value[y][x] = 'enemy'
    //   if(enemyGhosted.value){
    //     gameGrid.value[y][x] = 'ghostedEnemy'

    //   }
    // })
  }

  const startInterval = () => {
    // players.value.forEach((e) => {
    //   e.data = [{x:0, y:0}]
    // })
    // console.log(socket)
    socketInterval = setInterval(() => {
      if (playerAlive.value) {
        socket?.emit('sendPlayerData', snake.value, params.playerId)
      }
      socket?.emit('getPlayerData', params.id)

      if (!gameOver.value) {
        updateGameGrid()
      } else {
        endGlobal()
      }
    }, 50)

    socket?.on('getData', (snake) => {
      if (params.playerId !== snake.id) {
        // console.log('enemy snake moved!')
        // console.log(snake)
        // enemySnake.value = snake.data

        players.value.forEach((e) => {
          if (e.id === snake.id) {
            e.data = snake.data
          }
        })
      }
    })

    // socket?.on('sendData', () => {
    //   console.log('player data sent')
    // })
    socket?.on('playerDied', (id) => {
      console.log('inside player died from socket')
      players.value.forEach((e) => {
        console.log(players.value)
        if (e.id === id) {
          //e.invisible = true
          e.alive = false
          e.data = []
          console.log('other player died')
        }
      })
      if (id === params.playerId) {
        //invisible.value = true
        console.log('own snake died')
        snake.value = []
        playerAlive.value = false
        //put yourself as alive false in players by checking id
        players.value.forEach((e) => {
          if (e.id === params.playerId) {
            e.alive = false
          }
        })
      }
    })
  }

  // Start de game loop om de spelstatus bij te werken
  function startGameLoop() {
    startInterval()
    //deleting all walls incase they were placed last round
    //checking modes and maps and listening to server to run logic
    socket?.emit('checkModeMap', params.id)

    //reset all players alive in the server aswell in case they are still in the same lobby
    socket?.emit('resetPlayersAlive', params.id)

    playerAlive.value = true
    //if the gamemode is limited-time
    socket?.on('setTimeLimit', () => {
      remainingTime.value = 3 * 60
      startTimer()
    })

    // Listen for the walls event from the server
    socket?.on('wallsGenerated', (walls: Array<{ x: number; y: number }>) => {
      console.log('Walls received from server:', obstacles)
      obstacles.value = walls
    })

    socket?.on('generatePowerUps', () => {
      powerUpTimeOut = setTimeout(() => {
        if (players.value[0].id === params.playerId) {
          console.log('generating powerups')
          generatePowerUp()
        }
      }, 5000)
    })

    socket?.on('teleportTrue', () => {
      teleports.value = true
    })
    /*
    if (selectedMode.value && selectedMode.value.name === 'limited-time') {
      remainingTime.value = 3 * 60
      startTimer()
    } else {
      remainingTime.value = 0
    }
    */

    socket?.on('teleportFalse', () => {
      teleports.value = false
    })

    // Genereer eerste voedsel
    generateFood()

    socket?.on('showFood', (foodX, foodY, id) => {
      food.value = { x: foodX, y: foodY }
      // players.value.forEach((e) => {
      //   if(e.id === id){
      //     e.score++
      //     console.log(e.score + e.id)
      //   }
      // })
    })

    socket?.on('updateScores', (id) => {
      players.value.forEach((e) => {
        if(e.id === id){
          e.score++
          console.log(e.score + e.id)
        }
      })
    })

    socket?.on('showPowerUp', (powerX, powerY, random) => {
      console.log('power up received')
      console.log(powerX, powerY, random)
      switch (random) {
        case 1:
          powerUp.value = { id: 1, name: 'speedboost', x: powerX, y: powerY }
          break
        case 2:
          powerUp.value = { id: 2, name: 'ghost', x: powerX, y: powerY }
          break
        case 3:
          powerUp.value = { id: 3, name: 'invisibility', x: powerX, y: powerY }
          break
        case 4:
          powerUp.value = { id: 4, name: 'magnet', x: powerX, y: powerY }
          break
      }
      console.log(powerUp.value)
    })

    socket?.on('setPowerUpAvailability', (bool) => {
      powerUpAvailable.value = bool
      console.log('power up availability: ' + powerUpAvailable.value)
    })

    socket?.on('activateGhost', (id) => {
      players.value.forEach((e) => {
        if (e.id === id) {
          e.ghosted = true
        }
      })
      if (id === params.playerId) {
        ghosted.value = true
      }
    })

    socket?.on('deactivateGhost', (id) => {
      players.value.forEach((e) => {
        if (e.id === id) {
          e.ghosted = false
        }
      })
      if (id === params.playerId) {
        ghosted.value = false
      }
    })

    socket?.on('activateInvis', (id) => {
      players.value.forEach((e) => {
        if (e.id === id) {
          e.invisible = true
        }
      })
      if (id === params.playerId) {
        invisible.value = true
      }
    })

    socket?.on('deactivateInvis', (id) => {
      players.value.forEach((e) => {
        if (e.id === id) {
          e.invisible = false
        }
      })
      if (id === params.playerId) {
        invisible.value = false
      }
    })

    gameLoopInterval = setInterval(
      () => {
        if (playerAlive.value) {
          directionChanged.value = false
          checkCollisions()
          moveSnake()
          checkCollisions()
        }
        if (!gameOver.value) {
          updateGameGrid()
        }

        /*else {
          console.log('calling endgame from inside interval constantly')
          endGame()
        }*/
      },
      2000 / (interval.value * 2)
    ) // Pas de snelheid aan door de intervaltijd te veranderen
  }

  // Lees toetsenbordinvoer
  onKeyStroke([keybinds.value.down, 'ArrowDown'], () => {
    moveSnakeUp()
  })

  onKeyStroke([keybinds.value.up, 'ArrowUp'], () => {
    moveSnakeDown()
  })

  onKeyStroke([keybinds.value.left, 'ArrowLeft'], () => {
    moveSnakeLeft()
  })

  onKeyStroke([keybinds.value.right, 'ArrowRight'], () => {
    moveSnakeRight()
  })

  const moveSnakeUp = () => {
    //zorgt ervoor dat je niet kan verwisselen naar de tegenovergestelde richting
    if (!directionChanged.value) {
      if (direction.value === 'up') {
        return
      } else {
        direction.value = 'down'
        directionChanged.value = true
      }
    }
  }

  const moveSnakeDown = () => {
    if (!directionChanged.value) {
      if (direction.value === 'down') {
        return
      } else {
        direction.value = 'up'
        directionChanged.value = true
      }
    }
  }

  const moveSnakeLeft = () => {
    if (!directionChanged.value) {
      if (direction.value === 'right') {
        return
      } else {
        direction.value = 'left'
        directionChanged.value = true
      }
    }
  }

  const moveSnakeRight = () => {
    if (!directionChanged.value) {
      if (direction.value === 'left') {
        return
      } else {
        direction.value = 'right'
        directionChanged.value = true
      }
    }
  }

  // Beweeg de slang
  function moveSnake() {
    const head = snake.value[0]
    let newHead: { x: number; y: number }

    // Bepaal de nieuwe positie op basis van de richting
    switch (direction.value) {
      case 'up':
        newHead = { x: head.x, y: head.y - 1 }
        break
      case 'down':
        newHead = { x: head.x, y: head.y + 1 }
        break
      case 'left':
        newHead = { x: head.x - 1, y: head.y }
        break
      case 'right':
        newHead = { x: head.x + 1, y: head.y }
        break
      default:
        return
    }

    if (teleports.value) {
      newHead.x = (newHead.x + numCols) % numCols
      newHead.y = (newHead.y + numRows) % numRows
    }

    // Plaats de nieuwe kop van de slang
    snake.value.unshift(newHead)

    //check if magnet is active
    if (!(powerUp.value.id === 4 && powerUpActive.value === true)) {
      if (newHead.x === food.value.x && newHead.y === food.value.y) {
        FoodCollision()
      } else {
        snake.value.pop() // Verwijder het einde van de slang
      }
    }

    if (newHead.x === powerUp.value.x && newHead.y === powerUp.value.y && powerUpAvailable.value) {
      socket?.emit('setPowerUpAvailability', false, params.id)
      //genereer een nieuwe powerUp na aantal seconden
      console.log('power up picked up')
      pickupPowerUp()
      powerUpTimeOut = setTimeout(() => {
        generatePowerUp()
      }, 20000)
    }
  }

  function FoodCollision() {
    score.value++
    socket?.emit('updateScores', params.id, params.playerId)
    // Play pick up sound
    pickupSound.value.currentTime = 0
    pickupSound.value.play().catch(() => {
      console.error('Something went wrong')
    })
    generateFood() // Genereer nieuw voedsel
  }

  function checkCollisions() {
    const head = snake.value[0]

    // Controleer botsingen met de randen van het speelveld en niet controleren als de map teleports is
    if (!teleports.value) {
      if (head.x < 0 || head.x >= numCols || head.y < 0 || head.y >= numRows) {
        //gameOver.value = true
        removePlayer()
        return
      }
    }

    if (!ghosted.value) {
      //controleer op botsing met obstacles
      obstacles.value.forEach((obstacle) => {
        if (head.x === obstacle.x && head.y === obstacle.y) {
          //gameOver.value = true
          removePlayer()
          return
        }
      })

      // Controleer botsingen met zichzelf
      for (let i = 1; i < snake.value.length; i++) {
        if (head.x === snake.value[i].x && head.y === snake.value[i].y) {
          //gameOver.value = true
          removePlayer()
          return
        }
      }

      // Controleer botsingen met andere snake
      //if (players.value.length > 1) {
      players.value.forEach((e) => {
        if (e.id !== params.playerId) {
          // && players.value.length > 1
          for (let i = 1; i < e.data.length; i++) {
            if (head.x === e.data[i].x && head.y === e.data[i].y && !e.ghosted) {
              //gameOver.value = true
              removePlayer()
              return
            }
          }
        }
      })
      //}

      // for (let i = 1; i < enemySnake.value.length; i++) {
      //   if (head.x === enemySnake.value[i].x && head.y === enemySnake.value[i].y) {
      //     gameOver.value = true
      //     return
      //   }
      // }

      // Controleer botsingen met andere snake head
      //alleen controleren op spelers die nog leven

      players.value.forEach((e) => {
        if (e.id !== params.playerId && e.alive) {
          if (head.x == e.data[0].x && head.y == e.data[0].y && !e.ghosted) {
            //gameOver.value = true
            removePlayer()
            return
          }
        }
      })
      // if (head.x == enemySnake.value[0].x && head.y == enemySnake.value[0].y) {
      //   gameOver.value = true
      //   return
      // }
    }
  }

  // Werk het speelveld bij op basis van de huidige status
  function updateGameGrid() {
    // Verwijder de vorige positie van de slang van het speelveld
    gameGrid.value.forEach((row, y) => {
      row.fill('empty')
    })

    if (powerUpAvailable.value) {
      switch (powerUp.value.id) {
        case 1:
          gameGrid.value[powerUp.value.y][powerUp.value.x] = 'swiftness'
          break
        case 2:
          gameGrid.value[powerUp.value.y][powerUp.value.x] = 'ghost'
          break
        case 3:
          gameGrid.value[powerUp.value.y][powerUp.value.x] = 'invisibility'
          break
        case 4: // Add this case
          gameGrid.value[powerUp.value.y][powerUp.value.x] = 'magnet'
          break
      }
    } else {
      gameGrid.value[powerUp.value.y][powerUp.value.x] = 'empty'
    }

    //hier is de error na dood
    // Plaats de slangen op het speelveld

    if (playerAlive.value) {
      snake.value.forEach((segment) => {
        if (segment === snake.value[0]) {
          const { x, y } = segment
          gameGrid.value[y][x] = 'snake-head'
          if (ghosted.value) {
            gameGrid.value[y][x] = 'ghostedSnakeHead'
          }
        } else {
          const { x, y } = segment
          gameGrid.value[y][x] = 'snake'
          if (ghosted.value) {
            gameGrid.value[y][x] = 'ghostedSnake'
          }
        }
      })
    }

    moveEnemySnake()

    // Plaats het voedsel op het speelveld
    const { x, y } = food.value
    gameGrid.value[y][x] = 'food'

    //do a check for each X Y on the grid if the gamegrid.value is ibstacle make it empty
    /*
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (gameGrid.value[i][j] === 'obstacles') {
          deleteObstacle(i,j);
        }
      }
    }*/

    //Zet obstakels op het speelveld indien nodig
    obstacles.value.forEach((obstacle) => {
      const { x, y } = obstacle
      gameGrid.value[y][x] = 'obstacles'
    })

    socket?.on('endGame', (winnerId, gameId) => {
      console.log('game ended')
      if (gameId === params.id){ endGlobal()}

      //socket?.emit('gameOver', params.playerId)
      console.log(`Game Over! Player ${winnerId} wins!`)
    })
  }

  const router = useRouter()

  const leaveGame = () => {
    socket?.emit('leaveGameInProgress', params.id)
    router.push('/')
  }

  // Start the timer
  function startTimer() {
    timerInterval = setInterval(() => {
      if (remainingTime.value > 0) {
        remainingTime.value -= 1
      } else {
        clearInterval(timerInterval)
        endGame()
      }
    }, 1000) // Decrement every second
  }

  const saveUserDuelData = async (payload: PostUserDuelPayload) => {
    try {
      if (gameOver.value) {
        await postUserDuel(payload)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return {
    setGameMusic,
    setPickupSound,
    setEndGameSound,
    endGame,
    keybinds,
    numRows,
    numCols,
    gameGrid,
    snake,
    food,
    direction,
    score,
    kills,
    gameOver,
    volume,
    initializeGame,
    startGameLoop,
    moveSnake,
    checkCollisions,
    updateGameGrid,
    leaveGame,
    initializeSocket,
    remainingTime,
    saveUserDuelData,
    moveSnakeUp,
    moveSnakeDown,
    moveSnakeRight,
    moveSnakeLeft,
    playerAlive,
    players,
    winnerName,
    gameLoopInterval,
    socketInterval
  }
})
