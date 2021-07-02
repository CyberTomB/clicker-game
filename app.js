var btc = 0
var btcPerSecond = 0
var clickRate = 1
var autoRate = 0

const upgrades = {
   GPU: {
      price: 100,
      change: 1,
      priceMultiplier: 0.02,
      owned: 0,
      type: 'click'
   },
   RAM: {
      price: 500,
      change: 0.01 * btcPerSecond,
      priceMultiplier: 0.03,
      owned: 0,
      type: 'click'
   },
   Rig: {
      price: 800,
      change: 1,
      priceMultiplier: 0.05,
      owned: 0,
      type: 'auto'
   },
   Server: {
      price: 1200,
      change: 10,
      priceMultiplier: 0.07,
      owned: 0,
      type: 'auto'
   }
}

function miningMath(item) {
   let upgrade = upgrades[item]
   console.log(upgrade)
   if (upgrade.type == 'click') {
      clickRate += upgrade.owned * upgrade.change
      console.log('upgrade change', upgrade.change)
      console.log('new clickrate', clickRate)
   }
}


function mine(coin) {
   btc += clickRate

   update()
}

function upgrade(item) {
   upgrades[item].owned += 1
   console.log('upgrade:', item, upgrades[item].owned)
   miningMath(item)
}

function update() {
   drawBTC()
}

function drawBTC() {
   document.getElementById('btc-count').innerText = `BTC: ${btc}`
}

function drawButtons() {
   let clickTemplate = ''
   let autoTemplate = ''
   for (let key in upgrades) {
      let btnText = key.toUpperCase()
      if (upgrades[key].type == 'click') {
         clickTemplate += `<button class="btn btn-secondary" onclick="upgrade('${key}')">${btnText}</button>`
      } else { autoTemplate += `<button class="btn btn-secondary" onclick="upgrade('${key}')">${btnText}</button>` }
   }
   document.getElementById('click-buttons').innerHTML = clickTemplate
   document.getElementById('auto-buttons').innerHTML = autoTemplate
}

drawButtons()