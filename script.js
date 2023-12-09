const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;
  let charCount = 0

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      charCount ++ 

      if (text.substr(index, 2) === '\n\n' && charCount > 500) {
        element.innerHTML += '<br> <br>';
        charCount = 0
        // Sla het extra teken over omdat het al is toegevoegd als "</p>"
        index++;
      }


      index++;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } else {
      clearInterval(interval);
    }
  }, 10);
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
  e.preventDefault();
  
  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe("");

  form.reset();

  const messageDiv = chatContainer.lastElementChild;
  loader(messageDiv);

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

    typeText(messageDiv, parsedData);
    const emailform = document.getElementById("emailform")
    emailform.classList.remove("hidden")

    const submitbtn = document.getElementById("submit-button")
    submitbtn.classList.add("hidden")
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Er is een fout opgetreden";
    alert(err);
  }
};

const popup = document.getElementById("popup")
const varSub = document.getElementById("varSub")
varSub.addEventListener("click", submitVariables)

function submitVariables(){

  let charVar1Value = document.getElementById('charVar1').value;
  let charVar2Value = document.getElementById('charVar2').value;
  let charVar3Value = document.getElementById('charVar3').value;
  let themaVarValue = document.getElementById('themaVar').value;
  let niveauVarValue = document.getElementById('niveauVar').value;


  v1 = [charVar1Value, charVar2Value, charVar3Value]
  v2 = [themaVarValue]
  v3 = [niveauVarValue]

  popup.classList.add("hidden")

}

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
