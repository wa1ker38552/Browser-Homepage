const defaultLinks = {
  "Code": [
    {"href": "https://replit.com/repls", "title": "Replit"},
    {"href": "https://github.com", "title": "Github"},
    {"href": "https://stackoverflow.com", "title": "Stackoverflow"}
  ],
  "Work": [
    {"href": "https://mvla.instructure.com", "title": "Instructure"},
    {"href": "https://mvla.aeries.net/student/LoginParent.aspx?page=Dashboard.aspx", "title": "Aeries"},
    {"href": "https://docs.google.com", "title": "Docs"},
    {"href": "https://mail.google.com/mail/u/1/#inbox", "title": "Mail"}
  ],
  "Gaming": [
    {"href": "https://discord.com/app", "title": "Discord"},
    {"href": "https://roblox.com/home", "title": "Roblox"},
    {"href": "https://rolimons.com", "title": "Rolimons"}
  ]
}
const searchEngines = ["https://google.com/search?q=", "https://bing.com/search?q=", "https://duckduckgo.com/?q=", "https://search.brave.com/search?q="]
const defaultStylesheet = "https://fonts.googleapis.com/css?family=Fira Code"
const defaultFont = "Fira Code"
var selectedEngine = 0

function openSettingsModal() {document.getElementById("modal").style.display = ""}
function closeSettingsModal() {document.getElementById("modal").style.display = "none"}

// getCookie is taken from https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function setCookie(name, value) {
  expires = "; expires=" + new Date(2147483647 * 1000).toUTCString()
  document.cookie = name + "=" + (value || "")  + expires + "; path=/"
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function setBackground(url) {
  const body = document.getElementsByTagName("body")[0]
  const overlay = document.getElementById("overlay")
  if (url == null || url == "") {
    overlay.style.background = ""
    body.style.background = ""
  } else {
    overlay.style.background = "rgba(255, 255, 255, 0.2)"
    body.style.background = `url('${url}')`
    body.style.backgroundSize = "cover"
  }
  document.getElementById("background").value = url
}

function saveSettings() {
  const background = document.getElementById("background")
  const linkConfig = document.getElementById("linkConfig")
  const colorPicker = document.getElementById("colorPicker")
  const stylesheetConfig = document.getElementById("stylesheet")
  const fontFace = document.getElementById("fontFace")
  
  if (stylesheetConfig.value != "") {
    setStylesheet(stylesheetConfig.value, fontFace.value)
  } else {
    setCookie("customStylesheet", defaultStylesheet)
    setCookie("customFontFace", defaultFont)
    document.documentElement.style.setProperty("--font-family", defaultFont)
    customStylesheet.href = defaultStylesheet
    stylesheetConfig.value = defaultStylesheet
    fontFace.value = defaultFont
  }
  
  setBackground(background.value)
  setCookie("background", background.value)
  setCookie("accent", colorPicker.value)
  document.documentElement.style.setProperty("--accent", getCookie("accent"))
  
  try {
    setLinks(JSON.parse(linkConfig.value))
    setCookie("linkConfig", JSON.stringify(linkConfig.value))
  } catch {
    if (getCookie("linkConfig")) {linkConfig.value = JSON.parse(getCookie("linkConfig"))} 
    else {linkConfig.value = defaultLinks}
  }
}

function setStylesheet(sheetUrl, fontFace) {
  document.getElementById("customStylesheet").href = sheetUrl
  document.documentElement.style.setProperty("--font-family", fontFace)
  setCookie("customStylesheet", sheetUrl)
  setCookie("customFontFace", fontFace)
}

function setLinks(json) {
  const container = document.getElementsByClassName("quick-links-container")[0]
  container.style.gridTemplateColumns = `repeat(${Object.keys(json).length}, 1fr)`
  container.innerHTML = ""
  for (let key in json) {
    const section = document.createElement("div")
    const sectionTitle = document.createElement("div")
    const linkContainer = document.createElement("div")
    section.className = "quick-links-section"
    sectionTitle.className = "section-title"
    sectionTitle.innerHTML = key
    for (let link of json[key]) {
      const a = document.createElement("a")
      a.href = link.href
      a.innerHTML = link.title
      linkContainer.append(a)
    }
    section.append(sectionTitle, linkContainer)
    container.append(section)
  }
  document.getElementById("linkConfig").value = JSON.stringify(json, null, 2)
}

function updateTime(timeObj, dateObj, ampmObj) {
  let date = new Date()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let ampm = hours >= 12 ? 'PM' : 'AM'
  
  hours = hours % 12
  hours = hours ? hours : 12
  minutes = minutes < 10 ? '0'+minutes : minutes

  if (`${hours}:${minutes}` != timeObj.innerHTML) {
    timeObj.innerHTML = `${hours}:${minutes}`
    ampmObj.innerHTML = ampm
  }
  
  if (`${date.getMonth()+1}.${date.getDate()}.${date.getFullYear()}` != dateObj.innerHTML) {
    dateObj.innerHTML = `${date.getMonth()+1}.${date.getDate()}.${date.getFullYear()}`
  }
}

function setSearch(index) {
  document.getElementsByClassName("selected")[0].classList.remove("selected")
  selectedEngine = index
  document.getElementsByClassName("search-options-container")[0].children[index].classList.add("selected")
}


window.onload = function() {
  const timeObj = document.getElementById("time")
  const dateObj = document.getElementById("date")
  const ampmObj = document.getElementById("ampm")
  const searchBar = document.getElementById("search")
  const modalBackground = document.getElementById("modal")
  const modal = document.getElementById("modal")
  const colorPicker = document.getElementById("colorPicker")
  const colorIndicator = document.getElementById("colorIndicator")
  const sheetUrl = document.getElementById("stylesheet")
  const fontFace = document.getElementById("fontFace")
  const customStylesheet = document.getElementById("customStylesheet")

  if (getCookie("accent")) {
    document.documentElement.style.setProperty("--accent", getCookie("accent"))
    colorPicker.value = getComputedStyle(document.documentElement).getPropertyValue("--accent")
    colorIndicator.innerHTML = getComputedStyle(document.documentElement).getPropertyValue("--accent")
  } else {
    colorPicker.value = getComputedStyle(document.documentElement).getPropertyValue("--accent")
    colorIndicator.innerHTML = getComputedStyle(document.documentElement).getPropertyValue("--accent")
  }

  if (getCookie("customStylesheet")) {
    document.documentElement.style.setProperty("--font-family", getCookie("customFontFace"))
    customStylesheet.href = getCookie("customStylesheet")
    sheetUrl.value = getCookie("customStylesheet")
    fontFace.value = getCookie("customFontFace")
  } else {
    document.documentElement.style.setProperty("--font-family", defaultFont)
    customStylesheet.href = defaultStylesheet
    sheetUrl.value = defaultStylesheet
    fontFace.value = defaultFont
  }


  if (getCookie("linkConfig")) {setLinks(JSON.parse(JSON.parse(getCookie("linkConfig"))))}
  else {setLinks(defaultLinks)}

  if (getCookie("background")) {setBackground(getCookie("background"))}
  
  updateTime(timeObj, dateObj, ampmObj)
  setInterval(function() {updateTime(timeObj, dateObj, ampmObj)}, 1000)

  colorPicker.addEventListener("input", function(e) {
    colorIndicator.innerHTML = colorPicker.value
  })

  modalBackground.addEventListener("click", function(event) {
    if (event.target == modalBackground) {closeSettingsModal()}
  })

  document.addEventListener("keydown", function(event) {
    if (event.key == "/" && document.activeElement != document.getElementById("linkConfig")
                         && document.activeElement != document.getElementById("background")
                         && document.activeElement != document.getElementById("stylesheet")
                         && document.activeElement != document.getElementById("fontFace")) {
      event.preventDefault()
      if (document.activeElement == searchBar) {searchBar.value += "/"} 
      searchBar.focus()
    } else if (event.ctrlKey && event.key == "x") {
      if (modal.style.display == "none") {openSettingsModal()}
      else {closeSettingsModal()}
    }
    else if ((event.key == "g" || event.key == "G") && document.activeElement != searchBar) {setSearch(0)}
    else if ((event.key == "b" || event.key == "B") && document.activeElement != searchBar) {setSearch(1)}
    else if ((event.key == "d" || event.key == "D") && document.activeElement != searchBar) {setSearch(2)}
    else if ((event.key == "r" || event.key == "R") && document.activeElement != searchBar) {setSearch(3)}
  })

  searchBar.addEventListener("keydown", function(event) {
    if (event.shiftKey && event.key === "Enter") {
      if (searchBar.value.slice(0, 8) == "https://") {window.location.href = searchBar.value} 
      else {window.location.href = `https://${searchBar.value}`}
    }
    else if (event.key == "Enter") {window.location.href = searchEngines[selectedEngine]+searchBar.value}
    else if (event.key == 'Escape') {
      searchBar.value = ""
      searchBar.blur()
    }
  })
}
