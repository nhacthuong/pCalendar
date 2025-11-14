const urlAPI = 'https://script.google.com/macros/s/AKfycbypkVn2OKUSxc9679YDerWxFtpRyNnLeA5Jirda0SD0ILhaJNTFZDz7z0sgxVH2ONnJ/exec';
const today = new Date(); // ngày hiện tại để so sánh
let ymd = `${today.getFullYear()}_${(today.getMonth()+1+'').padStart(2,'0')}_${(today.getDate()+'').padStart(2,'0')}`;
let uniqueId = '251112-124325822-NVA-19911231-45678';
let monthget = ymd.substr(0, 7);

// let mon = 10; // tháng 11 (js chạy từ 0–11)
// let yea = 2025;

$(function(){
    localStorage.clear();

    let mo=$('.month-info > div:first-child').text('THÁNG '+((today.getMonth()+1) < 10?'0':'') + (today.getMonth() + 1))
    let ye=$('.month-info > div:last-child').text(today.getFullYear());

    setInterval(updateClock, 1000);
    updateClock(); // chạy ngay khi load

    $.ajax({
      url: urlAPI,
      method: "POST",
      data: {'uniqueId':uniqueId,'monthget':monthget,'action':'GET_DATA'},      
      beforeSend: function () {
        $('#day').addClass('hidden');
        $('#spinner').show();
      },
      success: function(res) {
        // res
        localStorage.setItem("dataId", JSON.stringify(res));
        setOneDay(today.getDate(), today.getMonth(), today.getFullYear());
        $('#day').removeClass('hidden');
        $('#spinner').hide();
      },
      error: function(xhr, status, err) {
        console.error("❌ Lỗi:", status, err);
      },
      complete: function(xhr) {
      }
    });
});

function setOneDay(day, month, year){
  $('.dayNumber').text((day < 10?'0':'') + day);
  $('.monthName').text('THÁNG '+((month+1) < 10?'0':'') + (month + 1));
  
  const days = ["CHỦ NHẬT","THỨ HAI","THỨ BA","THỨ TƯ","THỨ NĂM","THỨ SÁU","THỨ BẢY"];
  const dayName = days[new Date(year, month, day).getDay()];
  $('.dayOfWeek').text(dayName);

  let date = new Date(year, month, day); ymd = `${date.getFullYear()}_${(date.getMonth()+1+'').padStart(2,'0')}_${(date.getDate()+'').padStart(2,'0')}`;
  //
  let dataId = localStorage.getItem("dataId");
  let res = JSON.parse(dataId);
  $('.yearKeyword').text(res.keyWordsSum.toUpperCase());
  $('.person-info .person-name').text(res['name-vn']);
  $('.person-info > img').attr('src',`./imgs/${res.plan}.png`);
  $('.person-info .person-keyword').text(res.prikeyWords.toUpperCase());
  let keyWords = res.keyWords[ymd];
  $('.keyWord').text(keyWords.toUpperCase());
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
        let addClass = 'day-card';
        const card = document.createElement("div");

        // năng lượng 1–9 lặp lại
        // const energy = (d % 9 === 0) ? 9 : d % 9;
        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            addClass += " choice-day";
        }
        if ([1,6,8].indexOf(d) > -1) {
            addClass += " note-day";
        }
        card.className = addClass;

        card.innerHTML = `<div class="day-number">${d}</div>`;

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
