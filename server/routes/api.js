const express = require('express');
const router = express.Router();
const dbCtrl = require('../../controllers/dbCtrl');


//DB 상세조회 API
router.get('/dbData', dbCtrl.getData);

//DB저장 API
router.post('/dbSaveData', dbCtrl.dbSaveData);

//실사 미등록 데이터 조회
router.get('/fieldWorkUnData', dbCtrl.getfieldWorkUnData);

//실사등록 API
router.post('/surveySaveData', dbCtrl.surveySaveData);


module.exports = router;