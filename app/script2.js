const resizeSVG = () => {
    if(window.innerWidth >= 900) {
        document.querySelector('#remix').style.height = `auto`;
        return;
    }
    document.querySelector('#remix').style.height = 0;
    const $main = document.querySelector('main');
    const svgHeight = `${Math.min($main.offsetHeight, $main.offsetWidth)}px`;
    document.querySelector('#remix').style.height = svgHeight;
}

window.onresize = _.debounce(resizeSVG, 150);

resizeSVG();