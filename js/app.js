import { commentTemplates, initialCardData } from './data.js';

// Quản lý state của phiếu hiện tại
let currentState = { ...initialCardData };

// Khởi chạy khi load xong trang
document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo biểu tượng Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Gán dữ liệu mặc định vào Form
  populateFormWithState();

  // 3. Render cập nhật sang thẻ xem trước
  renderCardPreview();

  // 4. Lắng nghe các sự kiện thay đổi dữ liệu trên Form
  attachEventListeners();
});

// Điền state vào form
function populateFormWithState() {
  document.getElementById('input-event').value = currentState.event;
  document.getElementById('input-branch').value = currentState.branch;
  document.getElementById('input-name').value = currentState.studentName;
  document.getElementById('input-class').value = currentState.classCode;
  document.getElementById('input-rank').value = currentState.rank;
  
  document.getElementById('input-logic').value = currentState.scoreLogic;
  document.getElementById('input-practice').value = currentState.scorePractice;
  document.getElementById('input-attendance').value = currentState.scoreAttendance;

  document.getElementById('input-strength').value = currentState.strengthText;
  document.getElementById('input-improve').value = currentState.improveText;
  document.getElementById('input-advice').value = currentState.adviceText;
}

// Cập nhật thẻ trực tiếp (Live update DOM)
function renderCardPreview() {
  // Header
  document.getElementById('card-event').innerText = currentState.event;
  document.getElementById('card-branch').innerText = currentState.branch || 'MindX School';

  // Thông tin học sinh
  document.getElementById('card-name').innerText = currentState.studentName || 'Họ và tên học viên';
  document.getElementById('card-class').innerText = `Lớp: ${currentState.classCode || '---'}`;
  document.getElementById('card-avatar').src = currentState.avatarUrl;

  // Xếp hạng & Điểm
  document.getElementById('card-rank').innerText = currentState.rank;
  document.getElementById('card-score-logic').innerText = currentState.scoreLogic;
  document.getElementById('card-score-practice').innerText = currentState.scorePractice;
  document.getElementById('card-score-attendance').innerText = currentState.scoreAttendance;

  // 3 Khối nhận xét
  document.getElementById('card-strength').innerText = currentState.strengthText;
  document.getElementById('card-improve').innerText = currentState.improveText;
  document.getElementById('card-advice').innerText = currentState.adviceText;
}

// Lắng nghe sự kiện
function attachEventListeners() {
  // Input text & select
  const inputs = [
    { id: 'input-event', key: 'event' },
    { id: 'input-branch', key: 'branch' },
    { id: 'input-name', key: 'studentName' },
    { id: 'input-class', key: 'classCode' },
    { id: 'input-rank', key: 'rank' },
    { id: 'input-logic', key: 'scoreLogic' },
    { id: 'input-practice', key: 'scorePractice' },
    { id: 'input-attendance', key: 'scoreAttendance' },
    { id: 'input-strength', key: 'strengthText' },
    { id: 'input-improve', key: 'improveText' },
    { id: 'input-advice', key: 'adviceText' }
  ];

  inputs.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        currentState[key] = e.target.value;
        renderCardPreview();
      });
      el.addEventListener('change', (e) => {
        currentState[key] = e.target.value;
        renderCardPreview();
      });
    }
  });

  // Xử lý upload avatar
  const avatarInput = document.getElementById('input-avatar-file');
  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          currentState.avatarUrl = uploadEvent.target.result;
          renderCardPreview();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Nút đặt lại avatar mặc định
  const btnResetAvatar = document.getElementById('btn-reset-avatar');
  if (btnResetAvatar) {
    btnResetAvatar.addEventListener('click', () => {
      currentState.avatarUrl = initialCardData.avatarUrl;
      avatarInput.value = '';
      renderCardPreview();
    });
  }

  // Nút chọn câu mẫu nhanh
  document.querySelectorAll('.btn-quick-sample').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.dataset.type;
      const list = commentTemplates[type];
      if (list && list.length > 0) {
        const randomComment = list[Math.floor(Math.random() * list.length)];
        if (type === 'strength') {
          currentState.strengthText = randomComment;
          document.getElementById('input-strength').value = randomComment;
        } else if (type === 'improve') {
          currentState.improveText = randomComment;
          document.getElementById('input-improve').value = randomComment;
        } else if (type === 'advice') {
          currentState.adviceText = randomComment;
          document.getElementById('input-advice').value = randomComment;
        }
        renderCardPreview();
      }
    });
  });

  // Nút tải ảnh PNG
  const btnExport = document.getElementById('btn-export-image');
  if (btnExport) {
    btnExport.addEventListener('click', exportImage);
  }
}

// Hàm chụp ảnh phiếu nét cao tải về
async function exportImage() {
  const cardElement = document.getElementById('card-render-node');
  const btnExport = document.getElementById('btn-export-image');

  const oldText = btnExport.innerHTML;
  btnExport.innerHTML = `<span>Đang tạo ảnh nét cao...</span>`;
  btnExport.disabled = true;

  try {
    const canvas = await window.html2canvas(cardElement, {
      scale: 2.5, // Độ phân giải cao cho di động (1200 x 1600px)
      useCORS: true,
      backgroundColor: '#ffffff',
      borderRadius: 24,
      logging: false
    });

    const safeName = (currentState.studentName || 'Hoc_Vien')
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_");
      
    const safeEvent = currentState.event.replace(/[^a-zA-Z0-9]/g, "_");

    const imageLink = canvas.toDataURL('image/png');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.download = `Phieu_${safeName}_${safeEvent}.png`;
    downloadAnchor.href = imageLink;
    downloadAnchor.click();
  } catch (error) {
    console.error('Lỗi khi xuất ảnh:', error);
    alert('Không thể xuất ảnh: ' + error.message);
  } finally {
    btnExport.innerHTML = oldText;
    btnExport.disabled = false;
    if (window.lucide) window.lucide.createIcons();
  }
}

