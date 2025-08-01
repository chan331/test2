function formatDate(isoString) {
  if (!isoString) return { date: "", years: "" };
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const currentYear = new Date().getFullYear();
  const yearsAsSuddenler = currentYear - year + 1;
  return {
    date: `${year}년 ${month}월 ${day}일`,
    years: `${yearsAsSuddenler}년차 서든러`,
  };
}

export { formatDate };
