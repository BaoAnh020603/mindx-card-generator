import { commentTemplates, initialCardData, DEFAULT_AVATAR_PLACEHOLDER } from './data.js';

let currentState = JSON.parse(JSON.stringify(initialCardData));
let isGenerated = false;

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  renderScoreInputs();
  autoCalculateTotalScore();
  attachEventListeners();
});

// Render danh sách các ô nhập điểm (cho phép sửa Tên tiêu chí & Số điểm)
function renderScoreInputs() {
  const container = document.getElementById('score-inputs-container');
  if (!container) return;

  container.innerHTML = currentState.scores.map((item, index) => `
    <div class="score-row" style="display: grid; grid-template-columns: 2fr 1.2fr auto; gap: 10px; align-items: center; margin-bottom: 8px;">
      <div>
        <input type="text" class="input-field score-name-input" data-index="${index}" value="${item.name}" placeholder="Tên tiêu chí (VD: Thực hành)" style="font-weight: 700; font-size: 13.5px; color: #090d16;">
      </div>
      <div style="display: flex; align-items: center; gap: 4px;">
        <input type="number" step="any" min="0" max="5" class="input-field score-val-input" data-index="${index}" value="${item.score}" placeholder="Điểm" style="text-align: center; font-weight: 900; font-size: 15px; color: #090d16;">
        <span style="font-size: 14px; font-weight: 900; color: #9f1239; white-space: nowrap;">/ 5</span>
      </div>
      <div>
        ${currentState.scores.length > 1 ? `
          <button type="button" class="btn-remove-score" data-index="${index}" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; display: flex; align-items: center;" title="Xóa tiêu chí này">
            <i data-lucide="trash-2" style="width: 17px; height: 17px; color: #dc2626;"></i>
          </button>
        ` : `<div style="width: 24px;"></div>`}
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();

  container.querySelectorAll('.score-name-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = e.target.dataset.index;
      currentState.scores[idx].name = e.target.value;
      if (isGenerated) renderCardScores();
    });
  });

  container.querySelectorAll('.score-val-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = e.target.dataset.index;
      currentState.scores[idx].score = e.target.value;
      autoCalculateTotalScore();
      if (isGenerated) {
        renderCardScores();
        renderTotalScoreAndRank();
      }
    });
  });

  container.querySelectorAll('.btn-remove-score').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.currentTarget.dataset.index;
      currentState.scores.splice(idx, 1);
      renderScoreInputs();
      autoCalculateTotalScore();
      if (isGenerated) {
        renderCardScores();
        renderTotalScoreAndRank();
      }
    });
  });
}

// Tự động tính điểm trung bình nếu người dùng chưa gõ đè
function autoCalculateTotalScore(force = false) {
  const totalInput = document.getElementById('input-total-score');
  if (!totalInput) return;

  // Nếu người dùng đã tự nhập tay thì không ghi đè trừ khi force
  if (!force && totalInput.dataset.manual === 'true') {
    currentState.totalScore = totalInput.value;
    return;
  }

  const validScores = currentState.scores
    .map(s => parseFloat(s.score))
    .filter(n => !isNaN(n));

  if (validScores.length > 0) {
    const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
    const roundedAvg = Math.round(avg * 100) / 100;
    totalInput.value = roundedAvg;
    currentState.totalScore = roundedAvg;
  } else {
    totalInput.value = '';
    currentState.totalScore = '';
  }
}

function attachEventListeners() {
  const form = document.getElementById('card-form');

  const btnAddScore = document.getElementById('btn-add-score');
  if (btnAddScore) {
    btnAddScore.addEventListener('click', () => {
      if (currentState.scores.length < 5) {
        currentState.scores.push({ name: "Tiêu chí mới", score: "5" });
        renderScoreInputs();
        autoCalculateTotalScore();
        if (isGenerated) {
          renderCardScores();
          renderTotalScoreAndRank();
        }
      } else {
        alert("Thẻ hiển thị đẹp nhất với tối đa 4 - 5 tiêu chí điểm.");
      }
    });
  }

  // Lắng nghe người dùng chỉnh tay điểm tổng
  const totalInput = document.getElementById('input-total-score');
  if (totalInput) {
    totalInput.addEventListener('input', (e) => {
      if (e.target.value.trim() !== '') {
        totalInput.dataset.manual = 'true';
      } else {
        delete totalInput.dataset.manual;
        autoCalculateTotalScore(true);
      }
      currentState.totalScore = e.target.value;
      if (isGenerated) renderTotalScoreAndRank();
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    currentState.event = document.getElementById('input-event').value;
    currentState.branch = document.getElementById('input-branch').value;
    currentState.studentName = document.getElementById('input-name').value;
    currentState.classCode = document.getElementById('input-class').value;
    currentState.rank = document.getElementById('input-rank').value;
    currentState.totalScore = document.getElementById('input-total-score').value || '-';

    currentState.strengthText = document.getElementById('input-strength').value;
    currentState.improveText = document.getElementById('input-improve').value;
    currentState.adviceText = document.getElementById('input-advice').value;

    renderCardPreview();

    isGenerated = true;
    document.getElementById('preview-placeholder').style.display = 'none';
    const previewWrapper = document.getElementById('preview-wrapper');
    previewWrapper.style.display = 'flex';

    if (window.lucide) window.lucide.createIcons();

    previewWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

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

  const btnReset = document.getElementById('btn-reset-form');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      form.reset();
      currentState = JSON.parse(JSON.stringify(initialCardData));
      isGenerated = false;
      renderScoreInputs();
      document.getElementById('preview-placeholder').style.display = 'flex';
      document.getElementById('preview-wrapper').style.display = 'none';
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Nút xuất Ảnh
  const btnExport = document.getElementById('btn-export-image');
  if (btnExport) {
    btnExport.addEventListener('click', exportImage);
  }

  // Nút xuất PDF
  const btnExportPdf = document.getElementById('btn-export-pdf');
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', exportPDF);
  }

  // Nút tải cả Combo (Ảnh + PDF) cùng lúc
  const btnExportAll = document.getElementById('btn-export-all');
  if (btnExportAll) {
    btnExportAll.addEventListener('click', exportBundle);
  }
}

// Bảng màu các ô điểm: Tương phản cao, chữ to rõ
const metricColorThemes = [
  { bg: '#fdf4ff', border: '#e879f9', tagColor: '#701a75', scoreColor: '#090d16' },
  { bg: '#eff6ff', border: '#60a5fa', tagColor: '#1e3a8a', scoreColor: '#090d16' },
  { bg: '#ecfdf5', border: '#34d399', tagColor: '#064e3b', scoreColor: '#090d16' },
  { bg: '#fff7ed', border: '#fb923c', tagColor: '#7c2d12', scoreColor: '#090d16' },
  { bg: '#fff1f2', border: '#fb7185', tagColor: '#881337', scoreColor: '#090d16' }
];

function renderCardScores() {
  const container = document.getElementById('card-scores-container');
  if (!container) return;

  const count = currentState.scores.length;
  container.style.gridTemplateColumns = `repeat(${count > 0 ? count : 1}, minmax(0, 1fr))`;

  container.innerHTML = currentState.scores.map((item, idx) => {
    const theme = metricColorThemes[idx % metricColorThemes.length];
    return `
      <div style="background: ${theme.bg}; border: 2px solid ${theme.border}; border-radius: 14px; padding: 9px 6px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
        <div style="font-size: 12px; font-weight: 800; color: ${theme.tagColor}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.name}">${item.name || 'Tiêu chí'}</div>
        <div style="font-size: 18px; font-weight: 900; color: ${theme.scoreColor}; margin-top: 2px; display: flex; align-items: baseline; justify-content: center; gap: 2px;">
          <span>${item.score || '-'}</span><span style="font-size: 12px; font-weight: 900; color: #e11d48;">/5</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderTotalScoreAndRank() {
  const cardTotalEl = document.getElementById('card-total-score');
  if (cardTotalEl) {
    cardTotalEl.innerText = (currentState.totalScore !== undefined && currentState.totalScore !== '') ? currentState.totalScore : '-';
  }
  const cardRankEl = document.getElementById('card-rank');
  if (cardRankEl) {
    cardRankEl.innerText = currentState.rank || '-';
  }
}

function renderCardPreview() {
  document.getElementById('card-event').innerText = currentState.event || 'CHECKPOINT';
  document.getElementById('card-branch').innerText = currentState.branch || 'MindX School';

  document.getElementById('card-name').innerText = currentState.studentName || 'Họ và tên học viên';
  document.getElementById('card-class').innerText = `Lớp: ${currentState.classCode || '---'}`;
  document.getElementById('card-avatar').src = currentState.avatarUrl;

  renderTotalScoreAndRank();
  renderCardScores();

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
      scale: 3, // Tăng scale lên 3x để chữ cực kỳ nét, không vỡ
      useCORS: true,
      backgroundColor: '#ffffff',
      borderRadius: 28,
      logging: false
    });

    const safeName = (currentState.studentName || 'Hoc_Vien')
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_");
      
    const safeEvent = (currentState.event || 'Checkpoint').replace(/[^a-zA-Z0-9]/g, "_");

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

async function exportPDF() {
  const cardElement = document.getElementById('card-render-node');
  const btnExportPdf = document.getElementById('btn-export-pdf');

  const oldText = btnExportPdf.innerHTML;
  btnExportPdf.innerHTML = `<span>Đang tạo PDF...</span>`;
  btnExportPdf.disabled = true;

  try {
    const canvas = await window.html2canvas(cardElement, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      borderRadius: 28,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;

    const cardWidth = cardElement.offsetWidth || 480;
    const cardHeight = cardElement.offsetHeight || 640;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [cardWidth, cardHeight]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, cardWidth, cardHeight);

    const safeName = (currentState.studentName || 'Hoc_Vien')
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_");
      
    const safeEvent = (currentState.event || 'Danh_Gia').replace(/[^a-zA-Z0-9]/g, "_");

    pdf.save(`Phieu_${safeName}_${safeEvent}.pdf`);
  } catch (error) {
    console.error('Lỗi khi xuất PDF:', error);
    alert('Không thể xuất PDF: ' + error.message);
  } finally {
    btnExportPdf.innerHTML = oldText;
    btnExportPdf.disabled = false;
    if (window.lucide) window.lucide.createIcons();
  }
}

// Hàm tải trọn bộ cả file Ảnh và file PDF chỉ trong 1 click
async function exportBundle() {
  const cardElement = document.getElementById('card-render-node');
  const btnExportAll = document.getElementById('btn-export-all');

  const oldText = btnExportAll.innerHTML;
  btnExportAll.innerHTML = `<span>Đang đóng gói Bộ (Ảnh + PDF)...</span>`;
  btnExportAll.disabled = true;

  try {
    // 1. Chụp Canvas 1 lần duy nhất với scale 3.0x nét căng
    const canvas = await window.html2canvas(cardElement, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      borderRadius: 28,
      logging: false
    });

    const safeName = (currentState.studentName || 'Hoc_Vien')
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_");
      
    const safeEvent = (currentState.event || 'Checkpoint').replace(/[^a-zA-Z0-9]/g, "_");

    // 2. Tải file Ảnh PNG
    const imgData = canvas.toDataURL('image/png');
    const imageAnchor = document.createElement('a');
    imageAnchor.download = `Phieu_${safeName}_${safeEvent}.png`;
    imageAnchor.href = imgData;
    imageAnchor.click();

    // 3. Tải file PDF (tạo trực tiếp từ imgData của canvas, chạy tức thì)
    setTimeout(() => {
      const { jsPDF } = window.jspdf;
      const cardWidth = cardElement.offsetWidth || 480;
      const cardHeight = cardElement.offsetHeight || 640;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [cardWidth, cardHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, cardWidth, cardHeight);
      pdf.save(`Phieu_${safeName}_${safeEvent}.pdf`);
    }, 400);

  } catch (error) {
    console.error('Lỗi khi tải trọn bộ:', error);
    alert('Có lỗi khi tải: ' + error.message);
  } finally {
    setTimeout(() => {
      btnExportAll.innerHTML = oldText;
      btnExportAll.disabled = false;
      if (window.lucide) window.lucide.createIcons();
    }, 800);
  }
}
