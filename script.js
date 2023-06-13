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

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexaString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexaString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (`
    <div class="wrapper ${isAi && "ai"}">
      <div class="chat">
      <div class="profile"></div>
        <div class="message" id=${uniqueId}> ${value} </div>
      </div>
    </div>

    `)
}

const submit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  const uniqueId = generateId();
  chatContainer.innerHTML += chatStripe(true, "", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  const response = await fetch("https://chadgpt-basa.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Er is een fout opgetreden";
    alert(err);
  }
};

window.addEventListener("load", ()=> {
  const uniqueId = generateId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  const messageDiv = document.getElementById(uniqueId);
  messageDiv.innerHTML = "ChadGPT, Ask me anything";

} );

form.addEventListener("submit", submit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    submit(e);
  }
});

const serverUrl = 'https://chadgpt-basa.onrender.com';

const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', () => {
  chatContainer.innerHTML += chatStripe(true, "Memory cleared");
  fetch(`${serverUrl}/reset`)
    .then(response => response.text())
    .then(result => {
      console.log(result); 
    })
    .catch(error => {
      console.error(error);
    });
});