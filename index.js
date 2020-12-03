const Discord = require("discord.js");

const client = new Discord.Client();

const Database = require("@replit/database");
const db = new Database();

const prefix = "ozz_";

client.on("message", function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  else if (command === "sum") {
    const numArgs = args.map(x => parseFloat(x));
    const sum = numArgs.reduce((counter, x) => counter += x);
    message.reply(`The sum of all the arguments you provided is ${sum}!`);
  }

	else if (command === "echo") {
		const string = args.join(" ");
		message.channel.send(string);
	}

	else if (command === "yell") {
		const string = args.join(" ");
		const upperCase = string.toUpperCase();
		message.channel.send(upperCase);
	}

	else if (command === "set") {
		db.set(args[0], args[1]).then(() => {
			message.channel.send(`I saved <${args[1]}> to ${args[0]}`);
		});
	}

	else if (command === "get") {
		db.get(args[0]).then(value => {
			message.channel.send(`The link for ${args[0]} is <${value}>!`);
		})
	}

	else if (command === "list") {
		db.list().then(keys => {

			let string = ""
			keys.forEach(key => {
				
				db.get(key).then(value => {
					string += `${key} => ${db.get(key)}`
				});
				string += "\n"
				
			})
			message.channel.send(string);
		})

	}
	
	else if (command === "delete") {
		// this can throw errors!
		// db.delete(args[0]).then(() => {
		// 	message.channel.send(`I deleted ${args[0]} in the db!`);
		// })

		// this won't throw errors!
		db.get(args[0]).then(value => {

			if (value != null) {
				db.delete(args[0]).then(() => {
					message.channel.send(`I deleted ${args[0]}`);
				})
			} else {
				message.channel.send(`You tried to delete something that doesn't exist!`)
			}

		})

	}
});

client.login(process.env.BOT_TOKEN);
