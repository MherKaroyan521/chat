const socket = io();

const chatForm = document.getElementById("chat-form");
console.log(chatForm);

chatForm.addEventListener("submit", (e)=>{
  e.preventDefault()
  const msg = e.target.elements.msg.value
  e.target.elements.msg.value=''
  e.target.elements.msg.focus()
  socket.emit('chatMsg', msg)
});

function outputMsg (m){ 
	const div = document.createElement('div') 
	const container = document.querySelector(".chat-messages"); 	div.classList.add('message');
	div.innerHTML = `<p class='meta'>${m.username} 	<span>${m.time}</span></p><p class='text'>${m.message}</p>`; 	
  container.appendChild(div);
}

socket.on('message', (data)=>{
  outputMsg(data);
  const container = document.querySelector(".chat-messages");
  container.scrollTop = container.scrollHeight;
});