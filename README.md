# 动物连连看游戏 / Animal Lianliankan Game 🐾

一个基于HTML5的动物主题连连看游戏，支持多种难度和道具功能。

A web-based animal-themed matching tile game (Lianliankan) with multiple difficulty levels and power-ups.

## 功能特性 / Features

### ✨ 核心功能 / Core Features
- 🎮 **三种难度选择** / Three difficulty levels:
  - 简单 Easy: 6x6 网格 (3分钟)
  - 中等 Medium: 8x8 网格 (5分钟)
  - 困难 Hard: 10x10 网格 (8分钟)

- 🔧 **道具系统** / Power-ups:
  - 🔀 洗牌 Shuffle (3次使用机会)
  - 💡 提示 Hint (3次使用机会)
  - ⏸️ 暂停 Pause

- 📱 **响应式设计** / Responsive Design:
  - 完美适配PC和移动端
  - 自适应屏幕尺寸

- 🎨 **游戏体验** / Game Experience:
  - 配对成功显示连接线动画
  - 倒计时进度条
  - 实时分数统计
  - 可爱的动物表情符号

## 游戏规则 / Game Rules

1. 点击两个相同的动物方块进行配对
2. 两个方块之间的连接线最多可以转2个弯
3. 成功配对后方块消失，获得100分
4. 在时间结束前消除所有方块即可获胜
5. 使用道具帮助完成游戏

## 如何运行 / How to Run

### 方法1：直接打开 / Method 1: Direct Open
直接在浏览器中打开 `index.html` 文件即可开始游戏。

Simply open `index.html` in your web browser to start playing.

### 方法2：本地服务器 / Method 2: Local Server
```bash
# 使用 Python
python -m http.server 8080

# 或使用 Node.js
npx http-server

# 然后访问 http://localhost:8080
```

## 文件结构 / File Structure

```
lianliankan-game/
├── index.html      # 主HTML文件 / Main HTML file
├── style.css       # 样式表 / Stylesheet
├── game.js         # 游戏逻辑 / Game logic
└── README.md       # 说明文档 / Documentation
```

## 技术栈 / Tech Stack

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- SVG (for connection lines)

## 游戏截图 / Screenshots

![Start Screen](https://github.com/user-attachments/assets/29046f05-0efb-44f9-8817-c34fa58b77f5)
*游戏开始界面 / Start Screen*

![Game Board](https://github.com/user-attachments/assets/57bf8087-2566-4428-b17b-f9facd40ec40)
*游戏主界面 / Game Board*

![Mobile View](https://github.com/user-attachments/assets/faa202e9-323d-4046-936f-bc0d21492bae)
*移动端适配 / Mobile View*

## 浏览器支持 / Browser Support

- Chrome/Edge (推荐 / Recommended)
- Firefox
- Safari
- 移动端浏览器 / Mobile Browsers

## 许可证 / License

MIT License

## 贡献 / Contributing

欢迎提交问题和拉取请求！

Issues and pull requests are welcome!