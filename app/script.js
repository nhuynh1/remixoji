class EmojiPart {
    constructor(type, src, id) {
        this.type = type;
        this.src = src;
        this.id = id;
    }
}

class Remix {
    constructor() {
        this.emoji = new Map();
        this.emoji.set('face', undefined);
        this.emoji.set('eyes', undefined);
        this.emoji.set('mouth', undefined);
        this.emoji.set('extras', undefined);
    }

    addPart(part) {
        this.emoji.set(part.type, part.id);
    }

    removePart(partType) {
        this.emoji.set(partType, '');
    }

    removeAllParts() {
        this.emoji.forEach((value, key) => {
            this.emoji.set(key, undefined);
        });
    }
}

class View {
    constructor() {
        this.app = document.querySelector('.remix-wrap');
        this.remixSVG = this.app.querySelector('svg#remix');
        this.clearButton = document.querySelector('#remove-all-parts');
        this.downloadSVG = document.querySelector('#download-svg');
        this.downloadPNG = document.querySelector('#download-png');
        this.downloadButton = document.querySelector('#download-btn')
    }

    displayRemix(remix) {
        // remove all nodes from the remixSVG
        while (this.remixSVG.lastChild) {
            this.remixSVG.lastChild.remove();
        }

        // append nodes to the remixSVG
        remix.emoji.forEach((partName, partType) => {
            if (partName) {
                const svg = document.querySelector(`[data-part="${partName}"]`);
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                svg.childNodes.forEach(node => {
                    if (node.nodeType !== Node.TEXT_NODE) {
                        group.append(node.cloneNode(true));
                    }
                });
                this.remixSVG.append(group);
            }
        });
    }

    updatePNGDownloadURL() {
        const fileType = 'png';
        const svgString = (new XMLSerializer()).serializeToString(this.remixSVG);
        const svgEncode = btoa(svgString);

        const img = new Image(800, 800);
        img.src = 'data:image/svg+xml;base64,' + svgEncode;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = 1080;
            canvas.height = 1080;

            ctx.drawImage(img, 
                (canvas.width - img.width) / 2, 
                (canvas.height - img.height) / 2, 
                img.width, 
                img.height);

            this.downloadPNG.href = canvas.toDataURL();
            this.downloadPNG.download = `remixedEmoji.${fileType}`;
            this.downloadButton.href = canvas.toDataURL();
            this.downloadButton.download = `remixedEmoji.${fileType}`;
        }
    }

    updateSVGDownloadURL() {
        const url = 'data:image/svg+xml,' + encodeURIComponent(this.remixSVG.outerHTML);
        this.downloadSVG.href = url;
        this.downloadSVG.download = 'remixedEmoji.svg';
    }

    bindAddPart(handler) {
        this.app.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-part')) {
                handler(e.target.id, e.target.dataset.partType);
            }
        });
    }

    bindRemovePart(handler) {
        this.app.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-part')) {
                handler(e.target.dataset.partType);
            }
        });
    }

    bindRemoveAllParts(handler) {
        this.clearButton.addEventListener('click', () => {
            handler();
        });
    }

}

class App {
    constructor(remix, view) {
        this.remix = remix;
        this.view = view;
        this.view.bindAddPart(this.handleAddPart);
        this.view.bindRemovePart(this.handleRemovePart);
        this.view.bindRemoveAllParts(this.handleRemoveAllParts);
    }

    handleAddPart = (partID, partType) => {
        this.remix.addPart(new EmojiPart(partType, '', partID));
        this.updateView();
    }

    handleRemovePart = (partType) => {
        this.remix.removePart(partType);
        this.updateView();
    }

    handleRemoveAllParts = () => {
        this.remix.removeAllParts();
        this.updateView();
    }

    updateView = () => {
        this.view.displayRemix(this.remix);
        this.view.updateSVGDownloadURL();
        this.view.updatePNGDownloadURL();
    }
}

const app = new App(new Remix(), new View());

/* Template */
// const optionsCategoryTemplate = (category) => {
//     let div = document.createElement('div'),
//         h2 = document.createElement('h2');
//     div.classList.add('category');
//     //    h2.textContent = category;
//     //    div.appendChild(h2);
//     return div;
// }

// const clearPartButton = (partType) => {
//     let button = document.createElement('button');
//     button.textContent = `Remove ${partType}`;
//     button.classList.add('clear');
//     button.dataset.partType = partType;
//     return button;
// }

// const tabsTemplate = (category) => {
//     let li = document.createElement('li');
//     li.setAttribute('role', 'tab');
//     li.setAttribute('tabindex', '0');
//     li.textContent = category;
//     return li;
// }

// const tabsListTemplate = () => {
//     let ul = document.createElement('ul');
//     ul.setAttribute('aria-controls', 'options-tabs');
//     ul.setAttribute('role', 'tablist');
//     return ul;
// }

// /* Functions */

// const empty = (parent) => {
//     while (parent.lastChild) parent.lastChild.remove();
// }


// const createURI = (remixSVG) => 'data:image/svg+xml,' + encodeURIComponent(remixSVG.outerHTML);

// const removePartType = (remixSVG, partType) => {
//     const partToRemove = remixSVG.querySelector(`[data-part-type="${partType}"]`);
//     if (partToRemove) remixSVG.removeChild(partToRemove);
// }

// const textToShapes = async (text, svg = true) => {
//     const parser = new DOMParser(),
//         xml = parser.parseFromString(text, 'image/svg+xml');
//     return svg ? xml.querySelector('svg') :
//         xml.querySelector('svg').childNodes;
// }

// const getShapeData = async ({ src, partType }) => {
//     try {
//         let response = await fetch(src);
//         let text = await response.text();
//         let shapesNodeList = await textToShapes(text, false);
//         return { src, shapesNodeList, partType };
//     }
//     catch (e) {
//         console.error(e);
//         return false;
//     }
// }

// const insertShapeNode = ({ shapesNodeList, partType }) => {
//     if (!shapesNodeList) return;
//     removePartType(remixSVG, partType);

//     const g = Array.from(shapesNodeList).reduce((g, node) => {
//         g.appendChild(node);
//         return g;
//     }, document.createElementNS('http://www.w3.org/2000/svg', 'g'));

//     g.dataset.partType = partType;

//     if (partType === "face") {
//         remixSVG.insertBefore(g, remixSVG.firstElementChild);
//     } else {
//         remixSVG.appendChild(g);
//     }
// }

// const loadEmoji = ({ src, partType }) => {
//     getShapeData({ src, partType })
//         .then(insertShapeNode);
// }

// const randomizeParts = (partsByCategoryObj) => {
//     const categories = Object.keys(partsByCategoryObj);
//     const randomParts = categories.map(category => {
//         let categoryArray = partsByCategoryObj[category];
//         let randomIndex = Math.floor(Math.random() * categoryArray.length);
//         return categoryArray[randomIndex];
//     });

//     return randomParts;
// }


// const domain = './';
// const imageFolder = 'emojiparts/';
// const url = domain + 'emojiparts.json';
// const optionsMain = document.querySelector('.options');
// const remixSVG = document.querySelector('#remix');
// const optionsTabs = document.querySelector('#options-tabs');
// const randomButtonContainer = document.querySelector('.randomize');

// let partsByCategoryObj;

// const showRandomEmoji = () => {
//     const randomParts = randomizeParts(partsByCategoryObj);
//     randomParts.forEach(part => loadEmoji({ src: domain + imageFolder + part.filename, partType: part.part }));
//     randomButtonContainer.style.visibility = 'hidden';
// }


// const fetchParts = async (url) => {
//     let response = await fetch(url);
//     return await response.json();
// }
// const categorizeParts = async (json) => {
//     const parts = [...json];
//     const categorizedObj = parts.reduce((categorized, part) => {
//         categorized[part.part] = categorized[part.part] ?
//             [...categorized[part.part], part] :
//             [part];
//         return categorized;
//     }, {});
//     console.log(categorizedObj)
//     return categorizedObj;
// }
// const insertPartsAsImage = async (partsByCategory) => {
//     const categories = Object.keys(partsByCategory);

//     const tabList = tabsListTemplate();



//     categories.forEach((category, index) => {
//         const parts = partsByCategory[category];

//         // dynamically create the tabs here
//         const tab = tabsTemplate(category);
//         tab.setAttribute('aria-controls', `options-tabs_${index}`);
//         tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

//         const categoryDiv = optionsCategoryTemplate(category);
//         categoryDiv.id = `options-tabs_${index}`;
//         categoryDiv.setAttribute('role', 'tabpanel');
//         categoryDiv.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');

//         const fragment = parts.reduce((fragment, part) => {
//             const img = new Image;
//             img.src = `${domain}${imageFolder}${part.filename}`;
//             img.dataset.partType = part.part;
//             fragment.appendChild(img);
//             return fragment;
//         }, document.createDocumentFragment());

//         fragment.insertBefore(clearPartButton(category), fragment.firstElementChild)
//         categoryDiv.appendChild(fragment);
//         optionsMain.appendChild(categoryDiv);

//         tabList.appendChild(tab);
//     });

//     optionsTabs.insertBefore(tabList, optionsMain);
//     return partsByCategory;
// }

// const enableRandomization = (partsByCategory) => {
//     partsByCategoryObj = partsByCategory;
//     const randomizeButton = document.createElement('button');
//     //    randomizeButton.textContent = 'Randomize';
//     randomizeButton.setAttribute('onclick', 'showRandomEmoji()');
//     randomButtonContainer.appendChild(randomizeButton);
// }

// fetchParts(url)
//     .then(categorizeParts)
//     .then(insertPartsAsImage)
//     .then(enableRandomization);


// const clearSVG = () => {
//     //    removeAllChildren(remixSVG);
//     empty(remixSVG);
//     randomButtonContainer.style.visibility = 'visible';
// }

// const clearButtonClickHandler = (e) => {
//     const partType = e.target.dataset.partType;
//     removePartType(remixSVG, partType);
// }

// const emojiPartsClickHandler = (e) => {
//     const selectedPart = e.target,
//         selectedPartTag = selectedPart.tagName;
//     switch (selectedPartTag) {
//         case 'IMG':
//             randomButtonContainer.style.visibility = 'hidden';
//             const src = selectedPart.src,
//                 partType = selectedPart.dataset.partType;
//             loadEmoji({ src, partType });
//             break;
//         case 'BUTTON':
//             clearButtonClickHandler(e);
//             break;
//         default:
//             return;
//     }
// }



// optionsMain.addEventListener('click', emojiPartsClickHandler);

/* Downloads */
// https://stackoverflow.com/questions/53188714/convert-svg-to-png-jpeg-with-custom-width-and-height
// https://stackoverflow.com/questions/28226677/save-inline-svg-as-jpeg-png-svg

// const downloadRaster = (fileType = "png") => {
//     const svgString = (new XMLSerializer()).serializeToString(remixSVG);
//     const svgEncode = btoa(svgString);

//     const img = new Image();
//     img.width = 800;
//     img.height = 800;
//     img.src = 'data:image/svg+xml;base64,' + svgEncode;

//     img.onload = () => {


//         const canvas = document.createElement('canvas'),
//             ctx = canvas.getContext('2d');

//         canvas.width = 1080;
//         canvas.height = 1080;

//         if (['jpeg', 'jpg'].includes(fileType)) {
//             ctx.fillStyle = 'white';
//             ctx.fillRect(0, 0, canvas.width, canvas.height);
//         }

//         ctx.drawImage(img, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2, img.width, img.height);

//         //      ctx.drawImage(img, 0, 0, 1080, 1080, 0, 0, 100, 100);

//         let link;
//         switch (fileType) {
//             case 'png':
//                 link = canvas.toDataURL();
//                 break;
//             case 'jpg':
//                 link = canvas.toDataURL('image/jpeg', 1.0);
//                 break;
//             case 'jpeg':
//                 link = canvas.toDataURL('image/jpeg', 1.0);
//                 break;
//             default:
//                 console.log(`${fileType} is not a supported option`);
//         }

//         const a = document.createElement('a');
//         a.href = link;
//         a.download = `remixedEmoji.${fileType}`;
//         a.style.display = 'none';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//     }
// }

// const downloadSVG = () => {
//     const svgURI = createURI(remixSVG);
//     const a = document.createElement('a');
//     a.href = svgURI;
//     a.download = 'remixedEmoji.svg';
//     a.style.display = 'none';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
// }

// /* Tabs */
// const tabContainer = document.getElementById('options-tabs');

// const showTab = (id) => {
//     const tabs = tabContainer.querySelectorAll('[role="tab"]'),
//         tabPanels = tabContainer.querySelectorAll('[role="tabpanel"]'),
//         selectedTab = tabContainer.querySelector(`[aria-controls="${id}"]`),
//         selectedTabpanel = tabContainer.querySelector(`#${id}`);

//     tabs.forEach(tab => tab.setAttribute('aria-selected', 'false'));
//     tabPanels.forEach(tabpanel => tabpanel.setAttribute('aria-expanded', 'false'));
//     selectedTab.setAttribute("aria-selected", "true");
//     selectedTab.focus();
//     selectedTabpanel.setAttribute("aria-expanded", "true");
// }

// const tabContainerClickHandler = (e) => {
//     e.preventDefault();
//     if (e.target.getAttribute('role') !== 'tab') return;
//     showTab(e.target.getAttribute('aria-controls'));
// }

// tabContainer.addEventListener('click', tabContainerClickHandler);


// /* Download dropdown */
// const downloadFile = () => {
//     console.log('download');
// }

const downloadExtras = document.getElementById('download-extras');
const downloadExtrasButton = document.getElementById('download-extras-btn');

downloadExtrasButton.addEventListener('click', (e) => {
    e.stopPropagation();

    const closeDownloadExtras = (e) => {
        downloadExtras.classList.remove('open');
        document.body.removeEventListener('click', closeDownloadExtras);
    }
    if (downloadExtras.classList.contains('open')) {
        downloadExtras.classList.remove('open');
        document.body.removeEventListener('click', closeDownloadExtras);
    }
    else {
        downloadExtras.classList.add('open');
        document.body.addEventListener('click', closeDownloadExtras);
    }
});



// /* SVG Drag */
// let selectedPart, offset, transform;

// const getMousePosition = ({ clientX, clientY }) => {
//     const CTM = remixSVG.getScreenCTM();
//     return { x: (clientX - CTM.e) / CTM.a, y: (clientY - CTM.f) / CTM.d }
// }

// const mouseDownHandler = (e) => {
//     if (e.target.matches('svg')) return;

//     selectedPart = e.target.parentElement.matches('g') ?
//         e.target.parentElement : e.target;
//     offset = getMousePosition(e);

//     const transforms = selectedPart.transform.baseVal;
//     if (transforms.length === 0 ||
//         transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
//         const translate = remixSVG.createSVGTransform();
//         translate.setTranslate(0, 0);
//         selectedPart.transform.baseVal.insertItemBefore(translate, 0);
//     }

//     transform = transforms.getItem(0);
//     offset.x -= transform.matrix.e;
//     offset.y -= transform.matrix.f;
// }

// const mouseMoveHandler = (e) => {
//     if (selectedPart) {
//         e.preventDefault();
//         const coords = getMousePosition(e);
//         transform.setTranslate(coords.x - offset.x, coords.y - offset.y);
//     }
// }

// const mouseUpHandler = (e) => {
//     selectedPart = undefined;
// }




// remixSVG.addEventListener('mousedown', mouseDownHandler);
// remixSVG.addEventListener('mousemove', mouseMoveHandler);
// remixSVG.addEventListener('mouseup', mouseUpHandler);