window.onload = init;

// todo:
// add new columns on your % table for additional enchant maxes 

function init() {
  refreshType();
};

function refreshType() {
  let typeAvailable = Object.keys(gear);
  let s = "";
  typeAvailable.forEach((e) => {
    s += '<option value="' + e + '">' + e + '</option>\n';
  });

  let typeSelector = document.getElementById('calculator-type');
  typeSelector.innerHTML = s;

  refreshPiece();
};

function refreshPiece() {
  let gearType = document.getElementById('calculator-type').value;
  let piecesAvailable = Object.keys(gear[gearType]);
  piecesAvailable.pop();
  let s = "";
  piecesAvailable.forEach((e) => {
    s += '<option value="' + e + '">' + e + '</option>\n';
  });

  let pieceSelector = document.getElementById('calculator-piece');
  pieceSelector.innerHTML = s;  

  let typeLink = gear[gearType]['Sheet Link'];
  let link = document.getElementById('calculator-link');
  link.innerHTML = '<a href="' + typeLink + '">Detailed data</a>'

  refreshStat();
  refreshRecommended();
};

function refreshStat() {
  let gearType = document.getElementById('calculator-type').value;
  let pieceType = document.getElementById('calculator-piece').value;
  let statAvailable = Object.keys(gear[gearType][pieceType]['Stats']);
  let s = "";
  statAvailable.forEach((e) => {
    s += '<option value="' + e + '">' + e + '</option>\n';
  });

  let statSelector;
  for (let i = 1; i < 6; i++) {
    statSelector = document.getElementById('calculator-stat-' + i);
    statSelector.innerHTML = s;
    statSelector.selectedIndex = i-1;
  };

  let maxDI = gear[gearType][pieceType]["DI"];
  let statDI = document.getElementById('calculator-max-di');
  statDI.innerHTML = maxDI + "%";

  refreshTiers();
  refreshScore();
  refreshPriority();
};

function refreshTiers() {
  let gearType = document.getElementById('calculator-type').value;
  let pieceType = document.getElementById('calculator-piece').value;
  let tierType = gear[gearType][pieceType]["Type"]
  let tierEquivalence = tiers[gearType][tierType];
  let tierAvailable = Object.keys(tierEquivalence);

  let s = "<table><tr><th>Score</th><th>Tier</th><th>Single</th><th>Duo</th><th>Trio</th><th>Quad</th><th>Penta</th></tr>";
  tierAvailable.forEach((e) => {
    cT = tierEquivalence[e];
    sM = '</td><td>';
    s += '<tr><td>' + cT['Score'] + sM + e + sM + cT['Single'] + sM + cT['Duo'] + sM + cT['Trio'] + sM + cT['Quad'] + sM + cT['Penta'] + '</td></tr>\n';
  });

  s += '</table>'
  let tierTable = document.getElementById('equivalence-table');
  tierTable.innerHTML = s;


};

function refreshScore() {
  let gearType = document.getElementById('calculator-type').value;
  let pieceType = document.getElementById('calculator-piece').value;
  let tierType = gear[gearType][pieceType]["Type"]
  let tierEquivalence = tiers[gearType][tierType];
  let tierAvailable = Object.keys(tierEquivalence);

  totalDI = 0;
  // hasUtility = false;

  // utilityStats = ['Accuracy', 'Movement Speed']

  for (let i = 1; i < 6; i++) {
    let statType = document.getElementById('calculator-stat-' + i).value;
    let statValue = document.getElementById('calculator-stat-' + i + '-input').value;
    let maxValue = gear[gearType][pieceType]["Stats"][statType]["Value"];
    let maxDI = gear[gearType][pieceType]["Stats"][statType]["DI"];
    let result = statValue / maxValue * maxDI;
    totalDI += result;

    // if (utilityStats.includes(statType) & statValue / maxValue >= 0.4) {
    //   hasUtility = true;
    // };
  };

  let itemDI = parseInt(totalDI / gear[gearType][pieceType]["DI"] * 100);
  let resultPercent = document.getElementById('calculator-percent')
  resultPercent.innerHTML = 'Score: ' + itemDI + '%'
  let resultDI = document.getElementById('calculator-di');
  resultDI.innerHTML = 'Rating: ' + totalDI.toFixed(2) + '%';
  

  let finalTier = 'F';
  tierAvailable.forEach((e) => {
    if (itemDI >= parseInt(tierEquivalence[e]['Penta'])) {
      finalTier = e;
    }
  });

  let resultTier = document.getElementById('calculator-tier');
  resultTier.innerHTML = finalTier + ' tier';

  refreshValues();
};

function refreshValues() {
  let gearType = document.getElementById('calculator-type').value;
  let pieceType = document.getElementById('calculator-piece').value;

  let s = "<table><tr><th>Stat</th><th>Max Value</th><th>Your %</th><th>Your Rating</th><th>Max Rating</th></tr>\n";
  for (let i = 1; i < 6; i++) {
    let statType = document.getElementById('calculator-stat-' + i).value;
    let statValue = document.getElementById('calculator-stat-' + i + '-input').value;
    let maxValue = gear[gearType][pieceType]["Stats"][statType]["Value"];
    let maxDI = gear[gearType][pieceType]["Stats"][statType]["DI"];
    let currPerc = statValue / maxValue;
    let currDI = currPerc * maxDI;

    let sM = '</td><td>';
    let addVal = i === 5 & (gearType === 'Armor' | gearType === 'Accessories (7k)') ? 0.8 : 1;
    s += '<tr><td>' + statType + sM + maxValue + sM + parseInt(currPerc * 100) + '%' + sM + currDI.toFixed(2) + '%' + sM + (maxDI * addVal).toFixed(2) + '%' + '</td></tr>';
  };

  s += '</table>';

  if (pieceType === "Earrings") {
    s += '<br><span class="text-note"><span style="color: red;"><strong>Note:</strong></span> Defense Penetration is no longer a recommended stat as damage gain from going from 98 to 99 is lower than the damage gained from other stats</span>'
  }

  let valueTable = document.getElementById('calculator-values');
  valueTable.innerHTML = s;
};

function refreshPriority() {
  let gearType = document.getElementById('calculator-type').value;
  let pieceType = document.getElementById('calculator-piece').value;

  let pieceStats = gear[gearType][pieceType]['Stats'];
  let pieceStatsOrdered = [];
  Object.keys(pieceStats).forEach((e) => {
    pieceStatsOrdered.push({'Stat': e, 'DI': pieceStats[e]['DI'], 'Value': pieceStats[e]['Value']});
  });

  pieceStatsOrdered.sort((a,b) => {
    return b['DI'] - a['DI'];
  });

  let s = "<table><tr><th>Stat</th><th>Max Value</th><th>Max Rating</th></tr>\n";
  let sM = '</td><td>';
  pieceStatsOrdered.forEach((e) => {
    s += '<tr><td>' + e['Stat'] + sM + e['Value'] + sM + e['DI'].toFixed(2) + '%' + '</td></tr>';
  });

  s += '</table>';

  let priorityTable = document.getElementById('priority-enchant');
  priorityTable.innerHTML = s;
};

function refreshRecommended() {
  let gearType = document.getElementById('calculator-type').value;
  let piecesAvailable = Object.keys(gear[gearType]);
  piecesAvailable.pop();
  let statsList = [];
  piecesAvailable.forEach((e) => {
    let recommendedStats = Object.keys(gear[gearType][e]['Stats']).slice(0,5);
    statsList.push(recommendedStats);
  })

  
  let s = "<table><tr>";
  let sM = '</td><td>';
  piecesAvailable.forEach((e) => {
    s += '<th>' + e + '</th>';
  })
  s += '</tr>';
  for(i = 0; i < 5; i++){
    s += '<tr><td>'
    for(j = 0; j < statsList.length; j++){
      s += statsList[j][i]
      if (j+1 !== statsList.length) {
        s += sM
      }
    }
    s += '</td></tr>'
  };
  s += '</table>';

  let recommendedTable = document.getElementById('priority-best');
  recommendedTable.innerHTML = s;
};

function updateValues(enchants, value) {
  let gearType = document.getElementById('calculator-type').value;
  let pieceType = document.getElementById('calculator-piece').value;

  for (let i = 1; i < 6; i++) {
    let statType = document.getElementById('calculator-stat-' + i).value;
    let statValue = document.getElementById('calculator-stat-' + i + '-input');
    let maxValue = gear[gearType][pieceType]["Stats"][statType]["Value"];

    if (enchants >= i) {
      statValue.value = ['Normal Amp', 'Boss Amp', 'Cooldown Reduction'].includes(statType) ? (value * maxValue / 100).toFixed(2) : parseInt(value * maxValue / 100);
    } else {
      statValue.value = "";
    };
  }

  refreshScore();
};

// function increaseTier(currentTier) {
//   if (currentTier === 'SSS') {
//     return 'SSS';
//   };

//   let tiers = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
//   let newTier = tiers[tiers.indexOf(currentTier) + 1];

//   return newTier;
// };