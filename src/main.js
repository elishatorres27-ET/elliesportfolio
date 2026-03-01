import * as THREE from "three";
import "./style.scss";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvas = document.querySelector("#experience-canvas");
if (!canvas) throw new Error("Canvas #experience-canvas not found");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**  -------------------------- Scene / Camera / Renderer -------------------------- */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**  -------------------------- Controls -------------------------- */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();

controls.enablePan = true;

// Mouse buttons
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY, // scroll wheel click + drag (or wheel)
  RIGHT: THREE.MOUSE.PAN, // right click + drag pans
};

// Optional: make pan feel nicer
controls.screenSpacePanning = true; // pan in screen space
controls.panSpeed = 0.8;

// (Optional) prevent right-click menu so panning works smoothly
renderer.domElement.addEventListener("contextmenu", (e) => e.preventDefault());

/**  -------------------------- Loaders & Texture Preparations -------------------------- */
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

// Reuseable Materials
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

/**  -------------------------- Video Setup (robust) -------------------------- */
const videoElement = document.createElement("video");
videoElement.src = "/textures/video/picframe.mp4";
videoElement.loop = true;
videoElement.muted = true;
videoElement.playsInline = true;
videoElement.setAttribute("webkit-playsinline", "");
videoElement.preload = "auto";
videoElement.crossOrigin = "anonymous";

let videoTexture = null;

videoElement.addEventListener("error", () => {
  console.log("video error:", videoElement.error);
});
videoElement.addEventListener("playing", () => {
  console.log("video playing");
});

// Start (if autoplay blocked, start on first click)
videoElement.play().catch((e) => {
  console.warn("Video autoplay blocked:", e);
  window.addEventListener("click", () => videoElement.play().catch(console.warn), { once: true });
});

// Create the texture once the video can provide frames
videoElement.addEventListener("canplay", () => {
  if (videoTexture) return;

  videoTexture = new THREE.VideoTexture(videoElement);
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  videoTexture.flipY = false;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.generateMipmaps = false;

  console.log("VideoTexture created");
});

/**  -------------------------- Model Load -------------------------- */
loader.load(
  "/models/Room_Profile.glb",
  (glb) => {
    glb.scene.traverse((child) => {
      if (!child.isMesh) return;

      if (child.name.includes("glass")) {
        child.material = glassMaterial;
        return;
      }

      // Apply video to pic3 once the texture exists
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

      // Apply baked textures
      Object.keys(textureMap).forEach((key) => {
        if (child.name.includes(key)) {
          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures.day[key],
          });

          child.material = material;

          if (child.material.map) {
            child.material.map.minFilter = THREE.LinearFilter;
          }
        }
      });
    });

    scene.add(glb.scene);

    // --- Set your saved "best view" here (NO auto-framing to override it) ---
    camera.position.set(11.677559, 6.906606, 14.008882);
    controls.target.set(0.720452, 0.117464, -8.443379);
    controls.update();

    // Keep sane clipping planes (doesn't change view)
    const box = new THREE.Box3().setFromObject(glb.scene);
    const size = box.getSize(new THREE.Vector3()).length();
    camera.near = Math.max(0.01, size / 100);
    camera.far = size * 10;
    camera.updateProjectionMatrix();
  },
  undefined,
  (err) => {
    console.error("GLB load error:", err);
  }
);

/**  -------------------------- Event Listeners -------------------------- */
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**  -------------------------- Render Loop -------------------------- */
function animate() {}

const render = () => {
  controls.update(); // keep damping working
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();
