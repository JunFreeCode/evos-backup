const express = require('express');
const path = require('path');
const morgan = require('morgan') //log를 좀 더 상세히 보여준다.
const port = process.env.PORT || 8080;;
const app = express();
app.set('port',port)
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//정적 파일을 제공하기 위해 public 디렉토리 설정
 app.use(express.static(path.join(__dirname,'public')));

// view 경로 세팅, ejs 세팅, layout 세팅
app.set('views',path.join(__dirname,'views'))
   .set('view engine', 'ejs')
   .use(require('express-ejs-layouts'))
   .set('layout','layouts/layout');

//라우트 설정
const mainRoutes = require('./views/routes/main');
const authRoutes = require('./views/routes/auth');
const adminRoutes = require('./views/routes/admin');
app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);



// 서버 시작
app.listen(port, () => {
  console.log(`서버가 실행 중입니다. ${ port }`);
});