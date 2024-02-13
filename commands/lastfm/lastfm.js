    const { EmbedBuilder } = require('discord.js')
    const axios = require('axios')
    const lastFM = require('../../models/lastfm')

    module.exports = {
        name: 'lastfm',
        aliases: ['fm', 'lastf', 'lfm'],
        description: 'lastfm',
        category: 'lastfm',
        usage: ['lastfm set',
                'lastfm artist <artist>',
                //'lastfm whoknows <artist>',
                'lastfm artists <user>'],
        run: async (client, message, args) => {
            try {
                const fm_user = await lastFM.findOne({ id: message.author.id })
                const option = args[0]

                if(args[1] && args[0] !== 'set' && !fm_user) return args.error('You need to set your lastfm account first.')

                if(!option && fm_user) {
                    const resp = await axios.get('http://ws.audioscrobbler.com/2.0/',
                    {
                        params: {
                            api_key: client.config.lastfmkey,
                            method: 'user.getRecentTracks',
                            user: fm_user.lastfm,
                            format: 'json',
                        },
                    });

                    const artistResp = await axios.get('http://ws.audioscrobbler.com/2.0/',
                    {
                        params: {
                            api_key: client.config.lastfmkey,
                            method: 'artist.getInfo',
                            artist: resp.data.recenttracks.track[0].artist['#text'],
                            format: 'json',
                        },
                    });

                    const albumResp = await axios.get('http://ws.audioscrobbler.com/2.0/',
                    {
                        params: {
                            api_key: client.config.lastfmkey,
                            method: 'album.getInfo',
                            artist: resp.data.recenttracks.track[0].artist['#text'],
                            album: resp.data.recenttracks.track[0].album['#text'],
                            format: 'json',
                        },
                    });

                    const response2 = await axios.get(
                        'http://ws.audioscrobbler.com/2.0/',
                        {
                            params: {
                                api_key: client.config.lastfmkey,
                                method: 'user.getInfo',
                                user: fm_user.lastfm,
                                format: 'json',
                            },
                        }
                    );
                    const track = resp.data.recenttracks.track[0];
                    const embed = new EmbedBuilder()
                        .setThumbnail(track.image[3]['#text'])
                        .setColor(client.config.color)
                        .setFields([
                            { name: 'Artist', value: `[${track.artist['#text']}](${artistResp.data.artist.url})`, inline: true },
                            { name: 'Song', value: `[${track.name}](${track.url})`, inline: true },
                            { name: 'Album', value: `[${track.album['#text']}](${albumResp.data.album.url})`, inline: true },
                            { name: 'Scrobbles', value: response2.data.user.playcount, inline: true },

                        ])

                    return message.reply({ embeds: [embed] });
                } else if(!option && !fm_user) {
                    const embed = new EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription(`You didn't set your **last.fm** account. Exemple: \`${client.config.prefix}lastfm set <account>\``);
                    return message.channel.send({ embeds: [embed] });
                }

                switch(option) {
                    case 'set': {
                        try {
                            const check = await lastFM.findOne({ lastfm: args[1] })
                            if(check) return args.error('This account is already set by someone else.');

                            const response = await axios.get('http://ws.audioscrobbler.com/2.0/',
                                {
                                    params: {
                                        api_key: client.config.lastfmkey,
                                        method: 'user.getInfo',
                                        user: args[1],
                                        format: 'json',
                                    },
                                });
        
                            const embed = new EmbedBuilder()
                                .setColor(client.config.color)
                                .setDescription(`${message.author}, successfully connected your [account](${response.data.user.url})!`)
                            
        
                            if (!fm_user) {
                                await lastFM.create({
                                    id: message.author.id,
                                    lastfm: args[1],
                                });
                            } else {
                                fm_user.lastfm = args[1];
                                fm_user.updatedAt = Math.floor(Date.now() / 1000);
                                await fm_user.save();
                            }
                            return message.reply({ embeds: [embed] });
                        } catch (err) {
                            console.log(err)
                        }
                    } break;
                    case 'artists': {
                        try {
                            if(args[1]) {
                                const userid = message.mentions.users.first() || client.users.cache.find((u) =>  u.username.toLowerCase().includes(args[1].toLowerCase())) || (await client.users.fetch(args[1]));
                                if(userid) {
                                    const database = await lastFM.findOne({ id: userid.id })
                                    if(database) {
                                        const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
                                            params: {
                                                api_key: client.config.lastfmkey,
                                                method: 'user.getTopArtists',
                                                user: database.lastfm,
                                                format: 'json',
                                                limit: 10, // Limit to the top 10 artists
                                            },
                                        });
            
                                        const data = response.data.topartists.artist;

                                        const embed = new EmbedBuilder()
                                            .setDescription(`Displaying ${userid.globalName}'s top 10 artists`)
                                            .setColor(client.config.color);
            
                                        data.forEach((artist, index) => {
                                            embed.addFields({name: `${index + 1}. ${artist.name}`, value: `Playcount: ${artist.playcount}`, inline: true});
                                        });
            
                                        message.channel.send({ embeds: [embed] });

                                    } else {
                                        args.error('Not found this user in ours database')
                                    }
                                }
                            } else {
                                const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
                                    params: {
                                        api_key: client.config.lastfmkey,
                                        method: 'user.getTopArtists',
                                        user: fm_user.lastfm,
                                        format: 'json',
                                        limit: 10, // Limit to the top 10 artists
                                    },
                                });

                                const data = response.data.topartists.artist;

                                const embed = new EmbedBuilder()
                                    .setDescription(`Displaying ${message.author.username}'s top 10 artists`)
                                    .setColor(client.config.color);

                                data.forEach((artist, index) => {
                                    embed.addFields({name: `${index + 1}. ${artist.name}`, value: `Play count: ${artist.playcount}`, inline: true});
                                });
                            
                                message.channel.send({ embeds: [embed] });
                            }
                        } catch (error) {
                            const embed = new EmbedBuilder()
                                .setColor(client.config.color)
                                .setDescription(`I can't find your **last.fm** account, try using again or report to our [support server](https://discord.gg/TCCthNbms6)`);
                            message.channel.send({ embeds: [embed] });
                        }
                    } break;
                    case "artist": {
                        try {
                            const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
                                params: {
                                    api_key: client.config.lastfmkey,
                                    method: 'artist.getInfo',
                                    artist: args.slice(1).join(' '),
                                    format: 'json',
                                },
                            });

                            const data = response.data.artist;

                            const embed = new EmbedBuilder()
                                .setColor(client.config.color)
                                .setThumbnail(data.image[3]['#text'])
                                .setFields([
                                    { name: 'Artist', value: `[${data.name}](${data.url})`, inline: true },
                                    { name: 'Listeners', value: data.stats.listeners, inline: true },
                                    { name: 'Playcount', value: data.stats.playcount, inline: true },
                                    { name: 'Bio', value: data.bio.summary },
                                ]);

                            message.channel.send({ embeds: [embed] });
                        } catch (error) {
                            const embed = new EmbedBuilder()
                                .setColor(client.config.color)
                                .setDescription(`I can't find this artist, try using again or report to our [support server](https://discord.gg/TCCthNbms6)`);
                            message.channel.send({ embeds: [embed] });
                        }
                    } break;
                }
            } catch(e) {
                console.log(e)
                args.error('An error occured while running this command.')
            }
        }
    }