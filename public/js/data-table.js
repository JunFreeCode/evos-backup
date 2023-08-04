/*
 *  데이터 테이블 공통 스크립트
 */

$(document).ready(function(){
        //테이블데이터 언어설정
        var lang_kor = {
            "emptyTable": "데이터가 없습니다",
            "info": "_START_ - _END_ / _TOTAL_",
            "infoEmpty": "0 - 0 / 0",
            "infoFiltered": "(총 _MAX_ 개)",
            "infoThousands": ",",
            "lengthMenu": "페이지 줄수 _MENU_",
            "loadingRecords": "읽는중...",
            "processing": "처리중...",
            "search": "에서 검색:",
            "zeroRecords": "검색 결과가 없습니다",
            "paginate": {
                "first": "처음",
                "last": "마지막",
                "next": "다음",
                "previous": "이전",
                
            },
            "select":{
                "rows":{
                    "_":"%d 개의 행이 선택됨",
                    "0":"",
                    "1":"1 개의 행이 선택됨"
                }
            },
            //"info":"총 _TOTAL_ 개의 항목 중 _START_부터 _END_까지 표시"
        };

        dbList(lang_kor);  //DB조회
        surveyList(lang_kor);  //실사조회
        surveyReqList(lang_kor);  //실사요청조회
        surveyUnList(lang_kor); //실사신청 미등록조회
});


//DB조회 데이터 테이블
function dbList(lang_kor){
    //DB조회 화면 데이터 테이블
    var dbscreen = document.getElementById('dbList_Table');
    if(dbscreen){
        //반응형에서 pc사이즈로 변경시 사이즈 복구
        $(window).on('resize', function() {
            var table = $('#DB_dataTable').DataTable();
            table.responsive.recalc();
            table.columns.adjust();
        });

        //초기화 및 설정
        $('#dbList_Table').DataTable().destroy();
        var table = $('#dbList_Table').DataTable({
            "ajax": {  //ajax로 데이터 조회
                "url": "/api/dbData",
                "contentType": "application/json",
                "type": "GET",
                "data": function ( d ) {
                return JSON.stringify( d );
                }
            },
            columns:[
            { data : 'PART' , title: '소속_1', width: '5%', defaultContent: "" },
            { data : 'BD_1' , title: '건물종류_1', width: '10%' , defaultContent: ""  },
            { data : 'BD_2' , title: '건물종류_2', width: '10%'  , defaultContent: "" },
            { data : 'BD_NAME' , title: '건물이름', width: '20%', defaultContent: "" ,
                    render : function(data, type, row){   // 특정 컬럼 변경방법 (a링크,input 등등)
                        if(type == 'display'){
                            data = '<a href="/dbDetail/' + row.key + '">'+data+'</a>';
                        }
                        return data;
                    }
                    },
            { data : 'P_LOT' , title: '총주차면', width: '8%' , defaultContent: ""},
            { data : 'ADD_1' , title: '주소_1', width: '8%' , defaultContent: ""},
            { data : 'ADD_2' , title: '주소_2', width: '10%' , defaultContent: ""},
            { data : 'ADD_3' , title: '상세주소', width: '15%' , defaultContent: ""},
            { data : 'APPLY_STATE' , title: '실사상태', width: '10%' , defaultContent: ""},
            { data : 'CONT_STATE' , title: '계약진행상태', width: '10%' , defaultContent: ""},
            { data : 'EGR_STATE' , title: '시공진행상태', width: '10%', defaultContent: "" },
            { data : 'DB_DATE' , title: 'DB등록일', width: '8%' , defaultContent: ""},
            ],
            language: lang_kor,  //언어 변경
            buttons: [  //버튼명 변경
                {
                    extend: 'colvis',
                    text: '컬럼 필터링',
                    className: 'buttons-colvis'
                },
                {
                    extend: 'csvHtml5',
                    text: 'Export CSV',
                    charset: 'UTF-8',   //한글설정
                    bom: true,
                    className: 'buttons-csv'
                }
            ],
            responsive: true,  //반응형
            dom: 'Bfrtip',  //버튼 세팅
            autoWidth: false,
            select:true,  //셀 선택
            "lengthMenu": [20], // 페이지당 행 수 옵션 설정
            "order":[[11, "desc"]] // index열 기준 내림차순
        });
        
        //버튼 class 제거
        $('.dt-button').removeClass('dt-button');

        /* Column별 검색기능 추가 */
        $('#dbList_Table_filter').prepend('<select id="select" class="dataTable-select"></select>');
        $('#dbList_Table > thead > tr').children().each(function (indexInArray, valueOfElement) {
            $('#select').append('<option>'+valueOfElement.innerHTML+'</option>');
        });

        $('.dataTables_filter input').unbind().bind('keyup', function () {
            var colIndex = document.querySelector('#select').selectedIndex;
            table.column(colIndex).search(this.value).draw();
        });       

    };
}


//현장실사화면 데이터테이블 생성
function surveyList(lang_kor) {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);  //모바일 사이즈 적용

    var surveyList_Table = document.getElementById('surveyList_Table');
    if(surveyList_Table){
         //반응형에서 pc사이즈로 변경시 사이즈 복구
         $(window).on('resize', function() {
            var table = $('#surveyList_Table').DataTable();
            table.responsive.recalc();
            table.columns.adjust();
        });

        //초기화 및 설정
        $('#surveyList_Table').DataTable().destroy();
        var table = $('#surveyList_Table').DataTable({
            "ajax": {  //ajax로 데이터 조회
                "url": "/api/dbData",
                "contentType": "application/json",
                "type": "GET",
                "data": function ( d ) {
                return JSON.stringify( d );
                }
            },
            columns:[
                { data : 'NAME' , title: '이름', width: '5%' , defaultContent: ""},
                { data : 'APPLY_DATE' , title: '현장실사<br>신청일', width: '6%' , defaultContent: ""},
                { data : 'APPLY_STATE' , title: '현장실사<br>상태', width: '6%' , defaultContent: ""},
                { data : 'APPLY_DUE_DAY' , title: '실사예정일', width: '6%' , defaultContent: ""},
                { data : 'BD_1' , title: '건물종류_1', width: '6%' , defaultContent: ""},
                { data : 'BD_NAME' , title: '건물이름', width: '15%', defaultContent: "",
                            render : function(data, type, row){   // 특정 컬럼 변경방법 (a링크,input 등등)
                                if(type == 'display'){
                                    data = '<a href="/surveyDetail/' + row.key + '">'+data+'</a>';
                                }
                                return data;
                            }
                        },
                { data : 'P_LOT' , title: '총주차면', width: '5%' , defaultContent: ""},
                { data : 'ADD_1' , title: '주소_1', width: '3%' , defaultContent: ""},
                { data : 'ADD_2' , title: '주소_2', width: '4%' , defaultContent: ""},
                { data : 'ADD_3' , title: '상세주소', width: '8%' , defaultContent: ""},
                { data : 'BD_PERSON_1' , title: '건물담당자_1<br>이름', width: '3%' , defaultContent: ""},
                { data : 'BD_PH_1' , title: '건물담당자_1<br>연락처', width: '6%' , defaultContent: ""},
                { data : 'APPLY_FC' , title: '실사요청<br>급속충전기', width: '5%' , defaultContent: ""},
                { data : 'APPLY_SC' , title: '실사요청<br>완속충전기', width: '5%' , defaultContent: ""},
                { data : 'APPLY_NAME' , title: '실사담당자', width: '5%' , defaultContent: ""},
                { data : 'APPLY_RESULT_1' , title: '1차실사<br>결과', width: '5%' , defaultContent: ""},
                { data : 'ADD_COST_1' , title: '추가비용', width: '5%' , defaultContent: ""},
                { data : 'COST_WAY_1' , title: '비용처리안', width: '5%' , defaultContent: ""},
                { data : 'COST_RESULT_1' , title: '최종비용', width: '5%' , defaultContent: "" },
            ],
            language: lang_kor,  //언어 변경
            buttons: [  //버튼명 변경
                {
                    extend: 'colvis',
                    text: '컬럼 필터링',
                    className: 'buttons-colvis'
                },
                {
                    extend: 'csvHtml5',
                    text: 'Export CSV',
                    charset: 'UTF-8',   //한글설정
                    bom: true,
                    className: 'buttons-csv'
                }
            ],
            scrollX: !isMobile,
            responsive: isMobile ? true : false,  //반응형
            dom: 'Bfrtip',  //버튼 세팅
            autoWidth: false,
            select:true,  //셀 선택
            "lengthMenu": [20], // 페이지당 행 수 옵션 설정
            "order":[[3, "desc"]], // index열 기준 내림차순
            
        });
        
        //버튼 class 제거
        $('.dt-button').removeClass('dt-button');

        /* Column별 검색기능 추가 */
        $('#surveyList_Table_filter').prepend('<select id="select" class="dataTable-select"></select>');
        $('#surveyList_Table > thead > tr').children().each(function (indexInArray, valueOfElement) {
            $('#select').append('<option>'+valueOfElement.innerHTML+'</option>');
        });

        //기존 검색기능은 unbind 시킨다.
        $('.dataTables_filter input').unbind().bind('keyup', function () {
            var colIndex = document.querySelector('#select').selectedIndex;
            table.column(colIndex).search(this.value).draw();
        });   
    }
};


// 실사요청조회 (시공)
function surveyReqList(lang_kor){
    //실사요청조회 테이블 생성
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);  //모바일 사이즈 적용
    var surveyReqList_Table = document.getElementById('surveyReqList_Table');
    if(surveyReqList_Table){
         //반응형에서 pc사이즈로 변경시 사이즈 복구
         $(window).on('resize', function() {
            var table = $('#surveyReqList_Table').DataTable();
            table.responsive.recalc();
            table.columns.adjust();
        });

        //초기화 및 설정
        $('#surveyReqList_Table').DataTable().destroy();
        var table = $('#surveyReqList_Table').DataTable({
            "ajax": {  //ajax로 데이터 조회
                "url": "/api/dbData",
                "contentType": "application/json",
                "type": "GET",
                "data": function ( d ) {
                return JSON.stringify( d );
                }
            },
            columns:[
                { data : 'NAME' , title: '이름', width: '5%' , defaultContent: ""},
                { data : 'APPLY_DATE' , title: '현장실사<br>신청일', width: '6%' , defaultContent: ""},
                { data : 'APPLY_STATE' , title: '현장실사<br>상태', width: '6%', defaultContent: "" },
                { data : 'APPLY_DUE_DAY' , title: '실사예정일', width: '6%', defaultContent: ""},
                { data : 'BD_1' , title: '건물종류_1', width: '6%' , defaultContent: ""},
                { data : 'BD_NAME' , title: '건물이름', width: '15%', defaultContent: "",
                            render : function(data, type, row){   // 특정 컬럼 변경방법 (a링크,input 등등)
                                if(type == 'display'){
                                    data = '<a href="#">'+data+'</a>';
                                }
                                return data;
                            }
                        },
                { data : 'P_LOT' , title: '총주차면', width: '5%' , defaultContent: ""},
                { data : 'ADD_1' , title: '주소_1', width: '3%' , defaultContent: ""},
                { data : 'ADD_2' , title: '주소_2', width: '4%' , defaultContent: ""},
                { data : 'ADD_3' , title: '상세주소', width: '8%' , defaultContent: ""},
                { data : 'BD_PERSON_1' , title: '건물담당자_1<br>이름', width: '3%' , defaultContent: ""},
                { data : 'BD_PH_1' , title: '건물담당자_1<br>연락처', width: '6%' , defaultContent: ""},
                { data : 'APPLY_FC' , title: '실사요청<br>급속충전기', width: '5%' , defaultContent: ""},
                { data : 'APPLY_SC' , title: '실사요청<br>완속충전기', width: '5%' , defaultContent: ""},
                { data : 'APPLY_NAME' , title: '실사담당자', width: '5%' , defaultContent: ""},
                { data : 'APPLY_RESULT_1' , title: '1차실사<br>결과', width: '5%' , defaultContent: ""},
                { data : 'ADD_COST_1' , title: '추가비용', width: '5%' , defaultContent: ""
                        // render: function(data, type, row) {
                        //     if (type === 'display') {
                        //     var result = row['APPLY_RESULT_1'];
                        //     var cost = row['ADD_COST_1'];
                        //     cost = cost.trim().replace(/-/g, '');
                        //     if (result == '무상' && (cost === '')) {
                        //         data = '<button class="btn btn-primary btn-sm" onClick="addFieldReport();">실사보고서 입력</button>';
                        //     } else {
                        //         data = '<a href="#">' + data + '</a>';
                        //     }
                        //     }
                        //     return data;
                        // }
                },
                { data : 'COST_WAY_1' , title: '비용처리안', width: '5%' , defaultContent: ""},
                { data : 'COST_RESULT_1' , title: '최종비용', width: '5%' , defaultContent: ""},
                { data : null , title: '실사보고서입력', width:'5%' , defaultContent: "",
                        render: function(data, type, row) {
                            if (type === 'display') {
                            data = '<button class="btn btn-primary btn-sm" onClick="addFieldReport();">실사보고서 입력</button>';
                            return data;
                        }
                        return null;
                    }
                }
            ],
            language: lang_kor,  //언어 변경
            buttons: [  //버튼명 변경
                {
                    extend: 'colvis',
                    text: '컬럼 필터링',
                    className: 'buttons-colvis'
                },
                {
                    extend: 'csvHtml5',
                    text: 'Export CSV',
                    charset: 'UTF-8',   //한글설정
                    bom: true,
                    className: 'buttons-csv'
                }
            ],
            scrollX: !isMobile,
            responsive: isMobile ? true : false,  //반응형
            dom: 'Bfrtip',  //버튼 세팅
            autoWidth: false,
            select:true,  //셀 선택
            "lengthMenu": [20], // 페이지당 행 수 옵션 설정
            "order":[[3, "desc"]], // index열 기준 내림차순
            
        });
        
        // 실사보고서 입력 버튼이 있는 셀 선택 방지
        $('#surveyReqList_Table tbody').on('click', 'button.btn', function(e) {
            e.stopPropagation();
        });

        //버튼 class 제거
        $('.dt-button').removeClass('dt-button');

        /* Column별 검색기능 추가 */
        $('#surveyReqList_Table_filter').prepend('<select id="select" class="dataTable-select"></select>');
        $('#surveyReqList_Table > thead > tr').children().each(function (indexInArray, valueOfElement) {
            $('#select').append('<option>'+valueOfElement.innerHTML+'</option>');
        });

        //기존 검색기능은 unbind 시킨다.
        $('.dataTables_filter input').unbind().bind('keyup', function () {
            var colIndex = document.querySelector('#select').selectedIndex;
            table.column(colIndex).search(this.value).draw();
        });   
    }
};

//실사신청 미등록 조회 테이블
function surveyUnList(lang_kor){
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);  //모바일 사이즈 적용
    var surveyUnList_Table = document.getElementById('surveyUnList_Table');
    if(surveyUnList_Table){
         //반응형에서 pc사이즈로 변경시 사이즈 복구
         $(window).on('resize', function() {
            var table = $('#surveyUnList_Table').DataTable();
            table.responsive.recalc();
            table.columns.adjust();
        });

        //초기화 및 설정
        $('#surveyUnList_Table').DataTable().destroy();
        var table = $('#surveyUnList_Table').DataTable({
            "ajax": {  //ajax로 데이터 조회
                "url": "/api/fieldWorkUnData",
                "contentType": "application/json",
                "type": "GET",
                "data": function ( d ) {
                return JSON.stringify( d );
                }
            },
            columns:[
                { data : 'PART' , title: '소속', width: '5%' , defaultContent: ""},
                { data : 'DB_DATE' , title: 'DB등록일', width: '8%' , defaultContent: ""},
                { data : 'BD_1' , title: '건물종류_1', width: '8%' , defaultContent: ""},
                { data : 'BD_2' , title: '건물종류_2', width: '10%' , defaultContent: ""},
                { data : 'BD_NAME' , title: '건물이름', width: '15%', defaultContent: "",
                            render : function(data, type, row){   // 특정 컬럼 변경방법 (a링크,input 등등)
                                if(type == 'display'){
                                    data = '<a href="#">'+data+'</a>';
                                }
                                return data;
                            }
                        },
                { data : 'ADD_1' , title: '주소_1', width: '3%' , defaultContent: ""},
                { data : 'ADD_2' , title: '주소_2', width: '4%' , defaultContent: ""},
                { data : 'ADD_3' , title: '상세주소', width: '8%' , defaultContent: ""},
                { data : null , title: '실사신청', width:'5%' , height:'2%', defaultContent: "",
                        render: function(data, type, row) {
                            if (type === 'display') {
                            data = '<a href="/dbAdd/' + row.key + '">'+'실사신청'+'</a>';
                        }
                        return data;
                    }
                }
            ],
            language: lang_kor,  //언어 변경
            buttons: [  //버튼명 변경
                {
                    extend: 'colvis',
                    text: '컬럼 필터링',
                    className: 'buttons-colvis'
                },
                {
                    extend: 'csvHtml5',
                    text: 'Export CSV',
                    charset: 'UTF-8',   //한글설정
                    bom: true,
                    className: 'buttons-csv'
                }
            ],
            scrollX: !isMobile,
            responsive: isMobile ? true : false,  //반응형
            dom: 'Bfrtip',  //버튼 세팅
            autoWidth: false,
            select:true,  //셀 선택
            "lengthMenu": [20], // 페이지당 행 수 옵션 설정
            "order":[[3, "desc"]], // index열 기준 내림차순
            
        });
        
        // 실사보고서 입력 버튼이 있는 셀 선택 방지
        $('#surveyUnList_Table tbody').on('click', 'button.btn', function(e) {
            e.stopPropagation();
        });

        //버튼 class 제거
        $('.dt-button').removeClass('dt-button');

        /* Column별 검색기능 추가 */
        $('#surveyUnList_Table_filter').prepend('<select id="select" class="dataTable-select"></select>');
        $('#surveyUnList_Table > thead > tr').children().each(function (indexInArray, valueOfElement) {
            $('#select').append('<option>'+valueOfElement.innerHTML+'</option>');
        });

        //기존 검색기능은 unbind 시킨다.
        $('.dataTables_filter input').unbind().bind('keyup', function () {
            var colIndex = document.querySelector('#select').selectedIndex;
            table.column(colIndex).search(this.value).draw();
        });   
    };
};