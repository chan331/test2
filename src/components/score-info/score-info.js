function extractBodyContent(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const bodyElement = tempDiv.querySelector("body");
    return bodyElement ? bodyElement.innerHTML : html;
}

export async function renderScoreInfo(targetElement) {
    if (!targetElement) {
        console.error("렌더링할 대상 요소(targetElement)가 유효하지 않습니다.");
        return;
    }

    try {
        const response = await fetch("src/components/score-info/score-info.html");
        
        if (!response.ok) {
            throw new Error(`HTTP 오류! 상태: ${response.status}`);
        }

        const html = await response.text();
        
        const bodyContent = extractBodyContent(html);
        
        targetElement.innerHTML = bodyContent;
        console.log("score-info.html 내용이 성공적으로 렌더링되었습니다.");

    } catch (error) {
        console.error("score-info.html 렌더링 중 오류 발생:", error);
    }
}