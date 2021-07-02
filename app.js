const coins = {
   BTC: {
      name: 'BTC',
      owned: 0,
      coinRate: 1
   },
   DOGE: {
      name: 'DOGE',
      owned: 0,
      coinRate: 10
   },
   ETH: {
      name: 'ETH',
      owned: 0,
      coinRate: 2
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
      desc: 'Increases your base clickrate by 1'
   },
   RAM: {
      price: 500,
      change: 5,
      priceMultiplier: 1.03,
      owned: 0,
      auto: false,
      button: '',
      desc: 'Increases your base clickrate by 5.'
   },
   Rig: {
      price: 800,
      change: 1,
      priceMultiplier: 1.05,
      owned: 0,
      auto: true,
      button: '',
      desc: 'Increases your base mining rate by 1.'
   },
   Server: {
      price: 1200,
      change: 10,
      priceMultiplier: 1.07,
      owned: 0,
      auto: true,
      button: '',
      desc: 'Increases your base mining rate by 10.'
   }
}

var clickRate = 1
var autoRate = 0
var activeCoin = coins.BTC

function autoMine() {
   activeCoin.owned += autoRate
   enableUpgrades()
   drawCount()
}

function clickMine(coin) {
   coins[coin].owned += clickRate * coins[coin].coinRate
   enableUpgrades()
   drawCount()
}

function clickUpgrade(item) {
   let upgrade = upgrades[item]
   activeCoin.owned -= upgrade.price
   upgrade.owned += 1
   upgrade.price *= upgrade.priceMultiplier
   upgrade.price = upgrade.price.toFixed(2)
   enableUpgrades()
   updateRates(item)
   drawUpgrade(item)
   drawRates()
   drawCount()
}

function updateRates(item) {
   if (upgrades[item].auto) {
      autoRate += upgrades[item].change
   } clickRate += upgrades[item].change
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
      if (activeCoin.owned >= upgrades[key].price) {
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

function drawCount(item) {
   document.getElementById('btc-count').innerText = `BTC: ${activeCoin.owned}`
}

function drawUpgrade(upgrade) {
   document.getElementById(`${upgrade}-price`).innerText = `Price: $${upgrades[upgrade].price}`
   document.getElementById(`${upgrade}-owned`).innerText = `Owned: ${upgrades[upgrade].owned}`
}

function drawRates() {
   document.getElementById('cpc').innerText = `Coins per Click: ${clickRate}`
   document.getElementById('cps').innerText = `Coins per Second: ${autoRate}`
}

window.setInterval(autoMine, 1000)
generateButtons()
drawButtons()
drawRates()