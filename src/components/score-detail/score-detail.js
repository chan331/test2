const API_KEY = import.meta.env.VITE_NEXON_OPEN_API_KEY1;
const API_KEY_LIST = [
  import.meta.env.VITE_NEXON_OPEN_API_KEY1,
  import.meta.env.VITE_NEXON_OPEN_API_KEY2,
  import.meta.env.VITE_NEXON_OPEN_API_KEY3,
  import.meta.env.VITE_NEXON_OPEN_API_KEY4,
];

const detailArrayMap = {};

const MATCH_MODE = "폭파미션";
const DOMAIN = "https://open.api.nexon.com/suddenattack/v1";
let OUID = null;
const RESULT_KEY_VALUE = { 1: "승리", 2: "패배", 3: "무승부", DEFAULT: "-" };
let MATCH_DETAIL_ID = "";

function extractBodyContent(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const bodyElement = tempDiv.querySelector("body");
    return bodyElement ? bodyElement.innerHTML : html;
}

export async function renderScoreDetail(targetElement) {
    if (!targetElement) return;
    
    const html = await fetch("src/components/score-detail/score-detail.html").then(function(res) { 
        return res.text(); 
    });
    
    const bodyContent = extractBodyContent(html);
    targetElement.innerHTML = bodyContent;
    
    init();
}

function getTimeAgo(dateMatchString) {
  const matchDate = new Date(dateMatchString);
  const now = new Date();
  const diffMilliseconds = now.getTime() - matchDate.getTime();
  const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
  const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 30) {
    return `${diffDays}일 전`;
  } else {
    const year = matchDate.getFullYear();
    const month = (matchDate.getMonth() + 1).toString().padStart(2, "0");
    const day = matchDate.getDate().toString().padStart(2, "0");
    return `${year}. ${month}. ${day}.`;
  }
}

// 매치 정보를 렌더링
function renderMatchItem(matchInfo) {
  const li = document.createElement("li");
  li.classList.add("match-history-item");

  const matchResultText =
    RESULT_KEY_VALUE[matchInfo.match_result] || RESULT_KEY_VALUE.DEFAULT;
  const matchDateText = matchInfo.date_match
    ? getTimeAgo(matchInfo.date_match)
    : "-";
  const matchTypeText = matchInfo.match_type || "-";
  const kill = matchInfo.kill !== undefined ? matchInfo.kill : "-";
  const death = matchInfo.death !== undefined ? matchInfo.death : "-";
  const assist = matchInfo.assist !== undefined ? matchInfo.assist : "-";
  const headshotCount =
    matchInfo.headshot !== undefined ? matchInfo.headshot : "N/A";
  const damageDealt = matchInfo.damage !== undefined ? matchInfo.damage : "N/A";

  let kdRatio = "N/A";
  if (kill !== "-" && death !== "-") {
    if (death === 0) {
      kdRatio = kill;
    } else {
      kdRatio = ((kill / (kill + death)) * 100).toFixed(2);
    }
  }

  li.innerHTML = `
    <section class="match-preview-section">
      <div class="match-result-box ${
        matchResultText === "승리"
          ? "win"
          : matchResultText === "패배"
          ? "lose"
          : "draw"
      }">
      </div>

      <section class="match-padding-section" data-match-id="${
        matchInfo["match_id"]
      }">
        <div class="match-type-box">
          <p class="match-result-text ${
            matchResultText === "승리"
              ? "win"
              : matchResultText === "패배"
              ? "lose"
              : "draw"
          }">${matchResultText}</p>
          <p class="match-type-text">${matchTypeText}</p>
          <p class="match-date-text">${matchDateText}</p>
        </div>

        <div class="match-map-box">
          <p class="match-map-text"></p>
        </div>

        <section class="match-stats-section grid-full-width-section">
          <div class="match-stats-box">
            <p class="match-stats-label-text">
            <img class="icon-stat" src="./src/assets/user_icon/user_score.svg" alt="" />
            킬뎃
            </p>
            <p class="match-stats-value">${kdRatio}</p>
          </div>

          <div class="match-stats-box">
            <p class="match-stats-label-text">
            <img class="icon-stat" src="./src/assets/user_icon/user_score.svg" alt="" />
            KDA
            </p>
            <p class="match-stats-value">${kill} / ${death} / ${assist}</p>
          </div>

          <div class="match-stats-box">
            <p class="match-stats-label-text">
            <img class="icon-stat" src="./src/assets/user_icon/user_crits_shot.svg" alt="" />
            헤드샷
            </p>
            <p class="match-stats-value headshot-area">${headshotCount}</p>
          </div>

          <div class="match-stats-box">
            <p class="match-stats-label-text">
            <img class="icon-stat" src="./src/assets/user_icon/user_dealing.svg" alt="" />
            딜량
            </p>
            <p class="match-stats-value damage-area">${damageDealt}</p>
          </div>
        </section>
        <button class="btn-match-detail grid-full-width-section" type="button">
          <!--
          <img src="./src/assets/button_icon/down.svg" alt="상세 보기" style="width: 20px; height: 20px;" />-->
          ▼
        </button>
      </section>
    </section>

    <section id="section_${
      matchInfo["match_id"]
    }" class="user-match-detail-wrapper" style="display:none">
      <section class="match-header-section">
        <p class="match-result-text ${
          matchResultText === "승리" ? "win" : "lose"
        }">${matchResultText}</p>
        <p class="match-type-text map-name"></p>
        <p class="match-date-text">${convertToKoreanFormat(
          matchInfo["date_match"]
        )}</p>
        <button class="btn-mode-change">최근 동향 조회</button>
      </section>

      <section class="match-detail-section">
        <section class="match-team-section win">
          <section class="match-team-header-section win">
            <p class="match-header-text win">승리</p>
          </section>
          <section class="match-team-body-section win-section">
          </section>
        </section>
        <section class="match-team-section lose">
          <section class="match-team-header-section lose">
            <p class="match-header-text lose">패배</p>
          </section>
          <section class="match-team-body-section lose-section">
          </section>
        </section>
      </section>
    </section>
  `;
  return li;
}

// 매치 상세 헤더
function getDetailHeader() {
  return `
    <ul class="match-team-label-list">
          <li class="match-team-label-item">
              <p class="match-team-label-text">플레이어</p>
          </li>
          <li class="match-team-label-item">
              <p class="match-team-label-text">킬뎃</p>
          </li>
          <li class="match-team-label-item">
              <p class="match-team-label-text">KDA</p>
          </li>
          <li class="match-team-label-item match-team-item-web">
              <p class="match-team-label-text">헤드샷</p>
          </li>
          <li class="match-team-label-item match-team-item-web">
              <p class="match-team-label-text">딜량</p>
          </li>
      </ul>`;
}

function getDetailList(item) {
  const result = document.createElement("ul");

  result.classList.add("match-team-list");

  result.innerHTML = `
        <li data-v-2e9d49a7="" class="match-team-item">
          <img data-v-2e9d49a7="" src="${getRankIcon(
            item["season_grade"]
          )}" alt="계급" class="img-grade">
            <p data-v-2e9d49a7="" class="match-team-text"><a href="https://ezscope.gg/match/${
              item["user_name"]
            }" class="btn-search-player" target="_blank">${
    item["user_name"]
  }</a></p>
        </li>
        <li data-v-2e9d49a7="" class="match-team-item">
            <p data-v-2e9d49a7="" class="match-team-text rate-orange">${(
              (item.kill / (item.kill + item.death)) *
              100
            ).toFixed(
              2
            )} <span data-v-2e9d49a7="" class="match-team-unit-text">%</span></p>
        </li>
        <li data-v-2e9d49a7="" class="match-team-item">
            <p data-v-2e9d49a7="" class="match-team-text">${
              item.kill
            } / <span data-v-2e9d49a7="" class="match-team-death-text">${
    item.death
  }</span> / ${item.assist}</p>
        </li>
        <li data-v-2e9d49a7="" class="match-team-item match-team-item-web">
            <p data-v-2e9d49a7="" class="match-team-text">${item.headshot}</p>
        </li>
        <li data-v-2e9d49a7="" class="match-team-item match-team-item-web">
            <p data-v-2e9d49a7="" class="match-team-text">${item.damage.toLocaleString(
              "ko-KR"
            )}</p>
        </li>`;
  return result;
}

// 메인 초기화
const init = () => {
  const buttonUserInfo = document.getElementById("buttonUserInfo");
  const inputNickName = document.getElementById("inputNickName");
  const ouidArea = document.getElementById("ouidArea");
  const matchTypeUl = document.getElementById("matchType");
  const matchHistoryListUl = document.querySelector(".match-history-list");
  const informationArea = document.getElementById("informationArea");

  // 닉네임으로 ouid 받아오기
  buttonUserInfo.addEventListener("click", () => {
    const userName = inputNickName.value.trim();
    const params = new URLSearchParams();
    params.set("user_name", userName);
    const ouidcallUrl = `${DOMAIN}/id?${params.toString()}`;

    fetch(ouidcallUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-nxopen-api-key": API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        OUID = data.ouid;
        ouidArea.innerHTML = `${userName}의 ouid -> ${OUID}`;
        matchHistoryListUl.innerHTML = "";
        informationArea.innerHTML = "";
      });
  });

  // 매치타입 선택 시 매치목록 및 상세정보 가져오기
  if (matchTypeUl) {
    Array.from(matchTypeUl.querySelectorAll(".match-type-item button")).forEach(
      (button) => {
        button.addEventListener("click", () => {
          const li = button.closest(".match-type-item");
          const matchTypeText = li.dataset.value;

          matchTypeUl
            .querySelectorAll(".btn-match-type")
            .forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          matchHistoryListUl.innerHTML = "";
          informationArea.innerHTML =
            '<p class="match-loading">매치 정보를 로딩 중입니다...</p>';

          const params = new URLSearchParams();
          params.set("ouid", OUID);
          params.set("match_mode", MATCH_MODE);
          if (matchTypeText) {
            params.set("match_type", matchTypeText);
          }
          const matchListCallUrl = `${DOMAIN}/match?${params.toString()}`;

          //매치 목록 1차 요청
          fetch(matchListCallUrl, {
            method: "GET",
            headers: {
              accept: "application/json",
              "x-nxopen-api-key": API_KEY,
            },
          })
            .then((response) => response.json())
            .then((matchdata) => {
              // 1차요청의 패치를 성공!

              const matchList = matchdata.match
                ? matchdata.match.slice(0, 9)
                : [];

              if (!matchdata.match || matchdata.match.length === 0) {
                matchHistoryListUl.innerHTML =
                  '<li class="match-history-item"><p>해당 조건의 매치 결과가 없습니다.</p></li>';
                return;
              }

              matchList.forEach(function (item, index) {
                const li = renderMatchItem(item);
                matchHistoryListUl.appendChild(li);

                const arrayIndex = index % API_KEY_LIST.length;
                let apiKey = API_KEY_LIST[arrayIndex];

                // 2차 요청
                const matchDetailCallUrl = `${DOMAIN}/match-detail?match_id=${item["match_id"]}`;
                fetch(matchDetailCallUrl, {
                  method: "GET",
                  headers: {
                    accept: "application/json",
                    "x-nxopen-api-key": apiKey,
                  },
                })
                  .then((response) => response.json())
                  .then((matchDetaildata) => {
                    const section = document.querySelector(
                      `section[data-match-id="${item["match_id"]}"`
                    );

                    const sectionDetailElement = document.getElementById(
                      `section_${item["match_id"]}`
                    );

                    section.querySelector(".match-map-text").innerHTML =
                      matchDetaildata["match_map"];
                    sectionDetailElement.querySelector(".map-name").innerHTML =
                      matchDetaildata["match_map"];

                    const detailArray = matchDetaildata["match_detail"];
                    if (detailArray) {
                      const myName =
                        document.getElementById("inputNickName").value;
                      const myData = detailArray.filter(function (item) {
                        return myName === item["user_name"];
                      })[0];

                      section.querySelector(".headshot-area").innerHTML =
                        myData.headshot.toLocaleString();
                      section.querySelector(".damage-area").innerHTML =
                        myData.damage.toLocaleString();

                      detailArrayMap[item["match_id"]] = detailArray;
                    }
                  });
              });

              // 목록 요청이 모두 끝난 시점에 이벤트 핸들러 등록
              Array.from(
                document.querySelectorAll(".btn-match-detail")
              ).forEach((element) => {
                element.addEventListener("click", () => {
                  callDetailFatch(element.parentElement.dataset.matchId);
                });
              });
            });
        });
      }
    );
  }
};

const callDetailFatch = (matchId) => {
  const sectionElement = document.getElementById(`section_${matchId}`);

  if (MATCH_DETAIL_ID === matchId) {
    sectionElement.style.display = "none"; // 닫아버림
    MATCH_DETAIL_ID = "";
  } else {
    sectionElement.style.display = "";

    const winSection = sectionElement.querySelector(".win-section");
    const loseSection = sectionElement.querySelector(".lose-section");

    winSection.innerHTML = getDetailHeader();
    loseSection.innerHTML = getDetailHeader();

    detailArrayMap[matchId].forEach((item) => {
      // 이긴거
      if (item["match_result"] === "1") {
        winSection.appendChild(getDetailList(item));
      } else if (item["match_result"] === "2") {
        loseSection.appendChild(getDetailList(item));
      }
    });
    MATCH_DETAIL_ID = matchId;
  }
};

function getRankIcon(seasonGrade) {
  const prefix = "./src/assets/rank";
  let icon = "";
  console.log(seasonGrade);

  if (seasonGrade === "특등이병") {
    icon = "/class_00.png";
  } else if (seasonGrade === "특등일병") {
    icon = "/class_01.png";
  } else if (seasonGrade === "특등상병") {
    icon = "/class_02.png";
  } else if (seasonGrade === "특급병장") {
    icon = "/class_03.png";
  } else if (seasonGrade === "특전하사 1호봉") {
    icon = "/class_04.png";
  } else if (seasonGrade === "특전하사 2호봉") {
    icon = "/class_05.png";
  } else if (seasonGrade === "특전하사 3호봉") {
    icon = "/class_06.png";
  } else if (seasonGrade === "특전하사 4호봉") {
    icon = "/class_07.png";
  } else if (seasonGrade === "특전하사 5호봉") {
    icon = "/class_08.png";
  } else if (seasonGrade === "특전중사 1호봉") {
    icon = "/class_09.png";
  } else if (seasonGrade === "특전중사 2호봉") {
    icon = "/class_10.png";
  } else if (seasonGrade === "특전중사 3호봉") {
    icon = "/class_11.png";
  } else if (seasonGrade === "특전중사 4호봉") {
    icon = "/class_12.png";
  } else if (seasonGrade === "특전중사 5호봉") {
    icon = "/class_13.png";
  } else if (seasonGrade === "특전상사 1호봉") {
    icon = "/class_14.png";
  } else if (seasonGrade === "특전상사 2호봉") {
    icon = "/class_15.png";
  } else if (seasonGrade === "특전상사 3호봉") {
    icon = "/class_16.png";
  } else if (seasonGrade === "특전상사 4호봉") {
    icon = "/class_17.png";
  } else if (seasonGrade === "특전상사 5호봉") {
    icon = "/class_18.png";
  } else if (seasonGrade === "특임소위 1호봉") {
    icon = "/class_19.png";
  } else if (seasonGrade === "특임소위 2호봉") {
    icon = "/class_20.png";
  } else if (seasonGrade === "특임소위 3호봉") {
    icon = "/class_21.png";
  } else if (seasonGrade === "특임소위 4호봉") {
    icon = "/class_22.png";
  } else if (seasonGrade === "특임소위 5호봉") {
    icon = "/class_23.png";
  } else if (seasonGrade === "특임중위 1호봉") {
    icon = "/class_24.png";
  } else if (seasonGrade === "특임중위 2호봉") {
    icon = "/class_25.png";
  } else if (seasonGrade === "특임중위 3호봉") {
    icon = "/class_26.png";
  } else if (seasonGrade === "특임중위 4호봉") {
    icon = "/class_27.png";
  } else if (seasonGrade === "특임중위 5호봉") {
    icon = "/class_28.png";
  } else if (seasonGrade === "특임대위 1호봉") {
    icon = "/class_29.png";
  } else if (seasonGrade === "특임대위 2호봉") {
    icon = "/class_30.png";
  } else if (seasonGrade === "특임대위 3호봉") {
    icon = "/class_31.png";
  } else if (seasonGrade === "특임대위 4호봉") {
    icon = "/class_32.png";
  } else if (seasonGrade === "특임대위 5호봉") {
    icon = "/class_33.png";
  } else if (seasonGrade === "특공소령 1호봉") {
    icon = "/class_34.png";
  } else if (seasonGrade === "특공소령 2호봉") {
    icon = "/class_35.png";
  } else if (seasonGrade === "특공소령 3호봉") {
    icon = "/class_36.png";
  } else if (seasonGrade === "특공소령 4호봉") {
    icon = "/class_37.png";
  } else if (seasonGrade === "특공소령 5호봉") {
    icon = "/class_38.png";
  } else if (seasonGrade === "특공중령 1호봉") {
    icon = "/class_39.png";
  } else if (seasonGrade === "특공중령 2호봉") {
    icon = "/class_40.png";
  } else if (seasonGrade === "특공중령 3호봉") {
    icon = "/class_41.png";
  } else if (seasonGrade === "특공중령 4호봉") {
    icon = "/class_42.png";
  } else if (seasonGrade === "특공중령 5호봉") {
    icon = "/class_43.png";
  } else if (seasonGrade === "특공대령 1호봉") {
    icon = "/class_44.png";
  } else if (seasonGrade === "특공대령 2호봉") {
    icon = "/class_45.png";
  } else if (seasonGrade === "특공대령 3호봉") {
    icon = "/class_46.png";
  } else if (seasonGrade === "특공대령 4호봉") {
    icon = "/class_47.png";
  } else if (seasonGrade === "특공대령 5호봉") {
    icon = "/class_48.png";
  } else if (seasonGrade === "특급준장") {
    icon = "/class_49.png";
  } else if (seasonGrade === "특급소장") {
    icon = "/class_50.png";
  } else if (seasonGrade === "특급중장") {
    icon = "/class_51.png";
  } else if (seasonGrade === "특급대장") {
    icon = "/class_52.png";
  } else if (seasonGrade === "부사령관") {
    icon = "/class_53.png";
  } else if (seasonGrade === "사령관") {
    icon = "/class_54.png";
  } else if (seasonGrade === "총사령관") {
    icon = "/class_55.png";
  }
  return prefix + icon;
}

function convertToKoreanFormat(isoString) {
  // ISO 문자열을 Date 객체로 변환
  const date = new Date(isoString);

  // 한국 시간으로 변환 (UTC+9)
  const koreaTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");

  let hours = koreaTime.getHours();
  const minutes = String(koreaTime.getMinutes()).padStart(2, "0");
  const seconds = String(koreaTime.getSeconds()).padStart(2, "0");

  const period = hours >= 12 ? "오후" : "오전";
  hours = hours % 12 || 12; // 0시는 12시로

  return `${year}-${month}-${day} ${period} ${hours}시 ${minutes}분 ${seconds}초`;
}

addEventListener("DOMContentLoaded", init);
