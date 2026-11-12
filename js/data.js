// Ngân hàng gợi ý câu nhận xét chuẩn sư phạm MindX
export const commentTemplates = {
  strength: [
    "Con tiếp thu bài nhanh, tư duy logic tốt và hoàn thành bài kiểm tra đúng hạn.",
    "Rất sáng tạo trong việc phối màu và thiết kế nhân vật trong sản phẩm.",
    "Thao tác máy tính nhanh nhẹn, nhớ kiến thức cũ tốt và chủ động giúp đỡ bạn bè.",
    "Kỹ năng giải quyết vấn đề (troubleshooting/debug) rất tốt khi gặp lỗi bài tập.",
    "Tự giác học tập, luôn hoàn thành các thử thách nâng cao của thầy/cô giao."
  ],
  improve: [
    "Con cần đọc kỹ yêu cầu đề bài trước khi bắt tay vào ghép khối lệnh.",
    "Cần rèn luyện thêm tính kiên nhẫn khi sửa lỗi chương trình, tránh nản lòng.",
    "Lưu ý phân bổ thời gian đều giữa phần lý thuyết và phần thực hành sáng tạo.",
    "Con hãy tự tin giơ tay phát biểu và chia sẻ ý tưởng của mình nhiều hơn nhé."
  ],
  advice: [
    "Dành 15-20 phút thực hành thêm tại nhà mỗi tuần để rèn phản xạ tư duy.",
    "Tiếp tục phát huy tinh thần sáng tạo và tính tự lập trong các buổi học tới.",
    "Thầy cô tin con sẽ có một sản phẩm bứt phá tại buổi báo cáo cuối khóa!",
    "Khuyến khích con tham gia đặt câu hỏi nhiều hơn để hiểu sâu bản chất vấn đề."
  ]
};

// Avatar mặc định trung tính khi chưa upload ảnh bé
export const DEFAULT_AVATAR_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

// Dữ liệu ban đầu để trống hoàn toàn, linh hoạt tiêu chí điểm theo thang /5
export const initialCardData = {
  event: "",
  branch: "",
  studentName: "",
  classCode: "",
  avatarUrl: DEFAULT_AVATAR_PLACEHOLDER,
  totalScore: "",
  rank: "",
  scores: [
    { name: "Điểm năng lực", score: "5" },
    { name: "Điểm thực hành", score: "5" },
    { name: "Điểm trắc nghiệm", score: "5" }
  ],
  strengthText: "",
  improveText: "",
  adviceText: ""
};
