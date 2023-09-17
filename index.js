let selectedBuilding;
let selectedType;
let closestParkingLot;
let schoolCoords;
let shortestPathCoords;
let lotCoords;
let map;


const el = document.getElementById('submitButton')
if (el) {
  el.addEventListener('click', () => {
  submitBuilding();
});
}


function submitBuilding() {
    selectedBuilding = document.getElementById('building').value;

    console.log(selectedBuilding)
    // Call the function to calculate the closest parking lot
    selectedType = document.getElementById('ptype').value;

    closestParkingLot = closestLot(selectedBuilding, selectedType);

    console.log(selectedType)
    
    
    schoolCoords = convertToCoordinatesArray(schoolBuildings, selectedBuilding);
    lotCoords = convertToCoordinatesArray(parkingLots, closestParkingLot);
    //console.log(schoolCoords)
    //console.log(lotCoords)
    shortestPathCoords = schoolCoords.concat(lotCoords);
    //console.log(shortestPathCoords)

    const building = document.getElementById('building').value;
    const messageContainer = document.getElementById('message-container');


    // Clear any previous messages
    messageContainer.innerHTML = '';

    // Display "You selected" message
    const selectedMessage = document.createElement('div');
    selectedMessage.textContent = 'You selected: ' + building;
    messageContainer.appendChild(selectedMessage);


    // Display "Closest parking lot" message
    const closestLotMessage = document.createElement('div');
    closestLotMessage.textContent = 'Closest parking lot: ' + closestParkingLot;
    messageContainer.appendChild(closestLotMessage);
    const closestLotDistance = document.createElement('div');
    const kmLot = distance(schoolBuildings[selectedBuilding], parkingLots[closestParkingLot]);
    closestLotDistance.textContent = document.textContent = 'The distance to the closest parking lot is ' + kmLot + " meters";
    messageContainer.appendChild(closestLotDistance);

    
    async function initMap() {
      // The location of Uluru
      const position = { lat: 28.062245, lng: -82.414488 };
      // Request needed libraries.
      //@ts-ignore
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    
      let shortest = shortestPathCoords;
      let destBuilding = shortestPathCoords[0];
      let destLot = shortestPathCoords[1];
    
      //console.log(shortestPathCoords);
      // The map, centered at the building chosen
      map = new Map(document.getElementById("map"), {
        zoom: 17,
        center: destBuilding,
        mapId: "da9ab423a6a694ad",
      });
    
      const shortestPath = new google.maps.Polyline({
        path: shortest,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      shortestPath.setMap(map);
      // The marker, positioned at the building
      const building = new AdvancedMarkerElement({
        map: map,
        position: destBuilding,
        title: "Your selected building",
      });
    
      const parkLot = new AdvancedMarkerElement({
        map: map,
        position: destLot,
        title: "Your closest parking lot",
      });
    }
    
    initMap();
}
function closestLot(selectedBuilding, parkType) {
  const buildingCoords = schoolBuildings[selectedBuilding];

  // Initialize variables for minimum distance and closest parking lot
  let minDistance = Number.MAX_VALUE;
  let closestParkingLot = null;
  // Iterate through each parking lot
  for (const parkingLot in parkingLots) {
    const parkingLotCoords = parkingLots[parkingLot];
    const parkingLotType = parkingTypes[parkingLot];
    console.log(parkingLotType)
    console.log(parkType)
    if (parkingLotType.includes(parkType)){
      const distance = calculateAbsoluteDistance(buildingCoords, parkingLotCoords);
      // Update closest parking lot if this is closer
      if (distance < minDistance) {
        minDistance = distance;
        closestParkingLot = parkingLot;
    }
  }
  }

  return closestParkingLot;
}

function calculateAbsoluteDistance(coord1, coord2) {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;


  const latDiff = Math.abs(lat2 - lat1);
  const lonDiff = Math.abs(lon2 - lon1);
  const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

  return distance;
}

function distance(coords1, coords2) {
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  // Convert latitude and longitude from degrees to radians
  const toRadians = (angle) => (angle * Math.PI) / 180;
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);

  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Radius of the Earth in kilometers. Use 6371 for kilometers or 3956 for miles.
  const r = 6371;

  // Calculate the distance
  const result = Math.round((c * r) * 1000);

  return result;
}



let schoolBuildings = {
  LIB: [28.05966092951325, -82.4122310359583],
  CPR: [28.059698800505984, -82.4108362872735],
  HON: [28.05967986500878, -82.40936107231508],
  EDU: [28.06104794592928, -82.41090602470449],
  FAO: [28.06162073589354, -82.41017109943485],
  HMS: [28.061014809239904, -82.40926987720538],
  SOC: [28.06157339799344, -82.40903384281255],
  CWY: [28.061445585568666, -82.40817553592959],
  PED: [28.061294103979545, -82.40774638248811],
  ULH: [28.060652671764768, -82.40981436563344],
  BSN: [28.058529527435805, -82.40910894466444],
  CIS: [28.05873781992311, -82.41135127139748],
  CMC: [28.059807679542182, -82.41483814311925],
  CHE: [28.061330905423873, -82.41541559758608],
  ISA: [28.061222027915914, -82.4142890698001],
  ENA: [28.060026143455524, -82.41582396390845],
  ALN: [28.06142972344702, -82.41313639047705],
  UTA: [28.057536196981406, -82.41734246729034],
  UTB: [28.057256892477206, -82.41856957791207],
  MUS: [28.06465111633467, -82.41827721713977],
  PCD: [28.063827457163416, -82.41857762455216],
  MDN: [28.065133948071903, -82.42379183887476],
  FAS: [28.064000050788547, -82.41646455601649],
  MHC: [28.0688805160034, -82.42280311885362],
  FAD: [28.06380538445486, -82.41624495348667],
  FAH: [28.063252347662303, -82.41666005767208],
  MDF: [28.066615546588434, -82.41960935767209],
  MDT: [28.068392947782815, -82.41898519129361],
  TAR: [28.06418852024751, -82.41453275581432],
  BSF: [28.06086361274942, -82.41443306920387],
  NES: [28.062582128685207, -82.41537375749874],
  CPH: [28.067946075079316, -82.42506880353001],
  MDC: [28.063821944541544, -82.42349548465585],
  MDL: [28.06414364629538, -82.42469150404742],
};

let parkingLots = {
  'Collins Boulevard Parking Facility': [28.061667502605076, -82.41199599579342],
  'Lot 1': [28.060726658388486, -82.41212474182589],
  'Lot 10': [28.064432146561465, -82.41965688772964],
  'Lot 11': [28.06743798172685, -82.41275288170685],
  'Lot 16': [28.06880123041488, -82.41113819188418],
  'Lot 17A': [28.063693350867837, -82.41003401430676],
  'Lot 17B': [28.063570274667036, -82.4091542497894],
  'Lot 18': [28.060862903992806, -82.40238346165317],
  'Lot 19': [28.062188365983662, -82.42017053056922],
  'Lot 2A': [28.060226873269087, -82.41456499266785],
  'Lot 20': [28.067371712246416, -82.41421200341219],
  'Lot 21': [28.062263958056963, -82.40814166148357],
  'Lot 22A': [28.059221438624782, -82.40800671230812],
  'Lot 22D': [28.058047426402638, -82.40797452577782],
  'Lot 22E': [28.057829664666823, -82.40662269245789],
  'Lot 22F': [28.05796221534115, -82.40587167394682],
  'Lot 23B': [28.0563994088016, -82.40828901539409],
  'Lot 25': [28.067892399880904, -82.4084023386806],
  'Lot 26': [28.068649759188183, -82.40809656685822],
  'Lot 29A': [28.057948013501775, -82.41215877237748],
  'Lot 29B': [28.058776451618975, -82.4121265858667],
  'Lot 3A': [28.064531553480467, -82.41451241081825],
  'Lot 3B': [28.06450788517475, -82.41512395453108],
  'Lot 3C': [28.064503151513183, -82.41571404048783],
  'Lot 3D': [28.06456942275985, -82.41654016087146],
  'Lot 32': [28.06346174089841, -82.42248930049767],
  'Lot 32A': [28.05635606277018, -82.40926818916995],
  'Lot 32B': [28.056285052439716, -82.40832941605692],
  'Lot 33': [28.065214381736986, -82.42299489621738],
  'Lot 33T': [28.057290543504767, -82.41211198116154],
  'Lot 36': [28.05789120607968, -82.41093032067222],
  'Lot 37': [28.062263958064037, -82.40945594390261],
  'Lot 4': [28.065270001976636, -82.41453386848477],
  'Lot 41': [28.060526653974485, -82.40918772300448],
  'Lot 43': [28.068455686341597, -82.41569660613494],
  'Lot 44': [28.067376445761113, -82.41509176796762],
  'Lot 46': [28.063390735264278, -82.41970516748977],
  'Lot 47': [28.05974808307225, -82.42065332834797],
  'Lot 47A': [28.059028532258658, -82.41943024109214],
  'Lot 5A': [28.06419546306284, -82.41221107547173],
  'Lot 52': [28.06846515333057, -82.40560211246228],
  'Lot 6': [28.060976517837076, -82.40635424129825],
  'Lot 7A': [28.062311295657228, -82.41099284962317],
  'Lot 7B': [28.061690727919203, -82.41084448997373],
  'Lot 8A': [28.06036969773568, -82.41711647764127],
  'Lot 8B': [28.059796901120574, -82.4170199181191],
  'Lot 8C': [28.058069025071124, -82.41433234475188],
  'Lot 9C': [28.0655776873411, -82.41848744459868]
};

let parkingTypes = {
  'Collins Boulevard Parking Facility': 'GZ, S',
  'Lot 1': 'E',
  'Lot 10': 'S',
  'Lot 11': 'E',
  'Lot 16': 'R',
  'Lot 17A': 'R',
  'Lot 17B': 'R,S',
  'Lot 18': 'D,E,GZ,HE,R,S,Y',
  'Lot 19': 'D,E,HE,S',
  'Lot 2A': 'GZ2',
  'Lot 20': 'E,R,S',
  'Lot 21': 'E,S',
  'Lot 22A': 'D,E,S',
  'Lot 22D': 'D,E,S',
  'Lot 22E': 'D,E,S',
  'Lot 22F': 'D,E,S',
  'Lot 23B': 'D,E',
  'Lot 25': 'R',
  'Lot 26': 'E',
  'Lot 29A': 'S',
  'Lot 29B': 'S',
  'Lot 3A': 'E',
  'Lot 3B': 'D,E,S',
  'Lot 3C': 'E,S',
  'Lot 3D': 'E,S',
  'Lot 32': 'E,S',
  'Lot 32A': 'E,S',
  'Lot 32B': 'E,S',
  'Lot 33': 'GZ, AG',
  'Lot 33T': 'E',
  'Lot 36': 'GZ',
  'Lot 37': 'E',
  'Lot 4': 'E',
  'Lot 41': 'E',
  'Lot 43': 'E',
  'Lot 44': 'E',
  'Lot 46': 'E,HE',
  'Lot 47': 'D,E,R,S',
  'Lot 47A': 'R',
  'Lot 5A': 'R',
  'Lot 52': 'R',
  'Lot 6': 'D,E,S',
  'Lot 7A': 'E',
  'Lot 7B': 'D,E',
  'Lot 8A': 'E',
  'Lot 8B': 'D,E',
  'Lot 8C': 'E,S',
  'Lot 9C': 'D,E,GZ,R,S,Y'
};

function convertToCoordinatesArray(dict, key) {
  const coordinatesArray = [];
  const [lat, lng] = dict[key];
  coordinatesArray.push({ lat, lng });
  return coordinatesArray;
}

/*
selectedBuilding = "ENA"
closestParkingLot = "lot8A"
schoolCoords = convertToCoordinatesArray(schoolBuildings, selectedBuilding);
lotCoords = convertToCoordinatesArray(parkingLots, closestParkingLot);
    console.log(schoolCoords)
    console.log(lotCoords)
    shortestPathCoords = schoolCoords.concat(lotCoords);
    console.log(shortestPathCoords)
*/























