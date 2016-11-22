from cleverbot import Cleverbot
from flask import Flask, jsonify, render_template, request
import os

app = Flask(__name__)

id_to_bot = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/message', methods=['POST'])
def get_message_from_bot():
    bot_id = request.form['id']
    prompt = request.form['prompt']

    print bot_id + ' has received prompt: ' + prompt

    message = get_message(bot_id, prompt)
    return jsonify(message=message)

def create_bot_with_id(bot_id):
    bot = Cleverbot()
    id_to_bot[bot_id] = bot
    return bot

def get_message(bot_id, prompt='Hello.'):
    if bot_id not in id_to_bot:
        create_bot_with_id(bot_id)

    bot = id_to_bot[bot_id]
    msg = bot.ask(prompt).encode('utf-8')

    print bot_id + ': ' + msg

    return msg

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)