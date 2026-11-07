# MindX Student Card Generator 🚀🎨

> An automated, client-side web application designed for educators and educational consultants at **MindX Tech & AI School** to instantly generate professional, vibrant, and high-resolution student assessment cards for messaging apps (Zalo, Messenger) and PDF reports.

Live Demo: [https://mindx-card-generator.vercel.app](https://mindx-card-generator.vercel.app)

---

## 🌟 The Problem Solved

In modern educational operations:
- Parents rarely log into complex portal apps to review detailed student gradebooks.
- However, sending a visually appealing, concise summary image directly via **Zalo/messaging apps** has proven to achieve immediate engagement, high open rates, and instant parent feedback.
- Manually creating these report cards on Canva takes **5–10 minutes per student**, leading to operational burnout during assessment checkpoints.
- **MindX Card Generator** cuts this workflow down to **30 seconds per card**, completely automating formatting, branding, score tracking, and exports.

---

## ✨ Key Features

- **⚡ Instant Real-time Assessment Card Creation:** Fill out student details, evaluate performance criteria, craft feedback, and see a pixel-perfect live preview immediately.
- **🎨 Vibrant & Brand-Compliant Aesthetic:** Tailored specifically for MindX Tech & AI School, featuring official brand typography, gradient headers, playful accents, and distinct section badges for kids and teens.
- **🎯 100% High-Contrast Crisp Typography:** Optimized with custom high-contrast color palettes and bold font weights (`Plus Jakarta Sans`), ensuring all feedback is effortlessly readable on mobile screens without blurriness.
- **📊 Dynamic 5/5 Score System:**
  - Standardized on a `5/5` scale based on corporate evaluation standards.
  - Fully customizable metric names (e.g., *Practical Coding*, *Logical Thinking*, *Final Demo Project*).
  - Ability to add or remove criteria dynamically with auto-adjusting grid layouts.
- **🏆 Academic Ranking System:** Supports standard classification levels: `Rank A 🏆`, `Rank B 🎯`, `Rank C 🚀`, and `Rank D 🌱`.
- **💡 Quick Feedback Suggestion Bank:** One-click pre-populated pedagogical comments across *Strengths*, *Areas for Growth*, and *Actionable Advice* to assist teachers during rapid entry.
- **📸 High-Resolution Image Export (PNG):** Client-side DOM-to-image capture rendered at `3.0x` scale, outputting an ultra-sharp `4:5` vertical aspect ratio optimized for mobile messaging.
- **📄 Instant PDF Export:** Generates clean, publication-ready PDF documents via `jsPDF` for archival or printing needs.
- **🔒 Pure Client-Side Privacy:** Zero server dependencies. Student names, scores, and uploaded photos never leave the browser.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Markup & Layout** | **HTML5 Semantic & Modular CSS** | Separated structure and styling for optimal maintainability and clean styling isolation. |
| **Typography** | **Plus Jakarta Sans (Google Fonts)** | Modern, geometric, legible sans-serif designed for UI and print clarity. |
| **Icons** | **Lucide Icons** | Consistent, lightweight SVG icon set. |
| **Image Rendering** | **html2canvas (v1.4.1)** | Client-side DOM canvas rasterizer rendered at `3.0x` pixel density. |
| **PDF Generation** | **jsPDF (v2.5.1)** | High-fidelity vector PDF compilation directly from DOM elements. |
| **Deployment** | **Vercel** | Automated continuous deployment linked with GitHub commits. |

---

## 📂 Project Structure

```text
mindx-card-generator/
├── assets/
│   ├── favicon.png          # Browser tab icon
│   └── mindx-logo.jpg       # Official MindX Tech & AI School logo
├── css/
│   └── styles.css           # Custom styles, vibrant gradients, and responsive layout
├── js/
│   ├── app.js               # Application logic, DOM events, and export pipelines
│   └── data.js              # State initialization and pedagogical comment bank
├── index.html               # Main application interface and canvas structure
└── README.md                # Comprehensive documentation
```

---

## 🚀 Getting Started

### Local Development

No complex build setups, Node.js installations, or bundlers are required.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BaoAnh020603/mindx-card-generator.git
   cd mindx-card-generator
   ```

2. **Open in browser:**
   - Double click `index.html` or serve with any local HTTP server (such as VS Code *Live Server* or Python `python -m http.server 8080`).

---

## 📖 How to Use

1. **Enter School & Event Info:** Specify the assessment checkpoint (e.g., `CHECKPOINT 1`, `DEMO DAY`) and branch location (e.g., `MindX Thuan An`).
2. **Student Profile:** Fill in student name, class code, and optionally upload a portrait photo.
3. **Configure Scores:** Set the academic rank and adjust criteria scores (out of 5). Use `+ Thêm tiêu chí điểm` to add custom metrics.
4. **Pedagogical Feedback:** Write custom observations or click `+ Gợi ý mẫu` to quickly insert suggested comments.
5. **Generate & Download:**
   - Click **"Tạo Phiếu Đánh Giá Rực Rỡ"** to render the card.
   - Choose **"Tải Ảnh Zalo"** for a high-res `.png` or **"Tải PDF"** for a print-ready document.

---

## 📄 License

Distributed under the MIT License. Developed for educational automation and operational excellence at **MindX Tech & AI School**.
