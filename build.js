const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const viewsDirectory = path.join(__dirname, 'views');
const publicDirectory = path.join(__dirname, 'public');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function buildEjsToHtml(ejsFilePath, outputFilePath) {
  const ejsContent = fs.readFileSync(ejsFilePath, 'utf8');
  const htmlContent = ejs.render(ejsContent, { /* EJS 템플릿에 전달할 데이터 */ });
  fs.writeFileSync(outputFilePath, htmlContent, 'utf8');
}

const files = glob.sync('**/*.ejs', { cwd: viewsDirectory });
files.forEach((file) => {
  const ejsFilePath = path.join(viewsDirectory, file);
  const outputFilePath = path.join(publicDirectory, file.replace('.ejs', '.html'));

  ensureDirectoryExistence(outputFilePath);
  buildEjsToHtml(ejsFilePath, outputFilePath);
});

console.log('빌드가 완료되었습니다.');
