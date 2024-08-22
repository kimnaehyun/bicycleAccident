const API_KEY = 'UFCbK3TwksFAQpY%2Bde3UPWxkPdufR8Oj5rClzytxAsXxmzPhfh%2BBTcJQdk5Ds7r8x%2FBuUytTnuFNWLUfy2ClkA%3D%3D';
const mapDiv = document.getElementById("map");
let map;

function initMap() {
  // 초기 지도를 생성하고 현재 위치로 설정
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // 현재 위치로 지도 초기화
        map = new google.maps.Map(mapDiv, {
          zoom: 13,
          center: pos,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        new google.maps.Marker({
          position: pos,
          map: map,
          title: '현재 위치',
        });
      },
      () => {
        handleLocationError(true);
      }
    );
  } else {
    // Geolocation이 지원되지 않을 때
    handleLocationError(false);
  }
}

function handleLocationError(browserHasGeolocation) {
  const defaultPos = { lat: 37.5665, lng: 126.9780 }; // 서울 시청
  map = new google.maps.Map(mapDiv, {
    zoom: 13,
    center: defaultPos,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  console.error(browserHasGeolocation
    ? 'Error: The Geolocation service failed.'
    : 'Error: Your browser doesn\'t support geolocation.');
}

async function getData(year, guGun) {
  const url = `https://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle?ServiceKey=${API_KEY}&searchYearCd=${year}&siDo=48&guGun=${guGun}&type=json&numOfRows=10&pageNo=1`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  const locations = data.items.item.map((spot) => [spot.spot_nm, spot.la_crd, spot.lo_crd]);

  if (data.resultCode === "00") {
    drawMap(locations);
  } else {
    mapDiv.innerHTML = `<h2>해당 년도/지역의 사고 내역이 없습니다.</h2>`;
  }
}

function drawMap(locations) {
  // 사용자가 선택한 위치로 지도 초기화
  map.setCenter(new google.maps.LatLng(locations[0][1], locations[0][2]));

  const infowindow = new google.maps.InfoWindow();

  let marker, i;
  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map,
    });

    google.maps.event.addListener(
      marker,
      "click",
      (function (marker, i) {
        return function () {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        };
      })(marker, i)
    );
  }
}

const check = document.querySelector("#check");
const year = document.querySelector("#year");
const guGun = document.querySelector("#guGun");
check.addEventListener("click", () => {
  getData(year.value, guGun.value);
});
