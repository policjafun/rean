const { Snake } = require('discord-gamecord');


const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'snake',
    aliases: ['snakegame'],
    description: 'Snake game',
    category: 'fun',
    usage: ['snake'],
    userPerms: [''],
    clientPerms: [''],
    run: async (client, message, args) => {
        const Game = new Snake({
            message: message,
            isSlashGame: false,
            embed: {
                title: 'Snake Game',
                overTitle: 'Game Over',
                color: client.config.color,
            },
            emojis: {
                board: '⬛',
                food: '🍎',
                up: '⬆️', 
                down: '⬇️',
                left: '⬅️',
                right: '➡️',
            },
            stopButton: 'Stop',
            timeoutTime: 60000,
            snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
            foods: ['🍎', '🍇', '🍊', '🥕', '🥝', '🌽'],
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });
          
        Game.startGame();
    }
}