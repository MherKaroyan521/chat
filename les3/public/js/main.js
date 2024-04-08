const socket = io();

const chatForm = document.getElementById("chat-form");
console.log(chatForm);

chatForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const msg = e.target.elements.msg;
  console.log(msg.value);
  socket.emit("chatMsg", msg.value)
  msg.value = "";
  msg.focus();
});

function outputMsg (m){ 
	const div = document.createElement('div') 
	const container = document.querySelector(".chat-messages"); 	div.classList.add('message');
	div.innerHTML = `<p class='meta'>John 	<span>12:20pm</span></p><p class='text'>${m}</p>`; 	
  container.appendChild(div);
}

socket.on('message', (data)=>{
  console.log(data);
  outputMsg(data);
});