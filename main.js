const srcs = [
  "./assets/video/video1.mp4",
  "./assets/video/video2.mp4",
  "./assets/video/video3.mp4",
  "./assets/video/video4.mp4",
  "./assets/video/video5.mp4",
  "./assets/video/video6.mp4",
  "./assets/video/video7.mp4",
  "./assets/video/video8.mp4",
  "./assets/video/video9.mp4",
];
const player = document.querySelector(".video-section__player");
const video = document.querySelector(".video-section__viewer");
const progress = document.querySelector(".video-section__progress");
const volumeControl = document.querySelector(".video-section__volume-control");
const playBtn = document.querySelectorAll(".play");
const play = document.querySelector("#play");
const btnMain = document.querySelector(".video-section__btn-play");
const volumeBtn = document.querySelector(".video-section__btn-volume");
const prevBtn = document.querySelector(".btn-prev");
const nextBtn = document.querySelector(".btn-next");
const fullscreenBtn = document.querySelector(".video-section__btn-scale");
const inputs = document.querySelectorAll(".input-range");
const control = document.querySelector(".video-section__control");
const hotKey = document.querySelector(".hot-key__inner");
const sliderList = document.querySelector(".video-library__list");

let isPlaying = true;
let isSound = true;
let counter = 0;
const stack = [];
//========================================

const selectVideo = (parent) => {
  const videoElem = parent.firstElementChild;
  const srcVideo = video.getAttribute("src");
  const srcElem = videoElem.getAttribute("src");
  if (srcVideo !== srcElem) {
    video.src = srcElem;
  }
};
//========================================
control.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("video-section__control")) {
    hotKey.classList.add("hot-key__inner--active");
    setTimeout(() => {
      hotKey.classList.remove("hot-key__inner--active");
    }, 5000);
  }
});
//========================================
video.src = srcs[counter];
const prevVideo = () => {
  pauseVideo();
  counter--;
  video.src = srcs[counter];
  nextBtn.disabled = false;
  if (counter === 0) {
    prevBtn.disabled = true;
  }
};
//==========================================
const nextVideo = () => {
  pauseVideo();
  counter++;
  video.src = srcs[counter];
  prevBtn.disabled = false;
  if (counter === srcs.length - 1) {
    nextBtn.disabled = true;
  }
};
//==========================================
const playVideo = () => {
  btnMain.classList.add("play-btnMain--noActive");
  play.classList.add("play-btn--noActive");
  video.play();
};
//==========================================
const progressUpdate = () => {
  let time = video.currentTime;
  let duration = video.duration;
  if (isNaN(duration)) {
    progress.value = 0;
  } else progress.value = (100 * time) / duration;
  progress.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${progress.value}%, #ffffff ${progress.value}%, #ffffff 100%)`;
};
//==========================================
const videoRewind = () => {
  let progressValue = progress.value;
  video.currentTime = (video.duration * progressValue) / 100;
};
//==========================================
const pauseVideo = () => {
  video.pause();
  play.classList.remove("play-btn--noActive");
  btnMain.classList.remove("play-btnMain--noActive");
};
//==========================================
const muteSound = (val) => {
  stack.push(val);
  video.volume = 0;
  volumeControl.value = 0;
  volumeControl.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${volumeControl.value}%, #ffffff ${volumeControl.value}%, #ffffff 100%)`;
  volumeBtn.classList.add("btn--disabled");
};
//==========================================
const turnSound = () => {
  volumeControl.value = stack.pop() * 100;
  video.volume = volumeControl.value / 100;
  volumeBtn.classList.remove("btn--disabled");
  volumeControl.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${volumeControl.value}%, #ffffff ${volumeControl.value}%, #ffffff 100%)`;
};
//==========================================
const resizeInput = () => {
  inputs.forEach((item) => {
    item.addEventListener("input", function () {
      const value = this.value;
      this.style.background = `linear-gradient(to right, #82CFD0 0%, #82CFD0 ${value}%, #ffffff ${value}%, #ffffff 100%)`;
    });
  });
};
resizeInput();
//==========================================
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    player.classList.add("fullscreen");
    fullscreenBtn.classList.add("fullscreen-btn");
    progress.classList.add("fullscreen-progress");
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      fullscreenBtn.classList.remove("fullscreen-btn");
      player.classList.remove("fullscreen");
      progress.classList.remove("fullscreen-progress");
    }
  }
};
//+++++++++++++++++++++++++++++++++++++++++++
sliderList.addEventListener("click", (e) => {
  if (e.target.closest(".video-library__item")) {
    const parent = e.target.parentElement;
    selectVideo(parent);
    pauseVideo();
  }
});

prevBtn.addEventListener("click", prevVideo);
nextBtn.addEventListener("click", nextVideo);
video.addEventListener("ended", () => {
  video.currentTime = 0;
  pauseVideo();
});
playBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!btn.classList.contains("play-btn--noActive")) playVideo();
    else pauseVideo();
  });
});
video.addEventListener("click", (e) => {
  if (e.target) {
    if (!play.classList.contains("play-btn--noActive")) playVideo();
    else pauseVideo();
  }
});
video.addEventListener("timeupdate", () => {
  progressUpdate();
});
progress.addEventListener("input", videoRewind);
volumeControl.addEventListener("input", () => {
  video.volume = volumeControl.value / 100;
  if (video.volume === 0) {
    volumeBtn.classList.add("btn--disabled");
  } else volumeBtn.classList.remove("btn--disabled");
});
volumeBtn.addEventListener("click", () => {
  const val = video.volume;
  if (!volumeBtn.classList.contains("btn--disabled")) muteSound(val);
  else {
    turnSound();
  }
});
document.addEventListener("keydown", (e) => {
  e.preventDefault();
  let code = e.keyCode;
  switch (code) {
    case 32:
      if (e.repeat) return;
      if (isPlaying) pauseVideo();
      else playVideo();
      isPlaying = !isPlaying;
      break;
    case 37:
      video.currentTime -= 2;
      break;
    case 38:
      video.volume += 0.1;
      break;
    case 39:
      video.currentTime += 2;
      break;
    case 40:
      video.volume -= 0.1;
      break;
    case 70:
      if (e.repeat) return;
      toggleFullScreen();
      break;
    case 76:
      video.playbackRate = 1;
      break;
    case 77:
      if (e.repeat) return;
      if (isSound) muteSound(video.volume);
      else turnSound();
      isSound = !isSound;
      break;
    case 188:
      video.playbackRate = 0.5;
      break;
    case 190:
      video.playbackRate = 2;
      break;
  }
});
fullscreenBtn.addEventListener("click", toggleFullScreen);
