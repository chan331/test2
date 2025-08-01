// 이 파일은 Netlify 서버에서만 실행됩니다.
// 클라이언트(브라우저)에는 노출되지 않습니다.

// API 키를 순서대로 사용하기 위한 카운터
// 이 변수는 함수 스코프 외부에 있어, 함수가 "warm" 상태일 때 값이 유지됩니다.
let keyIndex = 0;

// exports.handler는 Netlify 함수의 기본 진입점입니다.
exports.handler = async function (event, context) {
  console.log("--- Netlify 함수 실행 시작 ---");
  console.log("요청 경로:", event.path);

  // 1. Netlify 환경변수에서 URL과 모든 API 키를 가져옵니다.
  console.log("1. 환경변수 로딩 시도...");
  const NEXON_API_URL_BASE = process.env.VITE_NEXON_OPEN_API_URL;
  const apiKeys = [
    process.env.VITE_NEXON_OPEN_API_KEY1,
    process.env.VITE_NEXON_OPEN_API_KEY2,
    process.env.VITE_NEXON_OPEN_API_KEY3,
    process.env.VITE_NEXON_OPEN_API_KEY4,
  ].filter(key => key); // 값이 있는(정의된) 키만 필터링
  
  console.log(` - API URL 로드 여부: ${NEXON_API_URL_BASE ? '성공' : '실패'}`);
  console.log(` - 로드된 API 키 개수: ${apiKeys.length}개`);

  if (!NEXON_API_URL_BASE || apiKeys.length === 0) {
    console.error("치명적 오류: API URL 또는 API 키가 서버에 설정되지 않았습니다.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API URL 또는 API 키가 서버에 설정되지 않았습니다." }),
    };
  }

  // 2. 여러 개의 API 키 중 하나를 순서대로 선택합니다.
  console.log("2. API 키 순차 선택...");
  // 나머지 연산자(%)를 사용하여 키 인덱스를 0부터 (키 개수 - 1)까지 순환시킵니다.
  const apiKeyToUse = apiKeys[keyIndex % apiKeys.length];
  console.log(` - 현재 키 인덱스: ${keyIndex % apiKeys.length}`);
  console.log(` - 선택된 키 (앞 8자리): ${apiKeyToUse.substring(0, 8)}...`);
  
  // 다음 요청을 위해 인덱스를 1 증가시킵니다.
  keyIndex++;

  // 3. 클라이언트에서 온 요청을 기반으로 실제 Nexon API URL을 재구성합니다.
  console.log("3. Nexon API URL 재구성...");
  const requestPath = event.path.replace("/api/", "");
  const queryString = event.rawQuery ? `?${event.rawQuery}` : "";
  const nexonApiUrl = `${NEXON_API_URL_BASE}/${requestPath}${queryString}`;
  console.log(" - 최종 요청 URL:", nexonApiUrl);

  try {
    console.log("4. Nexon API에 fetch 요청 시도...");
    // 4. 서버에서 Nexon API로 직접 요청을 보냅니다.
    const response = await fetch(nexonApiUrl, {
      headers: {
        "x-nxopen-api-key": apiKeyToUse,
        "Accept": "application/json",
      },
    });
    console.log(` - Nexon API 응답 상태 코드: ${response.status}`);

    // 응답이 성공(2xx 상태 코드)이 아닐 경우, 원본 에러를 확인합니다.
    if (!response.ok) {
        console.log(" - 응답 실패, 에러 내용 확인 중...");
        const errorText = await response.text(); 
        console.error(`[Netlify Function] Nexon API 에러 원문:`, errorText);
        
        return {
            statusCode: response.status,
            body: JSON.stringify({ 
                error: `Nexon API returned status ${response.status}`,
                details: errorText
            }),
        };
    }

    console.log("5. 응답 성공, JSON 파싱 시도...");
    // 5. 성공 응답을 JSON으로 파싱하여 클라이언트에 전달합니다.
    const data = await response.json();
    console.log("--- Netlify 함수 실행 종료 (성공) ---");
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("[Netlify Function] try-catch 블록에서 심각한 오류 발생:", error);
    console.log("--- Netlify 함수 실행 종료 (실패) ---");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "함수 실행 중 네트워크 오류 또는 예기치 않은 문제가 발생했습니다.", details: error.message }),
    };
  }
};
