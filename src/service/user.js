// 이 파일은 API 응답 데이터를 UI에서 사용하기 좋은 형태로 가공하는
// 서비스 로직(비즈니스 로직)을 담당합니다.

import total_grade_Response from "../data/total_grade_Response.json";
import season_grade_Response from "../data/season_grade_Response.json";
import rank_tier_Response from "../data/rank_tier_Response.json";


/**
 * - formatMatchDataForOtherInfo에서 실행
 * 전적 통계 객체를 생성하는 헬퍼 함수 
 * @param {object | undefined} match - 특정 매치 타입의 데이터 객체
 * @returns {object} - UI에 필요한 stats 객체
 */
const createStatsObject = (match) => {
  // 해당 매치 타입의 기록이 없는 경우
  if (!match) {
    return {
      record: '-',
      kd: '-',
      assist: '-', 
    };
  }

  // 승률 계산
  const winRate =
    match.total_match_count > 0
      ? ((match.win_match_count / match.total_match_count) * 100).toFixed(1)
      : 0;
  
  // UI에 필요한 형태로 가공하여 반환
  return {
    record: `${match.total_match_count}전 ${match.win_match_count}승 (${winRate}%)`,
    kd: `${match.kill_death_rate}%`,
    assist: `${Math.round(match.avg_assist || 0)}`, // avg_assist 키로 가정, 없으면 0
  };
};

/**
 * - user-Info.js에서 실행 후, 결과를 other-Info.js로 전달 
 * API 응답 데이터를 OtherInfo 컴포넌트 배열 형태로 가공
 * 클랜전, 랭크전 솔로, 랭크전 파티 데이터를 찾아 UI에 필요한 정보만 추출
 *
 * @param {object} data - API 응답 데이터를 담은 객체
 * @param {object} data.basicInfo - getUserBasicInfo 응답
 * @param {object} data.tierInfo - getUserTierInfo 응답
 * @param {object} data.matchInfo - getUserMatchInfo 응답
 * @returns {Array<object>} OtherInfo 컴포넌트에 전달할 props 배열
 */
export function formatMatchDataForOtherInfo(props) {
  const { userBasicInfo, userTierInfo, matchInfo } = props;

  // 필요한 데이터가 하나라도 없으면 빈 배열을 반환하여 에러 방지
  if (!userBasicInfo || !userTierInfo || !matchInfo) {
    return [];
  }

  // 1. match_type을 기준으로 전적 데이터를 집계합니다.
  const statsByMatchType = matchInfo.reduce((acc, match) => {
    const { match_type, match_result, kill, death, assist } = match;

    if (!acc[match_type]) {
      acc[match_type] = {
        total_match_count: 0,
        win_match_count: 0,
        total_kill: 0,
        total_death: 0,
        total_assist: 0,
      };
    }

    const stats = acc[match_type];
    stats.total_match_count += 1;
    if (match_result === '1') { // '1'이 승리
      stats.win_match_count += 1;
    }
    stats.total_kill += kill;
    stats.total_death += death;
    stats.total_assist += assist;

    return acc;
  }, {});

  // 2. 집계된 데이터를 기반으로 kill_death_rate와 avg_assist를 계산합니다.
  Object.values(statsByMatchType).forEach(stats => {
    // KDA (Kills / (Kills + Deaths))를 백분율로 계산합니다.
    const totalEngagements = stats.total_kill + stats.total_death;
    stats.kill_death_rate = totalEngagements > 0
      ? ((stats.total_kill / totalEngagements) * 100).toFixed(1)
      : '0.0';
    
    // 경기당 평균 어시스트를 계산합니다.
    stats.avg_assist = stats.total_match_count > 0
      ? (stats.total_assist / stats.total_match_count)
      : 0;
  });

  const clanMatchData = statsByMatchType['퀵매치 클랜전'];
  const soloRankData = statsByMatchType['랭크전 솔로'];
  const partyRankData = statsByMatchType['랭크전 파티'];

  // 최종적으로 UI에 전달될 데이터 배열
  const formattedInfo = [
    {
      title: '클랜전',
      name: userBasicInfo.clan_name || '소속 없음',
      icon: '/icon/user_clan.svg',
      stats: createStatsObject(clanMatchData),
    },
    {
      title: '솔로랭크',
      name: userTierInfo.solo_rank_match_tier || 'UNRANK',
      icon: `${rank_tier_Response.find((tier) => tier.tier === userTierInfo.solo_rank_match_tier)?.tier_image}`,
      stats: createStatsObject(soloRankData),
    },
    {
      title: '파티랭크',
      name: userTierInfo.party_rank_match_tier || 'UNRANK',
      icon: `${rank_tier_Response.find((tier) => tier.tier === userTierInfo.party_rank_match_tier)?.tier_image}`, 
      stats: createStatsObject(partyRankData),
    },
  ];

  return formattedInfo;
}


