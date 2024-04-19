const socket = io();
const params = new URLSearchParams(window.location.search);

const token = params.get("token");
console.log(token)
if (token) {
  localStorage.setItem("token", token); 
}

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  socket.emit("chatMsg", msg);
});
function outputMsg(data) {
  const div = document.createElement("div");
  const container = document.querySelector(".chat-messages");
  div.classList.add("message");

  div.innerHTML = `<p class='meta'>${data.username}
<span>${data.time}</span></p><p class='text'>${data.message}</p>`;
  container.appendChild(div);
}
socket.on("message", (data) => {
  outputMsg(data);
});
