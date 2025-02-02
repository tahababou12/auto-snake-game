import './style.css'
import { Game } from './game/Game'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <div class="game-container">
    <canvas id="gameCanvas"></canvas>
    <div class="stats">
      <h2>Battle Stats</h2>
      <div id="snakeStats"></div>
    </div>
  </div>
`

const game = new Game('gameCanvas', 800, 600)
game.start()
