// db폴더 관련 공통 스크립트

document.addEventListener("DOMContentLoaded", function () {
    const bd1 = document.getElementById("sbx_bd1");
    const bd2 = document.getElementById("sbx_bd2");

    // Define the options for each category
    const options = {
        주거시설: ["아파트 1000세대 이상", "아파트 500~1000세대", "아파트 100~500세대", "아파트 100세대 미만", "오피스텔", "기타"],
        상업시설: ["업무빌딩", "상가빌딩", "공장창고", "지식산업센터", "의료건물", "주차타워", "위락시설", "기타"],
        공공시설: ["청사업무동", "공영주차장", "대학교", "초중고교", "체육공원시설", "기타"],
    };

    // Event listener for select1
    bd1.addEventListener("change", function () {
        const selectedOption = bd1.value;
        const optionList = options[selectedOption];
        
        // Clear existing options in sbx_bd2
        bd2.innerHTML = "";

        // Add new options to sbx_bd2
        if(selectedOption != ""){
            optionList.forEach((optionText) => {
                const option = document.createElement("option");
                option.text = optionText;
                option.value = optionText;
                bd2.appendChild(option);
            });
        }
    });

    //DB등록 화면 특정일 달력생성
    $('#dateInput').datepicker({
        format: 'yyyy-mm-dd', // Korean date format
        language: 'ko', // Use Korean language
        autoclose: true,
        todayHighlight: true,
        enableOnReadonly: false
    });

    $('#surveyDate_3').on('click', function () {
        $('#dateInput').prop('disabled', !this.checked);
    });


    //DB저장 이벤트 추가
    const dbSaveBtn = document.getElementById('dbSaveBtn');
    if(dbSaveBtn){
      document.getElementById("dbSaveBtn").addEventListener("click", dbSave);
    }

    //현장실사신청 이벤트 추가
    const surveySave = document.getElementById('surveySaveBtn');
    if(surveySave){
      document.getElementById("surveySaveBtn").addEventListener("click", surveySaveBtn);
    }
    

    //실사신청 버튼 조건에 따라 disabled
    const dbNo = $('#dbNo').val();
    if(dbNo == ""){
      $('#surveySaveBtn').hide();
    }else{
      $('#surveySaveBtn').show();
      $('#dbSaveBtn').hide();
      $('#dbSurveySaveBtn').hide();

      $("#dbForm :input").prop("disabled", true);
    }

});

//DB 저장
async function dbSave(event) {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    const form = document.getElementById('dbForm');

    // 폼 유효성 검사
    // if (!form.checkValidity()) {
    //     form.reportValidity();
    //     return;
    // }

    const formData = new FormData(form);
    const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

    console.log(data);

    fetch("/api/dbSaveData", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',  // JSON 형식으로 헤더 설정
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("DB 저장이 완료되었습니다.");
          window.location.href = "/surveyUnList"; // DB만 등록하면 실사신청 미등록 페이지로 이동
        } else {
          alert("DB 저장중 오류가 발생했습니다.");
        }
      })
      .catch((error) => {
        console.error("Error during form submission:", error);
        alert("DB 저장중 오류가 발생했습니다.");
      });
  };

  //의무설치 계산식 5%,2%
  function calculatePercentages(inputElement) {
    const value = inputElement.value;
  
    if (value === '') {
      // 입력값이 비어있을 경우 기본 값인 0으로 설정
      inputElement.value = '0';
      return;
    }
  
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
      // 입력값이 숫자가 아닐 경우 처리
      inputElement.value = '';
      return;
    }
  
    // 5%, 2% 계산
    const percentage5 = numberValue * 0.05;
    const percentage2 = numberValue * 0.02;
  
     // 반올림하여 소수점 없이 정수로 표시
    const roundedPercentage5 = Math.round(percentage5);
    const roundedPercentage2 = Math.round(percentage2);
  
    // 계산된 결과를 출력
    $('#DUTY_PLOT_5').val(roundedPercentage5);
    $('#DUTY_PLOT_2').val(roundedPercentage2);

    $('#SC_5').val(roundedPercentage5);
    $('#SC_2').val(roundedPercentage2);

    //합계 구하기
    totalCalc();
  };

  //합계 구하기
  function totalCalc(){
    //total 구하기
    const totalDutyPlot5 = Number($('#DUTY_PLOT_5').val())+Number($('#SC_5').val()) + Number($('#FC_5').val());
    const totalDutyPlot2 = Number($('#DUTY_PLOT_2').val())+Number($('#SC_2').val()) + Number($('#FC_2').val());

    const totalExist = Number($('#EXIST_PLOT').val())+Number($('#EXIST_SC').val()) + Number($('#EXIST_FC').val());
    const totalChg = Number($('#CHG_PLOT').val())+Number($('#CHG_SC').val()) + Number($('#CHG_FC').val());
    const totalApply = Number($('#APPLY_PLOT').val())+Number($('#APPLY_SC').val()) + Number($('#APPLY_FC').val());

    $('#TOTAL_5').val(totalDutyPlot5);
    $('#TOTAL_2').val(totalDutyPlot2);

    $('#TOTAL_EXIST').val(totalExist);
    $('#TOTAL_CHG').val(totalChg);
    $('#TOTAL_APPLY').val(totalApply);
  };
  
  //테이블 입력 숫자 입력
  function handleNumberInput(inputElement) {
    const value = inputElement.value.trim();
  
    if (value === '') {
      // 입력값이 비어있을 경우 기본 값인 0으로 설정
      inputElement.value = '0';
      return;
    }
  
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
      // 입력값이 숫자가 아닐 경우 무시
      return;
    }
  
    // 숫자만 입력된 경우 해당 값을 그대로 유지
    inputElement.value = numberValue;

    //합계 구하기
    totalCalc();
  };
  

  //현장실사신청 저장
  function surveySaveBtn(event){
    event.preventDefault(); // 기본 폼 제출 동작 방지

    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    
    const data = {};
    formData.forEach((value, key) => {
      if (data[key]) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    fetch("/api/surveySaveData", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',  // JSON 형식으로 헤더 설정
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("DB 저장이 완료되었습니다.");
          window.location.href = "/surveyList"; //실사조회 페이지 이동
        } else {
          alert("DB 저장중 오류가 발생했습니다.");
        }
      })
      .catch((error) => {
        console.error("Error during form submission:", error);
        alert("DB 저장중 오류가 발생했습니다.");
      });

  };

  function handleDateInput(checkbox) {
    const dateInput = document.getElementById('dateInput');
    dateInput.disabled = !checkbox.checked;
  }