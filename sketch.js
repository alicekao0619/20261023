// ==========================================
// 遊戲全域狀態與變數設定
// ==========================================
// 0:開始, 1:故事1, 2:故事2, 3:料理選擇, 4:拼圖遊戲, 5:問答說明, 6:問答遊戲, 7:成績公布
let gameState = 0;

// ------------------------------------------
// 【新增】固定設計尺寸 1280 x 720（和背景圖片一樣大）
// 所有座標都用這個尺寸來寫，畫面再依視窗大小等比例縮放並置中，
// 這樣不管視窗多大，文字都會跟著圖片一起縮放，不會跑出框外或偏移。
// ------------------------------------------
const VW = 1280;
const VH = 720;
let sc = 1;          // 縮放比例
let offX = 0;        // 畫面左右留白
let offY = 0;        // 畫面上下留白
let mx = 0, my = 0;  // 換算後的滑鼠座標（取代 mouseX / mouseY）

// 圖片資源
let bgImage;
let storyImg1;
let storyImg2;
let woodBg;
let quizIntroImg;
let quizBgImg;
let resultBgImg;

// 音效與拼圖物件
let puzzleImgs = {};
let wrongSound;

// 故事文字控制
let storyText1 = "人類與外星人的大戰結束，外星人宣布投降，\n人類終於迎來勝利";
let storyText2 = "其中料理方面，人類忘記了一道道美味的料理\n直到你有天無意間翻開師傅留給自己的料理手札\n手札裡掉出一些碎片，隱約能看出一些字......\n似乎回想起來什麼被魔法塵封的記憶\n決心繼承師傅意智喚起失落的料理。";
let charIndex = 0;
let typingSpeed = 3;

// 故事圖片中灰色框的範圍（以 1280x720 圖片座標量測）
const STORY_BOX = { x: 95, y: 222, w: 1090, h: 450 };

// 料理選單設定
let menuButtons = [
  { name: "茶碗蒸", key: "chawanmushi" },
  { name: "咖哩飯", key: "curry" },
  { name: "蛋包飯", key: "omurice" },
  { name: "熔岩巧克力馬克杯蛋糕", key: "mugcake" }
];
let currentRecipeKey = "";

// 料理選擇按鈕版面
const MENU_BTN = { w: 640, h: 68, startY: 220, spacing: 100 };

// 拼圖系統變數
let currentPuzzleImg;
let puzzlePieces = [];
let draggingPiece = null;
let draggedOffsetX = 0;
let draggedOffsetY = 0;
let completedPieces = 0;
let puzzleCompleteTime = 0;
let baseW, baseH, baseX, baseY;

// 問答系統變數
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let quizStatus = "playing";   // playing / correct / wrong
let quizTimer = 0;
let selectedOptionIndex = -1;
let flowers = [];             // 【新增】答對時的花朵動畫

// 問答畫面版面（問答背景框約為 x:52~1228, y:38~682）
const QUIZ = {
  btnW: 820, btnH: 64, startY: 215, spacing: 80,
  panelX: 140, panelY: 430, panelW: 1000, panelH: 170,
  nextX: 640, nextY: 640, nextW: 260, nextH: 52
};

// 成績畫面按鈕
const RESULT_BTN = { w: 400, h: 52, y: 672, leftX: 340, rightX: 940 };

// 專屬題庫設定（【新增】每題加上 exp 解說）
const quizDatabase = {
  "chawanmushi": [
    { q: "茶碗蒸放入電鍋後，加熱多久合適？", options: ["1至2分鐘", "10至12分鐘", "45至50分鐘"], ans: 1,
      exp: "電鍋外鍋放約半杯水，蒸10至12分鐘蛋液剛好凝固。時間太短中間不會熟，太久則蛋會變老，出現像蜂巢一樣的氣孔。" },
    { q: "製作茶碗蒸時，蛋液與高湯的最佳比例約為？", options: ["1:1", "1:2", "1:4"], ans: 1,
      exp: "蛋液與高湯約1:2，可以同時做到滑嫩又能凝固。高湯太少口感會偏硬，高湯太多則蛋液不容易凝固。" },
    { q: "為了讓茶碗蒸表面平滑沒有氣孔，入鍋前應該？", options: ["用力攪拌產生泡泡", "用保鮮膜或蓋子蓋住", "加入大量鹽巴"], ans: 1,
      exp: "蒸的時候鍋蓋上的水蒸氣會滴下來，蓋上保鮮膜或小蓋子能擋住水滴，表面就不會出現坑洞。" },
    { q: "茶碗蒸的蛋液在過濾時，主要目的是什麼？", options: ["去除蛋筋與雜質", "增加蛋液的甜度", "改變蛋液的顏色"], ans: 0,
      exp: "過濾可以濾掉蛋筋（繫帶）、雜質和氣泡，讓蒸出來的茶碗蒸口感更細緻、表面更光滑。" },
    { q: "如果想讓茶碗蒸更有鮮味，通常會加入哪種食材的汁液？", options: ["檸檬汁", "蛤蜊高湯", "番茄醬"], ans: 1,
      exp: "蛤蜊高湯帶有豐富的海味與鮮甜，和蛋的味道很搭；檸檬汁和番茄醬的酸味反而會蓋過蛋香。" }
  ],
  "curry": [
    { q: "煮咖哩時，為了增加甜味與濃稠度，通常會先炒軟哪種蔬菜？", options: ["洋蔥", "青椒", "高麗菜"], ans: 0,
      exp: "洋蔥慢慢炒到軟化、微微焦糖色時會釋放甜味，燉煮後融進醬汁，讓咖哩更甜也更濃稠。" },
    { q: "日式咖哩塊通常在哪個步驟加入鍋中？", options: ["一開始和生肉一起炒", "水滾後立刻加入", "關火或微火時加入攪拌"], ans: 2,
      exp: "咖哩塊在大滾的湯裡容易結塊、黏鍋燒焦。先關火讓它慢慢溶解，再開小火收汁，醬汁會最滑順。" },
    { q: "哪一種肉類最常被用來製作日式家常咖哩？", options: ["魚肉", "雞肉或豬肉", "羊肉"], ans: 1,
      exp: "日本家庭咖哩最常用雞肉或豬肉，價格親民、燉煮後軟嫩，也很容易吸收咖哩的香味。" },
    { q: "為了讓咖哩風味更豐富，有些人會加入少許的？", options: ["黑巧克力或蘋果泥", "香草冰淇淋", "薄荷葉"], ans: 0,
      exp: "黑巧克力能增加醇厚的苦甜層次，蘋果泥帶來果香與自然甜味，都是常見的咖哩「隱藏版」調味。" },
    { q: "保存吃剩的咖哩時，最正確的做法是？", options: ["放在室溫下兩天", "完全放涼後冷藏或冷凍", "趁熱直接放入冰箱"], ans: 1,
      exp: "咖哩放在室溫太久容易孳生細菌；整鍋熱咖哩直接放冰箱又會讓冰箱溫度升高。建議分裝成小份盡快放涼，再冷藏或冷凍。" }
  ],
  "omurice": [
    { q: "製作蛋包飯的蛋皮時，火候應該如何控制？", options: ["全程大火", "中火轉小火", "不用開火"], ans: 1,
      exp: "先用中火讓蛋液快速定型，再轉小火慢慢熟成，蛋皮才不會焦掉，又能保持滑嫩。" },
    { q: "蛋包飯裡面的炒飯，最經典的口味是？", options: ["青醬炒飯", "番茄醬炒飯", "醬油炒飯"], ans: 1,
      exp: "日式蛋包飯最經典的內餡是用番茄醬炒的雞肉炒飯，酸甜的味道和滑嫩的蛋皮非常搭。" },
    { q: "為了讓蛋皮滑嫩不破，可以在蛋液中加入少許的？", options: ["牛奶或鮮奶油", "麵粉", "辣椒水"], ans: 0,
      exp: "牛奶或鮮奶油能增加水分與油脂，讓蛋皮更柔軟有彈性、不容易破；加麵粉則會讓口感變硬。" },
    { q: "經典的日式蛋包飯，通常會在蛋皮上方淋上什麼醬汁？", options: ["番茄醬或多明格拉斯醬", "美乃滋", "黃芥末醬"], ans: 0,
      exp: "番茄醬是家庭最常見的淋醬；多明格拉斯醬（Demi-glace）是用高湯熬煮的褐色醬汁，常見於洋食餐廳。" },
    { q: "炒飯時為了讓飯粒粒粒分明，最好使用？", options: ["剛煮好的軟爛熱飯", "放涼的隔夜飯", "生米直接炒"], ans: 1,
      exp: "隔夜飯的水分比較少，下鍋炒時不容易黏成一團，就能炒出粒粒分明的口感。" }
  ],
  "mugcake": [
    { q: "盛裝加熱用的馬克杯必須選擇什麼材質才安全？", options: ["金屬鋼杯", "一次性塑膠杯", "陶瓷杯(可微波)"], ans: 2,
      exp: "金屬放進微波爐會產生火花；一次性塑膠杯受熱可能變形。要選擇有標示「可微波」的陶瓷杯。" },
    { q: "製作微波馬克杯蛋糕時，麵糊大約只能裝到杯子的幾分滿？", options: ["全滿", "一半或六分滿", "一分滿"], ans: 1,
      exp: "蛋糕加熱時會膨脹長高，只裝一半到六分滿，才不會溢出杯子、弄髒微波爐。" },
    { q: "為了營造『熔岩』效果，通常會在麵糊中間塞入什麼？", options: ["一顆冰塊", "一塊固體巧克力", "一顆生蛋黃"], ans: 1,
      exp: "中間的巧克力塊受熱後融化，切開時就會流出濃稠的巧克力，形成「熔岩」效果。" },
    { q: "微波馬克杯蛋糕時，通常需要多久時間？", options: ["大約1到2分鐘", "10分鐘以上", "半小時"], ans: 0,
      exp: "一人份的麵糊很少，微波大約1到2分鐘就會熟；加熱太久蛋糕會變得又乾又硬。" },
    { q: "如果微波出來的蛋糕太乾硬，最可能是因為？", options: ["微波時間太長", "糖加太多", "杯子太小"], ans: 0,
      exp: "微波加熱太久會讓麵糊裡的水分蒸發太多，蛋糕就會乾硬。建議先少量加熱，不夠再每次加10秒。" }
  ]
};

// ==========================================
// 雙欄排版專用食譜庫
// ==========================================
const fullRecipes = {
  "chawanmushi": {
    left: "【茶碗蒸】難度：普通⭐⭐\n\n- 準備與比例（約2人份）-\n雞蛋：2顆(去殼約100ml)\n日式高湯：200ml至250ml(蛋與高湯比例1:2)\n調味料：日式醬油1小匙、味醂1小匙、少許鹽\n配料：雞肉丁、蝦仁、香菇、魚板、蛤蜊等",
    right: "- 簡單作法步驟 -\n\n1. 調製蛋液：雞蛋打散，加入放涼的高湯、醬油與味醂輕柔攪勻。\n2. 過篩：用細篩網過濾蛋液1至2次，濾掉氣泡是口感細緻關鍵。\n3. 放入配料：容器底部放入配料，倒入蛋液至八分滿，撈掉浮泡。\n4. 包覆保鮮膜：用耐熱保鮮膜封好，避免水滴掉落造成表面坑洞。\n5. 蒸煮：外鍋放半杯水，鍋蓋留小縫，中小火蒸10~12分，悶3~5分。"
  },
  "curry": {
    left: "【咖哩飯】難度：簡單⭐\n\n- 準備食材（約3-4人份）-\n肉類：雞腿肉或梅花豬肉400克(切3公分塊狀)\n蔬菜：洋蔥2顆(切丁)、馬鈴薯2顆(切塊)、紅蘿蔔1條(切塊)\n調料與基底：咖哩塊5小塊、水700毫升、沙拉油2大匙",
    right: "- 簡單作法步驟 -\n\n1. 煎肉與炒洋蔥：肉塊煎至焦香，加入洋蔥中小火翻炒至散發甜味。\n2. 燉煮食材：放入馬鈴薯與紅蘿蔔，加水煮滾後，轉小火燉煮20分。\n3. 融化咖哩：關火放入咖哩塊，靜置溶解後再開小火收汁。\n4. 提味：可依喜好加入蘋果泥或巧克力增加風味，淋在白飯上享用。"
  },
  "omurice": {
    left: "【蛋包飯】難度：困難⭐⭐⭐\n\n食材準備 (1-2人份)\n炒飯部分：白飯（建議用隔夜飯）1碗、雞腿肉（或火腿/小熱狗）50克、洋蔥 1/4個、番茄醬 2大匙、鹽與黑胡椒少許、無鹽奶油或沙拉油 1小匙。\n蛋皮部分：雞蛋 2-3顆、牛奶或鮮奶油 1大匙（可使蛋液更滑順）、鹽少許、無鹽奶油 10克。",
    right: "製作步驟\n炒番茄飯：\n洋蔥切丁，雞腿肉切小塊。\n熱鍋加入少許油，先炒香洋蔥丁與雞肉至熟，再放入白飯炒鬆。\n加入番茄醬、少許鹽與黑胡椒，將米飯與醬料翻炒均勻、收乾水分後，盛出裝碗備用。\n煎滑嫩蛋皮：\n將雞蛋打入碗中，加入牛奶與少許鹽打散過篩。\n平底不沾鍋放入無鹽奶油，開中小火加熱至融化。\n倒入蛋液，用筷子或耐熱刮刀快速繞圈攪拌，讓蛋液呈半熟滑蛋狀態。\n傳統包法：將蛋皮推至鍋邊，把炒飯蓋在蛋皮中央，再將兩側蛋皮往中間折起，倒扣在盤中。\n半熟滑蛋蓋飯法：將半熟的蛋液直接滑到盛好的番茄炒飯上。"
  },
  "mugcake": {
    left: "【熔岩馬克杯蛋糕】難度：簡單⭐\n\n- 準備材料（1人份）-\n乾性：低筋麵粉1/4杯、砂糖2大匙、可可粉2大匙、泡打粉1/2小匙。\n濕性：牛奶3大匙、融化奶油2大匙、雞蛋1顆、香草精1小匙。\n夾心：1塊牛奶或黑巧克力方塊。",
    right: "- 簡單作法步驟 -\n\n1. 混合材料：在可微波馬克杯中放入乾性材料，攪拌均勻。\n2. 加入濕性：打入雞蛋、倒入奶油與牛奶，攪拌至無粉末呈滑順狀。\n3. 放入熔岩心：將巧克力輕輕壓入麵糊中央，稍微被麵糊覆蓋。\n4. 微波加熱：微波爐高火加熱約1至1.5分鐘(中間稍微濕潤即可)。\n5. 稍微放涼：取出靜置2分鐘，直接挖取或搭配冰淇淋享用。"
  }
};


// ==========================================
// P5.JS 核心函式
// ==========================================
function preload() {
  bgImage = loadImage('所需圖片/廚房背景/廚房背景.png');
  storyImg1 = loadImage('所需圖片/開始動畫/第一頁.png');
  storyImg2 = loadImage('所需圖片/開始動畫/第二頁.png');
  woodBg = loadImage('所需圖片/木質桌面/木質桌面.png');
  quizIntroImg = loadImage('所需圖片/問答遊戲說明/問答遊戲說明.png');
  quizBgImg = loadImage('所需圖片/問答遊戲背景/問答遊戲背景.png');
  resultBgImg = loadImage('所需圖片/成績公布背景/成績公布背景.png');
  puzzleImgs["chawanmushi"] = loadImage('所需圖片/食譜拼圖所需圖案/茶碗蒸.png');
  puzzleImgs["curry"] = loadImage('所需圖片/食譜拼圖所需圖案/咖哩.png');
  puzzleImgs["omurice"] = loadImage('所需圖片/食譜拼圖所需圖案/蛋包飯.png');
  puzzleImgs["mugcake"] = loadImage('所需圖片/食譜拼圖所需圖案/熔岩巧克力蛋糕.png');
  wrongSound = loadSound('所需圖片/所需音效/error.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  updateScale();
}

// 【新增】依視窗大小計算縮放比例與置中位移
function updateScale() {
  sc = min(width / VW, height / VH);
  offX = (width - VW * sc) / 2;
  offY = (height - VH * sc) / 2;
}

// 【新增】把真實滑鼠座標換算成 1280x720 設計座標
function updateMouse() {
  mx = (mouseX - offX) / sc;
  my = (mouseY - offY) / sc;
}

function draw() {
  updateMouse();
  background(20);

  push();
  translate(offX, offY);
  scale(sc);
  // 畫面範圍外的部分不顯示
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, 0, VW, VH);
  drawingContext.clip();

  if (gameState === 0) {
    drawCoverImage(bgImage);
    textFont('monospace'); textStyle(BOLD); textAlign(CENTER, CENTER); textSize(76);
    fill(40, 40, 40); text("目標成為料理大師", VW / 2 + 5, VH * 0.3 + 5);
    fill(255, 215, 0); text("目標成為料理大師", VW / 2, VH * 0.3);
    textFont('sans-serif'); textStyle(NORMAL); textSize(38);
    fill(255, 255, 255, 150 + 105 * sin(frameCount * 0.05));
    text("- 點擊畫面開始遊戲 -", VW / 2, VH * 0.85);
  }
  else if (gameState === 1) {
    drawCoverImage(storyImg1);
    drawStoryText(storyText1);
  }
  else if (gameState === 2) {
    drawCoverImage(storyImg2);
    drawStoryText(storyText2);
  }
  else if (gameState === 3) {
    drawSelectionScreen();
  }
  else if (gameState === 4) {
    drawPuzzleScreen();
  }
  else if (gameState === 5) {
    drawQuizIntroScreen();
  }
  else if (gameState === 6) {
    drawQuizScreen();
  }
  else if (gameState === 7) {
    drawResultScreen();
  }

  drawingContext.restore();
  pop();
}

// ==========================================
// 【新增】共用工具函式
// ==========================================

// 圖片以「填滿不變形」方式鋪滿 1280x720
function drawCoverImage(img) {
  imageMode(CORNER);
  let r = max(VW / img.width, VH / img.height);
  let w = img.width * r, h = img.height * r;
  image(img, (VW - w) / 2, (VH - h) / 2, w, h);
}

function isInside(px, py, cx, cy, w, h) {
  return px > cx - w / 2 && px < cx + w / 2 && py > cy - h / 2 && py < cy + h / 2;
}

// 行首不能出現的標點（避免換行後標點跑到下一行開頭）
const NO_LINE_START = "，。、；：！？）」』》…,.;:!?)";

// 中文字逐字換行：回傳每一行的字串陣列（會保留原本的 \n 換行）
function wrapLines(str, maxW) {
  let lines = [];
  let paragraphs = str.split('\n');
  for (let p of paragraphs) {
    let line = "";
    for (let ch of p) {
      let test = line + ch;
      if (textWidth(test) > maxW && line.length > 0 && !NO_LINE_START.includes(ch)) {
        lines.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    lines.push(line);
  }
  return lines;
}

// 找出能讓文字完整放進框內的最大字級
function fitSize(str, w, h, maxSize, minSize, leading) {
  let s = maxSize;
  while (s > minSize) {
    textSize(s);
    if (wrapLines(str, w).length * s * leading <= h) break;
    s -= 1;
  }
  return s;
}

// 把文字放進指定方框：自動換行、自動縮小字級、可置中
// alignH: LEFT 或 CENTER；alignV: TOP 或 CENTER
function drawTextBox(str, x, y, w, h, size, leading, alignH, alignV) {
  textSize(size);
  let lines = wrapLines(str, w);
  let lh = size * leading;
  let total = lines.length * lh;
  let startY = (alignV === CENTER) ? y + (h - total) / 2 : y;
  textAlign(alignH, TOP);
  let tx = (alignH === CENTER) ? x + w / 2 : x;
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], tx, startY + i * lh + (lh - size) / 2);
  }
}

function fitTextBox(str, x, y, w, h, maxSize, minSize, leading, alignH, alignV) {
  let s = fitSize(str, w, h, maxSize, minSize, leading);
  drawTextBox(str, x, y, w, h, s, leading, alignH, alignV);
}

// 帶陰影的文字（讓白字在亮背景上也看得清楚）
function shadowText(str, x, y, col) {
  fill(0, 0, 0, 150);
  text(str, x + 3, y + 3);
  fill(col);
  text(str, x, y);
}

// ==========================================
// 各畫面繪製函式
// ==========================================

// 【修改】故事文字：整段文字在灰框內「水平＋垂直置中」，
// 每行仍靠左對齊，打字效果時文字不會左右跳動
function drawStoryText(fullText) {
  textFont('sans-serif'); textStyle(NORMAL);
  let pad = 40;
  let boxW = STORY_BOX.w - pad * 2;
  let boxH = STORY_BOX.h - pad * 2;
  let leading = 1.8;
  let size = fitSize(fullText, boxW, boxH, 32, 16, leading);
  textSize(size);
  let lines = wrapLines(fullText, boxW);
  let lh = size * leading;

  // 找出最長的一行寬度，讓整段文字區塊置中
  let blockW = 0;
  for (let l of lines) blockW = max(blockW, textWidth(l));
  let startX = STORY_BOX.x + (STORY_BOX.w - blockW) / 2;
  let startY = STORY_BOX.y + (STORY_BOX.h - lines.length * lh) / 2;

  // 打字機效果（只計算看得到的字）
  let totalChars = storyLength(fullText);
  if (frameCount % typingSpeed === 0 && charIndex < totalChars) charIndex++;

  fill(30); textAlign(LEFT, TOP);
  let remain = charIndex;
  for (let i = 0; i < lines.length && remain > 0; i++) {
    let part = lines[i].substring(0, remain);
    text(part, startX, startY + i * lh + (lh - size) / 2);
    remain -= lines[i].length;
  }
}

// 故事可見字數（不含換行符號）
function storyLength(t) {
  return t.replace(/\n/g, '').length;
}

function drawSelectionScreen() {
  drawCoverImage(woodBg);
  textFont('sans-serif');
  textAlign(CENTER, CENTER); textStyle(BOLD); textSize(48);
  shadowText("選擇一張碎片撿起", VW / 2, 110, 255);

  rectMode(CENTER);
  for (let i = 0; i < menuButtons.length; i++) {
    let bx = VW / 2; let by = MENU_BTN.startY + i * MENU_BTN.spacing + 60;
    if (isInside(mx, my, bx, by, MENU_BTN.w, MENU_BTN.h)) fill(200, 150, 100);
    else fill(139, 69, 19);
    noStroke();
    rect(bx, by, MENU_BTN.w, MENU_BTN.h, 10);
    fill(255); textSize(30);
    text(menuButtons[i].name, bx, by);
  }
}

function initPuzzle(recipeKey) {
  currentRecipeKey = recipeKey;
  currentPuzzleImg = puzzleImgs[recipeKey];
  puzzlePieces = []; completedPieces = 0; puzzleCompleteTime = 0;

  let maxW = VW * 0.4; let maxH = VH * 0.4;
  let imgRatio = currentPuzzleImg.width / currentPuzzleImg.height;
  if (maxW / imgRatio <= maxH) { baseW = maxW; baseH = maxW / imgRatio; }
  else { baseH = maxH; baseW = maxH * imgRatio; }
  baseX = VW / 2 - baseW / 2; baseY = 110;

  let pieceW = baseW / 2; let pieceH = baseH / 2;
  let srcW = currentPuzzleImg.width / 2; let srcH = currentPuzzleImg.height / 2;

  let slots = [0, 1, 2, 3]; slots.sort(() => random() - 0.5);
  let gap = VW * 0.03; let totalOptionsW = 4 * pieceW + 3 * gap;
  let startOptionX = VW / 2 - totalOptionsW / 2; let optionY = VH * 0.72;

  let pieceCount = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      let slotIndex = slots[pieceCount];
      let ox = startOptionX + slotIndex * (pieceW + gap);
      let piece = {
        id: r * 2 + c, sx: c * srcW, sy: r * srcH, sw: srcW, sh: srcH,
        targetX: baseX + c * pieceW, targetY: baseY + r * pieceH,
        currentX: ox, currentY: optionY, originX: ox, originY: optionY,
        w: pieceW, h: pieceH, isLocked: false
      };
      puzzlePieces.push(piece); pieceCount++;
    }
  }
}

function drawPuzzleScreen() {
  drawCoverImage(woodBg);
  textFont('sans-serif');
  textAlign(CENTER, CENTER); textStyle(BOLD); textSize(44);
  shadowText("試著將碎片拼湊起來", VW / 2, 60, 255);

  imageMode(CORNER);
  push(); tint(0, 100); image(currentPuzzleImg, baseX, baseY, baseW, baseH); pop();
  for (let i = 0; i < puzzlePieces.length; i++) {
    let p = puzzlePieces[i];
    noStroke(); image(currentPuzzleImg, p.currentX, p.currentY, p.w, p.h, p.sx, p.sy, p.sw, p.sh);
  }

  if (completedPieces === 4) {
    if (millis() - puzzleCompleteTime > 1500) {
      gameState = 5;
    }
  }
}

function drawQuizIntroScreen() {
  drawCoverImage(quizIntroImg);
  textFont('sans-serif'); textStyle(BOLD); textAlign(CENTER, CENTER); textSize(38);
  fill(255, 255, 255, 150 + 105 * sin(frameCount * 0.05));
  text("- 點擊畫面開始測驗 -", VW / 2, VH * 0.85);
}

function initQuiz() {
  currentQuestionIndex = 0; correctAnswersCount = 0;
  quizStatus = "playing"; selectedOptionIndex = -1;
  flowers = [];
}

// 【修改】問答畫面：題目自動換行置中、答錯時正確選項綠框＋上下跳動、
// 答對時花朵動畫、作答後顯示解說與「下一題」按鈕
function drawQuizScreen() {
  drawCoverImage(quizBgImg);
  textFont('sans-serif');
  let currentQ = quizDatabase[currentRecipeKey][currentQuestionIndex];

  // 題數
  textAlign(CENTER, CENTER); textStyle(BOLD); textSize(22);
  shadowText(`題數：${currentQuestionIndex + 1} / 5`, VW / 2, 66, 255);

  // 題目（放在固定框內，太長會自動換行與縮小）
  fill(0, 0, 0, 150);
  fitTextBox(currentQ.q, 140 + 3, 88 + 3, 1000, 92, 36, 20, 1.35, CENTER, CENTER);
  fill(255);
  fitTextBox(currentQ.q, 140, 88, 1000, 92, 36, 20, 1.35, CENTER, CENTER);

  // 選項按鈕
  rectMode(CENTER);
  let t = millis() - quizTimer;
  for (let i = 0; i < currentQ.options.length; i++) {
    let bx = VW / 2; let by = QUIZ.startY + i * QUIZ.spacing;

    if (quizStatus === "playing") {
      if (isInside(mx, my, bx, by, QUIZ.btnW, QUIZ.btnH)) fill('#7a6853');
      else fill('#5e503f');
      strokeWeight(2); stroke(255);
    } else {
      if (i === currentQ.ans) {
        // 正確選項：綠框
        fill('#5e503f'); strokeWeight(6); stroke(60, 210, 90);
        // 答錯時，正確選項上下跳動
        if (quizStatus === "wrong") by += -abs(sin(t * 0.008)) * 14;
      } else if (i === selectedOptionIndex) {
        // 選錯的選項：紅框
        fill('#5e503f'); strokeWeight(6); stroke(230, 60, 60);
      } else {
        fill('#3d3429'); noStroke();
      }
    }

    rect(bx, by, QUIZ.btnW, QUIZ.btnH, 15);
    noStroke(); fill(255); textStyle(BOLD);
    fitTextBox(currentQ.options[i], bx - QUIZ.btnW / 2 + 20, by - QUIZ.btnH / 2, QUIZ.btnW - 40, QUIZ.btnH, 28, 16, 1.2, CENTER, CENTER);
  }

  // 作答後：解說面板 + 下一題按鈕
  if (quizStatus !== "playing") {
    drawExplanationPanel(currentQ);
    drawNextButton();
  }

  // 花朵動畫畫在最上層
  updateAndDrawFlowers();
}

function drawExplanationPanel(q) {
  let x = QUIZ.panelX, y = QUIZ.panelY, w = QUIZ.panelW, h = QUIZ.panelH;
  rectMode(CORNER);
  fill(254, 250, 224, 235); stroke(67, 40, 24); strokeWeight(3);
  rect(x, y, w, h, 14);
  noStroke();

  let pad = 22;
  textStyle(BOLD); textSize(24); textAlign(LEFT, TOP);
  if (quizStatus === "correct") {
    fill(40, 140, 60);
    text("✔ 答對了！", x + pad, y + 16);
  } else {
    fill(200, 50, 50);
    let head = "✘ 答錯了，正確答案是：" + q.options[q.ans];
    fitTextBox(head, x + pad, y + 14, w - pad * 2, 34, 24, 16, 1.2, LEFT, TOP);
  }

  fill(67, 40, 24); textStyle(NORMAL);
  fitTextBox("解說：" + q.exp, x + pad, y + 56, w - pad * 2, h - 56 - 14, 22, 13, 1.5, LEFT, TOP);
}

function drawNextButton() {
  rectMode(CENTER);
  if (isInside(mx, my, QUIZ.nextX, QUIZ.nextY, QUIZ.nextW, QUIZ.nextH)) fill('#7a6853');
  else fill('#5e503f');
  stroke(255); strokeWeight(2);
  rect(QUIZ.nextX, QUIZ.nextY, QUIZ.nextW, QUIZ.nextH, 12);
  noStroke(); fill(255); textStyle(BOLD); textSize(24); textAlign(CENTER, CENTER);
  let label = (currentQuestionIndex >= 4) ? "查看成績 ▶" : "下一題 ▶";
  text(label, QUIZ.nextX, QUIZ.nextY);
}

// ==========================================
// 【新增】花朵動畫
// ==========================================
const FLOWER_COLORS = ['#ffb5c5', '#ffd6e0', '#fff1a8', '#ffffff', '#ffc8a2', '#f7a8c4'];

function spawnFlowers(cx, cy) {
  flowers = [];
  for (let i = 0; i < 16; i++) {
    let ang = random(TWO_PI);
    let spd = random(2, 6);
    flowers.push({
      x: cx + random(-QUIZ.btnW / 2, QUIZ.btnW / 2) * 0.8,
      y: cy + random(-15, 15),
      vx: cos(ang) * spd,
      vy: sin(ang) * spd - 3,
      size: random(26, 46),
      rot: random(TWO_PI),
      vr: random(-0.06, 0.06),
      petals: random([5, 6]),
      col: random(FLOWER_COLORS),
      born: millis() + i * 40,   // 一朵一朵依序綻放
      life: 2200
    });
  }
}

function drawFlower(size, petals, col, alpha) {
  let c = color(col); c.setAlpha(alpha);
  fill(c); stroke(255, 255, 255, alpha * 0.6); strokeWeight(1.5);
  for (let i = 0; i < petals; i++) {
    push();
    rotate(TWO_PI / petals * i);
    ellipse(0, -size * 0.32, size * 0.42, size * 0.62);
    pop();
  }
  noStroke();
  fill(255, 200, 60, alpha);
  circle(0, 0, size * 0.32);
  fill(255, 240, 180, alpha);
  circle(-size * 0.04, -size * 0.04, size * 0.12);
}

function updateAndDrawFlowers() {
  let now = millis();
  for (let i = flowers.length - 1; i >= 0; i--) {
    let f = flowers[i];
    let age = now - f.born;
    if (age < 0) continue;
    if (age > f.life) { flowers.splice(i, 1); continue; }

    f.x += f.vx; f.y += f.vy;
    f.vx *= 0.97; f.vy = f.vy * 0.97 + 0.05; // 慢慢減速、輕輕飄落
    f.rot += f.vr;

    // 綻放：0~400ms 由小長大（帶一點彈跳），最後 600ms 淡出
    let grow = constrain(age / 400, 0, 1);
    let s = f.size * (grow < 1 ? sin(grow * HALF_PI) * 1.15 : 1);
    let alpha = age > f.life - 600 ? map(age, f.life - 600, f.life, 255, 0) : 255;

    push();
    translate(f.x, f.y);
    rotate(f.rot);
    drawFlower(s, f.petals, f.col, alpha);
    pop();
  }
}

// ==========================================
// 繪製成績公布畫面
// ==========================================
function drawResultScreen() {
  drawCoverImage(resultBgImg);
  textFont('sans-serif');

  let title = "";
  let description = "";
  if (correctAnswersCount <= 2) {
    title = "料理見習生";
    description = "雖然嘗試過程有點慌亂，但以往跟著師傅在廚房手忙腳亂學習時的畫面一一浮現心中，你笑著嘆了口氣，從這一刻起似乎再也不會停下復興料理的腳步。";
  } else if (correctAnswersCount <= 4) {
    title = "充滿心得的主廚";
    description = "研究食譜的過程中獲得滿滿心得，看著窗戶反光映著在廚房忙忙碌碌的自己，想起師傅的身影，你擦了擦汗繼續投入料理的世界。";
  } else {
    title = "料理大師";
    description = "看向自己寫的滿滿的筆記，恍神間好像看到了師傅笑著拍了拍你的背，又想起小時候蹦蹦跳跳地對師父說自己要成為料理大師，決定將食譜傳授給更多人，像師父當初教導自己時一般。";
  }

  let mainColor = '#5e503f';
  let hoverColor = '#7a6853';
  rectMode(CORNER); noStroke();

  // 1. 頭銜區塊
  let titleW = 704, titleH = 58;
  let titleX = (VW - titleW) / 2, titleY = 22;
  fill(mainColor);
  rect(titleX, titleY, titleW, titleH, 10);
  fill(255); textStyle(BOLD);
  fitTextBox(`頭銜：${title}（答對 ${correctAnswersCount}/5 題）`, titleX + 20, titleY, titleW - 40, titleH, 30, 16, 1.2, CENTER, CENTER);

  // 2. 配字故事區塊
  let descW = 960, descH = 116;
  let descX = (VW - descW) / 2, descY = 94;
  fill(mainColor);
  rect(descX, descY, descW, descH, 10);
  fill(255); textStyle(NORMAL);
  let pad = 18;
  fitTextBox(description, descX + pad, descY + pad, descW - pad * 2, descH - pad * 2, 22, 12, 1.6, LEFT, CENTER);

  // 3. 【雙欄排版】食譜區塊
  let recipeW = 1088, recipeH = 410;
  let recipeX = (VW - recipeW) / 2, recipeY = 222;
  fill(mainColor);
  rect(recipeX, recipeY, recipeW, recipeH, 10);

  let rPad = 22;
  let columnGap = 32;
  let columnW = (recipeW - rPad * 2 - columnGap) / 2;
  let columnH = recipeH - rPad * 2;
  let leftColX = recipeX + rPad;
  let rightColX = leftColX + columnW + columnGap;

  // 中間分隔線
  stroke(255, 255, 255, 80); strokeWeight(1);
  line(rightColX - columnGap / 2, recipeY + rPad, rightColX - columnGap / 2, recipeY + recipeH - rPad);
  noStroke();

  // 左右兩欄用同一個字級（取兩欄都放得下的較小值），看起來比較整齊
  let recipe = fullRecipes[currentRecipeKey];
  textStyle(NORMAL);
  let leading = 1.5;
  let s = min(
    fitSize(recipe.left, columnW, columnH, 19, 10, leading),
    fitSize(recipe.right, columnW, columnH, 19, 10, leading)
  );
  fill(255);
  drawTextBox(recipe.left, leftColX, recipeY + rPad, columnW, columnH, s, leading, LEFT, TOP);
  drawTextBox(recipe.right, rightColX, recipeY + rPad, columnW, columnH, s, leading, LEFT, TOP);

  // 4. 底部按鈕
  rectMode(CENTER);
  let b = RESULT_BTN;
  fill(isInside(mx, my, b.leftX, b.y, b.w, b.h) ? hoverColor : mainColor);
  rect(b.leftX, b.y, b.w, b.h, 8);
  fill(isInside(mx, my, b.rightX, b.y, b.w, b.h) ? hoverColor : mainColor);
  rect(b.rightX, b.y, b.w, b.h, 8);

  fill(255); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(26);
  text("繼續探索料理", b.leftX, b.y);
  text("回到標題", b.rightX, b.y);
}

// ==========================================
// 滑鼠與觸控事件
// ==========================================
function mousePressed() {
  updateMouse();

  if (gameState === 0) {
    gameState = 1; charIndex = 0;
  }
  else if (gameState === 1) {
    if (charIndex >= storyLength(storyText1)) { gameState = 2; charIndex = 0; }
    else { charIndex = storyLength(storyText1); }
  }
  else if (gameState === 2) {
    if (charIndex >= storyLength(storyText2)) { gameState = 3; }
    else { charIndex = storyLength(storyText2); }
  }
  else if (gameState === 3) {
    for (let i = 0; i < menuButtons.length; i++) {
      let bx = VW / 2; let by = MENU_BTN.startY + i * MENU_BTN.spacing + 60;
      if (isInside(mx, my, bx, by, MENU_BTN.w, MENU_BTN.h)) {
        initPuzzle(menuButtons[i].key);
        gameState = 4; break;
      }
    }
  }
  else if (gameState === 4) {
    for (let i = puzzlePieces.length - 1; i >= 0; i--) {
      let p = puzzlePieces[i];
      if (!p.isLocked && mx > p.currentX && mx < p.currentX + p.w && my > p.currentY && my < p.currentY + p.h) {
        draggingPiece = p; draggedOffsetX = mx - p.currentX; draggedOffsetY = my - p.currentY;
        puzzlePieces.splice(i, 1); puzzlePieces.push(p); break;
      }
    }
  }
  else if (gameState === 5) {
    initQuiz();
    gameState = 6;
  }
  else if (gameState === 6) {
    let currentQ = quizDatabase[currentRecipeKey][currentQuestionIndex];

    if (quizStatus === "playing") {
      for (let i = 0; i < currentQ.options.length; i++) {
        let bx = VW / 2; let by = QUIZ.startY + i * QUIZ.spacing;
        if (isInside(mx, my, bx, by, QUIZ.btnW, QUIZ.btnH)) {
          selectedOptionIndex = i;
          quizTimer = millis();
          if (i === currentQ.ans) {
            quizStatus = "correct";
            correctAnswersCount++;
            spawnFlowers(bx, by);
          } else {
            quizStatus = "wrong";
            if (wrongSound) wrongSound.play();
          }
          break;
        }
      }
    }
    // 【新增】看完解說後，按「下一題」才前往下一題
    else if (isInside(mx, my, QUIZ.nextX, QUIZ.nextY, QUIZ.nextW, QUIZ.nextH)) {
      currentQuestionIndex++;
      flowers = [];
      if (currentQuestionIndex >= 5) { gameState = 7; }
      else { quizStatus = "playing"; selectedOptionIndex = -1; }
    }
  }
  else if (gameState === 7) {
    let b = RESULT_BTN;
    if (isInside(mx, my, b.leftX, b.y, b.w, b.h)) gameState = 3;
    else if (isInside(mx, my, b.rightX, b.y, b.w, b.h)) gameState = 0;
  }
}

function mouseDragged() {
  updateMouse();
  if (gameState === 4 && draggingPiece !== null) {
    draggingPiece.currentX = mx - draggedOffsetX;
    draggingPiece.currentY = my - draggedOffsetY;
  }
  return false;
}

function mouseReleased() {
  if (draggingPiece !== null) {
    let dX = abs(draggingPiece.currentX - draggingPiece.targetX);
    let dY = abs(draggingPiece.currentY - draggingPiece.targetY);
    let snapDistance = draggingPiece.w * 0.2;

    if (dX < snapDistance && dY < snapDistance) {
      draggingPiece.currentX = draggingPiece.targetX; draggingPiece.currentY = draggingPiece.targetY;
      draggingPiece.isLocked = true; completedPieces++;
      if (completedPieces === 4) {
        puzzleCompleteTime = millis();
      }
    } else {
      draggingPiece.currentX = draggingPiece.originX; draggingPiece.currentY = draggingPiece.originY;
      if (wrongSound) wrongSound.play();
    }
    draggingPiece = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateScale();
}
