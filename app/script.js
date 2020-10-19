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
        this.remixSVG = document.querySelector('svg#remix');
        this.clearButton = document.querySelector('#remove-all-parts');
        this.downloadSVG = document.querySelector('#download-svg');
        this.downloadPNG = document.querySelector('#download-png');
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
        }
    }

    updateSVGDownloadURL() {
        const url = 'data:image/svg+xml,' + encodeURIComponent(this.remixSVG.outerHTML);
        this.downloadSVG.href = url;
        this.downloadSVG.download = 'remixedEmoji.svg';
    }

    bindAddPart(handler) {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-part')) {
                handler(e.target.id, e.target.dataset.partType);
            }
        });
    }

    bindRemovePart(handler) {
        document.addEventListener('click', (e) => {
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



// /* Tabs */
const tabContainer = document.getElementById('options-tabs');

const showTab = (id) => {
    const tabs = tabContainer.querySelectorAll('[role="tab"]'),
        tabPanels = tabContainer.querySelectorAll('[role="tabpanel"]'),
        selectedTab = tabContainer.querySelector(`[aria-controls="${id}"]`),
        selectedTabpanel = document.querySelector(`#${id}`);

    console.log({id, selectedTabpanel})

    tabs.forEach(tab => tab.setAttribute('aria-selected', 'false'));
    tabPanels.forEach(tabpanel => tabpanel.setAttribute('aria-expanded', 'false'));
    selectedTab.setAttribute("aria-selected", "true");
    selectedTab.focus();
    selectedTabpanel.setAttribute("aria-expanded", "true");
}

const tabContainerClickHandler = (e) => {
    e.preventDefault();
    if (e.target.getAttribute('role') !== 'tab') return;
    showTab(e.target.getAttribute('aria-controls'));
}

tabContainer.addEventListener('click', tabContainerClickHandler);