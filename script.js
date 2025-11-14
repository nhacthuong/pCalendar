const uniqueId="251112-124325822-NVA-19911231-45678";
const today = new Date(); // ngày hiện tại để so sánh

// let mon = 10; // tháng 11 (js chạy từ 0–11)
// let yea = 2025;

$(function(){
    setOneDay(today.getDate(), today.getMonth(), today.getFullYear());

    let mo=$('.month-info > div:first-child').text('THÁNG '+((today.getMonth()+1) < 10?'0':'') + (today.getMonth() + 1))
    let ye=$('.month-info > div:last-child').text(today.getFullYear());

    setInterval(updateClock, 1000);
    updateClock(); // chạy ngay khi load
});

function setOneDay(day, month, year){
  $('.dayNumber').text((day < 10?'0':'') + day);
  $('.monthName').text('THÁNG '+((month+1) < 10?'0':'') + (month + 1));
  
  const days = ["CHỦ NHẬT","THỨ HAI","THỨ BA","THỨ TƯ","THỨ NĂM","THỨ SÁU","THỨ BẢY"];
  const dayName = days[new Date(year, month, day).getDay()];
  $('.dayOfWeek').text(dayName);
}

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


const bottomSheet = document.getElementById('bottomSheet');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
$('.openSheet').click(function(){
  let name=$(this).attr('id').toLowerCase().replace('btn','');
  bottomSheet.classList.add('active');
  overlay.classList.add('active');
  $(`.content > .${name}`).show();
});

closeBtn.addEventListener('click', () => {
  bottomSheet.classList.remove('active');
  overlay.classList.remove('active');
  $(`.content > *`).hide();
});

overlay.addEventListener('click', () => {
  bottomSheet.classList.remove('active');
  overlay.classList.remove('active');
  $(`.content > *`).hide();
});

// xem fill tháng
$('#btnMonth').click(function(){
  triggerHidden();
  renderCalendar(today.getMonth(), today.getFullYear());
});

function renderCalendar(month, year) {
    const daysContainer = document.getElementById("days-container");
    daysContainer.innerHTML = '';
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

        // khoảng trống
      for (let i = (firstDay + 7) % 7; i > 0; i--) {
          const empty = document.createElement("div");
          daysContainer.appendChild(empty);
      }

    for (let d = 1; d <= daysInMonth; d++) {
        const card = document.createElement("div");

        // năng lượng 1–9 lặp lại
        // const energy = (d % 9 === 0) ? 9 : d % 9;
        let addclass='';
         if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            card.className = "day-card choice-day";
        }
        else
          card.className = "day-card";

        card.innerHTML = `<div class="day-number${addclass}">${d}</div>`;

        daysContainer.appendChild(card);
    }
}

function triggerHidden() {
  $('#day').toggle('hidden');
  $('#month').toggle('hidden');
}

// xem 1 ngày
$(document).on('click', '.day-card', function() {
  triggerHidden();
  let da=$(this).text();
  let mo=$('.month-info > div:first-child').text().replace('THÁNG ', '');
  let ye=$('.month-info > div:last-child').text();
  setOneDay(da,parseInt(mo)-1,ye);
});
