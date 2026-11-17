const MAX_HEALTH = 100;
const PLAYER_ATTACK = 12;
const SPECIAL_MIN = 15;
const SPECIAL_MAX = 50;
const HEAL_MIN = 15;
const HEAL_MAX = 30;
const MONSTER_MIN = 8;
const MONSTER_MAX = 35;

const monsterHealthValue = document.getElementById("monster-health-value");
const monsterHealthBar = document.getElementById("monster-health-bar");
const playerHealthValue = document.getElementById("player-health-value");
const playerHealthBar = document.getElementById("player-health-bar");

const attackBtn = document.getElementById("attack-btn");
const specialAttackBtn = document.getElementById("special-attack-btn");
const healBtn = document.getElementById("heal-btn");
const surrenderBtn = document.getElementById("surrender-btn");
const newGameBtn = document.getElementById("new-game-btn");

const controls = document.getElementById("controls");
const gameOverBox = document.getElementById("game-over");
const gameOverMessage = document.getElementById("game-over-message");
const logList = document.getElementById("log-list");

let monsterHealth = MAX_HEALTH;
let playerHealth = MAX_HEALTH;
let gameOver = false;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateHealthBar(bar, valueEl, health) {
  const value = Math.max(health, 0);
  valueEl.textContent = value;
  bar.style.width = value + "%";

  if (value > 50) {
    bar.style.backgroundColor = "#00a876";
  } else if (value > 25) {
    bar.style.backgroundColor = "#e0a100";
  } else {
    bar.style.backgroundColor = "#d10000";
  }
}

function updateUI() {
  updateHealthBar(monsterHealthBar, monsterHealthValue, monsterHealth);
  updateHealthBar(playerHealthBar, playerHealthValue, playerHealth);
}

function addLog(who, action, amount) {
  const li = document.createElement("li");
  const whoSpan = document.createElement("span");
  whoSpan.className = who === "Player" ? "log--player" : "log--monster";
  whoSpan.textContent = who;

  const amountSpan = document.createElement("span");
  amountSpan.className = action === "heal" ? "log--heal" : "log--damage";
  amountSpan.textContent = amount;

  li.append(whoSpan);
  if (action === "heal") {
    li.append(" heals himself for ", amountSpan, " HP");
  } else if (action === "special") {
    li.append(" uses a special attack and deals ", amountSpan, " damage");
  } else {
    li.append(" attacks and deals ", amountSpan, " damage");
  }

  logList.prepend(li);
}

function addResultLog(text) {
  const li = document.createElement("li");
  li.className = "log--result";
  li.textContent = text;
  logList.prepend(li);
}

function endGame(message) {
  gameOver = true;
  gameOverMessage.textContent = message;
  gameOverBox.classList.remove("hidden");
  controls.classList.add("hidden");
  addResultLog(message);
}

function checkWinner() {
  if (monsterHealth <= 0 && playerHealth <= 0) {
    endGame("It's a draw!");
    return true;
  }
  if (monsterHealth <= 0) {
    endGame("You won! The monster is defeated!");
    return true;
  }
  if (playerHealth <= 0) {
    endGame("You lost! The monster got you.");
    return true;
  }
  return false;
}

function monsterAttack() {
  const damage = randomBetween(MONSTER_MIN, MONSTER_MAX);
  playerHealth -= damage;
  addLog("Monster", "attack", damage);
}

function finishTurn() {
  if (monsterHealth > 0) {
    monsterAttack();
  }
  updateUI();
  checkWinner();
}

function attack() {
  if (gameOver) return;
  monsterHealth -= PLAYER_ATTACK;
  addLog("Player", "attack", PLAYER_ATTACK);
  finishTurn();
}

function specialAttack() {
  if (gameOver) return;
  const damage = randomBetween(SPECIAL_MIN, SPECIAL_MAX);
  monsterHealth -= damage;
  addLog("Player", "special", damage);
  finishTurn();
}

function heal() {
  if (gameOver) return;
  const amount = randomBetween(HEAL_MIN, HEAL_MAX);
  const healed = Math.min(amount, MAX_HEALTH - playerHealth);
  playerHealth += healed;
  addLog("Player", "heal", healed);
  finishTurn();
}

function surrender() {
  if (gameOver) return;
  playerHealth = 0;
  updateUI();
  endGame("You surrendered! You lost.");
}

function newGame() {
  monsterHealth = MAX_HEALTH;
  playerHealth = MAX_HEALTH;
  gameOver = false;
  logList.innerHTML = "";
  gameOverBox.classList.add("hidden");
  controls.classList.remove("hidden");
  updateUI();
}

attackBtn.addEventListener("click", attack);
specialAttackBtn.addEventListener("click", specialAttack);
healBtn.addEventListener("click", heal);
surrenderBtn.addEventListener("click", surrender);
newGameBtn.addEventListener("click", newGame);

updateUI();
