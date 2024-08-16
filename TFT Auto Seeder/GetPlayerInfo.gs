function CreatePlayerObject(IGN) {

  var player = {
    ign:"",
    summonerId:"",
    tier:"",
    rank:"",
    lp:0
  }

  player.ign = IGN;
  player.summonerId = getSummonerId(player.ign);  
  if(player.summonerId == 'undefined' || !player.summonerId){
    player.summonerId = 'Bad IGN';
  }

  var rankData = getTFTRank(player.summonerId); 
  if(rankData !== 'undefined' && rankData){
    player.tier = rankData['tier'];
    player.rank= rankData['rank'];
    player.lp = rankData['lp'];
  }
  else{
    player.tier = 'UNRANKED';
    player.rank= 'IV';
    player.lp = 0;
  }
    
  return player;
}

// Gets a players summoner id based on their IGN
function getSummonerId(IGN) {
  try {
    var response = UrlFetchApp.fetch(`https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/`+IGN+`?api_key=${apiKey}`);
    var JSONresp = JSON.parse(response.getContentText());
    return JSONresp["id"];
  } catch (error) {
    Logger.log(error);
  }
}

// Gets a players TFT ranks based on their summoner id
function getTFTRank(SummonerId){

  var isRanked = 0; // Flag to mark a player as having a rank in the standard ranked playlist "RANKED_TFT"

  try {
    var ranking = {
    tier:"",
    rank:"",
    lp:0
    }   

    var response = UrlFetchApp.fetch(`https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/`+SummonerId+`?api_key=${apiKey}`);
    var JSONresp = JSON.parse(response.getContentText());

    if(JSONresp.length == 0){
      ranking.tier = 'UNRANKED';
      ranking.rank = 'IV';
      ranking.lp = 0;
    }else{     
      for(j=0;j<JSONresp.length;++j){
        if(JSONresp[j]["queueType"] == 'RANKED_TFT'){
          ranking.tier = JSONresp[j]["tier"];
          ranking.rank = JSONresp[j]["rank"];
          ranking.lp = JSONresp[j]["leaguePoints"];
          isRanked = 1;
        }
      }
      // If the player is ranked but not in the standard game mode
      if(isRanked == 0){
        ranking.tier = 'UNRANKED';
        ranking.rank = 'IV';
        ranking.lp = 0;
      }
    }
    return ranking;
  } 
  catch (error) {
    console.error(error);
  }
}