let digits = []

digits[0] = [
    1,1,1,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,1,1,1
]
digits[1] = [
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1
]
digits[2] = [
    1,1,1,1,
    0,0,0,1,
    0,0,0,1,
    1,1,1,1,
    1,0,0,0,
    1,0,0,0,
    1,0,0,0,
    1,1,1,1
]
digits[3] = [
    1,1,1,1,
    0,0,0,1,
    0,0,0,1,
    1,1,1,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    1,1,1,1
]
digits[4] = [
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,1,1,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1
]
digits[5] = [
    1,1,1,1,
    1,0,0,0,
    1,0,0,0,
    1,1,1,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    1,1,1,1
]
digits[6] = [
    1,1,1,1,
    1,0,0,0,
    1,0,0,0,
    1,1,1,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,1,1,1
]
digits[7] = [
    1,1,1,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1
]
digits[8] = [
    1,1,1,1,
    1,0,0,1,
    1,0,0,1,
    1,1,1,1,
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,
    1,1,1,1
]
digits[9] = [
    1,1,1,1,
    1,0,0,1,
    1,0,0,1,
    1,1,1,1,
    0,0,0,1,
    0,0,0,1,
    0,0,0,1,
    1,1,1,1
]

let frame

let start
let canva

let playerOneScore
let playerTwoScore

let playerOne
let playerTwo

let pong

class Canvas {
    constructor(id, canva) {
        if(canva == undefined)
        {
            canva = document.createElement("canvas")
            canva.id = id
            let height = Math.floor((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)*0.6)
            
            while ((height/15)%2 !=1) {
                height += 1
            }
            
            canva.width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)*0.7
            canva.height = height

            document.body.appendChild(canva)
        }
        this.main = canva
        this.width = canva.width
        this.height = canva.height
        this.canvaContext = canva.getContext('2d')
        this.reset()
    }

    reset() {
        this.canvaContext.fillStyle = "black"
        this.canvaContext.fillRect(0, 0, this.width, this.height)
    }
}

class Paddle {
    constructor(id, canva, score) {
        this.id = id 
        this.canva = canva
        this.width = 15
        this.height = 60
        this.speed = 0
        this.score = score
        if(id=="player_two")
        {
            this.x = canva.width-50
        } else {
            this.x = 50
        }
        this.y = canva.height/2 - this.height
        this.draw()
    }

    draw() {
        if (this.y+(3*this.speed)+this.height > this.canva.height) {
            this.y = this.canva.height-this.height
        } else if (this.y+(3*this.speed) < 0) {
            this.y = 0
        } else {
            this.y += 3*this.speed
        }
        
        this.canva.canvaContext.fillStyle = "white"
        this.canva.canvaContext.fillRect(this.x, this.y, this.width, this.height)

        for(let i=0; i<this.canva.height/15; i++) {
            if(i%2 != 0) {
                this.canva.canvaContext.fillRect(canva.width/2-8, 0+15*i, 15, 15)
            }
        }
    }
}

class Ball {
    constructor(id, canva, playerOne, playerTwo) {
        this.id = id
        this.canva = canva
        this.playerOne = playerOne
        this.playerTwo = playerTwo
        this.width = 15
        this.height = 15
        this.x = canva.width/2 - this.width/2
        this.y = canva.height/2 - this.height/2
        this.xVelocity = -3
        this.yVelocity = 3
        this.draw()
        this.wallSound = new Audio('wall.mp3')
        this.paddleSound = new Audio('paddle.mp3')
        this.scoreSound = new Audio('score.mp3')
    }

    draw() {
        this.canva.canvaContext.fillStyle = "white"
        this.canva.canvaContext.fillRect(this.x, this.y, this.width, this.height)

        if (this.y+this.height+this.yVelocity > this.canva.height) {
            this.y = this.canva.height-this.height
            this.yVelocity *= -1
            this.wallSound.play()
        } else if (this.y+this.yVelocity < 0) {
            this.y = 0
            this.yVelocity *= -1
            this.wallSound.play()
        } else if(this.x+this.width+this.xVelocity > this.canva.width) {
            this.scoreSound.play()
            this.playerOne.score.value += 1
            this.xVelocity = -4
            this.reset()
        } else if (this.x+this.xVelocity < 0) {
            this.scoreSound.play()
            this.playerTwo.score.value += 1
            this.xVelocity = 4
            this.reset()
        } else {
            this.x += this.xVelocity
            this.y += this.yVelocity
        }

        if ((this.x+this.width < this.playerTwo.x+this.playerTwo.width) && (this.x+this.width > this.playerTwo.x) && (this.y < this.playerTwo.y+this.playerTwo.height) && (this.y+this.height > this.playerTwo.y)) {
            this.x = this.playerTwo.x-this.width
            this.paddleSound.play()
            let rand = Math.floor(Math.random() * 2)

            if ((this.y >= this.playerTwo.y-this.height) && (this.y <= this.playerTwo.y+10)) {
                if(rand == 0) {
                    this.xVelocity = -5
                    this.yVelocity = -4
                } else {
                    this.xVelocity = -4
                    this.yVelocity = -4
                }
            } else if ((this.y >= this.playerTwo.y+10) && (this.y <= this.playerTwo.y+30)) {
                if(rand == 0) {
                    this.xVelocity = -6
                    this.yVelocity = -2
                } else {
                    this.xVelocity = -6
                    this.yVelocity = -3
                }
            } else if ((this.y >= this.playerTwo.y+30) && (this.y <= this.playerTwo.y+50)) {
                if(rand == 0) {
                    this.xVelocity = -6
                    this.yVelocity = 2
                } else {
                    this.xVelocity = -6
                    this.yVelocity = 3
                }
            } else if ((this.y >= this.playerTwo.y+50) && (this.y <= this.playerTwo.y+60)) {
                if(rand == 0) {
                    this.xVelocity = -5
                    this.yVelocity = 4
                } else {
                    this.xVelocity = -4
                    this.yVelocity = 4
                }
            }
        } else if ((this.x < this.playerOne.x+this.playerOne.width) && (this.x > this.playerOne.x) && (this.y < this.playerOne.y+this.playerOne.height) && (this.y+this.height > this.playerOne.y)) {
            this.x = this.playerOne.x+this.playerOne.width
            this.paddleSound.play()
            let rand = Math.floor(Math.random() * 2)
            
            if ((this.y >= this.playerOne.y-this.height) && (this.y <= this.playerOne.y+10)) {
                if(rand == 0) {
                    this.xVelocity = 5
                    this.yVelocity = -4
                } else {
                    this.xVelocity = 4
                    this.yVelocity = -4
                }
            } else if ((this.y >= this.playerOne.y+10) && (this.y <= this.playerOne.y+30)) {
                if(rand == 0) {
                    this.xVelocity = 6
                    this.yVelocity = -2
                } else {
                    this.xVelocity = 6
                    this.yVelocity = -3
                }
            } else if ((this.y >= this.playerOne.y+30) && (this.y <= this.playerOne.y+50)) {
                if(rand == 0) {
                    this.xVelocity = 6
                    this.yVelocity = 2
                } else {
                    this.xVelocity = 6
                    this.yVelocity = 3
                }
            } else if ((this.y >= this.playerOne.y+50) && (this.y <= this.playerOne.y+60)) {
                if(rand == 0) {
                    this.xVelocity = 5
                    this.yVelocity = 4
                } else {
                    this.xVelocity = 4
                    this.yVelocity = 4
                }
            }
        }
    }

    reset() {
        this.x = canva.width/2 - this.width/2
        this.y = canva.height/2 - this.height/2
        this.yVelocity = 0
        this.draw()
        
        if(this.playerOne.score.value == 10 || this.playerTwo.score.value == 10) {
            clearInterval(frame)
            start = false
            ai = false
            canva = new Canvas("main_canvas", canva.main)

            playerOneScore = new Digit("player_one_score", canva, canva.width/2 - 40, 15)
            playerTwoScore = new Digit("player_two_score", canva, canva.width/2 + 20, 15)

            playerOne = new Paddle("player_one", canva, playerOneScore)
            playerTwo = new Paddle("player_two", canva, playerTwoScore)

            pong = new Ball("ball", canva, playerOne, playerTwo)

            oponent = new Enemy('oponent', pong)

            document.getElementById('one_player').style.display = "block"
            document.getElementById('two_players').style.display = "block"
        }
    }
}

class Digit {
    constructor(id, canva, x, y) {
        this.id = id
        this.x = x
        this.y = y
        this.canva = canva
        this.value = 0
        this.draw()
    }

    draw() {
        this.canva.canvaContext.fillStyle = "white"
        let digit = digits[this.value]
        let moveX = 0
        let moveY = 0
        let col = 0
        for(let i=0; i<32; i++) {
            if(digit[i] == 1) {
                this.canva.canvaContext.fillRect(this.x+moveX, this.y+moveY, 5, 5)
            }
            if(col==3){
                moveY += 5 
                moveX = 0
                col = 0
            } else {
                moveX += 5
                col += 1
            }
        }
    }
}

class Enemy {
    constructor(id, ball) {
        this.id = id
        this.ball = ball
        this.paddle = ball.playerTwo
        this.difficulty = undefined
        this.rand = 0
    }

    update() {
        if (this.ball.x >= this.paddle.x - this.difficulty){
            if (this.rand == 0) {
                this.rand = Math.floor(Math.random() * (this.paddle.height-5))
            }
            if(this.paddle.y+this.rand > this.ball.y){
                this.paddle.speed = -1
            } else if(this.paddle.y+this.rand+5 < this.ball.y){
                this.paddle.speed = 1
            }
            else {
                this.paddle.speed = 0
            }
        } else {
            this.paddle.speed = 0
            this.rand = 0
        }
    }
}

start = false
ai = false

canva = new Canvas('main_canvas')

playerOneScore = new Digit('player_one_score', canva, canva.width/2 - 40, 15)
playerTwoScore = new Digit('player_two_score', canva, canva.width/2 + 20, 15)

playerOne = new Paddle('player_one', canva, playerOneScore)
playerTwo = new Paddle('player_two', canva, playerTwoScore)

pong = new Ball('ball', canva, playerOne, playerTwo)

oponent = new Enemy('oponent', pong)

document.getElementById('one_player').style.left = (canva.width/2 - 1.5*document.getElementById('one_player').offsetWidth) + 'px'
document.getElementById('one_player').style.top = (canva.height/2 - document.getElementById('one_player').offsetHeight/2) + 'px'

document.getElementById('two_players').style.left = (canva.width/2 + 0.5*document.getElementById('two_players').offsetWidth) + 'px'
document.getElementById('two_players').style.top = (canva.height/2 - document.getElementById('two_players').offsetHeight/2) + 'px'

document.getElementById('difficulty').style.left = (canva.width/2 - 35) + 'px'
document.getElementById('difficulty').style.top = (canva.height/2 - 50) + 'px'

function updateFrame() {
    canva.reset()
    playerOne.draw()
    playerTwo.draw()
    playerOneScore.draw()
    playerTwoScore.draw()
    pong.draw()
}

function updateFrameWithAI() {
    canva.reset()
    oponent.update()
    playerOne.draw()
    playerTwo.draw()
    playerOneScore.draw()
    playerTwoScore.draw()
    pong.draw()
}

window.addEventListener("keydown", function(event) {
	if(event.key === 'w') {
        playerOne.speed = -1
    }
	if(event.key === 's') {
        playerOne.speed = 1
    }
    if(!ai) {
        if(event.key === 'ArrowUp') {
            playerTwo.speed = -1
        }
        if(event.key === 'ArrowDown') {
            playerTwo.speed = 1
        }
    }
})

window.addEventListener("keyup", function(event) {
	if(event.key === 'w') {
        playerOne.speed = 0
    }
	if(event.key === 's') {
        playerOne.speed = 0
    }
    if(!ai) {
        if(event.key === 'ArrowUp') {
            playerTwo.speed = 0
        }
        if(event.key === 'ArrowDown') {
            playerTwo.speed = 0
        }
    }
})

document.getElementById('one_player').addEventListener('click', function() {
    this.style.display = 'none'
    document.getElementById('two_players').style.display = 'none'
    document.getElementById('difficulty').style.display = 'block'
})

document.getElementById('two_players').addEventListener('click', function() {
    if(!start) {
        frame = setInterval(updateFrame, 11)
        start = true
        this.style.display = 'none'
        document.getElementById('one_player').style.display = 'none'
    }
})

document.getElementById('easy').addEventListener('click', function() {
    if(!start && !ai) {
        oponent.difficulty = canva.width/5
        frame = setInterval(updateFrameWithAI, 11)
        start = true
        ai = true
        document.getElementById('difficulty').style.display = 'none'
    }
})

document.getElementById('medium').addEventListener('click', function() {
    if(!start && !ai) {
        oponent.difficulty = canva.width/3
        frame = setInterval(updateFrameWithAI, 11)
        start = true
        ai = true
        document.getElementById('difficulty').style.display = 'none'
    }
})

document.getElementById('hard').addEventListener('click', function() {
    if(!start && !ai) {
        oponent.difficulty = canva.width/2
        frame = setInterval(updateFrameWithAI, 11)
        start = true
        ai = true
        document.getElementById('difficulty').style.display = 'none'
    }
})