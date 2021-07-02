var btc = 0
var btcPerSecond = 0

const clickUpgrades = {
   GPU: {
      price: 100,
      change: 1,
      priceMultiplier: 0.02
   },
   RAM: {
      price: 500,
      change: 0.01 * btcPerSecond,
      priceMultiplier: 0.03
   }
}

const autoUpgrades = {
   Rig: {
      price: 800,
      change: 1,
      priceMultiplier: 0.05
   },
   Server: {
      price: 1200,
      change: 10,
      priceMultiplier: 0.07
   }
}

let purchasedUpgrades = []

function mine(coin) {
   btc += 1
   update()
}



function update() {
   drawBTC()
}

function drawBTC() {
   document.getElementById('btc-count').innerText = `BTC: ${btc}`
}

function drawButtons() {
   let clickTemplate = ''
   for (let key in clickUpgrades) {
      let btnText = key.toUpperCase()
      clickTemplate += `<button class="btn btn-secondary" onclick="upgrade('${key}')">${btnText}</button>`
   }
   document.getElementById('click-buttons').innerHTML = clickTemplate
   let autoTemplate = ''
   for (let key in autoUpgrades) {
      let btnText = key.toUpperCase()
      autoTemplate += `<button class="btn btn-secondary" onclick="upgrade('${key}')">${btnText}</button>`
   }
   document.getElementById('auto-buttons').innerHTML = autoTemplate
}

drawButtons()