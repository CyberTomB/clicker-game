const coins = {
   BTC: {
      name: 'BTC',
      owned: 0.00000000,
      coinRate: 0.00100000,
      marketValue: 100,
      marketRate: 10,
      img: 'BTC.png',
   },
   DOGE: {
      name: 'DOGE',
      owned: 0.00000000,
      coinRate: 0.01000000,
      marketValue: 1.00,
      marketRate: 1,
      img: 'DOGE.png',

   },
   ETH: {
      name: 'ETH',
      owned: 0.00000000,
      coinRate: 0.00075000,
      marketValue: 75,
      marketRate: 8,
      img: 'ETH.png',

   }
}

const upgrades = {
   GPU: {
      price: 10,
      change: 1,
      priceMultiplier: 1.15,
      owned: 0,
      auto: false,
      button: '',
      desc: 'Increases your base clickrate by 1',
      icon: '<i class="mdi mdi-chip"></i>'
   },
   RAM: {
      price: 50,
      change: 5,
      priceMultiplier: 1.30,
      owned: 0,
      auto: false,
      button: '',
      desc: 'Increases your base clickrate by 5.',
      icon: '<i class="mdi mdi-checkerboard-plus"></i>'
   },
   'Hard Drive': {
      price: 500,
      change: 1,
      priceMultiplier: 1.05,
      owned: 0,
      auto: true,
      button: '',
      desc: 'Increases your base mining rate by 1.',
      icon: '<i class="mdi mdi-grid"></i>'
   },
   Server: {
      price: 5000,
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
var rigOn = `<h4 class="bg-danger text-light rounded-sm p-1">ACTIVE</h4>`


function autoMine() {
   activeCoin.owned += autoRate * activeCoin.coinRate
   enableUpgrades()
   drawCount()
}

function clickCoin(coin) {
   coins[coin].owned += clickRate * coins[coin].coinRate
   enableUpgrades()
   drawCount()
}

function clickMine(coin) {
   console.log('prior active coin: ', activeCoin)

   document.getElementById(`${activeCoin.name}-rigged`).innerHTML = `<button class="btn btn-success" onclick="clickMine('${activeCoin.name}')">MINE</button>`
   activeCoin = coins[coin]
   console.log('new active coin: ', activeCoin)
   document.getElementById(`${coin}-rigged`).innerHTML = rigOn
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
   drawUpgradePrices(item)
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

function generateUpgradeButtons() {
   for (let key in upgrades) {
      upgrades[key].button =
         `<div class="col-5 card bg-dark text-light my-2 shadow" id="${key}">
         <div class="card-header">
               <h4>${key}</h4>
               <p>${upgrades[key].desc}</p>
               </div>
               <div class="card-body">
            <h6 class="card-text" id="${key}-price">Price: $${upgrades[key].price}</h6>
            <p class="text-muted card-text" id="${key}-owned">Owned: ${upgrades[key].owned}</p>
            <button id="${key}-buy" type="button" class="btn btn-info" style="max-width: 40%;" onclick="clickUpgrade('${key}')" disabled>BUY</button>
            </div>
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

function drawUpgradeButtons() {
   let template = ''
   for (let key in upgrades) {
      template += upgrades[key].button
   }
   document.getElementById('upgrades').innerHTML = template
}

function drawCount() {
   for (let key in coins) {
      coins[key].owned = Number(coins[key].owned.toFixed(8))
      let countStr = coins[key].owned.toFixed(8)
      document.getElementById(`${key}-count`).innerText = `${key}: ${countStr}`
      let coinVal = coins[key].owned * coins[key].marketValue
      let coinValStr = coinVal.toFixed(2)
      document.getElementById(`${key}-coinval`).innerText = `$${coinValStr}`
   }
   USD = Number(USD.toFixed(2))
   document.getElementById('usd-count').innerText = `USD: $${USD}`
}

function drawUpgradePrices(upgrade) {
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
         <p>${key}: ${upgrades[key].owned}</p>
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
   document.getElementById('cps').innerText = `Mining Rate per Second: x${autoRate}`
}

function drawMarket() {
   for (let key in coins) {
      document.getElementById(`market-${key}`).innerText = `${key}: $${coins[key].marketValue}`
   }
}

function drawCoins() {
   let template = ''
   for (let key in coins) {
      let coinVal = coins[key].owned * coins[key].marketValue
      coinVal = coinVal.toFixed(2)
      let rigged = ''
      if (coins[key] == activeCoin) {
         rigged = rigOn
      } else {
         rigged = `<button class="btn btn-success" onclick="clickMine('${key}')">MINE</button>`
      }
      template +=
         `<div class="col-3" id="${coins[key].name}-card">
         <div class="row coin-card justify-content-center text-center p-3">
            <img class="btn col-12" onclick="clickCoin('${key}')" src="${coins[key].img}"></img>
            <h5 class="col-12 text-secondary">Mining Rate: ${coins[key].coinRate}0 per click.</h5>
            <h3 class="col-12" id="${key}-coinval">${coinVal}</h3>
            <h4 class="col-8 text-secondary" id="${key}-count">${coins[key].owned}</h4>
            <div class="col-4" id="${key}-rigged">
            ${rigged}
            </div>
            <h5 class="col-12">- SELL -</h5>
            <div class="col-12">
               <div class="row justify-content-center">
                  <button class="btn btn-primary col-md-2 m-1" onclick="sellCoin('${key}',.10)">10%</button>
                  <button class="btn btn-primary col-md-2 m-1" onclick="sellCoin('${key}',.25)">25%</button>
                  <button class="btn btn-primary col-md-2 m-1" onclick="sellCoin('${key}',.50)">50%</button>
                  <button class="btn btn-primary col-md-2 m-1" onclick="sellCoin('${key}', 1)">ALL</button>
               </div>
            </div>
         </div>
         <div class="row text-center">
            <p class="col-12 bg-info text-light rounded-sm" id="market-${key}">${key}: $0.00</p>
         </div>
      </div>`

   }
   document.getElementById('coins').innerHTML = template

   drawMarket()
}

window.setInterval(autoMine, 1000)
window.setInterval(updateMarket, 3000)
generateUpgradeButtons()
drawUpgradeButtons()
drawRates()
drawCoins()
drawRig()