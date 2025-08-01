import { renderMainVisual } from "../main-visual/main-visual.js";
import { renderTeamIntroduction } from "../team-introduction/team-introduction.js";
import { renderConvention } from "../convention/convention.js";
import { renderMainButton } from "../main-button/main-button.js";

function extractBodyContent(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const bodyElement = tempDiv.querySelector("body");
    return bodyElement ? bodyElement.innerHTML : html;
}

async function loadGSAP() {
    if (typeof gsap === "undefined") {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js";
            script.onload = () => resolve();
            document.head.appendChild(script);
        });
    }
    return Promise.resolve();
}

export async function renderHomePage(targetElement) {
    if (!targetElement) return;
    
    await loadGSAP();
    
    const html = await fetch("src/components/home/home.html").then(function(res) { 
        return res.text(); 
    });
    
    const bodyContent = extractBodyContent(html);
    targetElement.innerHTML = bodyContent;
    
    try {
        const mainVisualSection = document.getElementById("main-visual-section");
        if (mainVisualSection) {
            await renderMainVisual(mainVisualSection);
        }
        
        const teamIntroSection = document.getElementById("team-introduction-section");
        if (teamIntroSection) {
            await renderTeamIntroduction(teamIntroSection);
        }
        
        const conventionSection = document.getElementById("convention-section");
        if (conventionSection) {
            await renderConvention(conventionSection);
        }
        
        const mainButtonSection = document.getElementById("main-button-section");
        if (mainButtonSection) {
            await renderMainButton(mainButtonSection);
        }
        
    } catch (error) {
        console.error("홈페이지 컴포넌트 렌더링 중 오류 :", error);
    }
} 