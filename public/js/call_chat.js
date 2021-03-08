var nameData = localStorage.getItem('MeetMe_name')

if(nameData===''){
    var data = prompt("Please enter your name");
    localStorage.setItem('MeetMe_name',data)
    while (!data){
        data = prompt("Please enter your name");
        localStorage.setItem('MeetMe_name',data)
    }
    var nameData = localStorage.getItem('MeetMe_name')


}

const chatForm = document.getElementById('msgInput');
const chatMsg = document.querySelector('.msg_container');
var messg = document.getElementById('message');

let socketio = io('/');

socketio.on('connected-user', (message)=>{
    // console.log('connected to server');
    setMessage({user:null, message:message.message});
    chatMsg.scrollTop = chatMsg.scrollHeight;
    window.scrollBy(100,100)
})
socketio.on('disconnect-user', (message)=>{
    // console.log('disconnected from user');
    setMessage({user:null, message:message.message});
})
socketio.on('error', function(err){
    console.log(err)
    alert(err)
})
socketio.on('message', message =>{
    setMessage(message);
    chatMsg.scrollTop = chatMsg.scrollHeight;
    window.scrollBy(100,100)
})

chatForm.addEventListener('submit', e =>{
    e.preventDefault();
    const message = e.target.elements.message.value;
    if(messg.value.length>=1){
        socketio.emit('chatting',{
            user: nameData || data,
            message: message
        }); //sending message to server
    }
    messg.value = '';
})

function setMessage(msg){
    const div = document.createElement('div');
    div.classList.add(`${
        msg.user===nameData?"message_outgoing": msg.user!=null?"message_incomming":"message"
    }`);
    div.innerHTML = `${
        msg.user!=null? `<h6>from ${msg.user===nameData? 'you': msg.user}</h6><p>${msg.message}</p>`:`<p>${msg.message}</p>`
    }`;
    document.querySelector('.msg_container').appendChild(div)
}

function leave(){
    socketio.disconnect()
    peerConnection.close();
    window.open('/')
}