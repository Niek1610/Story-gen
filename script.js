const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;


function addLoadingAnimation() {
  let loadingElement = document.getElementById('loading-dots');
  loadInterval = setInterval(function() {
    loadingElement.innerHTML += '.';
    if (loadingElement.innerHTML.length > 3) {
      loadingElement.innerHTML = '';
    }
  }, 500); 
}

function laden() {
  let loadingElement = document.getElementById('submit-button');
  loadInterval = setInterval(function() {
    loadingElement.innerHTML += '.';
    if (loadingElement.innerHTML.length > 24) {
      loadingElement.innerHTML = 'Verhaal wordt gemaakt';
    }
  }, 500); 
}

let interval;

function typeText(element, text) {
  let index = 0;
  let charCount = 0
  let titelcount = 0 

  interval = setInterval(() => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      charCount ++ 
    
      if (text.charAt(index) === '.' && titelcount === 0) {
        element.innerHTML += '<br> <br>';
        titelcount = 1;
      }

      if (text.substr(index, 2) === '\n\n' && charCount > 500) {
        element.innerHTML += '<br> <br>';
        charCount = 0
        // Sla het extra teken over omdat het al is toegevoegd als "</p>"
        index++;
      }

      index++;
     
    } else {
      clearInterval(interval);
    }
  }, 30);
}

function skipText(element, text) {
  const skipbtn = document.getElementById("skipbtn")

  skipbtn.addEventListener("click", () =>{

    clearInterval(interval)
    let charCount = 0;
    let formattedText = '';
  
    for (let i = 0; i < text.length; i++) {
      formattedText += text.charAt(i);
      charCount++;
  
      if (text.substr(i, 2) === '\n\n' && charCount > 500) {
        formattedText += '<br> <br>';
        charCount = 0;
        i++;
      }
    }
  
    element.innerHTML += formattedText;
    chatContainer.scrollTop = chatContainer.scrollHeight;
    skipbtn.style.display = "none"
  })
  
}



function chatStripe(value) {
  return (`
    <div class="wrapper ai">
      <div class="chat">
        <div class="profile"></div>
        <div class="message">${value}</div>
      </div>
    </div>
  `);
}


let v1 = []
let v2 = []
let v3 = []

const submit = async (e) => {
  testbtn.style.display = "none"
  e.preventDefault();
  const submitbtn = document.getElementById("submit-button")
  submitbtn.innerHTML = "Verhaal wordt gemaakt"
  submitbtn.style.pointerEvents = "none"
  laden()
  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe("");

  form.reset();

  const messageDiv = chatContainer.lastElementChild;
 
  const response = await fetch("https://story-yuz6.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
     character: v1,
     thema: v2,
     geletterdheid: v3
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    console.log('url:', data.imagedata);

    const imggen = document.getElementById("imageGen")
    imggen.style.visibility = "visible"
    imggen.setAttribute('src', data.imagedata)

    typeText(messageDiv, parsedData);
    skipText(messageDiv, parsedData)
    
      const bewaren = document.getElementById("bewaren")
      bewaren.classList.remove("hidden")

    const submitbtn = document.getElementById("submit-button")
    submitbtn.classList.add("hidden")

    const chatContainer = document.getElementById("chat_container")
    chatContainer.style.pointerEvents = "all"

    const skipbtn = document.getElementById("skipbtn")
    skipbtn.style.display = "grid"
  
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Er is een fout opgetreden";
    alert(err);
  }
};



window.addEventListener("load", () => {
  chatContainer.innerHTML += chatStripe("");
});

form.addEventListener("submit", submit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    submit(e);
  }
});

const serverUrl = 'https://story-yuz6.onrender.com';

addLoadingAnimation()

const ja = document.getElementById("ja")
ja.addEventListener("click", () =>{
  bewaren.classList.add("hidden")
  const emailform = document.getElementById("emailform")
  emailform.classList.remove("hidden")
})

const nee = document.getElementById("nee")
nee.addEventListener("click", () =>{
  location.reload()
})

// Tijdelijke functies
const title = document.getElementById("titleheader")
const testbtn = document.getElementById("testingbutton")
testbtn.addEventListener("click", () =>{
  popup.classList.remove("hidden")
  title.style.display = "none"
 
})


const popup = document.getElementById("popup")
const varSub = document.getElementById("varSub")
varSub.addEventListener("click", submitVariables)

function submitVariables(){

  let charVar1Value = document.getElementById('charVar1').value;
  let charVar2Value = document.getElementById('charVar2').value;
  let charVar3Value = document.getElementById('charVar3').value;
  let themaVar1Value = document.getElementById('themaVar1').value;
  let themaVar2Value = document.getElementById('themaVar2').value;
  let themaVar3Value = document.getElementById('themaVar3').value;
  let niveauVarValue = document.getElementById('niveauVar').value;


  v1 = [charVar1Value, charVar2Value, charVar3Value]
  v2 = [themaVar1Value, themaVar2Value, themaVar3Value]
  v3 = [niveauVarValue]

  popup.classList.add("hidden")
  const submitbtn = document.getElementById("submit-button")
  submitbtn.classList.remove("hidden")
  console.log(v1,v2,v3)
  testbtn.style.display = "none"
  const of = document.getElementById("of")
  of.style.display = "none"
}