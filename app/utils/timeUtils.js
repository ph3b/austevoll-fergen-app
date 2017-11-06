const dayArray = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
  "Søndag"
];

const monthArray = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "May",
  "Juni",
  "Juli",
  "August",
  "September",
  "November",
  "Desember"
];

export const timeToFerryLeaves = ferryTimeString => {
  const [hours, minutes] = ferryTimeString.replace("*", "").split(":");
  const ferryTime = new Date();
  ferryTime.setHours(parseInt(hours));
  ferryTime.setMinutes(parseInt(minutes));
  const now = new Date();
  const minutesToFerryLeaves =
    Math.floor(ferryTime / 1000 / 60) - Math.floor(now / 1000 / 60);
  if (minutesToFerryLeaves < 60) return minutesToFerryLeaves + " min";

  return `${Math.floor(minutesToFerryLeaves / 60)}t ${minutesToFerryLeaves %
    60}m`;
};

const getTimeSlot = () => {
  const now = new Date();

  if (now.getDay() === 7) {
    return "sunday";
  }

  if (now.getDay() === 6) {
    return "saturday";
  }

  return "man-fri";
};

export const getFutureFerries = ferryTimes => {
  const ferryTimesForToday = ferryTimes[getTimeSlot()];
  return ferryTimesForToday.filter(ferry => {
    const ferryTimeString = ferry.replace("*", "");
    const [hour, minutes] = ferryTimeString.split(":");
    const ferryTime = new Date();
    ferryTime.setHours(parseInt(hour));
    ferryTime.setMinutes(parseInt(minutes));
    const now = new Date();
    return ferryTime > now;
  });
};

export const getTodayString = () => {
  const today = new Date();
  const todayDate = today.getDate();
  const todayDay = today.getDay();
  const todayMonth = today.getMonth();
  return `${dayArray[todayDay - 1]} ${todayDate}. ${monthArray[
    todayMonth - 1
  ]}`;
};
