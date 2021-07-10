const coins = {
   BTC: {
      name: 'BTC',
      owned: 0.00000000,
      coinRate: 0.00010000,
      marketValue: 100,
      marketRate: 10,
      img: 'BTC.png'
   },
   DOGE: {
      name: 'DOGE',
      owned: 0.00000000,
      coinRate: 0.00100000,
      marketValue: 1.00,
      marketRate: 1,
      img: 'DOGE.png',

   },
   ETH: {
      name: 'ETH',
      owned: 0.00000000,
      coinRate: 0.00007500,
      marketValue: 75,
      marketRate: 8,
      img: 'ETH.png',

   }
}

const upgrades = {
   GPU: {
      price: 10,
      change: 1,
      priceMultiplier: 1.02,
      owned: 0,
      auto: false,
      button: '',
      desc: 'Increases your base clickrate by 1',
      icon: '<i class="mdi mdi-chip"></i>'
   },
   RAM: {
      price: 500,
      change: 5,
      priceMultiplier: 1.03,
      owned: 0,
      auto: false,
      button: '',
      desc: 'Increases your base clickrate by 5.',
      icon: '<i class="mdi mdi-checkerboard-plus"></i>'
   },
   'Hard Drive': {
      price: 800,
      change: 1,
      priceMultiplier: 1.05,
      owned: 0,
      auto: true,
      button: '',
      desc: 'Increases your base mining rate by 1.',
      icon: '<i class="mdi mdi-grid"></i>'
   },
   Server: {
      price: 1200,
      change: 10,
      priceMultiplier: 1.07,
      owned: 0,
      auto: true,
      button: '',
      desc: 'Increases your base mining rate by 10.',
      icon: '<i class="mdi mdi-server"></i>'
   }
}

var clickRate = 1
var autoRate = 0
var activeCoin = coins.BTC
var USD = 0.00
var generation = 0
var upDown = 1


function autoMine() {
   activeCoin.owned += autoRate * activeCoin.coinRate
   enableUpgrades()
   drawCount()
}

function clickMine(coin) {
   coins[coin].owned += clickRate * coins[coin].coinRate
   enableUpgrades()
   drawCount()
}

//Accepts a string and a number, changes coins to USD based on rates
function sellCoin(coin, percentage) {
   let sellAmt = coins[coin].owned * percentage
   USD += sellAmt * coins[coin].marketValue
   coins[coin].owned -= sellAmt
   drawCount()
}

function clickUpgrade(item) {
   let upgrade = upgrades[item]
   USD -= upgrade.price
   upgrade.owned += 1
   upgrade.price *= upgrade.priceMultiplier
   upgrade.price = upgrade.price.toFixed(2)
   enableUpgrades()
   updateRates(item)
   drawUpgrade(item)
   drawRig()
   drawRates()
   drawCount()
}

function updateRates(item) {
   if (upgrades[item].auto) {
      autoRate += upgrades[item].change
   } clickRate += upgrades[item].change
}

// Trying to have market direction change every 3 iterations, starting in "up" and then turning to "down"
function updateMarket() {
   generation++
   console.log('generation: ', generation)
   console.log('updown:', upDown)
   if (generation >= 4 || (generation >= 2 && upDown == -1)) {
      upDown *= -1
      generation = 0
   }
   for (let key in coins) {
      let rand = Math.random()
      coins[key].marketValue += (rand * coins[key].marketRate * upDown)
      coins[key].marketValue = Number(coins[key].marketValue.toFixed(2))
   }
   drawMarket()
}

function generateButtons() {
   for (let key in upgrades) {
      upgrades[key].button =
         `<div class="col-12 card bg-secondary" id="${key}">
      <h4>${key}</h4>
      <h6 id="${key}-price">Price: $${upgrades[key].price}</h6>
      <h6 id="${key}-owned">Owned: ${upgrades[key].owned}</h6>
      <p>${upgrades[key].desc}</p>
      <button id="${key}-buy" type="button" class="btn btn-primary" style="max-width: 30%;" onclick="clickUpgrade('${key}')" disabled>BUY</button>
   </div>`
   }
}

function enableUpgrades() {
   for (let key in upgrades) {
      if (USD >= upgrades[key].price) {
         document.getElementById(`${key}-buy`).disabled = false
      } else {
         document.getElementById(`${key}-buy`).disabled = true
      }
   }
}

function drawButtons() {
   let clickTemplate = ''
   let autoTemplate = ''
   for (let key in upgrades) {
      if (upgrades[key].auto) {
         autoTemplate += upgrades[key].button
      } else {
         clickTemplate += upgrades[key].button
      }
      document.getElementById('click-upgrades').innerHTML = clickTemplate
      document.getElementById('auto-upgrades').innerHTML = autoTemplate
   }
}

function drawCount() {
   for (let key in coins) {
      coins[key].owned = Number(coins[key].owned.toFixed(8))
      let countStr = coins[key].owned.toFixed(8)
      document.getElementById(`${key}-count`).innerText = `${key}: ${countStr}`
   }
   USD = Number(USD.toFixed(2))
   document.getElementById('usd-count').innerText = `USD: $${USD}`
}

function drawUpgrade(upgrade) {
   document.getElementById(`${upgrade}-price`).innerText = `Price: $${upgrades[upgrade].price}`
   document.getElementById(`${upgrade}-owned`).innerText = `Owned: ${upgrades[upgrade].owned}`
}

function drawRig() {
   let template = '<h3>RIG</h3>'
   for (let key in upgrades) {
      let i = 0
      if (upgrades[key].owned > 0) {
         innerTemplate = `${upgrades[key].icon}`
         template += `
         <p>${key}: </p>
         `
         while (i < upgrades[key].owned) {
            template += innerTemplate
            i++
         }
      }
   }
   document.getElementById('rig').innerHTML = template
}

function drawRates() {
   document.getElementById('cpc').innerText = `Click Multiplier: x${clickRate}`
   document.getElementById('cps').innerText = `Mining per Second: x${autoRate}`
}

function drawMarket() {
   for (let key in coins) {
      document.getElementById(`market-${key}`).innerText = `${key}: $${coins[key].marketValue}`
   }
}

function drawCoins() {
   let template = ''
   for (let key in coins) {
      template +=
         `<div class="col-4 text-center">
            <img class="btn" onclick="clickMine('${key}')" src="${coins[key].img}"></img>
            <h5>Mining Rate: ${coins[key].coinRate} per click.</h5>
         </div>`
   }
   document.getElementById('coins').innerHTML = template
}

window.setInterval(autoMine, 1000)
window.setInterval(updateMarket, 3000)
generateButtons()
drawButtons()
drawRates()
drawMarket()
drawCoins()
drawRig()