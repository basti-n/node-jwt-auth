const SECONDS = 60;
const MINUTES = 60;
const HOURS = 24;

function getMsFromDays(days) {
  return days * SECONDS * MINUTES * HOURS;
}

function getSecFromDays(days) {
  return days * MINUTES * HOURS;
}

module.exports.getMsFromDays = getMsFromDays;
module.exports.getSecFromDays = getSecFromDays;
