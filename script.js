let fileInput = document.getElementById("file");
let image = document.getElementById("image");
let downloadButton = document.getElementById("download");
let aspectRatioBtns = document.querySelectorAll(".aspect-ratio-btns");
const rotateRightButton = document.getElementById("rotate-right");
const rotateLeftButton = document.getElementById("rotate-left");
const scaleXButton = document.getElementById("scale-X-button");
const scaleYButton = document.getElementById("scale-Y-button");
const centerButton = document.getElementById("center-button");
const previewButton = document.getElementById("preview");
const previewImage = document.getElementById("preview-image");
const tiledPreview = document.getElementById("tiled-preview");
const sizeSlider = document.getElementById("size-slider");
const sizeValue = document.getElementById("size-value");
const sizeSliderContainer = document.querySelector(".size-slider-container");
const options = document.querySelector(".options-btn");
let cropper = "";
let fileName = "";
let scaleXClick = false,
  scaleYClick = false;
let rotateRightValue = -45,
  rotateLeftValue = 45;

//Window load
window.onload = () => {
  downloadButton.classList.add("hide");
  options.classList.add("hide");
  previewButton.classList.add("hide");
  sizeSliderContainer.classList.add("hide");
  sizeSlider.addEventListener("input", updateTileSize);
};

fileInput.onchange = () => {
  //The FileReader object helps tp read contents of file stored on computer
  let reader = new FileReader();
  //readAsDataURL read the content of input file
  reader.readAsDataURL(fileInput.files[0]);
  reader.onload = () => {
    //onload is triggered after file reading operation is successfully completed
    //set src attribute of image to the result/input file
    image.setAttribute("src", reader.result);
    //set filename for setting downloaded file name later
    //initialize cropper
    if (cropper) {
      cropper.destroy();
    }
    cropper = new Cropper(image, {
      crop() {
        autoUpdateLivePreview();
      },
      zoom() {
        autoUpdateLivePreview();
      },
      move() {
        autoUpdateLivePreview();
      },
    });
    options.classList.remove("hide");
    downloadButton.classList.remove("hide");
    sizeSliderContainer.classList.remove("hide");
    initializeLivePreview();
  };
  fileName = fileInput.files[0].name.split(".")[0];
};

//Change Aspect Ratio
aspectRatioBtns.forEach((element) => {
  element.addEventListener("click", () => {
    if (element.innerText == "Free") {
      cropper.setAspectRatio(NaN);
    } else {
      cropper.setAspectRatio(eval(element.innerText.replace(":", "/")));
    }
    autoUpdatePreview();
  });
});

//Function for rotate buttons
rotateRightButton.addEventListener("click", () => {
  cropper.rotate(rotateRightValue);
  autoUpdatePreview();
});

rotateLeftButton.addEventListener("click", () => {
  cropper.rotate(rotateLeftValue);
  autoUpdatePreview();
});

//Flip Vertically and flip horizontally
scaleXButton.addEventListener("click", () => {
  if (scaleXClick) {
    cropper.scaleX(1);
    scaleXClick = false;
  } else {
    cropper.scaleX(-1);
    scaleXClick = true;
  }
  autoUpdatePreview();
});

scaleYButton.addEventListener("click", () => {
  if (scaleYClick) {
    cropper.scaleY(1);
    scaleYClick = false;
  } else {
    cropper.scaleY(-1);
    scaleYClick = true;
  }
  autoUpdatePreview();
});

//Center Image
centerButton.addEventListener("click", () => {
  cropper.reset();
  autoUpdatePreview();
});

//Function to initialize live preview
function initializeLivePreview() {
  sizeSlider.value = 100;
  sizeValue.textContent = "100%";
  updateTileSize();
  autoUpdateLivePreview();
}

//Function for live preview update
function autoUpdateLivePreview() {
  if (cropper) {
    let imgSrc = cropper.getCroppedCanvas({}).toDataURL();
    previewImage.src = imgSrc;
    tiledPreview.style.backgroundImage = `url('${imgSrc}')`;  
    updateTileSize();
  }
}

//Function to auto-update preview with current edits
function autoUpdatePreview() {
  if (cropper) {
    let imgSrc = cropper.getCroppedCanvas({}).toDataURL();
    previewImage.src = imgSrc;
    tiledPreview.style.backgroundImage = `url('${imgSrc}')`;  
    updateTileSize();
  }
}

//Function to update tile size
function updateTileSize() {
  const sizePercent = sizeSlider.value;
  sizeValue.textContent = `${sizePercent}%`;
  const sizeInPixels = (sizePercent / 100) * 200; // 200px base size
  tiledPreview.style.backgroundSize = `${sizeInPixels}px ${sizeInPixels}px`;
}

//Function to download the edited image
downloadButton.addEventListener("click", (e) => {
  e.preventDefault();
  
  //Get custom filename from user
  let customFileName = prompt("Enter filename (without extension):", `cropped_${fileName}`);
  
  //If user cancelled, don't download
  if (customFileName === null) {
    return;
  }
  
  //Capture the entire tiled preview
  html2canvas(tiledPreview).then(canvas => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${customFileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  });
});
