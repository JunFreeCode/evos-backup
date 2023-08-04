const firebaseConfig = require('./server/config/firebase');
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const express = require('express');
const path = require('path');
const morgan = require('morgan') //log를 좀 더 상세히 보여준다.
const port = process.env.PORT || 8080;;
const app = express();


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

app.set('port',port)
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//전체 파일에 정적 파일을 제공하기 위해 public 디렉토리 설정
app.use(express.static(path.join(__dirname,'public')));

// view 경로 세팅, ejs 세팅, layout 세팅
app.set('views',path.join(__dirname,'views'))
   .set('view engine', 'ejs')
   .use(require('express-ejs-layouts'))
   .set('layout','layouts/layout')

//라우트 설정
const mainRoutes = require('./server/routes/main');
const authRoutes = require('./server/routes/auth');
const adminRoutes = require('./server/routes/admin');
const apiRoutes = require('./server/routes/api');
const bodyParser = require('body-parser');
app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

//해당 경로에서도 정적파일을 사용하기 위해 설정
app.use('/dbDetail', express.static('public'));
app.use('/dbAdd', express.static('public'));
app.use('/surveyDetail', express.static('public'));
app.use(express.static('public', { 
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));


// 미들웨어를 앱에 등록
//app.use(authMiddleware);

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 실행 중입니다. ${ port }`);
});

module.exports = app;