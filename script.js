const API_KEY = "bf7b52a8-b4de-40bf-bf89-0b4fc699306c";

// Initial map view
const initialView = {
  center: [39.5, -98.35],
  zoom: 4
};

const map = L.map("map").setView(initialView.center, initialView.zoom);

// Dark map
L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
{
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);


// Star player images
const starPlayers = {
  "Los Angeles Lakers": "lebron.png",
  "Denver Nuggets": "jokic.png",
  "Boston Celtics": "yay.png",
  "Charlotte Hornets": "lamelo.pnyg",
  "New York Knicks": "brunson.png",
  "San Antonio Spurs": "wemby.png",
  "Portland Trail Blazers": "dame.png",
  "Houston Rockets": "kd.png",
  "Phoenix Suns": "booker.png",
  "New Orleans Pelicans": "zion.png",
  "Miami Heat": "bam.png",
  "LA Clippers": "kawhi.png",
  "Indiana Pacers": "haliburton.png",
  "Minnesota Timberwolves": "ant.png",
  "Oklahoma City Thunder": "sga.png",
  "Cleveland Cavaliers": "mitch.png",
  "Brooklyn Nets": "porterjr.png",
  "Memphis Grizzlies": "ja.png",
  "Philadelphia 76ers": "maxey.png",
  "Utah Jazz": "markkanen.png",
  "Milwaukee Bucks": "giannis.png",
  "Chicago Bulls": "giddey.png",
  "Toronto Raptors": "barnes.png",
  "Golden State Warriors": "curry.png"
  
};


// Create player icon
function playerIcon(image) {
  return L.icon({
    iconUrl: `players/${image}`,
    iconSize: [80, 80],         // same as CSS width/height
    iconAnchor: [40, 40],       // center the icon
    popupAnchor: [0, -40],
    className: "player-icon"    // connects CSS class
  });
}


// Reset view button
const resetControl = L.control({ position: "topright" });

resetControl.onAdd = function () {

  const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");

  div.innerHTML = "⤺";

  div.style.width = "30px";
  div.style.height = "30px";
  div.style.lineHeight = "30px";
  div.style.textAlign = "center";
  div.style.background = "white";
  div.style.cursor = "pointer";
  div.style.fontSize = "18px";

  div.onclick = () => {
    map.setView(initialView.center, initialView.zoom);
  };

  return div;
};

resetControl.addTo(map);


// Fetch games
async function getGames() {

  const today = new Date().toLocaleDateString("en-CA");

  const response = await fetch(
    `https://api.balldontlie.io/v1/games?dates[]=${today}`,
    {
      headers: { Authorization: API_KEY }
    }
  );

  const data = await response.json();

  displayGames(data.data);
}


// Display markers
function displayGames(games) {

  games.forEach(game => {

    const homeTeam = game.home_team.full_name;
    const visitorTeam = game.visitor_team.full_name;

    const homeScore = game.home_team_score;
    const visitorScore = game.visitor_team_score;

    // Determine which team is leading
    let leadingTeam;

    if (homeScore > visitorScore) {
      leadingTeam = homeTeam;
    } else if (visitorScore > homeScore) {
      leadingTeam = visitorTeam;
    } else {
      leadingTeam = homeTeam; // if tied, default to home team
    }

    const location = teamLocations[homeTeam];
    if (!location) return;

    const playerImage = starPlayers[leadingTeam];
    if (!playerImage) return;

    const popup = `
      <div class="game-popup">
        <b>${visitorTeam}</b> ${visitorScore}<br>
        <b>${homeTeam}</b> ${homeScore}<br><br>
        Status: ${game.status}
      </div>
    `;

    L.marker(location, {
      icon: playerIcon(playerImage)
    })
    .addTo(map)
    .bindPopup(popup);

  });

}


getGames();


// Refresh every minute
setInterval(() => {
  location.reload();
}, 60000);
