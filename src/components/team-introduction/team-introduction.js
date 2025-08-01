// GSAP 전역 변수 선언
/* global gsap */

function extractBodyContent(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const bodyElement = tempDiv.querySelector("body");
  return bodyElement ? bodyElement.innerHTML : html;
}

// 팀소개 애니메이션
function animateTeamIntroduction() {
  if (typeof gsap !== "undefined") {
    // 초기 숨김 상태 설정
    gsap.set(".team-member", { opacity: 0, x: -100 });

    // 애니메이션 실행
    gsap.to(".team-member", {
      opacity: 1,
      x: 0,
      duration: 1.3,
      ease: "power2.out",
      stagger: 0.2,
    });
  }
}

// 스크롤 감지
function setupScrollAnimation() {
  const teamIntroSection = document.querySelector(".team-intro");
  if (!teamIntroSection) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateTeamIntroduction();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(teamIntroSection);
}

export async function renderTeamIntroduction(targetElement) {
  if (!targetElement) return;

  const html = await fetch("src/components/team-introduction/team-introduction.html").then(function (res) {
    return res.text();
  });

  targetElement.innerHTML = extractBodyContent(html);

  setTimeout(function () {
    setupScrollAnimation();
  }, 100);
}
