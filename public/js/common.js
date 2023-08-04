//공통 스크립트

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', function() {
    // 현재 URL의 경로를 가져옴
    var currentPath = window.location.pathname;
  
    // 사이드바의 각 메뉴 요소를 선택
    var menuItems = document.querySelectorAll('.nav-link');
  
    // 각 메뉴를 순회하면서 현재 URL 경로와 일치하는 메뉴를 찾고 활성화 상태로 설정
    menuItems.forEach(function(menuItem) {
      // 메뉴의 href 속성값에서 경로를 추출
      var menuPath = menuItem.getAttribute('href').split('/').pop();
  
      // 현재 URL 경로와 메뉴 경로를 비교
      if (menuPath === currentPath) {
        menuItem.classList.add('active'); // 활성화 클래스 추가
      }
    });
  });

$(document).ready(function() {
    //네비바 이벤트
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
        event.preventDefault();
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
  });


//주소 앞에 번호 추출
function extractFirstPart(address) {
    return address.split(',')[0];
}

//주소 검색
function searchAddress(){
    new daum.Postcode({
        oncomplete: function(data) {
            // Get the road address
            var roadAddress = data.roadAddress;
            // Get the jibun address
            var jibunAddress = data.jibunAddress;

            if (data.userSelectedType === 'R') {
                document.getElementById('add_1').value = data.sido;
                document.getElementById('add_2').value = data.sigungu;
                document.getElementById('add_3').value = data.roadname+" "+extractFirstPart(data.roadAddressEnglish);
            } else {
                document.getElementById('add_1').value = data.sido;;
                document.getElementById('add_2').value = data.sigungu;
                document.getElementById('add_3').value = data.roadname+" "+extractFirstPart(data.roadAddressEnglish);
            }
        }
    }).open();
};