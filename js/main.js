const API_KEY = 'UFCbK3TwksFAQpY%2Bde3UPWxkPdufR8Oj5rClzytxAsXxmzPhfh%2BBTcJQdk5Ds7r8x%2FBuUytTnuFNWLUfy2ClkA%3D%3D';
const mapDiv = document.getElementById("map");
getData = async(year,guGun) => {
  const url = `http://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle?ServiceKey=${API_KEY}&searchYearCd=${year}&siDo=48&guGun=${guGun}&type=json&numOfRows=10&pageNo=1`;
  const response = await fetch(url);
const data = await response.json();
console.log(data);

const locations = data.items.item.map((spot) =>[spot.spot_nm, spot.la_crd,spot.lo_crd])

if(data.resultCode === "00"){
drawMap(locations);
}else{
mapDiv.innerHTML = `<h2>해당 년도/지역의 사고 내역이 없습니다.</h2>`
}
}


function drawMap(locations) {
  //매개변수의 형태
  // locations: [
  //   ["지역이름",위도,경도],
  //   ['통영', 37.566585, 126.977989],
  // ]

  //맵 생성
  const map = new google.maps.Map(mapDiv, {
    zoom: 13,
    center: new google.maps.LatLng(locations[0][1], locations[0][2]),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  const infowindow = new google.maps.InfoWindow();

  let marker, i;
//로케이션별로 마크 생성
  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map,
    });

    //마크를 클릭했을 때 보여주는 정보
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

const check = document.querySelector("#check")
const year = document.querySelector("#year");
const guGun = document.querySelector("#guGun");
check.addEventListener("click", () => {
  getData(year.value,guGun.value);
})