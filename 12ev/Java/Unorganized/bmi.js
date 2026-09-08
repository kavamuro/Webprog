function isLeapYear(year) {
  if (year % 4 != 0) {
    return false;
  }
  if (year % 100 == 0 && year % 400 != 0) {
    return false;
  }
  return true;
}

console.log(isLeapYear(2020), true, "Incorrect answer for year = 2020");
console.log(isLeapYear(2000), true, "Incorrect answer for year = 2000");
console.log(isLeapYear(2100), false, "Incorrect answer for year = 2100");
