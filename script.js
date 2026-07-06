// ================================
// Image Resizer Pro
// Part 1
// ================================

const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const imageCanvas = document.getElementById("imageCanvas");
const ctx = imageCanvas.getContext("2d");

const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");

const resizeBtn = document.getElementById("resizeBtn");
const resetBtn = document.getElementById("resetBtn");

const downloadLink = document.getElementById("downloadLink");

const presetButtons = document.querySelectorAll(".preset-btn");

const lockAspect = document.getElementById("lockAspect");

const qualityRange = document.getElementById("qualityRange");
const qualityValue = document.getElementById("qualityValue");

const formatSelect = document.getElementById("formatSelect");

const resizeStatus = document.getElementById("resizeStatus");

const fileName = document.getElementById("fileName");

const originalSize = document.getElementById("originalSize");
const originalResolution = document.getElementById("originalResolution");
const newResolution = document.getElementById("newResolution");
const outputFormat = document.getElementById("outputFormat");

const dropArea = document.getElementById("dropArea");

let selectedFile = null;
let img = new Image();

let aspectRatio = 1;

// ====================================
// Helpers
// ====================================

function bytesToSize(bytes) {

    if (bytes === 0) return "0 Bytes";

    const k = 1024;

    const sizes = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
        parseFloat((bytes / Math.pow(k, i)).toFixed(2))
        + " "
        + sizes[i]
    );

}

// ====================================
// Preview Uploaded Image
// ====================================

imageInput.addEventListener("change", () => {

    if (!imageInput.files.length) return;

    selectedFile = imageInput.files[0];

    fileName.textContent = selectedFile.name;

    originalSize.textContent =
        bytesToSize(selectedFile.size);

    const reader = new FileReader();

    reader.onload = function (e) {

        img.src = e.target.result;

    };

    reader.readAsDataURL(selectedFile);

});

img.onload = function () {

    previewImage.src = img.src;

    previewImage.style.display = "block";

    aspectRatio =
        img.width / img.height;

    widthInput.value =
        img.width;

    heightInput.value =
        img.height;

    originalResolution.textContent =
        img.width +
        " × " +
        img.height;

    newResolution.textContent =
        img.width +
        " × " +
        img.height;

};

// ====================================
// Maintain Aspect Ratio
// ====================================

widthInput.addEventListener("input", () => {

    if (!lockAspect.checked) return;

    if (!widthInput.value) return;

    heightInput.value = Math.round(

        widthInput.value / aspectRatio

    );

});

heightInput.addEventListener("input", () => {

    if (!lockAspect.checked) return;

    if (!heightInput.value) return;

    widthInput.value = Math.round(

        heightInput.value * aspectRatio

    );

});

// ====================================
// Quality Slider
// ====================================

qualityRange.addEventListener("input", () => {

    qualityValue.textContent =
        qualityRange.value + "%";

});

// ====================================
// Social Media Presets
// ====================================

presetButtons.forEach(button => {

    button.addEventListener("click", () => {

        widthInput.value =
            button.dataset.width;

        heightInput.value =
            button.dataset.height;

    });

});

// ====================================
// Drag & Drop
// ====================================

[
    "dragenter",
    "dragover"
].forEach(eventName => {

    dropArea.addEventListener(
        eventName,
        e => {

            e.preventDefault();

            dropArea.classList.add("active");

        }
    );

});

[
    "dragleave",
    "drop"
].forEach(eventName => {

    dropArea.addEventListener(
        eventName,
        e => {

            e.preventDefault();

            dropArea.classList.remove("active");

        }
    );

});

dropArea.addEventListener("drop", e => {

    const files = e.dataTransfer.files;

    if (!files.length) return;

    imageInput.files = files;

    imageInput.dispatchEvent(

        new Event("change")

    );

});

// ====================================
// Resize Image
// ====================================

resizeBtn.addEventListener("click", () => {

    if (!selectedFile) {

        alert("Please upload an image first!");

        return;

    }

    const width = parseInt(widthInput.value);

    const height = parseInt(heightInput.value);

    if (!width || !height) {

        alert("Please enter valid dimensions.");

        return;

    }

    imageCanvas.width = width;
    imageCanvas.height = height;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
        img,
        0,
        0,
        width,
        height
    );

    const format = formatSelect.value;

    outputFormat.textContent =
        format.toUpperCase();

    newResolution.textContent =
        width + " × " + height;

    const mimeType =
        format === "png"
            ? "image/png"
            : format === "webp"
            ? "image/webp"
            : "image/jpeg";

    const quality =
        qualityRange.value / 100;

    imageCanvas.toBlob(

        blob => {

            if (!blob) return;

            const url =
                URL.createObjectURL(blob);

            downloadLink.href = url;

            downloadLink.download =
                `resized-image.${format}`;

            downloadLink.style.display =
                "inline-flex";

            resizeStatus.innerHTML =
                `
                ✅ Image resized successfully!
                <br>
                <strong>Output Size:</strong>
                ${bytesToSize(blob.size)}
                `;

        },

        mimeType,

        quality

    );

});

// ====================================
// Reset
// ====================================

resetBtn.addEventListener("click", () => {

    imageInput.value = "";

    selectedFile = null;

    img.src = "";

    previewImage.removeAttribute("src");

    imageCanvas.width = 0;
    imageCanvas.height = 0;

    widthInput.value = "";
    heightInput.value = "";

    qualityRange.value = 90;
    qualityValue.textContent = "90%";

    formatSelect.value = "png";

    fileName.textContent = "No Image Selected";

    originalSize.textContent = "--";
    originalResolution.textContent = "--";
    newResolution.textContent = "--";
    outputFormat.textContent = "PNG";

    resizeStatus.textContent = "";

    downloadLink.style.display = "none";

});

// ====================================
// Format Change
// ====================================

formatSelect.addEventListener("change", () => {

    outputFormat.textContent =
        formatSelect.value.toUpperCase();

});

// ====================================
// Enter Key Support
// ====================================

document.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        resizeBtn.click();

    }

});

// ====================================
// Highlight Drop Area
// ====================================

dropArea.addEventListener("dragenter", () => {

    dropArea.style.borderColor = "#38bdf8";

});

dropArea.addEventListener("dragleave", () => {

    dropArea.style.borderColor =
        "rgba(255,255,255,.35)";

});

dropArea.addEventListener("drop", () => {

    dropArea.style.borderColor =
        "rgba(255,255,255,.35)";

});

// ====================================
// Preview Animation
// ====================================

previewImage.onload = () => {

    previewImage.style.opacity = "0";

    previewImage.style.transform =
        "scale(.95)";

    setTimeout(() => {

        previewImage.style.transition =
            ".35s";

        previewImage.style.opacity = "1";

        previewImage.style.transform =
            "scale(1)";

    }, 100);

};

// ====================================
// Canvas Animation
// ====================================

function animateCanvas() {

    imageCanvas.style.opacity = "0";

    imageCanvas.style.transform =
        "scale(.95)";

    setTimeout(() => {

        imageCanvas.style.transition =
            ".35s";

        imageCanvas.style.opacity = "1";

        imageCanvas.style.transform =
            "scale(1)";

    }, 100);

}

resizeBtn.addEventListener(
    "click",
    animateCanvas
);

// ====================================
// Initial State
// ====================================

downloadLink.style.display = "none";

previewImage.style.display = "none";

qualityValue.textContent =
    qualityRange.value + "%";

outputFormat.textContent =
    formatSelect.value.toUpperCase();

console.log("✅ Image Resizer Pro Loaded Successfully");