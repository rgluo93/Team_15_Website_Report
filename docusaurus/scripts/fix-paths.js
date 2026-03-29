const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../build/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

html = html.replace(/href="\/assets\//g, 'href="./assets/');
html = html.replace(/src="\/assets\//g, 'src="./assets/');

fs.writeFileSync(indexPath, html);
console.log('Fixed asset paths in build/index.html');
