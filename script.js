const DEFAULT_BACKGROUND = "https://wallpapers.com/images/featured/pastel-gradient-background-etu0z7lbeebg6mlf.jpg"
//const DEFAULT_BACKGROUND = "assets/fantasy.png"
const DEFAULT_BROWSERS = ["https://google.com/search?q=", "https://bing.com/search?q=", "https://duckduckgo.com/?q=", "https://search.brave.com/search?q="]
const DEFAULT_BOOKMARKS = [
  [
    ["Replit", "https://replit.com"],
    ["Github", "https://github.com"],
    ["Stackoverflow", "https://stackoverflow.com"]
  ],
  [
    ["Instructure", "https://mvla.instructure.com"],
    ["Aeries", "https://mvla.aeries.net/student/LoginParent.aspx?page=Dashboard.aspx"],
    ["Docs", "https://docs.google.com"],
    ["Mail", "https://mail.google.com"]
  ],
  [
    ["Discord", "https://discord.com/app"],
    ["Roblox", "https://roblox.com"],
    ["Rolimons", "https://rolimons.com"]
  ]
]
var selectedBrowser = DEFAULT_BROWSERS[0]

function openSettingsModal() {animateOpenModal(document.getElementById("modal"))}
function closeSettingsModal() {animateCloseModal(document.getElementById("modal"))}

function updateTime() {
  const time = document.querySelector("#time")
  
  const currentTime = new Date()
  const hours = currentTime.getHours()
  const minutes = currentTime.getMinutes()

  const t = `${hours % 12 || 12}:${minutes < 10 ? `0${minutes}` : minutes} ${hours >= 12 ? "PM" : "AM"}`
  if (time.innerHTML != t) {
    time.innerHTML = t
  }
}

function updateDate() {
  const date = document.querySelector("#date")

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const currentDate = new Date()

  const d = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`
  if (date.innerHTML != d) {
    date.innerHTML = d
  }
}

function setBrowser(i) {
  document.getElementsByClassName("selected-browser")[0].classList.remove("selected-browser")
  document.querySelector("#browserSelect").children[i].classList.add("selected-browser")
  selectedBrowser = DEFAULT_BROWSERS[i]
}

function createBookmarks(groupData, group) {
  groupData.forEach(function(e) {
    const bookmark = document.createElement("a")
    bookmark.href = e[1]
    bookmark.innerHTML = e[0]
    group.append(bookmark)
  })
}

function loadBookmarks(bookmarks) {
  const parent = document.querySelector("#bookmarksContainer")
  
  let cols = ""
  for (_ of bookmarks) {cols += "1fr "}
  parent.style.gridTemplateColumns = cols
  
  if (bookmarks.length == 1) {
    const bookmarksGroup = document.createElement("div")
    bookmarksGroup.className = "card bookmarks-group"
    bookmarksGroup.style = "border-radius: 5px 5px 10px 10px"
    createBookmarks(bookmarks[0], bookmarksGroup)
    parent.append(bookmarksGroup)
  } else {
    bookmarks.forEach(function(e) {
      const bookmarksGroup = document.createElement("div")
      bookmarksGroup.className = "card bookmarks-group"
      createBookmarks(e, bookmarksGroup)
      parent.append(bookmarksGroup)
    })
    parent.children[0].style = "border-radius: 5px 5px 5px 10px"
    parent.children[parent.children.length-1].style = "border-radius: 5px 5px 10px 5px"
  }
}

window.onload = function() {
  updateTime()
  updateDate()
  setInterval(updateTime(), 1000)
  setInterval(updateDate(), 60000)
  loadBookmarks(DEFAULT_BOOKMARKS)
  initializeThemes()

  const input = document.querySelector("#input")
  window.onclick = function(e) {
    if (e.target == document.querySelector("#modal")) {
      closeSettingsModal()
    } else if (e.target == document.querySelector("#impexpModal")) {
      animateCloseModal(document.querySelector("#impexpModal"))
    }
  }
  window.addEventListener("keydown", function(e) {
    if (e.key == "/") {
      e.preventDefault()
      if (document.activeElement == input) {input.value += "/"}
      input.focus()
    } else if (e.key == "Escape" && document.activeElement == input) {
      input.value = ""
      input.blur()
    } else if (e.key == "Enter" && e.shiftKey && document.activeElement == input) {
      if (input.value.slice(0, 8) == "https://") {window.location.href = input.value} 
      else {window.location.href = "https://"+input.value}
    } else if (e.key == "Enter" && document.activeElement == input) {
      window.location.href = selectedBrowser+input.value
    }
    else if (e.key == "g" && document.activeElement != input) {setBrowser(0)}
    else if (e.key == "b" && document.activeElement != input) {setBrowser(1)}
    else if (e.key == "d" && document.activeElement != input) {setBrowser(2)}
    else if (e.key == "r" && document.activeElement != input) {setBrowser(3)}
    else if (e.ctrlKey && e.key == "x") {
      if (document.querySelector("#modal").style.display == "") {
        closeSettingsModal()
      } else {
        openSettingsModal()
      }
    }
  })
}