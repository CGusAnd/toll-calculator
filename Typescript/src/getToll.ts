import dayjs from "dayjs";

/**
 * Stubbed example.\
 * In a production environment this type of data should be imported from some sort of managed resource.
 */
const holidays = Object.freeze([
  dayjs("2024-05-01"),
  dayjs("2024-06-06"),
  dayjs("2024-06-22"),
  dayjs("2024-12-25")
]);

/**
 * Get the toll price for a given date
 */
export function getToll(date: dayjs.Dayjs) {
  let toll = 0;
  const hour = date.get("hour");
  const minute = date.get("minute");

  if (
    holidays.some((holiday) => holiday.isSame(date, "day")) ||
    [0, 6].includes(date.day())
  )
    toll = 0;
  else if (hour === 6) {
    if (minute < 30) toll = 8;
    else toll = 13;
  } else if (hour === 7) toll = 18;
  else if (hour === 8 && minute < 30) toll = 13;
  // Note: Matching logic in given templates here but having first half of the hours 9-14 be free seems odd
  else if (hour >= 8 && hour <= 14 && minute >= 30) toll = 8;
  else if (hour === 15 && minute < 30) toll = 13;
  else if (hour >= 15 && hour <= 16) toll = 18;
  else if (hour === 17) toll = 13;
  else if (hour === 18 && minute < 30) toll = 8;

  return toll;
}
