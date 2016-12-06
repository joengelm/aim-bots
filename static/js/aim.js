const adjectives = ['yellow', 'savvy', 'wild', 'crazy', 'dead', 'rich', 'poor', 'happy', 'musical', 'purring', 'bad', 'good', 'old', 'yung', 'mean', 'funny', 'b4d', 'gr33n', 'blue', 'red', 'ded', '', '', '', '', '', '', '', '', '', ''];
const nouns = ['joey', 'sushi', 'mikey', 'serg', 'felip', 'cat', 'kitten', 'burrito', 'fangurl', 'fanboi', 'baseb4llr', 'erikaa', 'emily', 'willy', 'zombie', 'sock', 'witch', 'wizard', 'boy', 'girl', 'woman', 'man', 'elf', 'hunter', '', '', '', '', '', '', '', ''];
const colors = ['blue', 'red', 'green', 'purple', 'violet', 'brown'];
const voices = ['UK English Male', 'UK English Female', 'US English Female'];
const prompts = ['What\'s your favorite TV show?', 'Do you like sushi?', 'I don\'t like talking to strangers.', 'the internet scares me', 'i need a friend', 'where are you from?', 'a/s/l?', 'Will you marry me?', 'tell me a bedtime story', 'how are you?', 'What is your social security number?', 'do i know u?', 'what is today\'s date?', 'tell me a joke', 'I don\'t like you.', 'i\'m sleepy', 'hey ;)', 'sup', 'yo', 'Howdy!', 'hallo', 'Guten Tag.', 'Hola.', 'Bonjour.', 'Good morning, sunshine.', 'ayy lmao'];

let namesToBots = {};
let allBots = [];

let buddyCount = 0;
let totalBuddies = 0;

let topIndex = 5;
const bringToTop = (event) => {
	document.getElementById(event.data.id).style.zIndex = topIndex + 1;
	topIndex += 1;
};

const bringToTopById = (id) => {
	document.getElementById(id).style.zIndex = topIndex + 1;
	topIndex += 1;
};

const updateScroll = (chatbox) => {
    const element = document.getElementById(chatbox);
    element.scrollTop = element.scrollHeight;
};

const addMessage = (bot, message, chatbox) => {
	$('#' + chatbox).append('<p class="chattext"><span style="color:' + bot.color + '">' + bot.name + '</span>: ' + message + '</p>');	
	console.log('appended ' + message + ' for ' + bot.name);
	setTimeout(updateScroll, 100, chatbox);
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

const chat = (bot1, bot2, prompt, chatbox) => {
	addMessage(bot1, prompt, chatbox);

	responseFromBot(bot2, prompt, (response) => {
		addMessage(bot2, response, chatbox);

		responseFromBot(bot1, response, (nextPrompt) => {
			chat(bot1, bot2, nextPrompt, chatbox);
		});
	});
};

const makeChatWith = (bot1, bot2) => {
	const chatbox = 'chatbox' + bot1.name + bot2.name;
	const top = random(2, 30).toString();
	const left = random(5, 45).toString();
	const chatWindowHTML = '<div id="' + chatbox + 'Window" style="position: absolute; top: ' + top + '%; left: ' + left + '%;" class="noselect"><img src="static/img/aim.png"><div class="chatbox" id="' + chatbox + '"></div></div>';
	$("#desktop").append(chatWindowHTML);
	$("#" + chatbox + "Window").draggable();
	$("#" + chatbox + "Window").on('mousedown', { id: chatbox + 'Window' }, bringToTop);
	bringToTopById(chatbox + 'Window');
	chat(bot1, bot2, choose(prompts), chatbox);
};

const handleBuddyClick = (event) => {
	const bot = namesToBots[event.data.name];
	makeChatWith(bot, chooseDistinctBot(allBots, bot));
};

const incrementBuddyCount = () => {
	buddyCount += 1;
	$('#buddyCount56').text('(' + buddyCount + '/' + totalBuddies + ')');
};

const addToBuddyList = (bots) => {
	for (bot of bots) {
		$("#buddyList").append('<p class="buddyName ' + bot.name + '">' + bot.name + '</p>');
		$("." + bot.name).on('click', { name: bot.name }, handleBuddyClick);
		incrementBuddyCount();
	}
};

const emptyBot = () => {
	return {
		name: '',
		color: '',
		voice: ''
	};
};

const random = (lower, upper) => {
	// Inclusive on both ends, only accepts and returns integers
	return Math.floor(Math.random() * (upper + 1 - lower)) + lower;
};

const choose = (list) => {
	return list[Math.floor(Math.random() * list.length)];
};

const chooseDistinctBot = (list, otherBot) => {
	let choice = choose(list);
	let count = 0;
	while (choice.name == otherBot.name && count < 50) {
		choice = choose(list);
		count += 1;
	}
	return choice;
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

	bot = {
		id: getId(),
		name: name,
		color: color,
		voice: voice
	}

	namesToBots[name] = bot;
	allBots.push(bot);

	return bot;
};

const addNewBuddy = () => {
	const bot = makeDistinctBot(emptyBot());
	addToBuddyList([bot]);

	const delay = random(15000, 60000);
	setTimeout(addNewBuddy, delay);
}

const main = (prompt) => {
	bot1 = makeDistinctBot(emptyBot());
	bot2 = makeDistinctBot(bot1);

	totalBuddies = random(32, 97);

	addToBuddyList([bot1, bot2]);
	$("#buddy").draggable();
	$("#buddy").on('mousedown', { id: 'buddy' }, bringToTop);

	makeChatWith(bot1, bot2);

	setTimeout(addNewBuddy, 10000);
};

setTimeout(() => { main('Hello.') }, 2000);
