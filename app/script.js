const debounce = require('lodash/debounce');
import './style.css';

class EmojiPart {
    constructor(type, id) {
        this.type = type;
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
        this.remixSVG = document.querySelector('svg#remix');
        this.remixWrap = document.querySelector('main');
        this.clearButton = document.querySelector('#remove-all-parts');
        this.downloadSVG = document.querySelector('#download-svg');
        this.downloadPNG = document.querySelector('#download-png');
        this.tabsContainer = document.querySelector('#options-tabs');
        this.tabs = this.tabsContainer.querySelectorAll('[role="tab"]');
        this.tabPanels = this.tabsContainer.querySelectorAll('[role="tabpanel"]');
        this.loadTabHandler();
        this.loadResizeHandler();
    }

    bindAddPart(handler) {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-part')) {
                handler(e.target.id, e.target.dataset.partType);
            }
        });
    }

    bindRemoveAllParts(handler) {
        this.clearButton.addEventListener('click', () => {
            handler();
        });
    }
    
    bindRemovePart(handler) {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-part')) {
                handler(e.target.dataset.partType);
            }
        });
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

    loadResizeHandler() {
        window.onresize = debounce(this.resizeDisplaySVG, 150);
        window.onload = () => {
            this.resizeDisplaySVG();
        }
    }
    
    loadTabHandler() {
        this.tabsContainer.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.getAttribute('role') !== 'tab') return;
            this.showTab(e.target.getAttribute('aria-controls'));
        });
    }

    resizeDisplaySVG = () => {
        if(window.innerWidth >= 900) {
            this.remixSVG.style.height = `auto`;
            return;
        }
        this.remixSVG.style.height = 0;
        const svgSize = `${Math.min(this.remixWrap.offsetHeight, this.remixWrap.offsetWidth)}px`;
        this.remixSVG.style.height = svgSize;
        this.remixSVG.style.width = svgSize;    
    }

    showTab = (id) => {
        const selectedTab = this.tabsContainer.querySelector(`[aria-controls="${id}"]`);
        const selectedTabpanel = this.tabsContainer.querySelector(`#${id}`);

        // set aria-selected and aria-expanded to false
        this.tabs.forEach(tab => tab.setAttribute('aria-selected', 'false'));
        this.tabPanels.forEach(tabpanel => tabpanel.setAttribute('aria-expanded', 'false'));

        // set aria-selected and aria-expanded to true for the selected tab and tabpanel
        selectedTab.setAttribute('aria-selected', 'true');
        selectedTab.focus();
        selectedTabpanel.setAttribute('aria-expanded', 'true');
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
        }
    }

    updateSVGDownloadURL() {
        const url = 'data:image/svg+xml,' + encodeURIComponent(this.remixSVG.outerHTML);
        this.downloadSVG.href = url;
        this.downloadSVG.download = 'remixedEmoji.svg';
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
        this.remix.addPart(new EmojiPart(partType, partID));
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