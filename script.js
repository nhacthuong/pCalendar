const uniqueId="251112-124325822-NVA-19911231-45678";

$(function(){
  // let dayOfWeek = $('.dayOfWeek').text().split('');
  // // .map(item => (item === "" || item === null || item === undefined ? "&nbsp;" : item));
  // console.log(dayOfWeek);
  // $('.dayOfWeek').html(`<div>${dayOfWeek.join('</div><div>')}</div>`);

  // let keyWord = $('.keyWord').text().split('');
  // $('.keyWord').html(`<div>${keyWord.join('</div><div>')}</div>`);
});

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Thêm số 0 ở trước nếu < 10
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const currentTime = `${hours}:${minutes}:${seconds}`;
  document.getElementById("clock").innerHTML = currentTime;
}

setInterval(updateClock, 1000);
updateClock(); // chạy ngay khi load
