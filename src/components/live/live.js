const CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_NAVER_CLIENT_SECRET;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_OPEN_API_KEY;

const THUMBNAIL_TYPES_TO_TRY = ["1080", "720"];

window.tryNextThumbnailType = function(imgElement) {
    const originalUrlPattern = imgElement.dataset.originalUrlPattern;
    let currentIndex = parseInt(imgElement.dataset.currentIndex || "-1");

    currentIndex++;

    if (currentIndex < THUMBNAIL_TYPES_TO_TRY.length) {
        const nextType = THUMBNAIL_TYPES_TO_TRY[currentIndex];
        const newSrc = originalUrlPattern.replace("{type}", nextType);
        
        imgElement.dataset.currentIndex = currentIndex;
        imgElement.src = newSrc;
    } else {
        imgElement.onerror = null;
    }
};

async function fetchLiveList(size = 20, next = null) {
    try {
        let url = `/api/chzzk/lives?size=${size}`;
        if (next) {
            url += `&next=${next}`;
        }

        const headers = {
            "Client-Id": CLIENT_ID,
            "Client-Secret": CLIENT_SECRET,
            "Content-Type": "application/json"
        };

        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        const data = await response.json(); 
        
        if (!response.ok) { 
            throw new Error(`HTTP 요청 실패 : ${response.status} - ${data.message || response.statusText}`);
        }

        if (data.code && data.code !== 200) {
            throw new Error(`API 내부 오류 : ${data.code} - ${data.message || "알 수 없는 오류"}`);
        }

        return data.content;
    } catch (error) {
        console.error("치지직 라이브 목록 조회 중 오류 발생 :", error); 
        return null;
    }
}

async function fetchYoutubeLiveList(query, maxResults = 10) {
    try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&eventType=live&key=${YOUTUBE_API_KEY}&maxResults=${maxResults}`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchResponse.ok) {
            throw new Error(`YouTube Search API 요청 실패 : ${searchResponse.status} - ${searchData.error?.message || searchResponse.statusText}`);
        }

        const videoIds = searchData.items.map(function(item) { return item.id.videoId; }).filter(function(id) { return id; });
        
        if (videoIds.length === 0) {
            return []; 
        }

        const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${videoIds.join(",")}&key=${YOUTUBE_API_KEY}`;
        const videoDetailsResponse = await fetch(videoDetailsUrl);
        const videoDetailsData = await videoDetailsResponse.json();

        if (!videoDetailsResponse.ok) {
            throw new Error(`YouTube Videos API 요청 실패 : ${videoDetailsResponse.status} - ${videoDetailsData.error?.message || videoDetailsResponse.statusText}`);
        }

        const channelsToFetch = new Set();
        videoDetailsData.items.forEach(function(video) {
            channelsToFetch.add(video.snippet.channelId);
        });

        const channelIds = Array.from(channelsToFetch).filter(function(id) { return id; });
        let channelDetails = {};
        if (channelIds.length > 0) {
            const channelDetailsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds.join(",")}&key=${YOUTUBE_API_KEY}`;
            const channelDetailsResponse = await fetch(channelDetailsUrl);
            const channelDetailsData = await channelDetailsResponse.json();

            if (!channelDetailsResponse.ok) {
                console.warn(`YouTube Channels API 요청 실패 (채널 이미지) : ${channelDetailsResponse.status} - ${channelDetailsData.error?.message || channelDetailsResponse.statusText}`);
            } else {
                channelDetailsData.items.forEach(function(channel) {
                    channelDetails[channel.id] = channel.snippet.thumbnails.default.url;
                });
            }
        }
        
        return videoDetailsData.items.map(function(video) {
            return {
                platform: "youtube", 
                liveTitle: video.snippet.title,
                liveThumbnailImageUrl: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
                channelId: video.snippet.channelId,
                channelName: video.snippet.channelTitle,
                channelImageUrl: channelDetails[video.snippet.channelId] || "https://via.placeholder.com/30", 
                concurrentUserCount: video.liveStreamingDetails?.concurrentViewers || 0, 
                liveStreamUrl: `https://www.youtube.com/watch?v=${video.id}`
            };
        });

    } catch (error) {
        console.error("유튜브 라이브 목록 조회 중 오류 발생 :", error); 
        return null;
    }
}

function createLiveBox(liveData) {
    let thumbnailUrl = liveData.liveThumbnailImageUrl;
    let originalPatternForRetry = "";

    if (liveData.platform !== "youtube" && thumbnailUrl && thumbnailUrl.includes("{type}")) {
        originalPatternForRetry = thumbnailUrl;
        thumbnailUrl = thumbnailUrl.replace("{type}", THUMBNAIL_TYPES_TO_TRY[0]); 
    } 
    
    const liveStreamUrl = liveData.liveStreamUrl; 

    const thumbnailClass = liveData.platform === "youtube" ? "live-box__thumbnail youtube-thumbnail" : "live-box__thumbnail";

    return `
        <a href="${liveStreamUrl}" target="_blank" rel="noopener noreferrer" class="live-box">
            <img 
                class="${thumbnailClass}"
                src="${thumbnailUrl}" 
                alt=""
                ${originalPatternForRetry ? `onerror="window.tryNextThumbnailType(this);" data-original-url-pattern="${originalPatternForRetry}" data-current-type-index="0"` : ""}
            />
            <div class="live-box__title">
                <span class="live-box__title__mark">${liveData.platform === "youtube" ? "LIVE" : "Live"}</span>
                <p class="live-box__title__text">${liveData.liveTitle}</p>
            </div>
            <div class="live-box__profile-box">
                <img class="live-box__profile-box__image" src="${liveData.channelImageUrl}" alt=""/>
                <p class="live-box__profile-box__nickname">${liveData.channelName}</p>
                <p class="live-box__profile-box__viewers">${liveData.concurrentUserCount === 0 ? "시청 정보 없음" : `${liveData.concurrentUserCount}명 시청중`}</p>
            </div>
            <div class="live-box__overlay">
                <p class="live-box__overlay-text">방송 시청하기</p>
            </div>
        </a>
    `;
}

function renderLiveList(containerSelector, liveDataArray) {
    const liveContainer = document.querySelector(containerSelector);
    
    if (!liveContainer) {
        console.error(`${containerSelector} DOM 할당 실패`);
        return;
    }

    liveContainer.innerHTML = "";

    liveDataArray.forEach(function(liveData) {
        liveContainer.innerHTML += createLiveBox(liveData);
    });
}

async function initializeLiveList() {
    const chzzkLiveContainer = document.querySelector(".live-container");
    const youtubeLiveContainer = document.querySelector(".youtube-live-container"); 

    if (!chzzkLiveContainer || !youtubeLiveContainer) { 
        console.error("하나 이상의 라이브 컨테이너 요소를 찾을 수 없습니다. HTML을 확인해주세요.");
        return;
    }
    
    chzzkLiveContainer.innerHTML = `
        <div class="live-status-wrapper">
            <p>치지직 라이브 방송을 가져오는 중...</p>
        </div>`; 
    youtubeLiveContainer.innerHTML = `
        <div class="live-status-wrapper">
            <p>유튜브 라이브 방송을 가져오는 중...</p>
        </div>`;

    const chzzkResult = await fetchLiveList(20);
    if (chzzkResult && chzzkResult.data) {
        const chzzkGameLives = chzzkResult.data.filter(function(live) { return live.categoryType === "GAME"; });
        const chzzkLivesToRender = chzzkGameLives.slice(0, 10);

        if (chzzkLivesToRender.length > 0) {
            console.log("치지직 게임 라이브 목록 조회 성공:", chzzkLivesToRender);
            renderLiveList(".live-container", chzzkLivesToRender); 
        } else {
            console.warn("치지직 게임 라이브를 찾을 수 없습니다.");
            chzzkLiveContainer.innerHTML = `
                <div class="live-status-wrapper">
                    <p>현재 치지직 GAME 카테고리 라이브를 찾을 수 없습니다.</p>
                </div>`;
        }
    } else {
        console.error("치지직 라이브 목록을 가져올 수 없습니다.");
        chzzkLiveContainer.innerHTML = `
            <div class="live-status-wrapper">
                <p>치지직 라이브 목록을 가져오는데 실패했습니다.</p>
            </div>`;
    }

    const youtubeLives = await fetchYoutubeLiveList("서든어택", 10);
    if (youtubeLives) {
        if (youtubeLives.length > 0) {
            console.log("유튜브 서든어택 라이브 목록 조회 성공:", youtubeLives);
            renderLiveList(".youtube-live-container", youtubeLives); 
        } else {
            console.warn("유튜브 서든어택 라이브를 찾을 수 없습니다.");
            youtubeLiveContainer.innerHTML = `
                <div class="live-status-wrapper">
                    <p>현재 유튜브에서 '서든어택' 라이브를 찾을 수 없습니다.</p>
                </div>`;
        }
    } else {
        console.error("유튜브 라이브 목록을 가져올 수 없습니다.");
        youtubeLiveContainer.innerHTML = `
            <div class="live-status-wrapper">
                <p>유튜브 라이브 목록을 가져오는데 실패했습니다.</p>
            </div>`;
    }
}

export async function renderLivePage(targetElement) {
    if (!targetElement) return;
    
    const html = await fetch("src/components/live/live.html").then(function(res) { return res.text(); });
    targetElement.innerHTML = html;
    
    await initializeLiveList();
}

window.liveModule = {
    fetchLiveList,
    fetchYoutubeLiveList,
    renderLiveList,
    initializeLiveList
};