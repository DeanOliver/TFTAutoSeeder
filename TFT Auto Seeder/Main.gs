function TFTSeeder(){

  //* Variables *//
  var activeSheet = SpreadsheetApp.getActiveSheet();
  var sheet = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  var players = [];

  // Create a player object for all the IGNs
  for(n=1;n<sheet.length;++n){
    var IGN = sheet[n][0] ; // n=row, x=column
    //* Function found in GetPlayerInfo.gs *//
    var player = CreatePlayerObject(IGN);
    players.push(player);
    Logger.log(IGN);
  }

  // Order all the players in the list by rank
  players = seedPlayers(players);
  
  // Print all the player data onto the sheet
  for(i=2;i<(players.length+2);++i){
    activeSheet.getRange(i,1).setValue([players[i-2].ign]);
    activeSheet.getRange(i,2).setValue([players[i-2].summonerId]);
    activeSheet.getRange(i,3).setValue([players[i-2].tier]);
    activeSheet.getRange(i,4).setValue([players[i-2].rank]);  
    activeSheet.getRange(i,5).setValue([players[i-2].lp]);
  }
}

function seedPlayers(players){

  players.sort((a, b) => { // Sort by LP
    return b.lp - a.lp;
  })

  players.sort((a, b) => { // Sort by rank
    return ranks[a.rank] - ranks[b.rank];
  })
  
  players.sort((a, b) => { // Sort by tier
    return tiers[b.tier] - tiers[a.tier];
  })

  return players;
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Auto Seeder')
      .addItem('Seed By IGN','TFTSeeder')
      .addToUi();
}