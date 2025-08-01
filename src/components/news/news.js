// 통합랭킹 데이터셋
const totalRankingData = [
  { rank: 1, grade: "class_59.png", nickname: "왕자", winRate: "80.2%", kd: "56.2%", record: "110511승 27239패 23무" },
  { rank: 2, grade: "class_58.png", nickname: "19", winRate: "74.1%", kd: "60.8%", record: "59570승 20793패 20무" },
  { rank: 3, grade: "class_58.png", nickname: "상추", winRate: "64.7%", kd: "50.1%", record: "59697승 32547패 80무" },
  { rank: 4, grade: "class_58.png", nickname: "사자", winRate: "78.4%", kd: "57.1%", record: "81401승 22459패 27무" },
  { rank: 5, grade: "class_58.png", nickname: "폭력", winRate: "70.2%", kd: "66.5%", record: "68951승 29302패 25무" },
  { rank: 6, grade: "class_58.png", nickname: "지은", winRate: "71.1%", kd: "54.6%", record: "50379승 20467패 23무" },
  { rank: 7, grade: "class_58.png", nickname: "춘천닭갈비", winRate: "65.2%", kd: "59.4%", record: "55738승 29671패 50무" },
  { rank: 8, grade: "class_58.png", nickname: "먀오먀오", winRate: "80.7%", kd: "59.6%", record: "76647승 18263패 9무" },
  { rank: 9, grade: "class_58.png", nickname: "Onecherry", winRate: "72.0%", kd: "62.4%", record: "92594승 35977패 77무" },
  { rank: 10, grade: "class_58.png", nickname: "더건", winRate: "62.5%", kd: "57.2%", record: "57562승 34341패 167무" },
];

// 시즌랭킹 데이터셋
const seasonRankingData = [
  { rank: 1, grade: "class_55.png", nickname: "오리", winRate: "71.3%", kd: "60.5%", record: "72839승 27702패 1611무" },
  { rank: 2, grade: "class_55.png", nickname: "빼냥엄마시체찾음", winRate: "73.2%", kd: "56.8%", record: "16056승 5879패 2무" },
  { rank: 3, grade: "class_55.png", nickname: "의", winRate: "62.3%", kd: "58.4%", record: "670승 405패 0무" },
  { rank: 4, grade: "class_55.png", nickname: "미소", winRate: "74.4%", kd: "54.3%", record: "11524승 3961패 7무" },
  { rank: 5, grade: "class_55.png", nickname: "지건", winRate: "80.4%", kd: "56.8%", record: "26888승 6538패 12무" },
  { rank: 6, grade: "class_55.png", nickname: "망고", winRate: "64.7%", kd: "57.7%", record: "13183승 7200패 2무" },
  { rank: 7, grade: "class_55.png", nickname: "왕자", winRate: "80.2%", kd: "56.2%", record: "110511승 27239패 23무" },
  { rank: 8, grade: "class_55.png", nickname: "사자", winRate: "78.4%", kd: "57.1%", record: "81401승 22459패 27무" },
  { rank: 9, grade: "class_55.png", nickname: "춘천닭갈비", winRate: "65.2%", kd: "59.4%", record: "55738승 29671패 50무" },
  { rank: 10, grade: "class_55.png", nickname: "엥딩", winRate: "56.1%", kd: "57.2%", record: "5805승 4542패 3무" },
];

function renderRankingTable(data) {
  const tbody = document.getElementById("rankingTableBody");
  if (!tbody) return;
  tbody.innerHTML = data.map(function(row) {
    return `
    <tr>
      <td class="ranking-rank">${row.rank}</td>
      <td><img class="ranking-grade-img" src="/images/${row.grade}" alt="계급" /></td>
      <td class="ranking-nickname">${row.nickname}</td>
      <td>${row.winRate}</td>
      <td>${row.kd}</td>
      <td>${row.record}</td>
    </tr>
  `;
  }).join("");
}

export async function renderNewsPage(targetElement) {
  if (!targetElement) return;
  const html = await fetch("src/components/news/news.html").then(function(res) { return res.text(); });
  targetElement.innerHTML = html;
  
  renderRankingTable(totalRankingData);
  document.querySelectorAll(".ranking-tab").forEach(function(tab) {
    tab.addEventListener("click", function() {
      document.querySelectorAll(".ranking-tab").forEach(function(t) { t.classList.remove("active"); });
      this.classList.add("active");
      if (this.dataset.type === "total") {
        renderRankingTable(totalRankingData);
      } else {
        renderRankingTable(seasonRankingData);
      }
    });
  });
}