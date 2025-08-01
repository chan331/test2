// 이제 모든 API 호출은 Netlify의 서버리스 함수(프록시)를 통해 이루어집니다.
// 따라서 클라이언트 측 코드에는 API 키나 실제 API URL이 포함되지 않습니다.

// 프록시 API의 기본 경로
const PROXY_API_BASE_URL = "/api/";


//  공통 fetch 함수 - 이제 프록시 서버를 호출합니다.
async function baseFetch(url) {
  console.log("🔍 프록시 API 호출:", url);

  try {
    // 이제 헤더에 API 키를 담을 필요가 없습니다.
    // Netlify 함수가 서버에서 안전하게 키를 추가해줍니다.
    const response = await fetch(url);
    console.log("response",response);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '서버 응답을 JSON으로 파싱할 수 없습니다.' }));
        console.error(`HTTP 에러! 상태: ${response.status}`, errorData);
        throw new Error(`[${response.status}] ${errorData.message || '서버 오류가 발생했습니다.'}`);
    }

    const data = await response.json();
    console.log("✅ 프록시 API 응답:", data);
    return data;
  } catch (error) {
    console.error("❌ baseFetch 에러:", error);
    throw error;
  }
}

// 각 API 호출 함수들이 프록시 경로를 사용하도록 수정합니다.
export async function getUserId(characterName) {
  const encodedCharacterName = encodeURIComponent(characterName);
  const url = PROXY_API_BASE_URL + "id?user_name=" + encodedCharacterName;
  try {
    return await baseFetch(url);
  } catch (error) {
    console.error("getUserId 에러:", error);
    throw error;
  }
}

export async function getUserBasicInfo(userId) {
  const url = PROXY_API_BASE_URL + "user/basic?ouid=" + userId;
  try {
    return await baseFetch(url);
  } catch (error) {
    console.error("getUserBasicInfo 에러:", error);
    throw error;
  }
}

export async function getUserRankInfo(userId) {
  const url = PROXY_API_BASE_URL + "user/rank?ouid=" + userId;
  try {
    return await baseFetch(url);
  } catch (error) {
    console.error("getUserRankInfo 에러:", error);
    throw error;
  }
}

export async function getUserTierInfo(userId) {
  const url = PROXY_API_BASE_URL + "user/tier?ouid=" + userId;
  try {
    return await baseFetch(url);
  } catch (error) {
    console.error("getUserTierInfo 에러:", error);
    throw error;
  }
}

export async function getUserRecentInfo(userId) {
  const url = PROXY_API_BASE_URL + "user/recent-info?ouid=" + userId;
  try {
    return await baseFetch(url);
  } catch (error) {
    console.error("getUserRecentInfo 에러:", error);
    throw error;
  }
}

export async function getUserMatchInfo(userId, matchMode = "폭파미션", matchType = "") {
  const encodedMatchMode = matchMode ? encodeURIComponent(matchMode) : "";
  const encodedMatchType = matchType ? encodeURIComponent(matchType) : "";

  let url = matchType
    ? PROXY_API_BASE_URL +
      `match?ouid=${userId}&match_mode=${encodedMatchMode}&match_type=${encodedMatchType}`
    : PROXY_API_BASE_URL + `match?ouid=${userId}&match_mode=${encodedMatchMode}`;

  console.log("프록시 요청 url:", url);
  try {
    return await baseFetch(url);
  } catch (error) {
    console.error("getUserMatchInfo 에러:", error);
    throw error;
  }
}

export async function getUserMatchDetailInfo(matchId) {
  const url = PROXY_API_BASE_URL + `match-detail?match_id=${matchId}`;
  try {
    return await baseFetch(url);
  } catch (error) {
    console.error("getUserMatchDetailInfo 에러:", error);
    throw error;
  }
}

export async function getGradeMetaData() {
  const url = PROXY_API_BASE_URL + "meta/grade";
  try {
    return await baseFetch(url);
  } catch (error) {
    console.error("getGradeMetaData 에러:", error);
    throw error;
  }
} //얘는 https://open.api.nexon.com/static/suddenattack/meta/grade 일로 보내야 함. 메타 데이터를 받는 경우에는 서버리스 함수에서 URL을 좀 수정해줘야함.


export async function getSeasonGradeMetaData() {
  const url = PROXY_API_BASE_URL + "meta/season_grade";
  try {
    return await baseFetch(url);
  } catch (error) {
    console.error("getSeasonGradeMetaData 에러:", error);
    throw error;
  }
} //얘는 https://open.api.nexon.com/static/suddenattack/meta/season_grade 일로 보내야 함. 

export async function getTierMetaData() {
  const url = PROXY_API_BASE_URL + "meta/tier";
  try {
    return await baseFetch(url);
  } catch (error) {
    console.error("getTierMetaData 에러:", error);
    throw error;
  }
} //얘는 https://open.api.nexon.com/static/suddenattack/meta/tier 일로 보내야 함.
 


