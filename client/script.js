import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chat_container = document.querySelector("#chat_container");
var textArea = document.querySelector("textarea");
var textAreaValue = textArea.value;
let loadInterval;

function loader(element){
  element.textContent = "";

  loadInterval = setInterval(()=> {
    element.textContent += ".";
  },300)

  if(element.textContent === "...."){
    element.textContext = "";
  }
}

function typeText(element,text){
  let index = 0;

  let interval = setInterval(()=>{
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval)
    }
  },20)
}

function generateUniqueId(){
  const timeStamps = Date.now();
  const randomNumber = Math.random();

  const hexaDecimalString = randomNumber.toString(16);

  return `id-${timeStamps}-${hexaDecimalString}`
}

const chatStripe = (isAi,value,uniqueId)=>{
  return(
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
            <div class="profile">
                <img 
                src="${isAi ? bot : user}"
                alt="${isAi ? 'bot' : 'user'}"
                />
            </div>
            <div class="message" id="${uniqueId}">${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async(e)=>{
  e.preventDefault();

  if(textArea.value === "" || textArea.value === " "){
    alert("Please Enter Something...")
    return;
  }

  const data = new FormData(form);
  chat_container.innerHTML += chatStripe(false,data.get("prompt"));

  form.reset();

  const uniqueId = generateUniqueId();
  chat_container.innerHTML += chatStripe(true," ",uniqueId);

  chat_container.scrollTop = chat_container.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv)

  const response = await fetch("https://ai-app-6ubu.onrender.com",{
    method:"post",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify({
      prompt:data.get("prompt")
    })
  })

  clearInterval(loadInterval)
  messageDiv.innerHTML = "";


  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv,parsedData);
  }else{
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong..."
    alert(err)
  }

}

form.addEventListener("submit",handleSubmit);


form.addEventListener("keyup",(e)=>{
  if(e.keyCode === 13){
    if(textArea.value === ""){
      alert("Please Enter Something...")
      return;
    }
    handleSubmit(e)
  }
})