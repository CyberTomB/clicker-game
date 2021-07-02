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
      price: 100,
      change: 1,
      priceMultiplier: 0.02,
      owned: 0,
      auto: false,
      button: '',
      desc: 'Increases your base clickrate by 1'
   },
   RAM: {
      price: 500,
      change: 5,
      priceMultiplier: 0.03,
      owned: 0,
      auto: false,
      button: '',
      desc: 'Increases your base clickrate by 5.'
   },
   Rig: {
      price: 800,
      change: 1,
      priceMultiplier: 0.05,
      owned: 0,
      auto: true,
      button: '',
      desc: 'Increases your base mining rate by 1.'
   },
   Server: {
      price: 1200,
      change: 10,
      priceMultiplier: 0.07,
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
   drawCount()
   console.log('the autorate:', autoRate)
   console.log('active coin: ', activeCoin.name, 'owned: ', activeCoin.owned)
}

function clickMine(coin) {
   coins[coin].owned += clickRate * coins[coin].coinRate
   drawCount()
}

function upgrade(item) {
   upgrades[item].owned += 1
   updateRates(item)
   console.log('upgrade:', item, upgrades[item].owned)
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
      <h6>Price: ${upgrades[key].price}</h6>
      <h6>Owned: ${upgrades[key].owned}</h6>
      <p>${upgrades[key].desc}</p>
      <button type="button" class="btn btn-primary" style="max-width: 30%;" onclick="upgrade('${key}')">BUY</button>
   </div>`
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

function drawCount(coin) {
   document.getElementById('btc-count').innerText = `BTC: ${activeCoin.owned}`
}

window.setInterval(autoMine, 1000)
generateButtons()
drawButtons()