import "./record.css";
import { renderSearchBar } from "../searchbar/search-Bar.js";
import { UserInfo } from "../userinfo/user-Info.js";
import { renderScoreInfo } from "../score-info/score-info.js";
import { renderScoreDetail } from "../score-detail/score-detail.js";
import { renderTotalStatistics } from "../total-statistics/total-statistics.js";

function extractBodyContent(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const bodyElement = tempDiv.querySelector("body");
    return bodyElement ? bodyElement.innerHTML : html;
}

export async function renderRecordPage(targetElement) {
    if (!targetElement) return;
    
    const html = await fetch("src/components/record/record.html").then(function(res) { 
        return res.text(); 
    });
    
    const bodyContent = extractBodyContent(html);
    targetElement.innerHTML = bodyContent;
    
    try {
        const searchbarSection = document.getElementById("searchbar-section");
        if (searchbarSection) {
            await renderSearchBar(searchbarSection);
        }
        
        const userInfoSection = document.getElementById("user-info-section");
        if (userInfoSection) {
            UserInfo(userInfoSection, { data: null }); 
        }

        const scoreInfoSection = document.getElementById("score-info-section");
        if (scoreInfoSection) {
            await renderScoreInfo(scoreInfoSection);
        }

        const totalStatisticsSection = document.getElementById("total-statistics-section");
        if (totalStatisticsSection) {
            await renderTotalStatistics(totalStatisticsSection);
        }
        
        const scoreDetailSection = document.getElementById("score-detail-section");
        if (scoreDetailSection) {
            await renderScoreDetail(scoreDetailSection);
        }
        
        console.log("전적 페이지 렌더링 완료");
        
    } catch (error) {
        console.error("전적 페이지 컴포넌트 렌더링 중 오류 :", error);
    }
} 