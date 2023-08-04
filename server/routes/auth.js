const firebaseConfig = require('../config/firebase');
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const express = require('express');
const router = express.Router();
//Firebase 앱 초기화
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

//로그인 전에 유효성 검사 미들웨어 넣을수있음 


//로그인 라우트
router.post('/login' , async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    // 이메일/비밀번호를 사용하여 사용자 인증
    const signInResult = await signInWithEmailAndPassword(auth, email, password);
    const token = await signInResult.user.getIdToken();
    //res.status(200).json({ token });
    res.redirect('/home');
  } catch (error) {
    console.error('Authentication failed:', error);
    res.status(401).json({ error: '로그인에 실패했습니다.' });
  }
});

router.get('/logout', (req, res) => {
  // admin.auth().signOut()
  //   .then(() => {
  //     res.redirect('/login/login');
  //   })
  //   .catch((error) => {
  //     res.redirect('/login/login', { title: 'EVOS', layout:false, error });
  //   });
});

module.exports = router;