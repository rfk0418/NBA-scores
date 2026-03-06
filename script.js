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

//lat/lon of arenas
const teamLocations = {
"Atlanta Hawks":[33.7573,-84.3963],
"Boston Celtics":[42.3662,-71.0621],
"Brooklyn Nets":[40.6826,-73.9754],
"Charlotte Hornets":[35.2251,-80.8392],
"Chicago Bulls":[41.8807,-87.6742],
"Cleveland Cavaliers":[41.4965,-81.6882],
"Dallas Mavericks":[32.7905,-96.8103],
"Denver Nuggets":[39.7487,-105.0077],
"Detroit Pistons":[42.3410,-83.0550],
"Golden State Warriors":[37.7680,-122.3877],
"Houston Rockets":[29.7508,-95.3621],
"Indiana Pacers":[39.7639,-86.1555],
"Los Angeles Clippers":[34.0430,-118.2673],
"Los Angeles Lakers":[34.0430,-118.2673],
"Memphis Grizzlies":[35.1382,-90.0506],
"Miami Heat":[25.7814,-80.1870],
"Milwaukee Bucks":[43.0451,-87.9172],
"Minnesota Timberwolves":[44.9795,-93.2760],
"New Orleans Pelicans":[29.9490,-90.0821],
"New York Knicks":[40.7505,-73.9934],
"Oklahoma City Thunder":[35.4634,-97.5151],
"Orlando Magic":[28.5392,-81.3839],
"Philadelphia 76ers":[39.9012,-75.1720],
"Phoenix Suns":[33.4457,-112.0712],
"Portland Trail Blazers":[45.5316,-122.6668],
"Sacramento Kings":[38.5802,-121.4996],
"San Antonio Spurs":[29.4269,-98.4375],
"Toronto Raptors":[43.6435,-79.3791],
"Utah Jazz":[40.7683,-111.9011],
"Washington Wizards":[38.8981,-77.0209]
};

// Star player images
const starPlayers = {
  "Los Angeles Lakers": "lebron.png",
  "Denver Nuggets": "jokic.png",
  "Boston Celtics": "celtics.png",
  "Dallas Mavericks": "mavs.png"
};

// Create player icon
function playerIcon(image) {
  return L.icon({
    iconUrl: `players/${image}`,
    iconSize: [80, 80],
    iconAnchor: [40, 40],
    popupAnchor: [0, -40]
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

    const location = teamLocations[homeTeam];
    if (!location) return;

    const playerImage = starPlayers[homeTeam];
    if (!playerImage) return;

    const popup = `
      <div class="game-popup">
        <b>${visitorTeam}</b> ${game.visitor_team_score}<br>
        <b>${homeTeam}</b> ${game.home_team_score}<br><br>
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
