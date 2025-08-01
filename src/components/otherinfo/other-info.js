import "./other-info.css";

/**
 * 클랜, 랭크 정보를 표시하는 카드 컴포넌트
 * @param {object} props - 컴포넌트에 전달될 데이터
 * @param {object} props.info - 카드에 표시될 정보 (title, name, icon, stats...)
 * @returns {string} - 렌더링될 HTML 문자열
 */
export function OtherInfo(props) {
  
  
  const render = () => {
    const { info } = props;
    if (!info) return ""; // 데이터가 없으면 빈 문자열 반환

    return `
    <div class="clan-profile">
      <div class="clan-profile__header">
        <h2 class="clan-profile__title">${info.title}</h2>
        <div class="clan-profile__subtitle">${info.title !== "클랜전" ? "2025년 시즌3" : ""}</div>
        <div class="clan-profile__emblem">
          <img class="clan-profile__emblem__img" src="${info.icon}" alt="클랜 아이콘" />
        </div>
        <div class="clan-profile__name">${info.name}</div>
      </div>
      <div class="clan-profile__body">
        <div class="clan-profile__stats">
          <div class="stat-item">
            <div class="stat-item__label"><img src="/icon/user_win_rate.svg" alt="전적" />전적</div>
            <div class="stat-item__value">${info.stats.record}</div>
          </div>
          <div class="stat-item">
            <div class="stat-item__label"><img src="/icon/user_score.svg" alt="킬뎃" />킬뎃</div>
            <div class="stat-item__value stat-item__value--danger">${info.stats.kd}</div>
          </div>
          <div class="stat-item">
            <div class="stat-item__label"><img src="/icon/user_crits_shot.svg" alt="어시스트" />어시스트</div>
            <div class="stat-item__value">${info.stats.assist}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  };

  //렌더링
  return render();
}
