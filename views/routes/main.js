// routes/main.js
const express = require('express');
const router = express.Router();

//루트 실행
router.get('/', (req, res) => {
  res.render('login/login', { title: 'EVOS', layout:false });
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
