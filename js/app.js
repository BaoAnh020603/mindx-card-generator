import { commentTemplates, initialCardData, DEFAULT_AVATAR_PLACEHOLDER } from './data.js';

let currentState = JSON.parse(JSON.stringify(initialCardData));
let isGenerated = false;

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  renderScoreInputs();
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
        <input type="number" step="0.5" min="0" max="5" class="input-field score-val-input" data-index="${index}" value="${item.score}" placeholder="Điểm" style="text-align: center; font-weight: 900; font-size: 15px; color: #090d16;">
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
      if (isGenerated) renderCardScores();
    });
  });

  container.querySelectorAll('.btn-remove-score').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.currentTarget.dataset.index;
      currentState.scores.splice(idx, 1);
      renderScoreInputs();
      if (isGenerated) renderCardScores();
    });
  });
}

function attachEventListeners() {
  const form = document.getElementById('card-form');

  const btnAddScore = document.getElementById('btn-add-score');
  if (btnAddScore) {
    btnAddScore.addEventListener('click', () => {
      if (currentState.scores.length < 5) {
        currentState.scores.push({ name: "Tiêu chí mới", score: "5" });
        renderScoreInputs();
        if (isGenerated) renderCardScores();
      } else {
        alert("Thẻ hiển thị đẹp nhất với tối đa 4 - 5 tiêu chí điểm.");
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    currentState.event = document.getElementById('input-event').value;
    currentState.branch = document.getElementById('input-branch').value;
    currentState.studentName = document.getElementById('input-name').value;
    currentState.classCode = document.getElementById('input-class').value;
    currentState.rank = document.getElementById('input-rank').value;

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

  const btnExport = document.getElementById('btn-export-image');
  if (btnExport) {
    btnExport.addEventListener('click', exportImage);
  }

  const btnExportPdf = document.getElementById('btn-export-pdf');
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', exportPDF);
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

function renderCardPreview() {
  document.getElementById('card-event').innerText = currentState.event || 'CHECKPOINT';
  document.getElementById('card-branch').innerText = currentState.branch || 'MindX School';

  document.getElementById('card-name').innerText = currentState.studentName || 'Họ và tên học viên';
  document.getElementById('card-class').innerText = `Lớp: ${currentState.classCode || '---'}`;
  document.getElementById('card-avatar').src = currentState.avatarUrl;

  document.getElementById('card-rank').innerText = currentState.rank || '-';

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

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [480, 640]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 480, 640);

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
