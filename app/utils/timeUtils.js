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
  "May",
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

const getTimeSlot = (offset = 0) => {
  const now = new Date();

  if (now.getDay() + offset === 7) {
    return "sunday";
  }

  if (now.getDay() + offset === 6) {
    return "saturday";
  }

  if (now.getDay() + offset === 5) {
    return "fri";
  }

  return "man-thu";
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

export const getFerriesForTomorrow = ferryTimes => {
  return ferryTimes[getTimeSlot(1)];
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
