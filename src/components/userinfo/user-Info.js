import "./user-Info.css";
import { formatDate } from "../../utils/date";
import { OtherInfo } from "../otherinfo/other-info.js";
import { formatMatchDataForOtherInfo } from "../../service/user.js";
import total_grade_Response from "../../data/total_grade_Response.json";
import season_grade_Response from "../../data/season_grade_Response.json";
import mockData from "../../data/mock.json";

// 임시 클랜원 목 데이터
const mockOtherInfo = [
  {
    title: "클랜전",
    name: "시크",
    icon: "/icon/user_clan.svg",
    stats: {
      record: "150전 100승 (66.7%)",
      kd: "70.1%",
      assist: "5.6"
    },
  },
  {
    title: "솔로랭크",
    name: "LEGEND",
    icon: "/icon/user_clan.svg",
    stats: {
      record: "122전 87승 (71.3%)",
      kd: "65.5%",
      assist: "5.8"
    },
  },
  {
    title: "파티랭크",
    name: "GRAND MASTER I",
    icon: "/icon/user_clan.svg",
    stats: {
      record: "100전 50승 (50.0%)",
      kd: "55.3%",
      assist: "4.1"
    },
  },
];

const mockUserInfo = {
  userBasicInfo: {
    user_name: "오리",
    user_date_create: "2005-08-25T03:55:12.450Z",
    title_name: "S",
    clan_name: "시크",
    manner_grade: "최고"
  },
  userRankInfo: {
    user_name: "오리",
    grade: "부원수",
    grade_exp: 782123992,
    grade_ranking: 340,
    season_grade: "총사령관",
    season_grade_exp: 415192689,
    season_grade_ranking: 1
  },
  userTierInfo: {
    user_name: "오리",
    solo_rank_match_tier: "GRAND MASTER III",
    solo_rank_match_score: 3546,
    party_rank_match_tier: "GRAND MASTER I",
    party_rank_match_score: 3184
  },
  userRecentInfo: {
    user_name: "오리",
    recent_win_rate: 53.333336,
    recent_kill_death_rate: 57,
    recent_assault_rate: 52.333332,
    recent_sniper_rate: 66.666664,
    recent_special_rate: 57.333332
  }
}

export function UserInfo(targetElement, props) {
  // --- 상태 영역 ---
  let state = {
    activeTab: "total", // 'total' or 'season'
  };

  // --- 메서드 영역 ---
  const setState = (nextState) => {
    state = { ...state, ...nextState };
    render();
  };

  // --- 렌더링 영역 ---
  const render = () => {
    const data = props?.data || mockData; //데이터 없는 경우 mock데이터 사용용
    console.log(data);

    const { userBasicInfo, userRankInfo, userTierInfo, userRecentInfo, matchInfo } = data;
    console.log("matchInfo", matchInfo);
     //matchInfo는 일단 빼고 본격적으로 api받아올 때는 matchInfo도 적용 matchInfo만 이름 user안 붙음.

    //이제 여기서 데이터 핸들링링 해줘야함 service폴더에 user.js로 가공
   


    // 데이터가 완전히 로드되지 않았을 경우를 대비
    if (!userBasicInfo || !userRankInfo || !userTierInfo || !userRecentInfo) {
      return;
    }
    const otherInfos = formatMatchDataForOtherInfo({ userBasicInfo, userTierInfo, matchInfo });
    console.log(otherInfos);
    const { date, years } = formatDate(userBasicInfo.user_date_create);
    const gradeImage = state.activeTab === "total" ? total_grade_Response.find((grade) => grade.grade === userRankInfo.grade)?.grade_image : season_grade_Response.find((grade) => grade.season_grade === userRankInfo.season_grade)?.season_grade_image;

    targetElement.innerHTML = `
    <div class="container user-info">
      <div class="user-profile-container">
        <div class="user-profile">
          <div class="user-profile__header">
            <div class="user-profile__header__left">
              <button data-tab="total" class="user-profile__header__left__totalBtn ${
                state.activeTab === "total"
                  ? "user-profile__header__left__Btn--active"
                  : ""
              }" type="button">통합</button>
              <button data-tab="season" class="user-profile__header__left__seasonBtn ${
                state.activeTab === "season"
                  ? "user-profile__header__left__Btn--active"
                  : ""
              }" type="button">시즌</button>
            </div>
            <div class="user-profile__header__right">
              <span class="user-profile__header__right__date">${date} (${years})</span>
              <button class="user-profile__header__right__refresh-button" type="button">전적 갱신</button>
            </div>
          </div>

          <div class="user-profile__body">
            <div class="user-profile__body__info">
              <img src="/images/profile/user-default-img.png" alt="유저 이미지" class="user-profile__body__info__img" />
              <div class="user-profile__body__info__content">
              <img src="${gradeImage}" alt="유저 이미지" class="user-profile__body__info__grade" />
                <div class="user-profile__body__info__content__name">${
                  userBasicInfo.user_name
                }</div>
                <span class="user-profile__body__info__content__rank">(${state.activeTab === "total" ? userRankInfo.grade_ranking : userRankInfo.season_grade_ranking} 위)</span>
              </div>
            </div>

            <div class="user-profile__stats">
              <div class="stat-item">
                <div class="stat-item__left">
                  <div class="stat-item__value__top"><img src="/icon/user_win_rate.svg" alt="승률" />승률</div>
                  <div class="stat-item__value__bottom">${Number(
                    userRecentInfo.recent_win_rate
                  ).toFixed(2)}%</div>
                </div>
                <div class="stat-item__right">
                  <div class="stat-item__value__top"><img src="/icon/user_score.svg" alt="킬뎃" />킬뎃</div>
                  <div class="stat-item__value__bottom">${Number(
                    userRecentInfo.recent_kill_death_rate
                  ).toFixed(2)}%</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-item__left">
                  <div class="stat-item__value__top"><img src="/icon/user_gun.svg" alt="라플" />라플</div>
                  <div class="stat-item__value__bottom">${Number(
                    userRecentInfo.recent_assault_rate
                  ).toFixed(2)}%</div>
                </div>
                <div class="stat-item__right">
                  <div class="stat-item__value__top"><img src="/icon/user_gun.svg" alt="스나" />스나</div>
                  <div class="stat-item__value__bottom">${Number(
                    userRecentInfo.recent_sniper_rate
                  ).toFixed(2)}%</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-item__left">
                  <div class="stat-item__value__top"><img src="/icon/user_gun.svg" alt="특수" />특수</div>
                  <div class="stat-item__value__bottom">${Number(
                    userRecentInfo.recent_special_rate
                  ).toFixed(2)}%</div>
                </div>
                <div class="stat-item__right">
                  <div class="stat-item__value__top"><img src="/icon/user_gun.svg" alt="특수" />주무기</div>
                  <div class="stat-item__value__bottom">올라운더</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-item__left">
                  <div class="stat-item__value__top"><img src="/icon/user_clan.svg" alt="클랜" />클랜</div>
                  <div class="stat-item__value__bottom">${
                    userBasicInfo.clan_name || "없음"
                  }</div>
                </div>
                <div class="stat-item__right">
                  <div class="stat-item__value__top"><img src="/icon/user_honor.svg" alt="매너" />매너</div>
                  <div class="stat-item__value__bottom">${
                    userBasicInfo.manner_grade || "정보 없음"
                  }</div>
                </div>
              </div>
              <!-- 특수/주무기 등 추가 데이터가 필요하면 여기에 항목을 추가할 수 있습니다. -->
            </div>
          </div>
        </div>
       </div> 
      
      ${otherInfos.map((info) => OtherInfo({ info })).join("")}
      </div>
    `;

    // 이벤트 핸들링 영역
    const $headerLeft = targetElement.querySelector(".user-profile__header__left");
    if ($headerLeft) {
      $headerLeft.addEventListener("click", (e) => {
        const tabButton = e.target.closest("[data-tab]");
        if (tabButton) {
          const { tab } = tabButton.dataset;
          setState({ activeTab: tab });
        }
      });
    }
  };

  //렌더링
  return render();
}
