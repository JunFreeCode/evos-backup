// routes/main.js
const express = require('express');
const router = express.Router();
const dbCtrl = require('../../controllers/dbCtrl');

//루트 실행
router.get('/', (req, res) => {
  res.render('login/login', { title: 'EVOS', layout:false });
});

//홈 이동
router.get('/home', (req, res) => {
  res.render('pages/home/home',{ subTitle : 'HOME'});
});

//DB조회
router.get('/dbList', (req, res) => {
  res.render('pages/db/dbList',{ subTitle : 'DB조회'});
});

//DB등록
router.get('/dbAdd', (req, res) => {
  res.render('pages/db/dbAdd',{ subTitle : 'DB등록' , data : ''});
});

//DB등록 상세조회 ( 실사 미등록 화면에서 조회 시 호출 )
router.get('/dbAdd/:id', async (req, res) => {
  try {
    const key = req.params.id;
    const data = await dbCtrl.getDataByKey(key);
    const rowData = data[0];
    res.render('pages/db/dbAdd', { subTitle: 'DB등록', data: rowData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//DB상세조회
router.get('/dbDetail/:id', async (req, res) => {
  try {
    const key = req.params.id;
    const data = await dbCtrl.getDataByKey(key);
    const rowData = data[0];
    res.render('pages/db/dbDetail', { subTitle: 'DB상세보기', data: rowData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//현장실사 조회
router.get('/surveyList', (req, res) => {
  res.render('pages/survey/surveyList',{ subTitle : '현장실사조회'});
});

//현장실사 미등록 조회
router.get('/surveyUnList' ,(req, res) => {
  res.render('pages/survey/surveyUnList',{ subTitle : '실사신청 미등록 조회'});
});

//실사요청조회(시공)
router.get('/surveyReqList', (req, res) => {
  res.render('pages/surveyConst/surveyReqList',{ subTitle : '실사요청조회 (시공)'});
});


//현장실사 상세 조회
router.get('/surveyDetail/:id', async (req, res) => {
  try {
    const key = req.params.id;
    const data = await dbCtrl.getDataByKey(key);
    const rowData = data[0];
    res.render('pages/survey/surveyDetail', { subTitle: '현장실사요청서 조회', data: rowData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 대메뉴: 일정관리
// router.get('/schedule/checklist', (req, res) => {
//   res.render('pages/schedule/checklist', { title: 'Checklist' });
// });

// router.get('/schedule/view', (req, res) => {
//   res.render('pages/schedule/view', { title: 'View Schedule' });
// });

// router.get('/schedule/create', (req, res) => {
//   res.render('pages/schedule/create', { title: 'Create Schedule' });
// });

// 대메뉴: DB관리
// router.get('/dbManagement/database', (req, res) => {
//   res.render('pages/dbManagement/database', { title: 'Database Management' });
// });

// router.get('/dbManagement/table', (req, res) => {
//   res.render('pages/dbManagement/table', { title: 'Table Management' });
// });

// 나머지 대메뉴와 소메뉴에 대한 경로 설정...

module.exports = router;
