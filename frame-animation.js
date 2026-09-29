const redredSequence = document.querySelector('#redred-frame-sequence');
const redredCanvas = document.querySelector('#redred-frame-canvas');
const redredContext = redredCanvas.getContext('2d');
const redredProgress = document.querySelector('#redred-frame-progress');
const redredIntro = document.querySelector('.redred-frame__copy--intro');
const redredReveal = document.querySelector('.redred-frame__copy--reveal');
const redredFinal = document.querySelector('.redred-frame__copy--final');
const redredCue = document.querySelector('.redred-frame__cue');
const redredFrameCount = 160;
const redredFrames = [];
let redredCurrentFrame = -1;
let redredScrollFrame;

function redredFramePath(index) {
  return `ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`;
}

function drawRedredFrame(index) {
  const image = redredFrames[index];
  if (!image || !image.complete) return;

  const width = redredCanvas.clientWidth;
  const height = redredCanvas.clientHeight;
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const viewportRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > viewportRatio) {
    drawWidth = height * imageRatio;
    offsetX = (width - drawWidth) / 2;
  } else {
    drawHeight = width / imageRatio;
    offsetY = (height - drawHeight) / 2;
  }

  redredContext.clearRect(0, 0, width, height);
  redredContext.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

function resizeRedredCanvas() {
  const ratio = window.devicePixelRatio || 1;
  redredCanvas.width = Math.floor(redredCanvas.clientWidth * ratio);
  redredCanvas.height = Math.floor(redredCanvas.clientHeight * ratio);
  redredContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawRedredFrame(redredCurrentFrame < 0 ? 0 : redredCurrentFrame);
}

function updateRedredCopy(progress) {
  redredIntro.classList.toggle('is-visible', progress < .24);
  redredReveal.classList.toggle('is-visible', progress >= .24 && progress < .68);
  redredFinal.classList.toggle('is-visible', progress >= .68);
  redredIntro.style.opacity = progress < .24 ? String(1 - progress * 2.2) : '0';
  redredReveal.style.opacity = progress >= .24 && progress < .68 ? String(Math.min(1, (progress - .24) * 5, (.68 - progress) * 5)) : '0';
  redredFinal.style.opacity = progress >= .68 ? String(Math.min(1, (progress - .68) * 5)) : '0';
  redredCue.style.opacity = progress > .08 ? '0' : '1';
}

function updateRedredScene() {
  const sectionTop = redredSequence.getBoundingClientRect().top;
  const scrollable = Math.max(1, redredSequence.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -sectionTop / scrollable));
  const nextFrame = Math.min(redredFrameCount - 1, Math.floor(progress * (redredFrameCount - 1)));

  if (nextFrame !== redredCurrentFrame) {
    redredCurrentFrame = nextFrame;
    drawRedredFrame(redredCurrentFrame);
  }

  redredProgress.style.width = `${progress * 100}%`;
  updateRedredCopy(progress);
  redredScrollFrame = undefined;
}

function requestRedredSceneUpdate() {
  if (!redredScrollFrame) redredScrollFrame = requestAnimationFrame(updateRedredScene);
}

for (let index = 0; index < redredFrameCount; index += 1) {
  const image = new Image();
  image.src = redredFramePath(index);
  image.onload = () => {
    if (index === 0) {
      resizeRedredCanvas();
      updateRedredScene();
    }
  };
  redredFrames.push(image);
}

window.addEventListener('resize', resizeRedredCanvas);
window.addEventListener('scroll', requestRedredSceneUpdate, { passive: true });
resizeRedredCanvas();
updateRedredScene();
