const likeElement = document.getElementById("likes");

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

if (getCookie("likes")==="") {
  setCookie("likes", '[]', 365);
}

function getLikes(cb) {
  let url = 'https://stenunblockedserver.stensjogren.repl.co/like?game=' + encodeURIComponent(game);
    const xml = new XMLHttpRequest();
    xml.open("GET", url, true);
    xml.send(null);
    xml.onload=function() {
    if (xml.status === 200) {
      cb( JSON.parse(xml.responseText)['likes'] );
    } else {
      cb( "Error: " + xml.responseText );
    }
    };
}

function like() {
    let js = JSON.parse(getCookie("likes"));
    
    if (js.includes(game)) {
      likeElement.innerText = 'Updating likes...';
      getLikes(function(res) {
        likes[game] = res;
        likeElement.innerText = likes[game] + ' likes';
      });
      return;
    }
  
    let url = 'https://stenunblockedserver.stensjogren.repl.co/like?game=' + encodeURIComponent(game);
    const xml = new XMLHttpRequest();
    xml.open("POST", url, true);
    xml.send(null);
    xml.onload = function(){
      if (xml.status === 200) {
        js.push(game);
          setCookie("likes", JSON.stringify(js));
          getLikes(function(res) {
            likes[game]=res;
            likeElement.innerText = likes[game] + ' likes';
          });
          return;
      }
      cb( "Error: " + xml.responseText);
    };
}

if (getCookie("enabledCookie")=="1") {
  try {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  
    gtag('config', 'G-MY0THGFRYS');
  } catch {
    console.log("[StenUnblocked] Failed to load google analytics!");
  }
}

if (likeElement != null)
  getLikes(function(likeCount) {
    likeElement.innerText = likeCount + " likes";
  });

(function(){
  var gameURL = 'hmm';
  try {
    gameURL = '?game=' + encodeURIComponent(game);
  } catch {
    gameURL = '';
  }

  let xml = new XMLHttpRequest();
  xml.open('POST', 'https://stenunblockedaktieapi--geometrysten.repl.co/view-game' + gameURL, true);
  xml.send(null);
})();

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

var _hueMode = getCookie("hueMode") == "1";
async function hueModeLoop() {
  while (_hueMode) {
    let as = document.getElementsByTagName("a");
    let speed = 1;
    for (let r = 0; r < 360; r+=speed) {
      for (let i = 0; i < as.length; i++) {
        as[i].style.filter = 'hue-rotate(' + r + 'deg)';
        as[i].style.color = 'red';
      }
      await sleep(1);
    }
  }
}

async function hueify(el) {
  let speed = 1;
  while (!_hueMode) {
    for (let r = 0; r < 360; r+=speed) {
      el.style.filter = 'hue-rotate(' + r + 'deg)';
      el.style.color = 'red';
      await sleep(1);
    }
  }
}

function clearHues() {
  let as = document.getElementsByTagName("a");
  for (let i = 0; i < as.length; i++) {
    as[i].style.filter = '';
    as[i].style.color = '';
  }
}

function toggleHueMode() {
  if (_hueMode) {
    _hueMode = false;
    setCookie("hueMode", "");
    hueify(hueModeTxt);
    clearHues();
  } else {
    _hueMode = true;
    setCookie("hueMode", "1");
    hueModeLoop();
  }
}

var hueModeTxt = document.getElementById("hueModeTxt");

if (hueModeTxt) {
  hueify(hueModeTxt);
  hueModeTxt.addEventListener("onclick", function(e) {
    toggleHueMode();
  })
}

if (_hueMode)
  hueModeLoop();