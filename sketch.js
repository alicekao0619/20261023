// ==========================================
// 遊戲全域狀態與變數設定
// ==========================================
// 0:開始, 1:故事1, 2:故事2, 3:料理選擇, 4:拼圖遊戲, 5:問答說明, 6:問答遊戲, 7:成績公布
let gameState = 0; 

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
let currentText = ""; 
let charIndex = 0; 
let typingSpeed = 3; 

// 料理選單設定
let menuButtons = [
  { name: "茶碗蒸", key: "chawanmushi" },
  { name: "咖哩飯", key: "curry" },
  { name: "蛋包飯", key: "omurice" },
  { name: "熔岩巧克力馬克杯蛋糕", key: "mugcake" }
];
let currentRecipeKey = ""; 

// 拼圖系統變數
let currentPuzzleImg; 
let puzzlePieces = []; 
let draggingPiece = null; 
let draggedOffsetX = 0; 
let draggedOffsetY = 0; 
let completedPieces = 0; 
let puzzleCompleteTime = 0; // 新增：用來記錄拼圖完成的時間，控制 1.5 秒延遲
let baseW, baseH, baseX, baseY;

// 問答系統變數
let currentQuestionIndex = 0; 
let correctAnswersCount = 0;  
let quizStatus = "playing";   
let quizTimer = 0;            
let selectedOptionIndex = -1; 

// 專屬題庫設定
const quizDatabase = {
  "chawanmushi": [
    { q: "茶碗蒸放入電鍋後，加熱多久合適？", options: ["1至2分鐘", "10至12分鐘", "45至50分鐘"], ans: 1 },
    { q: "製作茶碗蒸時，蛋液與高湯的最佳比例約為？", options: ["1:1", "1:2", "1:4"], ans: 1 },
    { q: "為了讓茶碗蒸表面平滑沒有氣孔，入鍋前應該？", options: ["用力攪拌產生泡泡", "用保鮮膜或蓋子蓋住", "加入大量鹽巴"], ans: 1 },
    { q: "茶碗蒸的蛋液在過濾時，主要目的是什麼？", options: ["去除蛋筋與雜質", "增加蛋液的甜度", "改變蛋液的顏色"], ans: 0 },
    { q: "如果想讓茶碗蒸更有鮮味，通常會加入哪種食材的汁液？", options: ["檸檬汁", "蛤蜊高湯", "番茄醬"], ans: 1 }
  ],
  "curry": [
    { q: "煮咖哩時，為了增加甜味與濃稠度，通常會先炒軟哪種蔬菜？", options: ["洋蔥", "青椒", "高麗菜"], ans: 0 },
    { q: "日式咖哩塊通常在哪個步驟加入鍋中？", options: ["一開始和生肉一起炒", "水滾後立刻加入", "關火或微火時加入攪拌"], ans: 2 },
    { q: "哪一種肉類最常被用來製作日式家常咖哩？", options: ["魚肉", "雞肉或豬肉", "羊肉"], ans: 1 },
    { q: "為了讓咖哩風味更豐富，有些人會加入少許的？", options: ["黑巧克力或蘋果泥", "香草冰淇淋", "薄荷葉"], ans: 0 },
    { q: "保存吃剩的咖哩時，最正確的做法是？", options: ["放在室溫下兩天", "完全放涼後冷藏或冷凍", "趁熱直接放入冰箱"], ans: 1 }
  ],
  "omurice": [
    { q: "製作蛋包飯的蛋皮時，火候應該如何控制？", options: ["全程大火", "中火轉小火", "不用開火"], ans: 1 },
    { q: "蛋包飯裡面的炒飯，最經典的口味是？", options: ["青醬炒飯", "番茄醬炒飯", "醬油炒飯"], ans: 1 },
    { q: "為了讓蛋皮滑嫩不破，可以在蛋液中加入少許的？", options: ["牛奶或鮮奶油", "麵粉", "辣椒水"], ans: 0 },
    { q: "經典的日式蛋包飯，通常會在蛋皮上方淋上什麼醬汁？", options: ["番茄醬或多明格拉斯醬", "美乃滋", "黃芥末醬"], ans: 0 },
    { q: "炒飯時為了讓飯粒粒粒分明，最好使用？", options: ["剛煮好的軟爛熱飯", "放涼的隔夜飯", "生米直接炒"], ans: 1 }
  ],
  "mugcake": [
    { q: "盛裝加熱用的馬克杯必須選擇什麼材質才安全？", options: ["金屬鋼杯", "一次性塑膠杯", "陶瓷杯(可微波)"], ans: 2 },
    { q: "製作微波馬克杯蛋糕時，麵糊大約只能裝到杯子的幾分滿？", options: ["全滿", "一半或六分滿", "一分滿"], ans: 1 },
    { q: "為了營造『熔岩』效果，通常會在麵糊中間塞入什麼？", options: ["一顆冰塊", "一塊固體巧克力", "一顆生蛋黃"], ans: 1 },
    { q: "微波馬克杯蛋糕時，通常需要多久時間？", options: ["大約1到2分鐘", "10分鐘以上", "半小時"], ans: 0 },
    { q: "如果微波出來的蛋糕太乾硬，最可能是因為？", options: ["微波時間太長", "糖加太多", "杯子太小"], ans: 0 }
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
    // 【修改完成】已刪除最後一段裝飾上桌的文字
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
}

function draw() {
  if (gameState === 0) {
    image(bgImage, 0, 0, width, height);
    textFont('monospace'); textStyle(BOLD); textAlign(CENTER, CENTER); textSize(width * 0.06);
    fill(40, 40, 40); text("目標成為料理大師", width / 2 + 5, height * 0.3 + 5);
    fill(255, 215, 0); text("目標成為料理大師", width / 2, height * 0.3);
    textFont('sans-serif'); textStyle(NORMAL); textSize(width * 0.03);
    fill(255, 255, 255, 150 + 105 * sin(frameCount * 0.05));
    text("- 點擊畫面開始遊戲 -", width / 2, height * 0.85);
  }
  else if (gameState === 1) {
    image(storyImg1, 0, 0, width, height);
    drawStoryText(storyText1);
  }
  else if (gameState === 2) {
    image(storyImg2, 0, 0, width, height);
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
}

// ==========================================
// 各畫面繪製函式
// ==========================================
function drawStoryText(fullText) {
  textFont('sans-serif'); textStyle(NORMAL); fill(30); textAlign(LEFT, TOP);
  textSize(24); textLeading(41); 
  let textX = 133; let textY = 308;
  if (frameCount % typingSpeed === 0 && charIndex < fullText.length) {
    currentText = fullText.substring(0, charIndex + 1);
    charIndex++;
  }
  text(currentText, textX, textY);
}

function drawSelectionScreen() {
  imageMode(CORNER);
  image(woodBg, 0, 0, width, height);
  textAlign(CENTER, CENTER); textStyle(BOLD); textSize(width * 0.04); fill(255); 
  text("選擇一張碎片撿起", width / 2, height * 0.15);

  let btnW = width * 0.6; let btnH = height * 0.1; let spacing = height * 0.15; let startY = height * 0.3;
  for (let i = 0; i < menuButtons.length; i++) {
    let bx = width / 2; let by = startY + i * spacing;
    rectMode(CENTER); 
    if (mouseX > bx - btnW/2 && mouseX < bx + btnW/2 && mouseY > by - btnH/2 && mouseY < by + btnH/2) {
      fill(200, 150, 100); 
    } else {
      fill(139, 69, 19); 
    }
    rect(bx, by, btnW, btnH, 10);
    fill(255); text(menuButtons[i].name, bx, by);
  }
}

function initPuzzle(recipeKey) {
  currentRecipeKey = recipeKey; 
  currentPuzzleImg = puzzleImgs[recipeKey];
  puzzlePieces = []; completedPieces = 0; puzzleCompleteTime = 0;
  
  let maxW = width * 0.4; let maxH = height * 0.4;
  let imgRatio = currentPuzzleImg.width / currentPuzzleImg.height;
  if (maxW / imgRatio <= maxH) { baseW = maxW; baseH = maxW / imgRatio; } 
  else { baseH = maxH; baseW = maxH * imgRatio; }
  baseX = width / 2 - baseW / 2; baseY = height * 0.15; 
  
  let pieceW = baseW / 2; let pieceH = baseH / 2;
  let srcW = currentPuzzleImg.width / 2; let srcH = currentPuzzleImg.height / 2;
  
  let slots = [0, 1, 2, 3]; slots.sort(() => random() - 0.5); 
  let gap = width * 0.03; let totalOptionsW = 4 * pieceW + 3 * gap; 
  let startOptionX = width / 2 - totalOptionsW / 2; let optionY = height * 0.72; 

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
  imageMode(CORNER); image(woodBg, 0, 0, width, height);
  textAlign(CENTER, TOP); textStyle(BOLD); textSize(width * 0.04); fill(255); 
  text("試著將碎片拼湊起來", width / 2, height * 0.05);
  
  push(); tint(0, 100); image(currentPuzzleImg, baseX, baseY, baseW, baseH); pop(); 
  for (let i = 0; i < puzzlePieces.length; i++) {
    let p = puzzlePieces[i];
    noStroke(); image(currentPuzzleImg, p.currentX, p.currentY, p.w, p.h, p.sx, p.sy, p.sw, p.sh);
  }
  
  // 【新增】檢查是否拼圖完成，若完成則開始計時 1500 毫秒後跳轉
  if (completedPieces === 4) {
    if (millis() - puzzleCompleteTime > 1500) {
      gameState = 5; 
    }
  }
}

function drawQuizIntroScreen() {
  imageMode(CORNER); image(quizIntroImg, 0, 0, width, height);
  textFont('sans-serif'); textStyle(BOLD); textAlign(CENTER, CENTER); textSize(width * 0.03);
  fill(255, 255, 255, 150 + 105 * sin(frameCount * 0.05));
  text("- 點擊畫面開始測驗 -", width / 2, height * 0.85);
}

function initQuiz() {
  currentQuestionIndex = 0; correctAnswersCount = 0;
  quizStatus = "playing"; selectedOptionIndex = -1;
}

function drawQuizScreen() {
  imageMode(CORNER); image(quizBgImg, 0, 0, width, height);
  let questions = quizDatabase[currentRecipeKey];
  let currentQ = questions[currentQuestionIndex];
  
  textAlign(CENTER, TOP); textStyle(BOLD); fill(255); textSize(width * 0.025);
  text(`題數：${currentQuestionIndex + 1} / 5`, width / 2, height * 0.08);
  textSize(width * 0.035); text(currentQ.q, width / 2, height * 0.15);
  
  let btnW = width * 0.6; let btnH = height * 0.12; 
  let spacing = height * 0.16; let startY = height * 0.4;
  
  for (let i = 0; i < currentQ.options.length; i++) {
    let bx = width / 2; let by = startY + i * spacing;
    rectMode(CENTER);
    
    if (quizStatus === "playing") {
      if (mouseX > bx - btnW/2 && mouseX < bx + btnW/2 && mouseY > by - btnH/2 && mouseY < by + btnH/2) { fill('#7a6853'); } 
      else { fill('#5e503f'); }
      strokeWeight(2); stroke(255);
    } else {
      if (i === selectedOptionIndex) {
        fill('#5e503f'); strokeWeight(6);
        if (quizStatus === "correct") stroke(0, 255, 0); 
        else stroke(255, 0, 0); 
      } else {
        fill('#3d3429'); noStroke();
      }
    }
    
    rect(bx, by, btnW, btnH, 15);
    noStroke(); fill(255); textSize(width * 0.025); textAlign(CENTER, CENTER);
    text(currentQ.options[i], bx, by);
  }
  
  if (quizStatus !== "playing") {
    if (millis() - quizTimer > 1500) {
      currentQuestionIndex++;
      if (currentQuestionIndex >= 5) { gameState = 7; } 
      else { quizStatus = "playing"; selectedOptionIndex = -1; }
    }
  }
}

// ==========================================
// 強制中文字精準換行與排版函式
// ==========================================
function drawCustomText(str, startX, startY, maxWidth, lineHeight) {
  if (!str) return;
  let paragraphs = str.split('\n'); 
  let currentY = startY;
  
  for (let i = 0; i < paragraphs.length; i++) {
    let paragraph = paragraphs[i];
    let currentLine = "";
    
    for (let j = 0; j < paragraph.length; j++) {
      let testLine = currentLine + paragraph[j];
      if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
        text(currentLine, startX, currentY);
        currentLine = paragraph[j]; 
        currentY += lineHeight;
      } else {
        currentLine = testLine;
      }
    }
    text(currentLine, startX, currentY);
    currentY += lineHeight;
  }
}

// ==========================================
// 繪製成績公布畫面 
// ==========================================
function drawResultScreen() {
  imageMode(CORNER);
  image(resultBgImg, 0, 0, width, height);

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
  
  rectMode(CORNER);

  // 1. 頭銜區塊
  let titleW = width * 0.55;
  let titleH = height * 0.08;
  let titleX = (width - titleW) / 2;
  let titleY = height * 0.04; 
  
  fill(mainColor); noStroke();
  rect(titleX, titleY, titleW, titleH, 10);
  fill(255); textAlign(CENTER, CENTER); textStyle(BOLD); 
  textSize(max(width * 0.03, 14)); 
  text(`頭銜：${title} (答對 ${correctAnswersCount}/5 題)`, titleX + titleW/2, titleY + titleH/2);

  // 2. 配字故事區塊
  let descW = width * 0.75; 
  let descH = height * 0.16;
  let descX = (width - descW) / 2;
  let descY = height * 0.14; 
  
  fill(mainColor); noStroke();
  rect(descX, descY, descW, descH, 10);
  
  fill(255); textAlign(LEFT, TOP); textStyle(NORMAL); 
  let descSize = max(width * 0.018, 12); 
  textSize(descSize); 
  let descLineH = descSize * 1.6;
  let pad = 15; 
  
  drawCustomText(description, descX + pad, descY + pad, descW - (pad * 2), descLineH);

  // 3. 【雙欄排版】食譜區塊
  let recipeW = width * 0.85; 
  let recipeH = height * 0.55; 
  let recipeX = (width - recipeW) / 2;
  let recipeY = height * 0.33;
  
  fill(mainColor); noStroke();
  rect(recipeX, recipeY, recipeW, recipeH, 10);

  let rPad = 15; 
  let columnGap = width * 0.02; 
  let columnW = (recipeW - (rPad * 2) - columnGap) / 2; 
  
  let leftColX = recipeX + rPad;
  let rightColX = recipeX + rPad + columnW + columnGap;

  fill(255); textAlign(LEFT, TOP); textStyle(NORMAL); 
  let recipeSize = max(width * 0.012, 10); 
  textSize(recipeSize); 
  let recipeLineH = recipeSize * 1.5;
  
  drawCustomText(fullRecipes[currentRecipeKey].left, leftColX, recipeY + rPad, columnW, recipeLineH);
  drawCustomText(fullRecipes[currentRecipeKey].right, rightColX, recipeY + rPad, columnW, recipeLineH);

  // 4. 底部按鈕
  rectMode(CENTER); 
  let btnW = width * 0.35; let btnH = height * 0.08;
  let btnY = height * 0.93;
  let leftBtnX = width * 0.28; let rightBtnX = width * 0.72;

  if (mouseX > leftBtnX - btnW/2 && mouseX < leftBtnX + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
    fill(hoverColor);
  } else { fill(mainColor); }
  rect(leftBtnX, btnY, btnW, btnH, 8);
  fill(255); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(max(width * 0.025, 12));
  text("繼續探索料理", leftBtnX, btnY);

  if (mouseX > rightBtnX - btnW/2 && mouseX < rightBtnX + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
    fill(hoverColor);
  } else { fill(mainColor); }
  rect(rightBtnX, btnY, btnW, btnH, 8);
  fill(255);
  text("回到標題", rightBtnX, btnY);
}

// ==========================================
// 滑鼠與觸控事件
// ==========================================
function mousePressed() {
  if (gameState === 0) {
    gameState = 1; charIndex = 0; currentText = "";
  }
  else if (gameState === 1) {
    if (charIndex >= storyText1.length) { gameState = 2; charIndex = 0; currentText = ""; }
    else { charIndex = storyText1.length; currentText = storyText1; }
  }
  else if (gameState === 2) {
    if (charIndex >= storyText2.length) { gameState = 3; }
    else { charIndex = storyText2.length; currentText = storyText2; }
  }
  else if (gameState === 3) {
    let btnW = width * 0.6; let btnH = height * 0.1; let spacing = height * 0.15; let startY = height * 0.3;
    for (let i = 0; i < menuButtons.length; i++) {
      let bx = width / 2; let by = startY + i * spacing;
      if (mouseX > bx - btnW/2 && mouseX < bx + btnW/2 && mouseY > by - btnH/2 && mouseY < by + btnH/2) {
        initPuzzle(menuButtons[i].key);
        gameState = 4; break; 
      }
    }
  }
  else if (gameState === 4) {
    for (let i = puzzlePieces.length - 1; i >= 0; i--) {
      let p = puzzlePieces[i];
      if (!p.isLocked && mouseX > p.currentX && mouseX < p.currentX + p.w && mouseY > p.currentY && mouseY < p.currentY + p.h) {
        draggingPiece = p; draggedOffsetX = mouseX - p.currentX; draggedOffsetY = mouseY - p.currentY;
        puzzlePieces.splice(i, 1); puzzlePieces.push(p); break; 
      }
    }
  }
  else if (gameState === 5) {
    initQuiz();
    gameState = 6;
  }
  else if (gameState === 6 && quizStatus === "playing") {
    let btnW = width * 0.6; let btnH = height * 0.12; 
    let spacing = height * 0.16; let startY = height * 0.4;
    let currentQ = quizDatabase[currentRecipeKey][currentQuestionIndex];
    
    for (let i = 0; i < currentQ.options.length; i++) {
      let bx = width / 2; let by = startY + i * spacing;
      if (mouseX > bx - btnW/2 && mouseX < bx + btnW/2 && mouseY > by - btnH/2 && mouseY < by + btnH/2) {
        selectedOptionIndex = i; 
        quizTimer = millis();    
        
        if (i === currentQ.ans) {
          quizStatus = "correct";
          correctAnswersCount++;
        } else {
          quizStatus = "wrong";
          if (wrongSound) wrongSound.play();
        }
        break;
      }
    }
  }
  else if (gameState === 7) {
    let btnW = width * 0.35; let btnH = height * 0.08;
    let btnY = height * 0.93;
    let leftBtnX = width * 0.28; let rightBtnX = width * 0.72;
    
    if (mouseX > leftBtnX - btnW/2 && mouseX < leftBtnX + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
      gameState = 3;
    }
    else if (mouseX > rightBtnX - btnW/2 && mouseX < rightBtnX + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
      gameState = 0;
    }
  }
}

function mouseDragged() {
  if (gameState === 4 && draggingPiece !== null) {
    draggingPiece.currentX = mouseX - draggedOffsetX;
    draggingPiece.currentY = mouseY - draggedOffsetY;
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
      // 【新增】當 4 塊完成時，記錄當下的時間，供 draw 函式延遲判斷使用
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

function windowResized() { resizeCanvas(windowWidth, windowHeight); }