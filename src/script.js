window.onload = function() {
  // Set time and date where the timer should count from
  countUpFromTime("Oct 21, 2001 17:00:00", 'countup1');
};

function countUpFromTime(countFrom, id) {
  countFrom = new Date(countFrom).getTime();
  var now = new Date().getTime();
  var timeDifference = now - countFrom;

  var secondsInADay = 60 * 60 * 1000 * 24;
  var secondsInAHour = 60 * 60 * 1000;

  var days = Math.floor(timeDifference / secondsInADay);
  var years = Math.floor(days / 365);
  if (years > 1) { days = days - (years * 365); }

  var hours = Math.floor((timeDifference % secondsInADay) / secondsInAHour);
  var minutes = Math.floor(((timeDifference % secondsInADay) % secondsInAHour) / (60 * 1000));
  var seconds = Math.floor((((timeDifference % secondsInADay) % secondsInAHour) % (60 * 1000)) / 1000);

  var idEl = document.getElementById(id);

  idEl.getElementsByClassName('years')[0].innerHTML = years;
  idEl.getElementsByClassName('days')[0].innerHTML = days;
  idEl.getElementsByClassName('hours')[0].innerHTML = hours;
  idEl.getElementsByClassName('minutes')[0].innerHTML = minutes;
  idEl.getElementsByClassName('seconds')[0].innerHTML = seconds;

  clearTimeout(countUpFromTime.interval);
  countUpFromTime.interval = setTimeout(function(){ countUpFromTime(countFrom, id); }, 1000);
}
