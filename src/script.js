window.onload = function() {
  // Set time and date where the timer should count from
  countUpFromTime("Oct 21, 2001 17:00:00", 'countup1');
};

function countUpFromTime(countFrom, id) {
  const countFromDate = new Date(countFrom);
  const now = new Date();

  // Validate date
  const isValidDate = !isNaN(countFromDate.getTime());

  // Get DOM element
  const idEl = document.getElementById(id);
  if (!idEl) {
    // Gracefully exit if DOM element is missing
    return;
  }

  let years = 0, remainingDays = 0, hours = 0, minutes = 0, seconds = 0;
  if (isValidDate) {
    // Calculate timezone offsets for both dates
    const countFromOffset = countFromDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const nowOffset = now.getTimezoneOffset() * 60000;

    // Adjust countFrom time to account for its timezone offset
    const stockholmTime = countFromDate.getTime() - countFromOffset;

    // Adjust current time to account for its timezone offset
    const stockholmNow = now.getTime() - nowOffset;

    const timeDifference = stockholmNow - stockholmTime;

    const msInADay = 60 * 60 * 1000 * 24;
    const msInAnHour = 60 * 60 * 1000;

    // Calculate the exact number of days between the two dates using Date objects
    const totalDays = Math.floor((now - countFromDate) / msInADay);

    // Calculate years and remaining days, accounting for leap years and DST
    remainingDays = totalDays;
    for (let year = countFromDate.getFullYear(); year < now.getFullYear(); year++) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      const daysInYear = isLeapYear ? 366 : 365;
      if (remainingDays >= daysInYear) {
        years++;
        remainingDays -= daysInYear;
      } else {
        break;
      }
    }

    // Adjust remainingDays to account for DST changes
    const adjustedDate = new Date(countFromDate);
    adjustedDate.setFullYear(countFromDate.getFullYear() + years);
    const exactDays = Math.floor((now - adjustedDate) / msInADay);
    remainingDays = exactDays;

    hours = Math.floor((timeDifference % msInADay) / msInAnHour);
    minutes = Math.floor(((timeDifference % msInADay) % msInAnHour) / (60 * 1000));
    seconds = Math.floor((((timeDifference % msInADay) % msInAnHour) % (60 * 1000)) / 1000);
  }

  idEl.getElementsByClassName('years')[0].innerHTML = years;
  idEl.getElementsByClassName('days')[0].innerHTML = remainingDays;
  idEl.getElementsByClassName('hours')[0].innerHTML = hours;
  idEl.getElementsByClassName('minutes')[0].innerHTML = minutes;
  idEl.getElementsByClassName('seconds')[0].innerHTML = seconds;

  clearTimeout(countUpFromTime.interval);
  countUpFromTime.interval = setTimeout(function(){ countUpFromTime(countFrom, id); }, 1000);
}

// Export for Node.js/CommonJS (test environment)
/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { countUpFromTime };
}