const dayArray = [
  "Søndag",
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag"
];

const monthArray = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember"
];

export const timeToFerryLeaves = (ferryTimeString, dayoffset = 0) => {
  const [hours, minutes] = ferryTimeString.replace("*", "").split(":");
  const ferryTime = new Date();
  ferryTime.setHours(parseInt(hours));
  ferryTime.setMinutes(parseInt(minutes));
  if (dayoffset > 0) {
    ferryTime.setDate(ferryTime.getDate() + dayoffset);
  }

  const now = new Date();

  const minutesToFerryLeaves =
    Math.floor(ferryTime / 1000 / 60) - Math.floor(now / 1000 / 60);
  if (minutesToFerryLeaves < 60) return minutesToFerryLeaves + " min";

  return `${Math.floor(minutesToFerryLeaves / 60)}t ${minutesToFerryLeaves %
    60}m`;
};

export const getTodayString = () => {
  const today = new Date();
  const todayDate = today.getDate();
  const todayDay = today.getDay();
  const todayMonth = today.getMonth();
  return `${dayArray[todayDay]} ${todayDate}. ${monthArray[
    todayMonth
  ].toLowerCase()}`;
};
