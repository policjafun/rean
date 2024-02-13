const { Wordle } = require('discord-gamecord');
const Discord = require('discord.js');

module.exports = {
    name: 'wordle',
    description: 'Play a wordle!',
    userPerms: [],
    botPerms: [],
    usage: ['wordle'],
    run: async (client, message, args) => {
        try {
            console.log('test')
            const Game = new Wordle({
                message: message,
                isSlashGame: false,
                embed: {
                    title: 'Wordle',
                    color: client.config.color,
                },
                customWord: null,
                timeoutTime: 60000,
                winMessage: 'You\'ve won! The word was **{word}**.',
                loseMessage: 'You\'ve lost! The word was **{word}**.',
                playerOnlyMessage: 'Only {player} can use these buttons.',
            });

            Game.startGame();
            Game.on('gameOver', async (g) => {
                if(g.guessed.includes(g.word)) {
                    let game = await client.db.gameWins.findOne({
                        userID: message.author.id,
                    });
                    if (!game) {
                        game = await client.db.gameWins.create({
                            userID: message.author.id,
                            wins: 0,
                        });
                    }
        
                    game.wins += 1;
                    await game.save();
                }
            });
        } catch (e) {
            console.log(e);
            args.error('An error occurred while running this command.')
        }

    },
};
