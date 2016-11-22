const adjectives = ['yellow', 'savvy', 'wild', 'crazy', 'dead', 'rich', 'poor', 'happy', 'musical', 'purring', 'bad', 'good', 'old', 'yung', 'mean', 'funny', 'b4d', 'gr33n', 'blue', 'red', 'ded', '', '', '', '', '', '', '', '', '', ''];
const nouns = ['joey', 'sushi', 'mikey', 'serg', 'felip', 'cat', 'kitten', 'burrito', 'fangurl', 'fanboi', 'baseb4llr', 'erikaa', 'emily', 'willy', 'zombie', 'sock', 'witch', 'wizard', 'boy', 'girl', 'woman', 'man', 'elf', 'hunter', '', '', '', '', '', '', '', ''];
const colors = ['blue', 'red', 'green', 'purple', 'violet', 'brown'];
const voices = ['UK English Male', 'UK English Female', 'US English Female'];

let scrolled = false;
const updateScroll = () => {
    if (!scrolled) {
        const element = document.getElementById("chatbox");
        element.scrollTop = element.scrollHeight;
    }
}

$("#yourDivID").on('scroll', () => {
    scrolled = true;
});

const addMessage = (bot, message) => {
	$('#chatbox').append('<p class="chattext"><span style="color:' + bot.color + '">' + bot.name + '</span>: ' + message + '</p>');	
	console.log('appended ' + message + ' for ' + bot.name);
	setTimeout(updateScroll, 100);
	responsiveVoice.speak(message, bot.voice);
};

const responseFromBot = (bot, prompt, callback) => {
	const params = {
		id: bot.id,
		prompt: prompt
	};
	$.post('/message', params, (response) => {
		const message = response['message'];
		console.log('prompt: ' + prompt);
		setTimeout(() => { callback(message) }, 1000 + prompt.length * 70);
	});
};

const chat = (bot1, bot2, prompt) => {
	addMessage(bot1, prompt);

	responseFromBot(bot2, prompt, (response) => {
		addMessage(bot2, response);

		responseFromBot(bot1, response, (nextPrompt) => {
			chat(bot1, bot2, nextPrompt);
		});
	});
};

const emptyBot = () => {
	return {
		name: '',
		color: '',
		voice: ''
	};
};

const choose = (list) => {
	return list[Math.floor(Math.random() * list.length)];
};

const getId = () => {
	const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
	return letter + Date.now().toString();
};

const getName = () => {
	const adj = choose(adjectives);
	const noun = choose(nouns);
	let number = '';
	if (Math.random() > 0.3) {
		number = Math.floor(Math.random() * 10000).toString();
	}

	const name = adj + noun + number;
	if (name.length < 5) {
		return getName();
	}
	return name;
};

const getColor = () => {
	return choose(colors);
};

const getVoice = () => {
	return choose(voices);
};

const makeDistinctBot = (otherBot) => {
	let name = otherBot.name;
	while (name === otherBot.name) {
		name = getName();
	}

	let color = otherBot.color;
	while (color === otherBot.color) {
		color = getColor();
	}

	let voice = otherBot.voice;
	while (voice === otherBot.voice) {
		voice = getVoice();
	}

	return {
		id: getId(),
		name: name,
		color: color,
		voice: voice
	};
};

const main = (prompt) => {
	bot1 = makeDistinctBot(emptyBot());
	bot2 = makeDistinctBot(bot1);

	chat(bot1, bot2, prompt);
};

setTimeout(() => { main('Hello.') }, 2000);
