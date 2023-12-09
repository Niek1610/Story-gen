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


let v1 = ["stoere, domme, jongen"]
let v2 = ["actie"]
let v3 = ["laag"]

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
