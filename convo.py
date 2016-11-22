from cleverbot import Cleverbot
from time import sleep
from os import system

bots = [Cleverbot(), Cleverbot()]

prevMessage = 'Hello.'
while True:
    for idx, bot in enumerate(bots):
        prevMessage = bot.ask(prevMessage).encode('utf-8')
        print prevMessage

        voice = 'serena' if idx == 0 else 'alex'
        system('say -v ' + voice + ' "' + prevMessage + '"')
