
let activeTextColor = '#f1f5f9';
let fonts = [];

async function init() {
    const res = await fetch('fonts.json');
    fonts = await res.json();
    
    // Load font-faces dynamically
    fonts.forEach(font => {
        const fontFace = new FontFace(font.name, `url(fonts/${font.file})`);
        fontFace.load().then(loadedFace => {
            document.fonts.add(loadedFace);
            renderCard(font);
        });
    });

    setupEvents();
}

function renderCard(font) {
    const grid = document.getElementById('fontGrid');
    const card = document.createElement('div');
    card.className = 'font-card';
    card.innerHTML = `
        <div style="font-size: 0.8rem; opacity: 0.5">${font.name}</div>
        <div class="preview-text" style="font-family: '${font.name}'; color: ${activeTextColor}">
            ${document.getElementById('textInput').value}
        </div>
        <button onclick="exportSingle('${font.name}')" style="font-size: 0.7rem; background: none; border: 1px solid #444; color: #888; cursor: pointer; padding: 5px 10px; border-radius: 5px;">خروجی سریع</button>
    `;
    grid.appendChild(card);
}

function setupEvents() {
    const input = document.getElementById('textInput');
    input.addEventListener('input', () => {
        document.querySelectorAll('.preview-text').forEach(p => {
            p.innerText = input.value;
        });
    });

    document.getElementById('btnWhiteText').addEventListener('click', () => {
        activeTextColor = '#ffffff';
        updatePreviewColors();
    });

    document.getElementById('btnBlackText').addEventListener('click', () => {
        activeTextColor = '#000000';
        updatePreviewColors();
    });

    document.getElementById('downloadAllBtn').addEventListener('click', () => {
        // Just for UX, exports the first font as example or we could loop.
        // Let's make it export the focused one or just the first.
        if(fonts.length > 0) exportSingle(fonts[0].name);
    });
}

function updatePreviewColors() {
    document.querySelectorAll('.preview-text').forEach(p => {
        p.style.color = activeTextColor;
    });
}

function exportSingle(fontName) {
    const text = document.getElementById('textInput').value || "متن خالی";
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const isTransparent = document.getElementById('transparentCheck').checked;

    ctx.font = `80px "${fontName}"`;
    const metrics = ctx.measureText(text);
    
    canvas.width = metrics.width + 100;
    canvas.height = 200;

    if (!isTransparent) {
        ctx.fillStyle = activeTextColor === '#000000' ? '#ffffff' : '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.font = `80px "${fontName}"`;
    ctx.fillStyle = activeTextColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const link = document.createElement('a');
    link.download = `${fontName}_Mehrab_Studio.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

init();
