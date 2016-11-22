const addMessage = (name, message, color, voice) => {
	$('#chatbox').append('<p class="chattext"><span style="color:' + color + '">' + name + '</span>: ' + message + '</p>');	
	console.log('appended ' + message + ' for ' + name);
	responsiveVoice.speak(message, voice);
};

setTimeout(() => addMessage('joey2000', 'Hi.', 'red', 'US English Male'), 500);
setTimeout(() => addMessage('erikaaat', 'Hello.', 'blue', 'UK English Female'), 2000);
setTimeout(() => addMessage('joey2000', 'How are you?', 'red', 'US English Male'), 4000);