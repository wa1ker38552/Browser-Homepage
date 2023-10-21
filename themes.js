const DEFAULT_THEME = [
  "#ffffff",
  "#808080",
  "1",
  "1",
  "1", 
  "0px",
  "#545454",
  "3px",
  "0.3",
  "40em",
  "0.5",
  "invert(29%) sepia(94%) saturate(0%) hue-rotate(226deg) brightness(96%) contrast(101%)",
  "cover"
]
const GLOBAL_VARIABLES = [
  "card-color",
  "background-overlay",
  "background-overlay-opacity",
  "background-overlay-brightness",
  "background-overlay-saturation",
  "background-overlay-blur",
  "text",
  "backdrop-blur",
  "accent-opacity",
  "wrapper-width",
  "card-opacity",
  "img-filter",
  "background-cover"
]

function saveSettings() {
  data = {}
  GLOBAL_VARIABLES.forEach(function(e) {
    data[e] = getCss('--'+e)
  })

  data = JSON.stringify(data)
  localStorage.setItem("settingsData", data)
}

function loadBackground(bg) {
  const body = document.querySelector("#backgroundOverlay")
  body.style.background = `url("${bg}")`
  body.style.backgroundSize = getCss("--background-cover")
  localStorage.setItem("background", bg)
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function loadGlobals(theme) {
  let i = 0
  GLOBAL_VARIABLES.forEach(function(e) {
    setCss("--"+e, theme[i])
    i++
  })
  
  setCardRGB()
}

function setCardRGB() {
  const rgb = hexToRgb(getCss("--card-color"))
  setCss("--card-color-r", rgb[0])
  setCss("--card-color-g", rgb[1])
  setCss("--card-color-b", rgb[2])
}

function setBackgroundCover(i) {
  document.getElementsByClassName("selected-background-size")[0].classList.remove("selected-background-size")
  setCss("--background-cover", ["contain", "cover", "auto"][i])
  document.querySelector("#backgroundOverlay").style.backgroundSize = ["contain", "cover", "auto"][i]
  document.querySelector("#backgroundSizeContainer").children[i].classList.add("selected-background-size")
  saveSettings()
}

function setCardColor(value) {
  setCss("--card-color", value)
  setCardRGB()
}

function exportSettings() {
  data = localStorage.getItem("settingsData")
  data = JSON.parse(data)
  data["background"] = localStorage.getItem("background")
  return btoa(JSON.stringify(data))
}

function copyExport() {
  navigator.clipboard.writeText(document.querySelector("#inpexpText").value)
  document.querySelector("#exportButtons").children[0].classList.add("successful-copy")
}

function importSettings() {
  try {
    data = JSON.parse(atob(document.querySelector("#inpexpText").value))
    background = data["background"]
    delete data["background"]
    localStorage.setItem("settingsData", JSON.stringify(data))
    localStorage.setItem("background", background)
    let settings = []
    data = JSON.parse(localStorage.getItem("settingsData"))
    for (let key in data) {settings.push(data[key])}
    loadGlobals(settings)
    loadBackground((localStorage.getItem("background") != null) ? localStorage.getItem("background") : DEFAULT_BACKGROUND)
  } catch (Exception) {}
}

function openImpexpModal(type) {
  let textarea = document.querySelector("#inpexpText")
  textarea.readOnly = (type) ? true : false
  textarea.value = (type) ? exportSettings() : ""
  document.querySelector("#expinpTitle").innerHTML = (type) ? "Export Settings" : "Import Settings"
  document.querySelector("#importButtons").style.display = (type) ? "none" : "grid"
  document.querySelector("#exportButtons").style.display = (type) ? "grid" : "none"
  animateOpenModal(document.querySelector("#impexpModal"))
}

function closeImpexpModal() {
  animateCloseModal(document.querySelector("#impexpModal"))
}


function initializeBackgroundFilters() {
  const bgBrightness = document.querySelector("#bgBrightness")
  const bgSaturation = document.querySelector("#bgSaturation")
  const bgOpacity = document.querySelector("#bgOpacity")
  const bgBlur = document.querySelector("#bgBlur")

  bgBrightness.value = getCss("--background-overlay-brightness")*10
  bgSaturation.value = getCss("--background-overlay-saturation")*10
  bgOpacity.value = getCss("--background-overlay-opacity")*10
  bgBlur.value = parseInt(getCss("--background-overlay-blur").replace("px", ""))

  bgBrightness.oninput = function() {setCss("--background-overlay-brightness", bgBrightness.value/10)}
  bgSaturation.oninput = function() {setCss("--background-overlay-saturation", bgSaturation.value/10)}
  bgOpacity.oninput = function() {setCss("--background-overlay-opacity", bgOpacity.value/10)}
  bgBlur.oninput = function() {setCss("--background-overlay-blur", bgBlur.value+"px")}

  bgBrightness.onchange = function() {saveSettings()}
  bgSaturation.onchange = function() {saveSettings()}
  bgOpacity.onchange = function() {saveSettings()}
  bgBlur.onchange = function() {saveSettings()}
}

function setBackground() {
  loadBackground(document.querySelector("#backgroundInput").value)
}

function initializeBackground() {
  if (localStorage.getItem("background") != null) {
    loadBackground(localStorage.getItem("background"))
    document.querySelector("#backgroundInput").value = localStorage.getItem("background")
  } else {
    loadBackground(DEFAULT_BACKGROUND)
  }
}

function initializeGlobals() {
  if (localStorage.getItem("settingsData") != null) {
    let data = JSON.parse(localStorage.getItem("settingsData"))
    let i = 0
    for (let key in data) {
      setCss("--"+GLOBAL_VARIABLES[i], data[key])
      i ++
    }
  } else {
    loadGlobals(DEFAULT_THEME)
  }
}

function initializeThemes() {
  initializeBackground()
  initializeGlobals()
  initializeBackgroundFilters()
  setBackgroundCover(["contain", "cover", "auto"].indexOf(getCss("--background-cover")))

  const cardColor = document.querySelector("#cardColorInput")
  const overlayColor = document.querySelector("#overlayColorInput")
  const textColor = document.querySelector("#textColorInput")

  const cardBlur = document.querySelector("#cardBlur")
  const cardOpacity = document.querySelector("#cardOpacity")
  const accentOpacity = document.querySelector("#accentOpacity")
  const cardsWidth = document.querySelector("#cardsWidth")

  cardColor.value = getCss("--card-color")
  overlayColor.value = getCss("--background-overlay")
  textColor.value = getCss("--text")
  cardBlur.value = parseInt(getCss("--backdrop-blur").replace("px", ""))
  cardOpacity.value = getCss("--card-opacity")*10
  accentOpacity.value = getCss("--accent-opacity")*10
  cardsWidth.value = parseInt(getCss("--wrapper-width").replace("em", ""))

  cardColor.oninput = function() {setCardColor(cardColor.value)}
  overlayColor.oninput = function() {setCss("--background-overlay", overlayColor.value)}
  textColor.oninput = function() {setCss("--text", textColor.value)}
  textColor.onchange = function() {setCss("--img-filter", hexToFilter(getCss("--text"))); saveSettings()}

  cardBlur.oninput = function() {setCss("--backdrop-blur", cardBlur.value+"px")}
  cardOpacity.oninput = function() {setCss("--card-opacity", cardOpacity.value/10)}
  accentOpacity.oninput = function() {setCss("--accent-opacity", accentOpacity.value/10)}
  cardsWidth.oninput = function() {setCss("--wrapper-width", cardsWidth.value+"em")}

  cardColor.onchange = function() {saveSettings()}
  overlayColor.onchange = function() {saveSettings()}
  cardBlur.onchange = function() {saveSettings()}
  cardOpacity.onchange = function() {saveSettings()}
  accentOpacity.onchange = function() {saveSettings()}
  cardsWidth.onchange = function() {saveSettings()}
}
