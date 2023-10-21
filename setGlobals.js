function setCss(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function getCss(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name)
}