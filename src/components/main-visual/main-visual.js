// GSAP 전역 변수 선언
/* global gsap */

function extractBodyContent(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const bodyElement = tempDiv.querySelector('body');
    return bodyElement ? bodyElement.innerHTML : html;
}

export async function renderMainVisual(targetElement) {
    if (!targetElement) return;
    
    const html = await fetch("src/components/main-visual/main-visual.html").then(function(res) { 
        return res.text(); 
    });
    
    const bodyContent = extractBodyContent(html);
    targetElement.innerHTML = bodyContent;
    
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
            defaults: {
                opacity: 0,
                duration: 1,
                ease: "power2.out",
            },
        });

        tl.from(".main-visual__bg", {
            scale: 1.5,
            duration: 1.3,
        })
        .from(
            ".visual-img01",
            {
                x: -100,
            },
            "-=0.7"
        )
        .from(
            ".visual-img02",
            {
                x: 100,
            },
            "-=0.7"
        )
        .from(
            ".visual-text",
            {
                y: 50,
            },
            "-=0.7"
        );
    }
}

window.addEventListener("DOMContentLoaded", function () {
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
            defaults: {
                opacity: 0,
                duration: 1,
                ease: "power2.out",
            },
        });

        tl.from(".main-visual__bg", {
            scale: 1.5,
            duration: 1.3,
        })
        .from(
            ".visual-img01",
            {
                x: -100,
            },
            "-=0.7"
        )
        .from(
            ".visual-img02",
            {
                x: 100,
            },
            "-=0.7"
        )
        .from(
            ".visual-text",
            {
                y: 50,
            },
            "-=0.7"
        );
    }
});
