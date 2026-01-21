const urlAPI = 'https://script.google.com/macros/s/AKfycbypkVn2OKUSxc9679YDerWxFtpRyNnLeA5Jirda0SD0ILhaJNTFZDz7z0sgxVH2ONnJ/exec';
const today = new Date();
const urlParams = new URLSearchParams(window.location.search);
const uniqueId = urlParams.get("uniqueId");

// Helper: Định dạng ngày thành yyyy_mm_dd
const formatYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}_${m}_${d}`;
};

let ymd = formatYMD(today);
let monthget = ymd.substr(0, 7);

$(function () {
    // Hiển thị tháng/năm hiện tại lên giao diện
    $('.month-info > div:first-child').text('THÁNG ' + String(today.getMonth() + 1).padStart(2, '0'));
    $('.month-info > div:last-child').text(today.getFullYear());

    // Chạy đồng hồ
    setInterval(updateClock, 1000);
    updateClock();

    // Gọi API lấy dữ liệu
    const query = new URLSearchParams({
        uniqueId: uniqueId,
        monthget: monthget,
        action: "GET_DATA"
    }).toString();

    const t0 = performance.now();
    $.ajax({
        url: `${urlAPI}?${query}`,
        method: "GET",
        beforeSend: () => {
            $('#day').addClass('hidden');
            $('#spinner').show();
        },
        success: (res) => {
            console.log("⚡ Dữ liệu đã tải xong");
            localStorage.setItem("dataId", JSON.stringify(res));
            
            setOneDay(today.getDate(), today.getMonth(), today.getFullYear());
            
            $('#day').removeClass('hidden');
            $('#spinner').hide();
            
            const t1 = performance.now();
            console.log("⚡ Thời gian AJAX:", ((t1 - t0) / 1000).toFixed(3), "s");
        },
        error: (xhr, status, err) => {
            console.error("❌ Lỗi kết nối API:", status, err);
            $('#spinner').hide();
            alert("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối mạng!");
        }
    });
});

// Hàm hiển thị thông tin chi tiết của 1 ngày
function setOneDay(day, month, year) {
    const dataId = localStorage.getItem("dataId");
    if (!dataId) return;
    const res = JSON.parse(dataId);

    const date = new Date(year, month, day);
    const currentYmd = formatYMD(date);
    const daysOfWeek = ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"];

    $('.dayNumber').text(String(day).padStart(2, '0'));
    $('.monthName').text('THÁNG ' + String(month + 1).padStart(2, '0'));
    $('.dayOfWeek').text(daysOfWeek[date.getDay()]);

    // Cập nhật thông tin từ dữ liệu API
    $('.yearKeyword').text(res.keyWordsSum?.toUpperCase() || "");
    
    const rname = res['name-vn'].split(' ');
    $('.txtName').text(rname[rname.length - 1][0]);
    $('.person-info .person-name').text(res['name-vn']);
    $('.person-info > img').attr('src', `./imgs/${res.plan}.png`);
    $('.person-info .person-keyword').text(`${res.plan?.toUpperCase()} - ${res.prikeyWords?.toUpperCase()}`);
    
    $('.keyWord').text(res.keyWords[currentYmd]?.toUpperCase() || "---");
    $('.date-slogan').text(res.dateSlogans[currentYmd] || "");
}

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB'); // Định dạng hh:mm:ss
    const clockEl = document.getElementById("clock");
    if (clockEl) clockEl.textContent = timeStr;
}

// Xử lý Bottom Sheet
const bottomSheet = document.getElementById('bottomSheet');
const overlay = document.getElementById('overlay');

$('.openSheet').click(function () {
    const name = $(this).attr('id').toLowerCase().replace('btn', '');
    bottomSheet.classList.add('active');
    overlay.classList.add('active');
    $(`.content > .${name}`).show();
});

const closeAllSheets = () => {
    bottomSheet.classList.remove('active');
    overlay.classList.remove('active');
    $(`.content > *`).hide();
};

$('#closeBtn, #overlay').click(closeAllSheets);

// Xử lý chuyển đổi giao diện Ngày/Tháng
function triggerHidden() {
    $('#day, #month').toggle();
}

$('#btnMonth').click(function () {
    triggerHidden();
    renderCalendar(today.getMonth(), today.getFullYear(), $('.dayNumber').text());
});

// Render lịch dạng danh sách (List)
function renderCalendar(month, year, activeDay = "") {
    const daysContainer = document.getElementById("days-container");
    daysContainer.innerHTML = '';
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Tạo các ô trống đầu tháng
    for (let i = (firstDay + 7) % 7; i > 0; i--) {
        daysContainer.appendChild(document.createElement("div"));
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const card = document.createElement("div");
        let className = 'day-card';
        if (d === parseInt(activeDay)) className += " choice-day";
        if (d < parseInt(activeDay)) className += " note-day";
        
        card.className = className;
        card.innerHTML = `<div class="day-number">${d}</div>`;
        daysContainer.appendChild(card);
    }
}

// Render lịch dạng Grid có kèm Slogan
function renderCalendarGrid(month, year, activeDay = "") {
    const daysContainer = document.getElementById("days-grids");
    const dataId = localStorage.getItem("dataId");
    if (!dataId) return;
    const res = JSON.parse(dataId);
    
    daysContainer.innerHTML = '';
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
        const dStr = String(d);
        const currentYmd = formatYMD(new Date(year, month, d));
        const card = document.createElement("div");
        
        let className = 'day-card-grids';
        if (d === parseInt(activeDay)) className += " choice-day";
        if (d < parseInt(activeDay)) className += " note-day";

        card.className = className;
        card.innerHTML = `
            <div class="day-number">${d}</div>
            <div class="date-slogan">${res.dateSlogans[currentYmd] || ""}</div>
        `;
        daysContainer.appendChild(card);
    }

    // Cuộn tới ngày đang chọn
    setTimeout(() => {
        const activeCard = $(daysContainer).find('.choice-day');
        if (activeCard.length) {
            $(daysContainer).animate({
                scrollTop: activeCard.offset().top - $(daysContainer).offset().top + $(daysContainer).scrollTop() - 10
            }, 800);
        }
    }, 100);
}

// Click chọn ngày từ lịch
$(document).on('click', '.day-card, .day-card-grids', function () {
    const dayClicked = $(this).find('.day-number').text();
    const monthStr = $('.month-info > div:first-child').text().replace('THÁNG ', '');
    const yearStr = $('.month-info > div:last-child').text();
    
    setOneDay(parseInt(dayClicked), parseInt(monthStr) - 1, parseInt(yearStr));
    triggerHidden();
});

$('#btnMonthGrid').click(function () {
    $('.month-details').addClass('hidden');
    $('.month-grids').removeClass('hidden');
    renderCalendarGrid(today.getMonth(), today.getFullYear(), $('.dayNumber').text());
});

$('#btnMonthCircle').click(function () {
    $('.month-details').removeClass('hidden');
    $('.month-grids').addClass('hidden');
});

let deferredPrompt;
const btnInstall = document.getElementById('btnInstall');

window.addEventListener('beforeinstallprompt', (e) => {
    // Ngăn chặn trình duyệt tự động hiển thị prompt
    e.preventDefault();
    // Lưu sự kiện lại để kích hoạt sau
    deferredPrompt = e;
    // Hiển thị nút cài đặt của mình
    btnInstall.classList.remove('hidden');
});

btnInstall.addEventListener('click', async () => {
    if (deferredPrompt) {
        // Hiển thị hộp thoại cài đặt của trình duyệt
        deferredPrompt.prompt();
        // Chờ người dùng trả lời
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // Xóa prompt đã dùng
        deferredPrompt = null;
        // Ẩn nút sau khi bấm
        btnInstall.classList.add('hidden');
    }
});

// Ẩn nút nếu ứng dụng đã được cài đặt thành công
window.addEventListener('appinstalled', () => {
    console.log('App was installed.');
    btnInstall.classList.add('hidden');
});
