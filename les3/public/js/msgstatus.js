document.addEventListener("DOMContentLoaded", function (){
  const params = new URLSearchParams(window.location.search);
  const messageContainer = document.getElementById("displayMessages")
  const message = params.get("message");
  const status = params.get("status");
  console.log(message, status);
  if(message && status){
    if(status == "Success"){
      messageContainer.style.backgroundColor = "green";
    }else {
      messageContainer.style.backgroundColor = "red";
    }
    messageContainer.innerHTML = message;
  
    setTimeout(function (){
      messageContainer.style.display = "none";
    },2000)
  }
})