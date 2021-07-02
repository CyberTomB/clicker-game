var btc = 0
var clickRate = 1
var autoRate = 0

const upgrades = {
   GPU: {
      price: 100,
      change: 1,
      priceMultiplier: 0.02,
      owned: 0,
      type: 'click-increment'
   },
   RAM: {
      price: 500,
      change: 0.01,
      priceMultiplier: 0.03,
      owned: 0,
      type: 'click-percentage'
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
   console.log('clickrate before:', clickRate)
   if (upgrade.type == 'click-increment') {
      clickRate += upgrade.change
   } else if (upgrade.type == 'click-percentage') {
      console.log('increment expected:', upgrade.change * autoRate)
      clickRate += autoRate * upgrade.change
   }
   else {
      autoRate += upgrade.change
   }
   console.log('clickrate: ', clickRate)
   console.log('ram change: ', upgrades.RAM.change)
}


function mine(coin) {
   btc += clickRate
   console.log('clickrate: ', clickRate)
   drawBTC()
}

window.setInterval(autoMine, 1000)

function autoMine() {
   btc += autoRate
   console.log(autoRate)
   drawBTC()
}

function upgrade(item) {
   upgrades[item].owned += 1
   console.log('upgrade:', item, upgrades[item].owned)
   miningMath(item)
}

function drawBTC() {
   document.getElementById('btc-count').innerText = `BTC: ${btc}`
   document.getElementById('cpc').innerText = `Coins per Click: ${clickRate}`
   document.getElementById('cps').innerText = `Coins per Second: ${autoRate}`
}

function drawButtons() {
   let clickTemplate = ''
   let autoTemplate = ''
   for (let key in upgrades) {
      let btnText = key.toUpperCase()
      if (upgrades[key].type == 'click-increment' || upgrades[key].type == 'click-percentage') {
         clickTemplate += `<button class="btn btn-secondary" onclick="upgrade('${key}')">${btnText}</button>`
      } else { autoTemplate += `<button class="btn btn-secondary" onclick="upgrade('${key}')">${btnText}</button>` }
   }
   document.getElementById('click-buttons').innerHTML = clickTemplate
   document.getElementById('auto-buttons').innerHTML = autoTemplate
}

drawButtons()