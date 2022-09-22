const socket = io("ws://localhost:3000");

//ngurusin kalo dapat data di event message
socket.on("message", (msg) => {
  const el = document.createElement("li");
  el.innerText = msg;
  document.querySelector("ul").appendChild(el);
})

document.querySelector("button").onclick = () => {
  const text = document.querySelector("input").value;

  //emit ke socket channel apo, disini ke channel message
  socket.emit("message", text);

  document.querySelector("input").value = "";
}
