config = {
  "LECTURE": "Data Warehousing",
  "LECTURER": "Prof. Dr. Johannes Schildgen",
  "LECTURER_EMAIL": "johannes.schildgen@oth-regensburg.de",
  "SEMESTER": "SS 2023"
};

START_DATE = "2023-04-12";

data = {
  "1": { "EX_DATES": mult_days(START_DATE,2) },
  "2": { "EX_DATES": mult_days(add_weeks(START_DATE, 2), 2) },
  "3": { "EX_DATES": mult_days(add_weeks(START_DATE, 3), 2) },
  "4": { "EX_DATES": mult_days(add_weeks(START_DATE, 4), 2) },
  "5": { "EX_DATES": mult_days(add_weeks(START_DATE, 6), 2) },
  "6": { "EX_DATES": mult_days(add_weeks(START_DATE, 7), 2) },
  "7": { "EX_DATES": mult_days(add_weeks(START_DATE, 9), 2) },
  "8": { "EX_DATES": mult_days(add_weeks(START_DATE, 10), 2) },
  "9": { "EX_DATES": mult_days(add_weeks(START_DATE, 11), 2) },
  "10": { "EX_DATES": mult_days(add_weeks(START_DATE, 12), 2) },
};

function mult_days(dateStr, ...days) {
  let date = new Date(dateStr);
  let dates = is_holiday(dateStr) ? [] : [dateStr];
  for (let i = 0; i < days.length; i++) {
    let newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    newDate.setDate(newDate.getDate() + days[i] + 1);
    newDateStr = newDate.toISOString().split("T")[0];
    if (is_holiday(newDateStr)) { continue; }
    dates.push(newDateStr);
  }
  dates.sort()
  return dates.join(", ");
}

function is_holiday(dateString) {
  // Konvertiere den Datum-String in ein Date-Objekt
  var date = new Date(dateString);

  // Berechne das Osterdatum mit dem Computus-Algorithmus
  var year = date.getFullYear();
  var a = year % 19;
  var b = Math.floor(year / 100);
  var c = year % 100;
  var d = Math.floor(b / 4);
  var e = b % 4;
  var f = Math.floor((b + 8) / 25);
  var g = Math.floor((b - f + 1) / 3);
  var h = (19 * a + b - d - g + 15) % 30;
  var i = Math.floor(c / 4);
  var k = c % 4;
  var l = (32 + 2 * e + 2 * i - h - k) % 7;
  var m = Math.floor((a + 11 * h + 22 * l) / 451);
  var n = Math.floor((h + l - 7 * m + 114) / 31);
  var p = (h + l - 7 * m + 114) % 31;
  var easter = new Date(year, n - 1, p + 1);

  // Bestimme die Feiertage
  var holidays = [
    { name: "Neujahr", date: "01-01" },
    { name: "Tag vor Karfreitag", date: new Date(easter.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace(/\//g, "-") },
    { name: "Karfreitag", date: new Date(easter.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace(/\//g, "-") },
    { name: "Ostermontag", date: new Date(easter.getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace(/\//g, "-") },
    { name: "Tag nach Ostermontag", date: new Date(easter.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace(/\//g, "-") },
    { name: "Tag der Arbeit", date: "05-01" },
    { name: "Christi Himmelfahrt", date: new Date(easter.getTime() + 39 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace(/\//g, "-") },
    { name: "Tag nach Christi Himmelfahrt", date: new Date(easter.getTime() + 40 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace(/\//g, "-") },
    { name: "Fronleichnam", date: new Date(easter.getTime() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace(/\//g, "-") },
    { name: "Tag nach Fronleichnam", date: new Date(easter.getTime() + 61 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace(/\//g, "-") },
    { name: "Pfingstmontag", date: new Date(easter.getTime() + 50 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace(/\//g, "-") },
    { name: "Tag nach Pfingstmontag", date: new Date(easter.getTime() + 51 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace(/\//g, "-") },
    { name: "Tag der Deutschen Einheit", date: "10-03" },
    { name: "Erster Weihnachtsfeiertag", date: "12-25" },
    { name: "Zweiter Weihnachtsfeiertag", date: "12-26" }
  ];

  // Prüfe, ob das Datum ein Feiertag ist
  var isHoliday = holidays.some(function(holiday) {
    return holiday.date === date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace(/\//g, "-");
  });

  return isHoliday;
}


function add_weeks(dateStr, weeks) {
  let date = new Date(dateStr);
  date.setDate(date.getDate() + 7*weeks);
  return date.toISOString().split("T")[0];
}

window.onload = function() {
  var html = document.documentElement.innerHTML;

  var url = window.location.href;
  var pageName = url.substring(url.lastIndexOf("/") + 1);
  var ex_no = pageName.match(/\d+/g)[0];
  html = html.replace(/%%%EX_NO%%%/g, ex_no);

  for(k in config) {
    html = html.replaceAll("%%%"+k.toUpperCase()+"%%%", config[k]);
  }
  for(k in data[ex_no]) {
    html = html = html.replaceAll("%%%"+k.toUpperCase()+"%%%", data[ex_no][k]);
  }

  document.documentElement.innerHTML = html;
};
