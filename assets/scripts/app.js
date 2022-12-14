const ATTACK_VALUE = 10
const STRONG_ATTACK_VALUE = 17
const MONSTER_ATTACK_VALUE = 14
const HEAL_VALUE = 20

const MODE_ATTACK = "ATTACK"
const MODE_STRONG_ATTACK = "STRONG_ATTACK"
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK"
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK"
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK"
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL"
const LOG_EVENT_GAME_OVER = "GAME_OVER"

let battleLog = []

function getMaxLifeValues() {
  const enteredValue = prompt("Maximum life for you and the monster", "100")

  const parsedValue = parseInt(enteredValue)
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: "Invalid user input, not a number" }
  }
  return parsedValue
}

let chosenMaxLife

try {
  chosenMaxLife = getMaxLifeValues()
} catch (error) {
  console.log(error)
  chosenMaxLife = 100
  alert("You entered something wrong, default value was used")
}

let currentMonsterHealth = chosenMaxLife
let currentPlayerHealth = chosenMaxLife
let hasBonusLife = true

adjustHealthBars(chosenMaxLife)

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMosterHealth: monsterHealth,
    flinalPlayerHealth: playerHealth,
  }

  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "MONSTER"
      break
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: "PLAYER",
        finalMosterHealth: monsterHealth,
        flinalPlayerHealth: playerHealth,
      }
      break
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: "PLAYER",
        finalMosterHealth: monsterHealth,
        flinalPlayerHealth: playerHealth,
      }
      break
    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        event: ev,
        value: val,
        target: "PLAYER",
        finalMosterHealth: monsterHealth,
        flinalPlayerHealth: playerHealth,
      }
      break
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: ev,
        value: val,
        finalMosterHealth: monsterHealth,
        flinalPlayerHealth: playerHealth,
      }
      break
    default:
      logEntry = {}
  }

  // if (ev === LOG_EVENT_PLAYER_ATTACK) {
  //   logEntry.target = "MONSTER"
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     target: "MONSTER",
  //     finalMosterHealth: monsterHealth,
  //     flinalPlayerHealth: playerHealth,
  //   }
  // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     target: "PLAYER",
  //     finalMosterHealth: monsterHealth,
  //     flinalPlayerHealth: playerHealth,
  //   }
  // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     target: "PLAYER",
  //     finalMosterHealth: monsterHealth,
  //     flinalPlayerHealth: playerHealth,
  //   }
  // } else if (ev === LOG_EVENT_GAME_OVER) {
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     finalMosterHealth: monsterHealth,
  //     flinalPlayerHealth: playerHealth,
  //   }
  // }
  battleLog.push(logEntry)
}

function reset() {
  currentMonsterHealth = chosenMaxLife
  currentPlayerHealth = chosenMaxLife
  resetGame(chosenMaxLife)
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE)
  currentPlayerHealth -= playerDamage
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  )

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false
    removeBonusLife()
    currentPlayerHealth = initialPlayerHealth
    setPlayerHealth(initialPlayerHealth)
    alert("You would be dead, but the bonus life saved you")
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!")
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    )
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!")
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER LOST",
      currentMonsterHealth,
      currentPlayerHealth
    )
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("You have a draw")
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    )
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset()
  }
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK

  const damage = dealMonsterDamage(maxDamage)
  currentMonsterHealth -= damage
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth)
  endRound()
}

function attackHandler() {
  attackMonster(MODE_ATTACK)
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK)
}

function healPlayerHandler() {
  let healValue
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more than initial health")
    healValue = chosenMaxLife - currentPlayerHealth
  } else {
    healValue = HEAL_VALUE
  }
  increasePlayerHealth(HEAL_VALUE)
  currentPlayerHealth += HEAL_VALUE
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  )
  endRound()
}

function printLogHandler() {
  for (let i = 0; i < 3; i++) {
    console.log("---------------")
  }
  console.log(battleLog)
}

attackBtn.addEventListener("click", attackHandler)
strongAttackBtn.addEventListener("click", strongAttackHandler)
healBtn.addEventListener("click", healPlayerHandler)
logBtn.addEventListener("click", printLogHandler)
