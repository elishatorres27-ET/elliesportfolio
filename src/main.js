import * as THREE from "three";
import "./style.scss";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";

const canvas = document.querySelector("#experience-canvas");
if (!canvas) throw new Error("Canvas #experience-canvas not found");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// -------------------- MODALS (GSAP) --------------------
const modalContainer = document.querySelector(".modal-container");

function findNameInParents(obj, keyword) {
  let cur = obj;
  const k = keyword.toLowerCase();
  while (cur) {
    if ((cur.name || "").includes(k)) return cur;
    cur = cur.parent;
  }
  return null;
}

// -------------------- MODALS (works with your HTML) --------------------
const modals = {
  work: document.querySelector(".modal.work"),
  about: document.querySelector(".modal.about"),
  contact: document.querySelector(".modal.contact"),
};

let isModalOpen = false;

function showModal(modal) {
  if (!modal) return;

  // hide all
  Object.values(modals).forEach((m) => {
    if (m) m.style.display = "none";
  });

  // show one
  modal.style.display = "block";
  isModalOpen = true;

  if (typeof controls !== "undefined") controls.enabled = false;

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
      if (typeof controls !== "undefined") controls.enabled = true;
    },
  });
}

// Exit buttons
document.querySelectorAll(".modal-exit-button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const modal = e.target.closest(".modal");
    hideModal(modal);
  });
});

// Clicking outside modal closes it
if (modalContainer) {
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      // close whichever modal is open
      const openOne = Object.values(modalByKey).find((m) => m && m.style.display === "block");
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
const textureLoader = new THREE.TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const environmentMap = new THREE.CubeTextureLoader()
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

window.addEventListener("click", () => {
  if (isModalOpen) return;
  if (currentIntersects.length === 0) return;

  const hit = currentIntersects[0].object;

  // social links (same idea: use parents too)
  Object.entries(socialLinks).forEach(([key, url]) => {
    if (findNameInParents(hit, key)) {
      const w = window.open(url, "_blank", "noopener,noreferrer");
      if (w) w.opener = null;
    }
  });

  if (findNameInParents(hit, "mywork")) {
    showModal(modals.work);
  } else if (findNameInParents(hit, "aboutme")) {
    showModal(modals.about);
  } else if (findNameInParents(hit, "contact")) {
    showModal(modals.contact);
  }
});

// -------------------- Model Load --------------------
loader.load(
  "/models/Room_Profile_V3.glb",
  (glb) => {
    glb.scene.traverse((child) => {
      if (!child.isMesh) return;

      if (child.name.includes("Raycaster")) {
        raycasterObjects.push(child);
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

    // your saved camera view
    camera.position.set(11.677559, 6.906606, 14.008882);
    controls.target.set(0.720452, 0.117464, -8.443379);
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
const render = () => {
  controls.update();

  yAxisFans.forEach((fan) => {
    fan.rotation.y -= 0.04;
  });

  if (!isModalOpen) {
    raycaster.setFromCamera(pointer, camera);
    currentIntersects = raycaster.intersectObjects(raycasterObjects, true);

    if (currentIntersects.length > 0) {
      const o = currentIntersects[0].object;
      document.body.style.cursor = o.name.includes("Pointer") ? "pointer" : "default";
    } else {
      document.body.style.cursor = "default";
    }
  } else {
    document.body.style.cursor = "default";
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();