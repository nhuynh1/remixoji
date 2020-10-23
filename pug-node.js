const pug = require('pug');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const emojiParts = require('./app/emojiparts.json');

const FILE_PATH = './app/emojiparts/';

const updatedEmojiParts = emojiParts.map((part) => {
    const partDescriptor = part.filename.split('.')[0];
    const xml = fs.readFileSync(`${FILE_PATH}${part.filename}`);
    const dom = new JSDOM(xml);
    const childNodes = dom.window.document.querySelector('svg').childNodes;
    let childNodesText = [];

    childNodes.forEach(node => {
        childNodesText.push(node.outerHTML)
    });

    const newXML = childNodesText.join('');
    return {xml: newXML, index: partDescriptor, part: part.part};
}).reduce((sortedParts, part) => {
    sortedParts[part.part] = sortedParts[part.part] ? [...sortedParts[part.part], part] : [part];
    return sortedParts;
}, {})

const compiledFn = pug.compileFile('./app/template.pug');
const html = compiledFn({ updatedEmojiParts: Object.entries(updatedEmojiParts) });

fs.writeFile('./public/index.html', html, function (error) {
    if (error) {
        return console.error(error);
    }
    console.log("File written successfully");
});