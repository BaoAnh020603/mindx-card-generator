import { commentTemplates, initialCardData, DEFAULT_AVATAR_PLACEHOLDER } from './data.js';

let currentState = { ...initialCardData };
let isGenerated = false;

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  attachEventListeners();
});

function attachEventListeners() {
  const form = document.getElementById('card-form');

  // Xử lý khi bấm nút "Tạo Phiếu Đánh Giá"
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Thu thập dữ liệu từ Form
    currentState.event = document.getElementById('input-event').value;
    currentState.branch = document.getElementById('input-branch').value;
    currentState.studentName = document.getElementById('input-name').value;
    currentState.classCode = document.getElementById('input-class').value;
    currentState.rank = document.getElementById('input-rank').value;

    currentState.scoreLogic = document.getElementById('input-logic').value || '-';
    currentState.scorePractice = document.getElementById('input-practice').value || '-';
    currentState.scoreAttendance = document.getElementById('input-attendance').value || '-';

    currentState.strengthText = document.getElementById('input-strength').value;
    currentState.improveText = document.getElementById('input-improve').value;
    currentState.adviceText = document.getElementById('input-advice').value;

    // Render sang Card
    renderCardPreview();

    // Hiện thẻ kết quả, ẩn placeholder
    isGenerated = true;
    document.getElementById('preview-placeholder').style.display = 'none';
    const previewWrapper = document.getElementById('preview-wrapper');
    previewWrapper.style.display = 'flex';

    if (window.lucide) window.lucide.createIcons();

    // Tự cuộn mượt đến khung thẻ nếu trên màn hình nhỏ
    previewWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Upload Avatar
  const avatarInput = document.getElementById('input-avatar-file');
  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          currentState.avatarUrl = uploadEvent.target.result;
          if (isGenerated) {
            document.getElementById('card-avatar').src = currentState.avatarUrl;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Nút chọn câu mẫu
  document.querySelectorAll('.btn-quick-sample').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.dataset.type;
      const list = commentTemplates[type];
      if (list && list.length > 0) {
        const randomComment = list[Math.floor(Math.random() * list.length)];
        if (type === 'strength') document.getElementById('input-strength').value = randomComment;
        if (type === 'improve') document.getElementById('input-improve').value = randomComment;
        if (type === 'advice') document.getElementById('input-advice').value = randomComment;
      }
    });
  });

  // Nút Làm mới Form
  const btnReset = document.getElementById('btn-reset-form');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      form.reset();
      currentState = { ...initialCardData };
      isGenerated = false;
      document.getElementById('preview-placeholder').style.display = 'flex';
      document.getElementById('preview-wrapper').style.display = 'none';
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Nút xuất ảnh
  const btnExport = document.getElementById('btn-export-image');
  if (btnExport) {
    btnExport.addEventListener('click', exportImage);
  }
}

function renderCardPreview() {
  document.getElementById('card-event').innerText = currentState.event;
  document.getElementById('card-branch').innerText = currentState.branch || 'MindX School';

  document.getElementById('card-name').innerText = currentState.studentName || 'Họ và tên học viên';
  document.getElementById('card-class').innerText = `Lớp: ${currentState.classCode || '---'}`;
  document.getElementById('card-avatar').src = currentState.avatarUrl;

  document.getElementById('card-rank').innerText = currentState.rank || '-';
  document.getElementById('card-score-logic').innerText = currentState.scoreLogic;
  document.getElementById('card-score-practice').innerText = currentState.scorePractice;
  document.getElementById('card-score-attendance').innerText = currentState.scoreAttendance;

  document.getElementById('card-strength').innerText = currentState.strengthText;
  document.getElementById('card-improve').innerText = currentState.improveText;
  document.getElementById('card-advice').innerText = currentState.adviceText;
}

async function exportImage() {
  const cardElement = document.getElementById('card-render-node');
  const btnExport = document.getElementById('btn-export-image');

  const oldText = btnExport.innerHTML;
  btnExport.innerHTML = `<span>Đang tạo ảnh...</span>`;
  btnExport.disabled = true;

  try {
    const canvas = await window.html2canvas(cardElement, {
      scale: 2.5,
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
