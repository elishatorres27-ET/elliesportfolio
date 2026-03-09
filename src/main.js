import * as THREE from "three";
import { Howl } from "howler";
import "./style.scss";
import { OrbitControls } from "./utils/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";

// -------------------- LOADING / ENTER UI --------------------
const loadingScreen = document.getElementById("loadingScreen");
const loadingTitle  = document.getElementById("loadingTitle"); // your wave "Loading..."
const enterBtn      = document.getElementById("enterBtn");     // button in HTML

let assetsReady = false;
let modelReady = false;
let canEnterRoom = false;

function showEnterIfReady() {
  if (!assetsReady || !modelReady) return;

  // hide "Loading..." word, show ENTER
  if (loadingTitle) loadingTitle.style.display = "none";
  if (enterBtn) enterBtn.style.display = "inline-flex";
}

// Use ONE loading manager and pass it into loaders
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
  canEnterRoom = true;
  assetsReady = true;
  showEnterIfReady();
};

// Ensure loading overlay is visible on boot
if (loadingScreen) loadingScreen.style.display = "flex";
if (enterBtn) enterBtn.style.display = "none";

// ---------- Background Music ----------
const musicToggleBtn = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const langToggleBtn = document.getElementById("langToggle");

const backgroundMusic = new Howl({
  src: ["/music/How Have You Been (Ni Hao Bu Hao) - Eric Chou _ Piano Cover.mp3"],
  loop: true,
  volume: 0.35,
});

let musicOn = false;

function setMusicUI() {
  if (!musicIcon) return;
  musicIcon.src = musicOn
    ? "/icons/music-svgrepo-com.svg"
    : "/icons/music-note-slash-svgrepo-com.svg";
}

function startMusic() {
  if (musicOn) return;
  backgroundMusic.play();
  musicOn = true;
  setMusicUI();
}

function stopMusic() {
  backgroundMusic.pause();
  musicOn = false;
  setMusicUI();
}

function toggleMusic() {
  if (musicOn) {
    stopMusic();
  } else {
    startMusic();
  }
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMusic();
  });
}

setMusicUI();

// ---------- Language Toggle  ----------
let lang = localStorage.getItem("siteLang") || "en";

const i18n = {
  en: {
    mywork: "~ My Work ~",
    about: "~ About Me ~",
    contact: "~ Let's Get In Touch! ~",

    researchHeader: "~ Research Project ~",
    academicHeader: "~ Academic Involvement ~",
    certHeader: "~ Certificates and Awards ~",

    aboutHeader: "Mechanical Engineer & Coder at Heart",
    aboutP1:
      "I am Elisha Torres (伊莉莎), a Mechanical Engineering student at Kun Shan University in Taiwan, originally from Belize City, Belize. Growing up in a challenging environment shaped my resilience, sense of responsibility, and determination to pursue education as a way to create opportunities for myself and my family. As the eldest sibling, I have always felt a strong motivation to succeed not only for my own future but also to help support and inspire those around me. Through discipline, perseverance, and a strong commitment to learning, I have consistently worked to achieve academic excellence and currently rank at the top of my class.",
    aboutP2:
      "My academic interests focus on semiconductor-related research, automation systems, and the application of machine learning in manufacturing processes. I have worked on projects involving automated wafer surface morphology measurement systems and predictive maintenance algorithms for CNC machining. In my research, I developed software for wafer surface profiling using laser sensors and motion control systems, and I applied feature extraction techniques and machine learning models to analyze machining data for tool wear prediction. I am particularly interested in how intelligent systems and automation can improve efficiency, precision, and reliability in modern manufacturing environments.",
    aboutP3:
      "Beyond engineering, I have a deep passion for classical music and have studied piano for many years. Music has always been an important creative outlet for me and a source of discipline and focus. I enjoy blending creativity with technology, which is reflected in my interactive portfolio where visitors can explore a 3D environment and even play a working digital piano embedded directly within the website. For me, music and engineering share many similarities—both require patience, structure, creativity, and a willingness to continuously improve.",
    aboutP4:
      "Outside of my academic and technical work, I enjoy activities that challenge my thinking and encourage continuous learning. I love reading and exploring books that expand my perspective and understanding of the world. I also enjoy playing chess, a hobby that strengthens my strategic thinking, patience, and analytical problem-solving skills. These interests complement my engineering mindset and help me approach problems from different perspectives.",
    aboutP5:
      "Looking ahead, I hope to pursue advanced studies in semiconductor manufacturing and build a career in Taiwan’s semiconductor industry. My long-term goal is to contribute to technological innovation while supporting my family and creating opportunities for the next generation. I believe that perseverance, curiosity, and a commitment to learning can transform even the most difficult beginnings into meaningful achievements.",
    autobiographyLink: "Read My Full Autobiography",

    contactHeader: "If you have any questions, let's connect!",
    enterBtn: "ENTER",
    loadingHelp: "Left Click + Drag to Rotate · Mouse Wheel to Zoom · Right Click + Drag to Pan",

    project1Title: "Automated Surface Morphology Measurement System for Wafer Stripping and Regeneration",
    project1Desc:
      "This project focused on developing an automated system for measuring wafer surface roughness during semiconductor wafer regeneration. The system integrates a Keyence CL-V050G confocal displacement sensor with a Galil DMC-B140-M motion controller to perform high-precision, non-contact surface measurements. A custom Python-based GUI (PyQt5) was developed to control motion, collect data, and visualize results in both 2D and 3D formats. The automated scanning platform improves measurement accuracy, repeatability, and efficiency while reducing human error and contamination risks, providing a practical solution for real-time wafer surface inspection in semiconductor manufacturing.",
    project2Title: "Smart Tool Wear Prediction Algorithm for CNC Milling Processes",
    project2Desc:
      "This project developed a machine-learning-based method for monitoring cutting tool wear in CNC milling operations using spindle motor current signals. Current data collected during machining was analyzed using feature extraction techniques including FFT, statistical analysis, and Principal Component Analysis (PCA) to identify indicators of tool degradation. A logistic regression classifier achieved approximately 97% accuracy in predicting tool conditions and determining optimal tool change points. The proposed approach enables real-time tool condition monitoring with minimal sensor requirements, supporting predictive maintenance and improved efficiency in smart manufacturing environments.",
    viewPaper: "View Full Paper"
  },

  zh: {
    mywork: "～ 我的作品 ～",
    about: "～ 關於我 ～",
    contact: "～ 聯絡我 ～",

    researchHeader: "～ 研究計畫 ～",
    academicHeader: "～ 學術參與 ～",
    certHeader: "～ 證照與獎項 ～",

    aboutHeader: "機械工程師與熱愛程式設計的人",
    aboutP1:
      "我是 Elisha Torres（伊莉莎），目前就讀於台灣崑山科技大學機械工程系，來自貝里斯市。成長環境中的挑戰塑造了我的韌性、責任感，以及我透過教育改變自己與家人未來的決心。身為家中的長女，我一直希望自己的努力不只成就自己，也能幫助並鼓舞身邊的人。靠著自律、堅持與對學習的投入，我持續追求學業卓越，目前成績名列前茅。",
    aboutP2:
      "我的學術興趣集中在半導體相關研究、自動化系統，以及機器學習在製造流程中的應用。我參與過晶圓表面形貌自動量測系統與 CNC 加工刀具預測維護演算法等專題研究。在研究中，我開發了結合雷射感測器與運動控制系統的晶圓表面量測軟體，也運用特徵擷取與機器學習模型分析加工數據，以進行刀具磨耗預測。我特別關注智慧系統與自動化如何提升現代製造的效率、精度與可靠性。",
    aboutP3:
      "除了工程之外，我也非常熱愛古典音樂，並且學習鋼琴多年。音樂一直是我重要的創意出口，也是培養專注力與紀律的一部分。我喜歡把創意和科技結合，這也展現在我的互動式作品集裡，訪客不但可以探索 3D 空間，還能直接彈奏網站中的數位鋼琴。對我來說，音樂與工程其實很相似，都需要耐心、結構、創造力，以及持續精進的精神。",
    aboutP4:
      "在學術與技術工作之外，我也喜歡能夠激發思考並促進持續學習的活動。我喜歡閱讀，透過書籍拓展自己的視野與理解。我也喜歡下西洋棋，這個興趣訓練了我的策略思考、耐心，以及分析與解決問題的能力。這些興趣也讓我在工程領域中能以更多元的角度思考問題。",
    aboutP5:
      "展望未來，我希望繼續攻讀半導體製造相關的進階學位，並在台灣半導體產業發展自己的職涯。我的長期目標是在支持家庭的同時，也能為科技創新做出貢獻，並為下一代創造更多機會。我相信，只要有毅力、好奇心與持續學習的精神，再艱難的起點也能轉化為有意義的成就。",
    autobiographyLink: "閱讀我的完整自傳",

    contactHeader: "如果你有任何問題，歡迎與我聯繫！",
    enterBtn: "進入",
    loadingHelp: "按住滑鼠左鍵拖曳可旋轉 · 滾輪可縮放 · 按住右鍵拖曳可平移",

    project1Title: "晶圓除膜再生後表面形貌自動量測系統",
    project1Desc:
      "本研究聚焦於開發一套用於半導體晶圓再生製程的表面粗糙度自動量測系統。系統整合 Keyence CL-V050G 共焦位移感測器與 Galil DMC-B140-M 運動控制器，以進行高精度、非接觸式表面量測。我也使用 Python 與 PyQt5 開發客製化介面，以控制平台運動、擷取資料，並以 2D 與 3D 形式即時視覺化結果。此自動掃描平台提升了量測精度、重複性與效率，同時降低人為誤差與污染風險。",
    project2Title: "CNC 銑削加工智慧刀具磨耗預測演算法",
    project2Desc:
      "本研究開發了一套以機器學習為基礎的刀具磨耗監測方法，利用 CNC 銑削過程中的主軸馬達電流訊號進行分析。透過 FFT、統計分析與主成分分析（PCA）等特徵擷取方法，辨識刀具劣化指標。以邏輯斯迴歸分類器進行分析後，在刀具狀態預測與最佳換刀點判定上達到約 97% 的準確率。此方法能以較少感測器達成即時刀具狀態監測，支援智慧製造中的預測維護。",
    viewPaper: "查看完整論文"
  }
};

function applyLanguage() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (i18n[lang] && i18n[lang][key]) {
      el.textContent = i18n[lang][key];
    }
  });

  localStorage.setItem("siteLang", lang);
}

if (langToggleBtn) {
  langToggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    lang = lang === "en" ? "zh" : "en";
    applyLanguage();
  });
}

applyLanguage();

// clock setup
let hourHand = null;
let minuteHand = null;
let secondHand = null;

const CLOCK_AXIS_X = new THREE.Vector3(1, 0, 0);
const _clockQuat = new THREE.Quaternion();

function updateClockToTaipeiTime() {
  if (!hourHand || !minuteHand || !secondHand) return;

  const now = new Date();

  const taipei = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Taipei",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const hour = Number(taipei.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(taipei.find((p) => p.type === "minute")?.value ?? 0);
  const second = Number(taipei.find((p) => p.type === "second")?.value ?? 0);

  const h = hour % 12;

  const secondAngle = (second / 60) * Math.PI * 2;
  const minuteAngle = ((minute + second / 60) / 60) * Math.PI * 2;
  const hourAngle = ((h + minute / 60 + second / 3600) / 12) * Math.PI * 2;

  // starting pose:
  // minute hand = 12
  // second hand = 12
  // hour hand   = 3
  const SECOND_OFFSET = 0;
  const MINUTE_OFFSET = 0;
  const HOUR_OFFSET = Math.PI / 2;

  secondHand.quaternion
    .copy(secondHand.userData.baseQuat)
    .multiply(_clockQuat.setFromAxisAngle(CLOCK_AXIS_X, SECOND_OFFSET - secondAngle));

  minuteHand.quaternion
    .copy(minuteHand.userData.baseQuat)
    .multiply(_clockQuat.setFromAxisAngle(CLOCK_AXIS_X, MINUTE_OFFSET - minuteAngle));

  hourHand.quaternion
    .copy(hourHand.userData.baseQuat)
    .multiply(_clockQuat.setFromAxisAngle(CLOCK_AXIS_X, HOUR_OFFSET - hourAngle));
}

/**  -------------------------- Audio setup -------------------------- */
// ---------- Piano Key Sound + Press Animation ----------

// cache original key positions so they return perfectly
function cacheKeyOriginal(obj) {
  if (!obj || obj.userData.__keyOrigCached) return;
  obj.userData.__keyOrigCached = true;
  obj.userData.__keyOrigPos = obj.position.clone();
}

let pianoResumeTimer = null;

const BG_NORMAL_VOLUME = 0.35;
const BG_DUCKED_VOLUME = 0.08;
const BG_FADE_OUT_MS = 180;
const BG_FADE_IN_MS = 500;
const PIANO_IDLE_DELAY = 900;

// exact piano key order from left to right
const pianoKeyOrder = [
  "Key_C_Fifteenth_Raycaster",
  "Key_C#_Fifteenth_Raycaster",
  "Key_D_Fifteenth_Raycaster",
  "Key_D#_Fifteenth_Raycaster",
  "Key_E_Fifteenth_Raycaster",
  "Key_F_Fifteenth_Raycaster",
  "Key_F#_Fifteenth_Raycaster",
  "Key_G_Fifteenth_Raycaster",
  "Key_G#_Fifteenth_Raycaster",
  "Key_A_Fifteenth_Raycaster",
  "Key_A#_Fifteenth_Raycaster",
  "Key_B_Fifteenth_Raycaster",
  "Key_C_higher_Fifteenth_Raycaster",
  "Key_C#_higher_Fifteenth_Raycaster",
  "Key_D_higher_Fifteenth_Raycaster",
  "Key_D#_higher_Fifteenth_Raycaster",
  "Key_E_higherFifteenth_Raycaster",
  "Key_F_higher_Fifteenth_Raycaster",
  "Key_F#_higher_Fifteenth_Raycaster",
  "Key_G_higher_Fifteenth_Raycaster",
  "Key_G#_higher_Fifteenth_Raycaster",
  "Key_A_higher_Fifteenth_Raycaster",
  "Key_A#_higher_Fifteenth_Raycaster",
  "Key_B_higher_Fifteenth_Raycaster",
];

const pianoKeyIndexMap = {};
pianoKeyOrder.forEach((name, i) => {
  pianoKeyIndexMap[name] = i + 1;
});

function duckBackgroundMusic() {
  if (!musicOn) return;
  backgroundMusic.fade(backgroundMusic.volume(), BG_DUCKED_VOLUME, BG_FADE_OUT_MS);
}

function restoreBackgroundMusicSoon() {
  if (pianoResumeTimer) clearTimeout(pianoResumeTimer);

  pianoResumeTimer = setTimeout(() => {
    if (!musicOn) return;
    backgroundMusic.fade(backgroundMusic.volume(), BG_NORMAL_VOLUME, BG_FADE_IN_MS);
  }, PIANO_IDLE_DELAY);
}

function playPianoKeySoundByName(keyName) {
  const keyNumber = pianoKeyIndexMap[keyName];
  if (!keyNumber) {
    console.warn("No piano sound mapped for:", keyName);
    return;
  }

  const soundPath = `/audio/public_audio_sfx_piano_Key_${keyNumber}.ogg`;

  if (!keyHowls[keyNumber]) {
    keyHowls[keyNumber] = new Howl({
      src: [soundPath],
      volume: 1.0,
      preload: true,
      html5: false,
      onloaderror: (_, err) => {
        console.error(`Failed to load piano key ${keyNumber}:`, soundPath, err);
      },
      onplayerror: (_, err) => {
        console.error(`Failed to play piano key ${keyNumber}:`, soundPath, err);
      },
    });
  }

  duckBackgroundMusic();
  restoreBackgroundMusicSoon();

  keyHowls[keyNumber].stop();
  keyHowls[keyNumber].play();
}

const keyHowls = {};

pianoKeyOrder.forEach((name, i) => {
  pianoKeyIndexMap[name] = i + 1;
});

// press animation: moves slightly DOWN then returns
function pressKey(obj) {
  if (!obj) return;

  cacheKeyOriginal(obj);

  const orig = obj.userData.__keyOrigPos;
  const downAmount = 0.03;

  // move down in local space
  const downDir = new THREE.Vector3(0, -1, 0).applyQuaternion(obj.quaternion).multiplyScalar(downAmount);
  const pressedPos = orig.clone().add(downDir);

  gsap.killTweensOf(obj.position);

  gsap.to(obj.position, {
    x: pressedPos.x,
    y: pressedPos.y,
    z: pressedPos.z,
    duration: 0.06,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(obj.position, {
        x: orig.x,
        y: orig.y,
        z: orig.z,
        duration: 0.10,
        ease: "power2.out",
      });
    },
  });
}

// -------------------- HOVER HELPERS (single copy) --------------------
let currentHoveredObject = null;
let chairTop;

// Finds the nearest parent (including itself) whose name contains keyword (case-sensitive)
function findNameInParents(obj, keyword) {
  let cur = obj;
  while (cur) {
    if ((cur.name || "").includes(keyword)) return cur;
    cur = cur.parent;
  }
  return null;
}

// Save original transforms once (correctly)
function cacheOriginalTransform(obj) {
  if (!obj || obj.userData.__origCached) return;

  obj.userData.__origCached = true;
  obj.userData.__origScale = obj.scale.clone();
  obj.userData.__origRot = obj.rotation.clone();
  obj.userData.__origPos = obj.position.clone();
}

const intro = {
  refs: {},
  set(obj) { if (obj?.name) this.refs[obj.name] = obj; },
  get(name) { return this.refs[name] || null; }
};

// Hover animation:
// - all hover objects: enlarge
// - whatsap/facebook/line: rotate slightly forward
// - aboutme/contact/mywork: rotate slightly right
// - on leave: return EXACTLY to original
function playHoverAnimation(obj, isHovering) {
  if (!obj) return;

  cacheOriginalTransform(obj);

  const origScale = obj.userData.__origScale;
  const origRot = obj.userData.__origRot;

  const hoverScale = origScale.clone().multiplyScalar(1.12); // enlarge

  const rotTarget = origRot.clone();

  // Social links tilt forward (x +)  <-- flipped sign
  if (obj.name.includes("whatsap") || obj.name.includes("facebook") || obj.name.includes("line")) {
    rotTarget.x = origRot.x + 0.20;
  }

  // Modals rotate right (y +)
  if (obj.name.includes("aboutme") || obj.name.includes("contact") || obj.name.includes("mywork")) {
    rotTarget.y = origRot.y + 0.20;
  }

  gsap.killTweensOf(obj.scale);
  gsap.killTweensOf(obj.rotation);

  if (isHovering) {
    gsap.to(obj.scale, {
      x: hoverScale.x,
      y: hoverScale.y,
      z: hoverScale.z,
      duration: 0.25,
      ease: "power2.out",
    });

    gsap.to(obj.rotation, {
      x: rotTarget.x,
      y: rotTarget.y,
      z: rotTarget.z,
      duration: 0.25,
      ease: "power2.out",
    });
  } else {
    gsap.to(obj.scale, {
      x: origScale.x,
      y: origScale.y,
      z: origScale.z,
      duration: 0.20,
      ease: "power2.out",
    });

    gsap.to(obj.rotation, {
      x: origRot.x,
      y: origRot.y,
      z: origRot.z,
      duration: 0.20,
      ease: "power2.out",
    });
  }
}

const canvas = document.querySelector("#experience-canvas");
if (!canvas) throw new Error("Canvas #experience-canvas not found");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// -------------------- MODALS (GSAP) --------------------
const modalContainer = document.querySelector(".modal-container");

// -------------------- MODALS (works with your HTML) --------------------
const modals = {
  work: document.querySelector(".modal.work"),
  about: document.querySelector(".modal.about"),
  contact: document.querySelector(".modal.contact"),
};

let isModalOpen = false;

function showModal(modal) {
  if (!modal) return;

  // show overlay
  if (modalContainer) modalContainer.style.display = "flex";

  Object.values(modals).forEach((m) => {
    if (m) m.style.display = "none";
  });
  modal.style.display = "block";
  isModalOpen = true;

  if (currentHoveredObject) {
    playHoverAnimation(currentHoveredObject, false);
    currentHoveredObject = null;
  }
  document.body.style.cursor = "default";
  currentIntersects = [];

  gsap.killTweensOf(modal);
  gsap.set(modal, { opacity: 0 });
  gsap.to(modal, { opacity: 1, duration: 0.35 });
}

function hideModal(modal) {
  if (!modal) return;

  gsap.killTweensOf(modal);
  gsap.to(modal, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      modal.style.display = "none";
      isModalOpen = false;
      controls.enabled = true;

      // hide overlay
      if (modalContainer) modalContainer.style.display = "none";
    },
  });
}

// Exit buttons
document.querySelectorAll(".modal-exit-button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    touchHappened = true;
    e.preventDefault();
    e.stopPropagation();
    const modal = e.target.closest(".modal");
    hideModal(modal);
  });
});

if (modalContainer) {
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      const openOne = Object.values(modals).find((m) => m && m.style.display === "block");
      if (openOne) hideModal(openOne);
    }
  });
}

// -------------------- THREE / RAYCASTER STATE --------------------
const yAxisFans = [];
const raycasterObjects = [];
let currentIntersects = [];

const socialLinks = {
  line: "https://line.me/ti/p/JJ7V1mFqWm",
  facebook: "https://www.facebook.com/share/1Ajc7M6Rc7/",
  whatsap: "https://wa.me/qr/T3ZABPVWM6CPK1",
};

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(0, 0);
let touchHappened = false;

// -------------------- Scene / Camera / Renderer --------------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// -------------------- Controls --------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false; // lock until Enter is clicked

let hasEntered = false;
// ENTER: hide overlay, enable controls, start intro
enterBtn.addEventListener("click", () => {
  if (hasEntered) return;
  hasEntered = true;

  gsap.to(loadingScreen, {
    autoAlpha: 0,
    duration: 0.35,
    ease: "power2.out",
    onStart: () => {
      loadingScreen.style.pointerEvents = "none";
    },
    onComplete: () => {
      loadingScreen.style.display = "none";

      startMusic();          // start bg music here
      playIntroAnimation();  // then play intro
    },
  });
});

  // enable controls / start your room interactions
  if (typeof controls !== "undefined") controls.enabled = true;

// after you set camera.position and controls.target:
controls.update();

// // ---------- Camera Position Debug Tool ----------
// window.addEventListener("keydown", (e) => {
//   if (e.key === "p") {

//     const pos = camera.position;
//     const target = controls.target;

//     console.log("camera.position.set(",
//       pos.x.toFixed(6), ",",
//       pos.y.toFixed(6), ",",
//       pos.z.toFixed(6),
//     ");");

//     console.log("controls.target.set(",
//       target.x.toFixed(6), ",",
//       target.y.toFixed(6), ",",
//       target.z.toFixed(6),
//     ");");

//   }
// });

// lock vertical tilt (up/down)
controls.minPolarAngle = 0.35;          // slightly above straight down
controls.maxPolarAngle = Math.PI / 2;   // don’t go under the floor

// lock left/right around the CURRENT view
const az = controls.getAzimuthalAngle();
const range = Math.PI / 10; // 30° each side (adjust)

// allow only a small “side-to-side” window
controls.minAzimuthAngle = az - range;
controls.maxAzimuthAngle = az + range;

controls.minDistance = 10;
controls.maxDistance = 30;

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = true;

controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN,
};

controls.screenSpacePanning = true;
controls.panSpeed = 0.8;

renderer.domElement.addEventListener("contextmenu", (e) => e.preventDefault());

// -------------------- Loaders & Textures --------------------
const textureLoader = new THREE.TextureLoader(loadingManager);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader(loadingManager);
loader.setDRACOLoader(dracoLoader);

const cubeLoader = new THREE.CubeTextureLoader(loadingManager);

const environmentMap = cubeLoader
  .setPath("textures/skybox/")
  .load(["px.webp", "nx.webp", "py.webp", "ny.webp", "pz.webp", "nz.webp"]);

scene.background = environmentMap;
scene.environment = environmentMap;

const textureMap = {
  First: { day: "/textures/Texture_1.webp" },
  Second: { day: "/textures/Texture_2.webp" },
  Third: { day: "/textures/Texture_3.webp" },
  Fourth: { day: "/textures/Texture_4.webp" },
  Fifth: { day: "/textures/Texture_5.webp" },
  Sixth: { day: "/textures/Texture_6.webp" },
  Seventh: { day: "/textures/Texture_7.webp" },
  Eigth: { day: "/textures/Texture_8.webp" },
  Nineth: { day: "/textures/Texture_9.webp" },
  Tenth: { day: "/textures/Texture_10.webp" },
  Eleventh: { day: "/textures/Texture_11.webp" },
  Twelveth: { day: "/textures/Texture_12.webp" },
  Thirteenth: { day: "/textures/Texture_13.webp" },
  Fourteenth: { day: "/textures/Texture_14.webp" },
  Fifteenth: { day: "/textures/Texture_15.webp" },
  Sixteenth: { day: "/textures/Texture_16.webp" },
  Seventeenth: { day: "/textures/Texture_17.webp" },
  Eigthteenth: { day: "/textures/Texture_18.webp" },
  Nineteenth: { day: "/textures/Texture_19.webp" },
};

const loadedTextures = { day: {} };

Object.entries(textureMap).forEach(([key, paths]) => {
  const dayTexture = textureLoader.load(paths.day);
  dayTexture.flipY = false;
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.day[key] = dayTexture;
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 1,
  opacity: 1,
  color: 0xfbfbfb,
  metalness: 0,
  roughness: 0,
  ior: 2,
  thickness: 0.01,
  specularIntensity: 1,
  envMap: environmentMap,
  envMapIntensity: 1,
  depthWrite: false,
  specularColor: 0xfbfbfb,
});

// -------------------- Video --------------------
const videoElement = document.createElement("video");
videoElement.src = "/textures/video/picframe.mp4";
videoElement.loop = true;
videoElement.muted = true;
videoElement.playsInline = true;
videoElement.setAttribute("webkit-playsinline", "");
videoElement.preload = "auto";
videoElement.crossOrigin = "anonymous";

let videoTexture = null;

videoElement.play().catch(() => {
  window.addEventListener("click", () => videoElement.play().catch(() => {}), { once: true });
});

videoElement.addEventListener("canplay", () => {
  if (videoTexture) return;
  videoTexture = new THREE.VideoTexture(videoElement);
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  videoTexture.flipY = false;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.generateMipmaps = false;
});

// -------------------- Input --------------------
window.addEventListener("mousemove", (e) => {
  touchHappened = false;
  pointer.x = (e.clientX / sizes.width) * 2 - 1;
  pointer.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener(
  "touchstart",
  (e) => {
    if (isModalOpen) return;
    e.preventDefault();
    pointer.x = (e.touches[0].clientX / sizes.width) * 2 - 1;
    pointer.y = -(e.touches[0].clientY / sizes.height) * 2 + 1;
  },
  { passive: false }
);

window.addEventListener(
  "touchend",
  (e) => {
    if (isModalOpen) return;
    e.preventDefault();
    handleRaycasterInteraction();
  },
  { passive: false }
);

function handleRaycasterInteraction() {
  if (isModalOpen) return;
  if (!currentIntersects || currentIntersects.length === 0) return;

  const hit = currentIntersects[0].object;

  // Find objects up the parent chain
  const pointerObj = findNameInParents(hit, "Pointer");
  const hoverObj = findNameInParents(hit, "Hover");

  const target = pointerObj || hoverObj || hit;

  const n = (target.name || "").toLowerCase();

  // ---------------- SOCIAL LINKS ----------------
  if (n.includes("facebook")) {
    window.open(socialLinks.facebook, "_blank", "noopener,noreferrer");
  }
  else if (n.includes("whatsap")) {
    window.open(socialLinks.whatsap, "_blank", "noopener,noreferrer");
  }
  else if (n.includes("line")) {
    window.open(socialLinks.line, "_blank", "noopener,noreferrer");
  }

  // ---------------- MODALS ----------------
  if (n.includes("mywork")) {
    showModal(modals.work);
  }
  else if (n.includes("aboutme")) {
    showModal(modals.about);
  }
  else if (n.includes("contact")) {
    showModal(modals.contact);
  }

  // ---------------- PIANO KEYS ----------------
  if (target.name && target.name.includes("Key_")) {
    playPianoKeySoundByName(target.name);
    pressKey(target);
  }
}

window.addEventListener("click", handleRaycasterInteraction);

// -------------------- Model Load --------------------
loader.load(
  "/models/Room_Profile_V4.glb",
  (glb) => {
    glb.scene.traverse((child) => {
      intro.set(child);

      // Clock
      if (child.name === "hourhand_Sixteenth") {
        hourHand = child;
        hourHand.userData.baseQuat = child.quaternion.clone();
      }

      if (child.name === "minutehand_Sixteenth") {
        minuteHand = child;
        minuteHand.userData.baseQuat = child.quaternion.clone();
      }

      if (child.name === "secondhand_Sixteenth") {
        secondHand = child;
        secondHand.userData.baseQuat = child.quaternion.clone();
      }

      // -------------------- Custom Image Frames --------------------
      if (child.name === "pic1") {
        const tex = textureLoader.load("/images/pic1.jpg");
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.flipY = false;

        child.material = new THREE.MeshBasicMaterial({
          map: tex
        });
      }

      if (child.name === "pic2") {
        const tex = textureLoader.load("/images/pic2.jpg");
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.flipY = false;

        child.material = new THREE.MeshBasicMaterial({
          map: tex
        });
      }

      if (child.name === "pic4") {
        const tex = textureLoader.load("/images/pic4.jpg");
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.flipY = false;

        child.material = new THREE.MeshBasicMaterial({
          map: tex
        });
      }

      if (child.name === "computerscreen") {
        const tex = textureLoader.load("/images/computerscreen.jpg");
        tex.colorSpace = THREE.SRGBColorSpace;

        child.material = new THREE.MeshBasicMaterial({
          map: tex
        });
      }

      if (child.name === "poster1") {
        const tex = textureLoader.load("/images/poster1.jpg");
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.flipY = false;

        // flip horizontally
        tex.wrapS = THREE.RepeatWrapping;
        tex.repeat.x = -1;

        child.material = new THREE.MeshBasicMaterial({
          map: tex,
          side: THREE.DoubleSide,
        });

        child.material.needsUpdate = true;
      }

      if (child.name === "poster2") {
        const tex = textureLoader.load("/images/poster2.jpg");
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.flipY = false;

        // flip horizontally
        tex.wrapS = THREE.RepeatWrapping;
        tex.repeat.x = -1;

        child.material = new THREE.MeshBasicMaterial({
          map: tex,
          side: THREE.DoubleSide,
        });

        child.material.needsUpdate = true;
      }

      if (!child.isMesh) return;

      if (child.name.includes("chairup")) {
        chairTop = child;
        child.userData.initialRotation = new THREE.Euler().copy(child.rotation);
      }

      if (child.name.includes("Raycaster")) {
        raycasterObjects.push(child);
      }

      if (child.name.includes("Hover")) {
        // optional: keep these if you still want them, but now correct
        child.userData.initialScale = child.scale.clone();
        child.userData.initialPosition = child.position.clone();
        child.userData.initialRotation = child.rotation.clone();
      }

      if (child.name.includes("glass")) {
        child.material = glassMaterial;
        return;
      }

      if (child.name === "pic3") {
        if (!videoTexture) return;
        child.material = new THREE.MeshBasicMaterial({
          map: videoTexture,
          side: THREE.DoubleSide,
          toneMapped: false,
        });
        child.material.needsUpdate = true;
        return;
      }

      // baked textures
      Object.keys(textureMap).forEach((key) => {
        if (child.name.includes(key)) {
          child.material = new THREE.MeshBasicMaterial({
            map: loadedTextures.day[key],
          });
          if (child.material.map) child.material.map.minFilter = THREE.LinearFilter;
        }
      });

      // fans
      const name = child.name.toLowerCase();
      if (name.includes("fan1") || name.includes("fan2") || name.includes("fan3")) {
        if (!yAxisFans.includes(child)) yAxisFans.push(child);
      }
    });

    scene.add(glb.scene);
    modelReady = true;
    showEnterIfReady();
  
    // your saved camera view
    camera.position.set(5.859166, 7.822870, 15.903586);
    controls.target.set(0.374858, 3.000000, -0.975377);
    controls.update();
    
    // clipping planes
    const box = new THREE.Box3().setFromObject(glb.scene);
    const size = box.getSize(new THREE.Vector3()).length();
    camera.near = Math.max(0.01, size / 100);
    camera.far = size * 10;
    camera.updateProjectionMatrix();

    console.log("raycasterObjects:", raycasterObjects.map((o) => o.name));
  },
  undefined,
  (err) => {
    console.error("GLB load error:", err);
  }
);

// make sure it's visible at start
if (loadingScreen) loadingScreen.style.display = "flex";

// ==================== INTRO ANIMATION (YOUR EXACT ORDER) ====================
function playIntroAnimation() {
  // If you want to block user camera during intro:
  if (typeof controls !== "undefined") controls.enabled = false;

  // helper: get by name (case-sensitive exact match)
  const get = (name) => (intro?.get ? intro.get(name) : (intro?.refs?.[name] ?? null));

  const warnMissing = (name) => console.warn("[Intro] Missing object:", name);

  // Hide via scale (keeps materials etc)
  const makeHidden = (obj) => {
    if (!obj) return;
    obj.visible = true;
    obj.userData.__introOrigScale = obj.userData.__introOrigScale || obj.scale.clone();
    obj.scale.set(0.0001, 0.0001, 0.0001);
  };

  const animateIn = (tl, obj, atTime = ">") => {
    if (!obj) return tl;
    const s = obj.userData.__introOrigScale || new THREE.Vector3(1, 1, 1);
    tl.to(
      obj.scale,
      { x: s.x, y: s.y, z: s.z, duration: 0.25, ease: "back.out(1.8)" },
      atTime
    );
    return tl;
  };

  // -------------------- YOUR LISTS (EXACT ORDER) --------------------
// -------------------- YOUR LISTS (EXACT ORDER) --------------------
const timeline1Names = [
  "welcomeplank_First",

  "myworkplack_First_Raycaster_Pointer_Hover",
  "myworktext_Third",
  "aboutmeplack_First_Raycaster_Pointer_Hover",
  "aboutmetext_Third",
  "contactplack_First_Raycaster_Pointer_Hover",
  "contacttext_Third",

  "marioplant_Sixteenth_Raycaster_Hover",
  "legocar_Eigthteenth_Raycaster_Hover",
  "ben_Eigthteenth_Raycaster_Hover",
  "frame1_Fourteenth",
  "frame_Fourteenth",
  "frame2_Fourteenth",
  "plant_Fourteenth_Raycaster_Hover",
  "hangingplant_Nineteenth_Raycaster_Hover",
  "rubixcube_Fifteenth_Raycaster_Hover",
  "name_Second_Raycaster_Hover",
  "pencils_Thirteenth_Raycaster_Hover",
  "watercan_Fourteenth_Raycaster_Hover",
  "soccer_Thirteenth_Raycaster_Hover",
  "boxes__Twelveth_Raycaster_Hover",
  "lamp_Twelveth_Raycaster_Hover",
];

// TL2 = socials + keys ONLY
const timeline2Names = [
  "facebook_Second_Raycaster_Pointer_Hover",
  "whatsap_Second_Raycaster_Pointer_Hover",
  "line_Second_Raycaster_Pointer_Hover",

  // keys (exact order)
  "Key_C_Fifteenth_Raycaster",
  "Key_C#_Fifteenth_Raycaster",
  "Key_D_Fifteenth_Raycaster",
  "Key_D#_Fifteenth_Raycaster",
  "Key_E_Fifteenth_Raycaster",
  "Key_F_Fifteenth_Raycaster",
  "Key_F#_Fifteenth_Raycaster",
  "Key_G_Fifteenth_Raycaster",
  "Key_G#_Fifteenth_Raycaster",
  "Key_A_Fifteenth_Raycaster",
  "Key_A#_Fifteenth_Raycaster",
  "Key_B_Fifteenth_Raycaster",
  "Key_C_higher_Fifteenth_Raycaster",
  "Key_C#_higher_Fifteenth_Raycaster",
  "Key_D_higher_Fifteenth_Raycaster",
  "Key_D#_higher_Fifteenth_Raycaster",
  "Key_E_higherFifteenth_Raycaster",
  "Key_F_higher_Fifteenth_Raycaster",
  "Key_F#_higher_Fifteenth_Raycaster",
  "Key_G_higher_Fifteenth_Raycaster",
  "Key_G#_higher_Fifteenth_Raycaster",
  "Key_A_higher_Fifteenth_Raycaster",
  "Key_A#_higher_Fifteenth_Raycaster",
  "Key_B_higher_Fifteenth_Raycaster",
];

// TL3 = "rest"
const timeline3Names = [
  "mic_Nineteenth_Raycaster_Hover",
  "Lamp_Nineth_Raycaster_Hover",
  "trophy4_Fifth_Raycaster_Hover",
  "trophy3_Fifth_Raycaster_Hover",
  "trophy2_Fifth_Raycaster_Hover",
  "trophy1_Fifth_Raycaster_Hover",
  "trophy7_Fifth_Raycaster_Hover",
  "trophy6_Fifth_Raycaster_Hover",
  "trophy5_Fifth_Raycaster_Hover",
  "Eleventh_Raycaster_Hover",
  "Tenth_Raycaster_Hover",
  "apple_Nineth_Raycaster_Hover",
];

// -------------------- RESOLVE OBJECTS --------------------
const tl1Objs = timeline1Names.map((n) => {
  const o = get(n);
  if (!o) warnMissing(n);
  return o;
}).filter(Boolean);

const tl2Objs = timeline2Names.map((n) => {
  const o = get(n);
  if (!o) warnMissing(n);
  return o;
}).filter(Boolean);

const tl3Objs = timeline3Names.map((n) => {
  const o = get(n);
  if (!o) warnMissing(n);
  return o;
}).filter(Boolean);

// hide everything first
[...tl1Objs, ...tl2Objs, ...tl3Objs].forEach(makeHidden);

// -------------------- BUILD TIMELINES --------------------
const tl1 = gsap.timeline({ defaults: { ease: "back.out(1.8)" } });
tl1Objs.forEach((obj, idx) => {
  const dur = idx < 7 ? 0.15 : 0.10;
  const s = obj.userData.__introOrigScale || new THREE.Vector3(1, 1, 1);
  tl1.to(obj.scale, { x: s.x, y: s.y, z: s.z, duration: dur }, idx === 0 ? 0 : ">");
});

const tl2 = gsap.timeline({ defaults: { ease: "back.out(1.8)" } });
tl2Objs.forEach((obj, idx) => {
  const dur = idx < 3 ? 0.18 : 0.10; // socials then faster keys
  const s = obj.userData.__introOrigScale || new THREE.Vector3(1, 1, 1);
  tl2.to(obj.scale, { x: s.x, y: s.y, z: s.z, duration: dur }, idx === 0 ? 0 : ">");
});

const tl3 = gsap.timeline({
  defaults: { ease: "back.out(1.8)" },
  onComplete: () => {
    if (typeof controls !== "undefined") controls.enabled = true;
  },
});
tl3Objs.forEach((obj, idx) => {
  const dur = 0.10;
  const s = obj.userData.__introOrigScale || new THREE.Vector3(1, 1, 1);
  tl3.to(obj.scale, { x: s.x, y: s.y, z: s.z, duration: dur }, idx === 0 ? 0 : ">");
});

// Start TL2 same time as TL1
tl1.play(0);
tl2.play(0);
tl3.play(0);

return { tl1, tl2, tl3 };
}

// -------------------- Resize --------------------
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// -------------------- Render Loop --------------------
const render = (timestamp) => {
  controls.update();

  // Clock
  updateClockToTaipeiTime();

  // Fan rotate animation
  yAxisFans.forEach((fan) => {
    fan.rotation.y -= 0.04;
  });

  // Chair rotate animation
  if (chairTop) {
    const time = timestamp * 0.001;
    const baseAmplitude = Math.PI / 8;

    const rotationOffset =
      baseAmplitude *
      Math.sin(time * 0.5) *
      (1 - Math.abs(Math.sin(time * 0.5)) * 0.3);

    chairTop.rotation.y = chairTop.userData.initialRotation.y + rotationOffset;
  }

  // -------------------- Raycaster Hover / Cursor --------------------
  if (!isModalOpen) {
    raycaster.setFromCamera(pointer, camera);
    currentIntersects = raycaster.intersectObjects(raycasterObjects, true);

    if (currentIntersects.length > 0) {
      const hit = currentIntersects[0].object;

      const hoverObj = findNameInParents(hit, "Hover");
      const pointerObj = findNameInParents(hit, "Pointer");

      if (hoverObj) {
        if (hoverObj !== currentHoveredObject) {
          if (currentHoveredObject) playHoverAnimation(currentHoveredObject, false);
          currentHoveredObject = hoverObj;
          playHoverAnimation(currentHoveredObject, true);
        }
      } else {
        if (currentHoveredObject) {
          playHoverAnimation(currentHoveredObject, false);
          currentHoveredObject = null;
        }
      }

      document.body.style.cursor = pointerObj ? "pointer" : "default";
    } else {
      if (currentHoveredObject) {
        playHoverAnimation(currentHoveredObject, false);
        currentHoveredObject = null;
      }
      document.body.style.cursor = "default";
    }
  } else {
    if (currentHoveredObject) {
      playHoverAnimation(currentHoveredObject, false);
      currentHoveredObject = null;
    }
    document.body.style.cursor = "default";
  }

  // Render ONCE
  renderer.render(scene, camera);

  // Request next frame ONCE
  window.requestAnimationFrame(render);
};

// Start the loop correctly (don't call render() directly)
window.requestAnimationFrame(render);