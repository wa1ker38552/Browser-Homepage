// setCookie, getCookie, and eraseCookie are taken from https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript

function setCookie(name,value,days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
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

function eraseCookie(name) {   
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function updateTime(timeObj, dateObj, ampmObj) {
  var date = new Date()
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'PM' : 'AM'
  
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

function setSearch(search) {
  if (document.activeElement != searchBar) {
    document.getElementById(searchOptions[currentSearch].id).classList.remove("selected")
    currentSearch = search
    document.getElementById(searchOptions[search].id).classList.add("selected")
  }
}

async function wait(s) {await new Promise(r => setTimeout(r, s))}

var currentSearch = "google"
var searchOptions = {
  "google": {"search": "https://google.com/search?q=", "id": "searchGoogle"},
  "bing": {"search": "https://bing.com/search?q=", "id": "searchBing"},
  "duckduckgo": {"search": "https://duckduckgo.com/?q=", "id": "searchDuckduckgo"},
  "brave": {"search": "https://search.brave.com/search?q=", "id": "searchBrave"}
}

var searchBar
window.onload = function() {
  if (getCookie("refresh") == "") {
    eraseCookie("refresh")
    wait(100)
      .then(x => {location.reload()})
  } else {
    setCookie("refresh")
  }
  searchBar = document.getElementsByClassName("search-bar")[0]
  var timeObj = document.getElementById("currentTime")
  var dateObj = document.getElementById("currentDate")
  var ampm = document.getElementById("ampm")

  searchBar.focus()
  updateTime(timeObj, dateObj, ampm)
  setInterval(function() {updateTime(timeObj, dateObj, ampm)}, 1000)

  document.addEventListener("keypress", function(event) {
    if (event.key == "/") {
      event.preventDefault()
      if (document.activeElement == searchBar) {
        searchBar.value += "/"
      } 
      searchBar.focus()
    } 
    else if (event.key == "g" || event.key == "G") {setSearch("google")}
    else if (event.key == "b" || event.key == "B") {setSearch("bing")}
    else if (event.key == "d" || event.key == "D") {setSearch("duckduckgo")}
    else if (event.key == "r" || event.key == "R") {setSearch("brave")}
  })

  searchBar.addEventListener('keydown', function onEvent(event) {
    if (event.shiftKey && event.key === "Enter") {
      if (searchBar.value.slice(0, 8) != "https://") {
        window.location.href = `https://${searchBar.value}`
      } else {
        window.location.href = searchBar.value
      }
    } else if (event.key === "Enter") {
      window.location.href = searchOptions[currentSearch].search+searchBar.value
    } else if (event.key == 'Escape') {
      searchBar.value = ""
      searchBar.blur()
    }
  })
}
