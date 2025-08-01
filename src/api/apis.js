// Vite 환경변수 사용 (VITE_ 접두사 필수)
const API_KEY = import.meta.env.VITE_NEXON_OPEN_API_KEY;
const API_KEY2 = import.meta.env.VITE_NEXON_OPEN_API_KEY2;
const urlString = import.meta.env.VITE_NEXON_OPEN_API_URL;

// 🔧 공통 fetch 함수 - API 키를 매개변수로 받을 수 있도록 수정
async function baseFetch(url, apiKey = API_KEY) {
  
  try {
    const response = await fetch(url, {
      headers: {
        "x-nxopen-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API 응답:", data);
    return data;
  } catch (error) {
    console.error("baseFetch 에러:", error);

    throw error;
  }
}


//유저 ouid 조회회
export async function getUserId(characterName) {
  if (!API_KEY) {
    throw new Error("NEXON API 키가 설정되지 않았습니다.");
  }

  const url = urlString + "id?user_name=" + characterName;

  try {
    const data = await baseFetch(url);
    console.log("API 응답:", data);
    return data;
  } catch (error) {
    console.error("getUserId 에러:", error);
    throw error;
  }
}


//유저 기본 정보 조회
export async function getUserBasicInfo(userId) {
  // API 키 확인
  if (!API_KEY) {
    throw new Error("NEXON API 키가 설정되지 않았습니다.");
  }

  const url = urlString + "user/basic?ouid=" + userId;

  try {
    const data = await baseFetch(url);
    console.log("API 응답:", data);
    return data;
  } catch (error) {
    console.error("getUserBasicInfo 에러:", error);
    throw error;
  }
}

//유저 랭크 정보 조회
export async function getUserRankInfo(userId) {
  if (!API_KEY) {
    throw new Error("NEXON API 키가 설정되지 않았습니다.");
  }

  const url = urlString + "user/rank?ouid=" + userId;

  try {
    const data = await baseFetch(url);
    console.log("API 응답:", data);
    return data;
  } catch (error) {
    console.error("getUserRankInfo 에러:", error);
    throw error;
  }
}


//유저 티어어 정보 조회
export async function getUserTierInfo(userId) {
  if (!API_KEY) {
    throw new Error("NEXON API 키가 설정되지 않았습니다.");
  }

  const url = urlString + "user/tier?ouid=" + userId;

  try {
    const data = await baseFetch(url);
    console.log("API 응답:", data);
    return data;
  } catch (error) {
    console.error("getUserTierInfo 에러:", error);
    throw error;
  }
}

// 유저 동향향 정보 조회
export async function getUserRecentInfo(userId) {
  if (!API_KEY) {
    throw new Error("NEXON API 키가 설정되지 않았습니다.");
  }

  const url = urlString + "user/recent-info?ouid=" + userId;

  try {
    const data = await baseFetch(url, API_KEY2);
    console.log("API 응답:", data);
    return data;
  } catch (error) {
    console.error("getUserRecentInfo 에러:", error);
    throw error;
  }
}

// 매치 정보 조회
export async function getUserMatchInfo(userId, matchMode = "폭파미션", matchType = "") {
  const encodedMatchMode = matchMode ? encodeURIComponent(matchMode) : "";
  const encodedMatchType = matchType ? encodeURIComponent(matchType) : "";

  // API 키 확인
  if (!API_KEY) {
    throw new Error("NEXON API 키가 설정되지 않았습니다.");
  }

  let url = matchType
    ? urlString +
      `match?ouid=${userId}&match_mode=${encodedMatchMode}&match_type=${encodedMatchType}`
    : urlString + `match?ouid=${userId}&match_mode=${encodedMatchMode}`;
    console.log("url:", url);

  try {
    const data = await baseFetch(url);
    console.log("API 응답:", data);
    return data;
  } catch (error) {
    console.error("getUserMatchInfo 에러:", error);
    throw error;
  }
}

// 매치 상세 정보 조회
export async function getUserMatchDetailInfo(matchId) {
  if (!API_KEY2) {
    throw new Error("NEXON API 키2가 설정되지 않았습니다.");
  }

  const url = urlString + `match-detail?match_id=${matchId}`;

  try {
    const data = await baseFetch(url, API_KEY2); // API_KEY2 사용
    console.log("API 응답:", data);
    return data;
  } catch (error) {
    console.error("getUserMatchDetailInfo 에러:", error);
    throw error;
  }
}