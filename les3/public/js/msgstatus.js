document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const messageContainer = document.getElementById("displayMessage");
  const message = params.get("message");
  const status = params.get("status");
  if (message) {
    if (status === "success") {
      messageContainer.style.color = "green";
    } else if (status === "fail") {
      messageContainer.style.color = "red";
    }
    messageContainer.innerText = message;
    setTimeout(() => {
      messageContainer.innerText = "";
    }, 2000);
  }
});

function getFileName(event){
  const files = event.target.files[0];
  let div = document.getElementsByClassName("img-container")[0];
  if (files) {
    div.textContent = "";
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener("load", function () {
        let img_div = document.createElement("div");
        img_div.setAttribute("class", "img-div");
        let src = fileReader.result;
        img_div.style.backgroundImage = `url('${src}')`
        div.appendChild(img_div);
    });
  }
}
if(document.getElementById("img")){
  document.getElementById("img").addEventListener("change", getFileName);
}