function extractBodyContent(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const bodyElement = tempDiv.querySelector('body');
    return bodyElement ? bodyElement.innerHTML : html;
}

export async function renderMainButton(targetElement) {
    if (!targetElement) return;
    
    const html = await fetch("src/components/main-button/main-button.html").then(function(res) { 
        return res.text(); 
    });
    
    const bodyContent = extractBodyContent(html);
    targetElement.innerHTML = bodyContent;
} 