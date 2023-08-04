window.addEventListener('DOMContentLoaded', event => {
     //로그인버튼 이벤트리스너
    // document.getElementById('loginButton').addEventListener('click', submitLoginForm);
});

//로그임 처리
// function submitLoginForm(){
//     console.log("로그인 함수 실행");
//     // 폼 데이터 수집
//     const form = document.getElementById('loginForm');
//     const formData = new FormData(form);
    
//     // AJAX 요청 보내기
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', '/auth/login');
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.onload = function() {
//       if (xhr.status === 200) {
//         // 로그인 성공 시 페이지 이동 등의 처리
//         console.log("성공");
//         window.location.href = '/home/home';
//       } else {
//         // 로그인 실패 시 에러 처리
//         console.log("실패");
//         console.error('Login failed:', xhr.responseText);
//       }
//     };
//     xhr.send(JSON.stringify({
//       email: formData.get('email'),
//       password: formData.get('password')
//     }));
  
//   }
