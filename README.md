# Translation Extension for Chrome / Extension Dịch Thuật cho Chrome

[English](#english) | [Tiếng Việt](#tiếng-việt)

---

## English

### Overview
A modern and intelligent Chrome extension for translating selected text with phonetic transcription and text-to-speech functionality.

### Features
- ✨ **Multiple Translation Services**
  - Google Translate (default, supports many languages)
  - Gemini AI (high accuracy, context-aware)
  - LibreTranslate (open-source alternative)
  - MyMemory (backup service)

- 🔤 **Phonetic Transcription**
  - Pinyin for Chinese
  - Romaji for Japanese
  - IPA for English and other languages

- 🔊 **Text-to-Speech**
  - Listen to both original and translated text
  - Automatic language detection for pronunciation

- 🎨 **Modern UI**
  - Clean and responsive design
  - Preserves text formatting (line breaks, spaces)
  - Dark mode compatible

### Installation

1. **Download/Clone this repository**
   ```bash
   git clone https://github.com/marx5/translate-extension.git
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (top right corner)

3. **Load the extension**
   - Click **Load unpacked**
   - Select the `chrome-extension` folder

4. **Configure API Key (Optional)**
   - Open `chrome-extension/config.js`
   - Replace the Gemini API key with your own from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Usage

#### Method 1: Select and Translate
1. Select any text on a webpage
2. Click the extension icon in the toolbar
3. The popup will automatically show the translation

#### Method 2: Manual Input
1. Click the extension icon
2. Type or paste text into the input field
3. Click **Translate** button

#### Features in the Popup
- **Service Selector**: Choose your preferred translation service
- **Language Selection**: 
  - Source: Auto Detect or select specific language
  - Target: Choose target language (default: Vietnamese)
- **Phonetic Display**: Shows phonetic transcription below text
- **Speaker Icons**: Click 🔊 to hear pronunciation
- **Preserved Formatting**: Line breaks and formatting are maintained

### Supported Languages
- English
- Vietnamese
- Chinese (Simplified)
- Japanese
- Korean
- French
- Spanish
- German
- Russian

### Configuration

Edit `chrome-extension/config.js` to customize:
```javascript
const CONFIG = {
  GEMINI_API_KEY: 'your-api-key-here'
};
```

### Troubleshooting

**Extension not working?**
- Check if Developer mode is enabled
- Reload the extension after making changes
- Check browser console for errors

**No translation result?**
- Verify internet connection
- Try switching to a different translation service
- Check if the API key is valid (for Gemini)

**No phonetic transcription?**
- Phonetics are not available for all languages
- English: Works for words/short phrases (up to 10 words)
- Chinese/Japanese: Provided by translation service
- Try using Gemini AI for better phonetic support

### Privacy
- No data is collected or stored
- All translations are processed through third-party APIs
- API keys are stored locally in your browser

### License
MIT License

---

## Tiếng Việt

### Tổng Quan
Extension Chrome hiện đại và thông minh để dịch văn bản đã chọn với phiên âm và tính năng phát âm.

### Tính Năng
- ✨ **Nhiều Dịch Vụ Dịch Thuật**
  - Google Translate (mặc định, hỗ trợ nhiều ngôn ngữ)
  - Gemini AI (độ chính xác cao, hiểu ngữ cảnh)
  - LibreTranslate (mã nguồn mở)
  - MyMemory (dịch vụ dự phòng)

- 🔤 **Phiên Âm**
  - Pinyin cho tiếng Trung
  - Romaji cho tiếng Nhật
  - IPA cho tiếng Anh và các ngôn ngữ khác

- 🔊 **Phát Âm**
  - Nghe cả văn bản gốc và bản dịch
  - Tự động phát hiện ngôn ngữ để phát âm

- 🎨 **Giao Diện Hiện Đại**
  - Thiết kế sạch sẽ và responsive
  - Giữ nguyên định dạng văn bản (xuống dòng, khoảng trắng)
  - Tương thích chế độ tối

### Cài Đặt

1. **Tải/Clone repository này**
   ```bash
   git clone https://github.com/marx5/translate-extension.git
   ```

2. **Mở trang Extensions của Chrome**
   - Truy cập `chrome://extensions/`
   - Bật **Developer mode** (góc trên bên phải)

3. **Tải extension**
   - Nhấp **Load unpacked** (Tải tiện ích đã giải nén)
   - Chọn thư mục `chrome-extension`

4. **Cấu hình API Key (Tùy chọn)**
   - Mở file `chrome-extension/config.js`
   - Thay thế API key của Gemini bằng key của bạn từ [Google AI Studio](https://aistudio.google.com/app/apikey)

### Sử Dụng

#### Cách 1: Chọn và Dịch
1. Bôi đen văn bản bất kỳ trên trang web
2. Nhấp vào icon extension trên thanh công cụ
3. Popup sẽ tự động hiển thị bản dịch

#### Cách 2: Nhập Thủ Công
1. Nhấp vào icon extension
2. Gõ hoặc dán văn bản vào ô nhập liệu
3. Nhấp nút **Translate**

#### Các Tính Năng trong Popup
- **Chọn Dịch Vụ**: Chọn dịch vụ dịch thuật ưa thích
- **Chọn Ngôn Ngữ**:
  - Nguồn: Tự động phát hiện hoặc chọn ngôn ngữ cụ thể
  - Đích: Chọn ngôn ngữ đích (mặc định: Tiếng Việt)
- **Hiển Thị Phiên Âm**: Hiển thị phiên âm bên dưới văn bản
- **Icon Loa**: Nhấp 🔊 để nghe phát âm
- **Giữ Định Dạng**: Xuống dòng và định dạng được giữ nguyên

### Ngôn Ngữ Được Hỗ Trợ
- Tiếng Anh
- Tiếng Việt
- Tiếng Trung (Giản thể)
- Tiếng Nhật
- Tiếng Hàn
- Tiếng Pháp
- Tiếng Tây Ban Nha
- Tiếng Đức
- Tiếng Nga

### Cấu Hình

Chỉnh sửa `chrome-extension/config.js` để tùy chỉnh:
```javascript
const CONFIG = {
  GEMINI_API_KEY: 'api-key-cua-ban'
};
```

### Xử Lý Sự Cố

**Extension không hoạt động?**
- Kiểm tra xem Developer mode đã được bật chưa
- Reload extension sau khi thay đổi
- Kiểm tra console của trình duyệt để xem lỗi

**Không có kết quả dịch?**
- Kiểm tra kết nối internet
- Thử chuyển sang dịch vụ dịch thuật khác
- Kiểm tra API key có hợp lệ không (đối với Gemini)

**Không có phiên âm?**
- Phiên âm không có sẵn cho tất cả ngôn ngữ
- Tiếng Anh: Hoạt động với từ đơn/cụm từ ngắn (tối đa 10 từ)
- Tiếng Trung/Nhật: Được cung cấp bởi dịch vụ dịch thuật
- Thử dùng Gemini AI để có hỗ trợ phiên âm tốt hơn

### Quyền Riêng Tư
- Không thu thập hoặc lưu trữ dữ liệu
- Tất cả bản dịch được xử lý qua API bên thứ ba
- API key được lưu cục bộ trong trình duyệt của bạn

### Giấy Phép
MIT License

---

## Screenshots / Ảnh Chụp Màn Hình

*Extension popup with translation result / Popup extension với kết quả dịch*

---

## Contributing / Đóng Góp
Contributions are welcome! Feel free to open issues or submit pull requests.

Rất hoan nghênh các đóng góp! Hãy thoải mái tạo issue hoặc gửi pull request.

## Support / Hỗ Trợ
For issues and questions, please open an issue on GitHub.

Đối với các vấn đề và câu hỏi, vui lòng tạo issue trên GitHub.
