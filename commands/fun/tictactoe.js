const { EmbedBuilder } = require('discord.js')
const { TicTacToe } = require('discord-gamecord');
const gameWins_model = require('../../models/gameWins.js')

module.exports = {
    name: 'tictactoe',
    aliases: ['ttt', 'tic-tac-toe'],
    description: 'Tic Tac Toe game',
    category: 'fun',
    usage: ['tictactoe <user>'],
    userPerms: [''],
    clientPerms: [''],
    run: async (client, message, args) => {
        try {
            if(!args[0]) return args.usage('tictactoe')
            const user = message.mentions.users.first() || findUser(message, args[0])
            const Game = new TicTacToe({
                message: message,
                isSlashGame: false,
                opponent: user,
                embed: {
                  title: 'Tic Tac Toe',
                  color: client.config.color,
                  statusTitle: 'Status',
                  overTitle: 'Game Over!'
                },
                emojis: {
                  xButton: '❌',
                  oButton: '🔵',
                  blankButton: '➖'
                },
                mentionUser: true,
                timeoutTime: 60000,
                xButtonStyle: 'DANGER',
                oButtonStyle: 'PRIMARY',
                turnMessage: 'Its turn of player **{player}**.',
                winMessage: '**{player}** won the TicTacToe Game.',
                tieMessage: 'The Game tied! No one won the Game!',
                timeoutMessage: 'The Game went unfinished! No one won the Game!',
                playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
              });


            Game.startGame();

            Game.on('gameOver', async (result) => {
                if(result.result == 'win') {
                    const data = await gameWins_model.findOne({ userID: result.winner })
                    if(!data) {
                        const newData = await gameWins_model.create({
                            userID: result.winner,
                            wins: 1
                        })
        
                        await newData.save()
                    } else {
                        data.wins += 1
                    }
                }
            })
            
        } catch(e) {
            console.log(e)
            args.error('An error occurred while executing the command')
        }
    }
}