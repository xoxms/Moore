import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { CommandInteraction, EmbedBuilder, Guild, GuildMember, TextBasedChannel } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Player, Queue } from "@discordx/music";
import { templateEmbed } from "../../lib/embeds.js";

@Discord()
@Category("Music")
@SlashGroup({
  description: "Music commands group",
  name: "music",
})
@SlashGroup("music")
export class MusicCommand {
  musicPlayer: Player;
  channel: TextBasedChannel | undefined;

  constructor() {
    this.musicPlayer = new Player();

    this.musicPlayer.on("onStart", ([, track]) => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: `Playing ${track.title}`,
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onFinishPlayback", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: "Finished playback",
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onPause", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: "Paused playback",
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onResume", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: "Resumed playback",
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onError", ([, err, track]) => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "error",
              title: "Music",
              description: `Error ${err.name}. \n While playing ${track.title}`,
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onFinish", ([, track]) => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: `Finished playing ${track.title}`,
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onLoop", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: "Looping",
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onRepeat", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: "Repeating",
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onSkip", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: "Skipped",
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onTrackAdd", ([, track]) => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: `Added ${track[track.length - 1].title}`,
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onLoopEnabled", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: "Loop enabled",
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onLoopDisabled", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: "Loop disabled",
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onRepeatEnabled", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: "Repeat enabled",
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onRepeatDisabled", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: "Repeat disabled",
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onMix", ([, tracks]) => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Mix",
              description: `Added ${tracks.length} tracks`,
            }),
          ],
        });
      }
    });

    this.musicPlayer.on("onVolumeUpdate", ([, volume]) => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            templateEmbed({
              type: "default",
              title: "Music",
              description: `Volume updated to ${volume}`,
            }),
          ],
        });
      }
    });
  }

  queue(guild: Guild): Queue {
    return this.musicPlayer.queue(guild);
  }

  @Slash({ description: "Play a song" })
  async play(
    @SlashOption({
      description: "Song name or url",
      name: "song",
      type: ApplicationCommandOptionType.String,
    })
    songName: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    if (!interaction.guild) return;

    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "You must be in a voice channel in order to use this command",
            interaction,
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();
    const queue = this.queue(interaction.guild);
    if (!queue.isReady) {
      this.channel = interaction.channel ?? undefined;
      await queue.join(interaction.member.voice.channel);
    }
    const status = await queue.play(songName);
    if (!status) {
      await interaction.followUp({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "Could not find any songs",
            interaction,
          }),
        ],
        ephemeral: true,
      });
    } else {
      await interaction.followUp({
        embeds: [
          templateEmbed({
            type: "default",
            title: "Music",
            description: `Playing ${status.title}`,
            interaction,
          }),
        ],
        ephemeral: true,
      });
    }
  }

  @Slash({ description: "Play songs from a playlist" })
  async playlist(
    @SlashOption({
      description: "Playlist name or url",
      name: "playlist",
      type: ApplicationCommandOptionType.String,
    })
    playlistName: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    if (!interaction.guild) {
      return;
    }

    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "You must be in a voice channel in order to use this command",
            interaction,
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();
    const queue = this.queue(interaction.guild);
    if (!queue.isReady) {
      this.channel = interaction.channel ?? undefined;
      await queue.join(interaction.member.voice.channel);
    }
    const status = await queue.playlist(playlistName);
    if (!status) {
      await interaction.followUp({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "Could not find any songs",
            interaction,
          }),
        ],
        ephemeral: true,
      });
    } else {
      await interaction.followUp({
        embeds: [
          templateEmbed({
            type: "default",
            title: "Music",
            description: "The requested playlist has been added to the queue",
            interaction,
          }),
        ],
      });
    }
  }

  async validateInteraction(
    interaction: CommandInteraction,
  ): Promise<undefined | { guild: Guild; member: GuildMember; queue: Queue }> {
    if (!interaction.guild || !(interaction.member instanceof GuildMember)) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "You must be in a guild in order to use this command",
            interaction,
          }),
        ],
      });
      return;
    }

    const queue = this.queue(interaction.guild);

    if (!queue.isReady) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "I am not in a voice channel",
            interaction,
          }),
        ],
      });
      return;
    }

    if (interaction.member.voice.channel!.id !== queue.voiceChannelId) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "You must be in the same voice channel as me in order to use this command",
            interaction,
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    return { guild: interaction.guild, member: interaction.member, queue };
  }

  @Slash({ description: "Skip current track" })
  async skip(interaction: CommandInteraction): Promise<void> {
    const validate = await this.validateInteraction(interaction);
    if (!validate) return;

    const { queue } = validate;
    queue.skip();

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: "Music",
          description: "Skipped current track",
          interaction,
        }),
      ],
      ephemeral: true,
    });
  }

  @Slash({ description: "Mix tracks" })
  async mix(interaction: CommandInteraction): Promise<void> {
    const validate = await this.validateInteraction(interaction);
    if (!validate) return;

    const { queue } = validate;
    queue.mix();

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: "Music",
          description: "Mixing tracks",
          interaction,
        }),
      ],
      ephemeral: true,
    });
  }

  @Slash({ description: "Pause track" })
  async pause(interaction: CommandInteraction): Promise<void> {
    const validate = await this.validateInteraction(interaction);
    if (!validate) return;

    const { queue } = validate;

    if (queue.isPause) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "The queue is already paused",
            interaction,
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    queue.pause();
    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: "Music",
          description: "Paused track",
          interaction,
        }),
      ],
      ephemeral: true,
    });
  }

  @Slash({ description: "resume music" })
  async resume(interaction: CommandInteraction): Promise<void> {
    const validate = await this.validateInteraction(interaction);
    if (!validate) return;

    const { queue } = validate;

    if (queue.isPlaying) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "The queue is already playing",
            interaction,
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    queue.resume();
    await interaction.reply("resumed music");
  }

  @Slash({ description: "Seek track" })
  async seek(
    @SlashOption({
      description: "Seek time in seconds",
      name: "time",
      type: ApplicationCommandOptionType.Number,
    })
    time: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    const validate = await this.validateInteraction(interaction);
    if (!validate) return;

    const { queue } = validate;

    if (!queue.isPlaying || !queue.currentTrack) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "There is no music playing",
            interaction,
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    const state = queue.seek(time * 1e3);
    if (!state) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "The requested time is out of bounds",
            interaction,
          }),
        ],
        ephemeral: true,
      });
      return;
    }
    await interaction.reply("current music seeked");
  }

  @Slash({ description: "Leave voice channel" })
  async leave(interaction: CommandInteraction): Promise<void> {
    const validate = await this.validateInteraction(interaction);
    if (!validate) return;

    const { queue } = validate;
    queue.leave();

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: "Music",
          description: "Left voice channel",
          interaction,
        }),
      ],
      ephemeral: true,
    });
  }

  @Slash({ description: "Loop queue" })
  async loop(interaction: CommandInteraction): Promise<void> {
    const validate = await this.validateInteraction(interaction);
    if (!validate) return;

    const { queue } = validate;
    queue.setLoop(!queue.loop);

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: "Music",
          description: `Loop queue is now ${queue.loop ? "on" : "off"}`,
          interaction,
        }),
      ],
      ephemeral: true,
    });
  }

  @Slash({ description: "Repeat current track" })
  async repeat(interaction: CommandInteraction): Promise<void> {
    const validate = await this.validateInteraction(interaction);
    if (!validate) return;

    const { queue } = validate;
    queue.setRepeat(!queue.repeat);

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: "Music",
          description: `Repeat track is now ${queue.repeat ? "on" : "off"}`,
          interaction,
        }),
      ],
      ephemeral: true,
    });
  }

  @Slash({ description: "Set music volume" })
  async volume(
    @SlashOption({
      description: "Amount of volume",
      name: "volume",
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    volume: number,
    interaction: CommandInteraction,
  ): Promise<void> {
    const validate = await this.validateInteraction(interaction);
    if (!validate) return;

    const { queue } = validate;
    if (volume < 0 || volume > 100) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Something went wrong!",
            description: "Volume must be between 0 and 100",
            interaction,
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    queue.setVolume(volume);
    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: "Music",
          description: `Volume set to ${volume}`,
          interaction,
        }),
      ],
      ephemeral: true,
    });
  }
}
