var conversion = require('phantom-html-to-pdf')();
var express = require('express');
var app = express();
var fs = require('fs'),
    path = require('path');

var htmlDir = './html/';
var directories = getDirs(htmlDir);
directories.forEach(dir => {
  console.log('>>> Registering GET endpoint for /'+dir);
  app.get('/'+dir, (req, res) => {
    pipePdf(res, dir);
  });
});

app.listen(3000, () => {
  console.log('>>> Converter listening at port 3000');
});


function pipePdf(res, dir){
  var filepath = htmlDir + dir + '/index.html';
  console.log('\n>>> converting:', filepath);
  conversion({
    url: filepath,
    fitToPage: true,
    // printDelay: 1000,
    waitForJS: true,
    allowLocalFilesAccess: true,
    phantomPath: require("phantomjs-prebuilt").path
  }, (err, pdf) => {
    console.log('>>> converting + ' + filepath + ' results');
    console.log('>>> Errors:', err);
    console.log('>>> Logs:', pdf.logs);
    console.log('>>> converted + ' + filepath);
    pdf.stream.pipe(res);
  })
}

function getDirs(srcpath){
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}