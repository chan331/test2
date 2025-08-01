async function performSearch(characterName) {
    searchQuery = characterName
    isLoading = true
    error = null
    apiResults = null
    updateContent()

    try {
      console.log(`"${characterName}" 캐릭터 정보 조회 시작`)
      
      // 1단계: 사용자 ID 조회
      console.log('1사용자 ID 조회 중...')
      const userIdResult = await getUserId(characterName)
      
      if (!userIdResult || !userIdResult.ouid) {
        throw new Error('사용자 ID를 찾을 수 없습니다. 캐릭터 이름을 확인해주세요.')
      }
      
      const userId = userIdResult.ouid
      console.log(`사용자 ID 조회 완료: ${userId}`)
      
      // 2~6단계: 주요 정보 병렬 조회
      console.log('2️⃣ 주요 정보 병렬 조회 시작...');
      
      const [
        userBasicInfo,
        userRankInfo,
        userTierInfo,
        userRecentInfo,
        matchInfo
      ] = await Promise.all([
        getUserBasicInfo(userId),
        getUserRankInfo(userId),
        getUserTierInfo(userId),
        getUserRecentInfo(userId),
        getUserMatchInfo(userId) // 디폴트 값 사용
      ]);
      
      console.log('✅ 주요 정보 병렬 조회 완료');
      
      // 7단계: API 키 2개 테스트 - 첫 2개 매치의 상세 정보 동시 조회
      let matchDetailResults = null;
      if (matchInfo && matchInfo.match && matchInfo.match.length >= 2) {
        console.log('4️⚡ API 키 2개 테스트: 첫 2개 매치 상세 정보 동시 조회 시작...')
        
        const firstMatchId = matchInfo.match[0].match_id;
        const secondMatchId = matchInfo.match[1].match_id;
        
        console.log(`📝 첫 번째 매치 ID: ${firstMatchId}`)
        console.log(`📝 두 번째 매치 ID: ${secondMatchId}`)
        
        try {
          // Promise.all을 사용해서 동시에 2개의 API 호출 (API_KEY2 사용)
          const [firstMatchDetail, secondMatchDetail] = await Promise.all([
            getUserMatchDetailInfo(firstMatchId),
            getUserMatchDetailInfo(secondMatchId)
          ]);
          
          matchDetailResults = {
            firstMatch: {
              matchId: firstMatchId,
              detail: firstMatchDetail
            },
            secondMatch: {
              matchId: secondMatchId,
              detail: secondMatchDetail
            }
          };
          
          console.log('✅ API 키 2개 테스트 성공: 2개 매치 상세 정보 동시 조회 완료')
        } catch (err) {
          console.error('❌ API 키 2개 테스트 실패:', err)
          matchDetailResults = {
            error: err.message
          };
        }
      } else {
        console.log('⚠️ 매치 정보가 부족해서 API 키 2개 테스트를 건너뜁니다.')
        matchDetailResults = {
          error: '매치 정보가 부족합니다 (최소 2개 매치 필요)'
        };
      }
      
      // 결과 저장
      apiResults = {
        userIdResult,
        userBasicInfo,
        userRankInfo,
        userTierInfo,
        userRecentInfo,
        matchInfo,
        matchDetailResults // API 키 2개 테스트 결과 추가
      }
      
      console.log('모든 API 호출 완료:', apiResults)
      
    } catch (err) {
      console.error('API 호출 중 오류 발생:', err)
      error = err.message || '알 수 없는 오류가 발생했습니다.'
    } finally {
      isLoading = false
      updateContent()
    }
  }