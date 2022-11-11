import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { CommandInteraction, EmbedBuilder, Guild, GuildMember, TextBasedChannel } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Player, Queue } from "@discordx/music";

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
          embeds: [new EmbedBuilder().setTitle(`🎧 Playing ${track.title}`).setURL(track.url || "")],
        });
      }
    });

    this.musicPlayer.on("onFinishPlayback", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("🎧 Finished playback")],
        });
      }
    });

    this.musicPlayer.on("onPause", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("⏸ Paused playback")],
        });
      }
    });

    this.musicPlayer.on("onResume", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("▶ Resumed playback")],
        });
      }
    });

    this.musicPlayer.on("onError", ([, err, track]) => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("❌ Error").setDescription(`Error: ${err} | Track: ${track.title}`)],
        });
      }
    });

    this.musicPlayer.on("onFinish", ([, track]) => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("🎧 Finished").setDescription(`Finished ${track.title}`)],
        });
      }
    });

    this.musicPlayer.on("onLoop", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("🔁 Looping")],
        });
      }
    });

    this.musicPlayer.on("onRepeat", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("🔁 Repeating")],
        });
      }
    });

    this.musicPlayer.on("onSkip", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("⏭ Skipped")],
        });
      }
    });

    this.musicPlayer.on("onTrackAdd", ([, track]) => {
      if (this.channel) {
        this.channel.send({
          embeds: [
            new EmbedBuilder().setTitle("🎧 Track added").setDescription(`Added ${track[track.length - 1].title}`),
          ],
        });
      }
    });

    this.musicPlayer.on("onLoopEnabled", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("🔁 Loop enabled")],
        });
      }
    });

    this.musicPlayer.on("onLoopDisabled", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("🔁 Loop disabled")],
        });
      }
    });

    this.musicPlayer.on("onRepeatEnabled", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("🔁 Repeat enabled")],
        });
      }
    });

    this.musicPlayer.on("onRepeatDisabled", () => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("🔁 Repeat disabled")],
        });
      }
    });

    this.musicPlayer.on("onMix", ([, tracks]) => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("🔁 Mix").setDescription(`Added ${tracks.length} tracks`)],
        });
      }
    });

    this.musicPlayer.on("onVolumeUpdate", ([, volume]) => {
      if (this.channel) {
        this.channel.send({
          embeds: [new EmbedBuilder().setTitle("🔊 Volume").setDescription(`Volume: ${volume}`)],
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
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("You must be in a voice channel to use this command")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
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
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("No songs found")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    } else {
      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setTitle("🎧 Playing")
            .setDescription(`Playing ${status.title}`)
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
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
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("You must be in a voice channel to use this command")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
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
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("No songs found")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    } else {
      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setTitle("🎧 Playing")
            .setDescription("The requested playlist has been added to the queue")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
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
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("This command can only be used in a server")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
      return;
    }

    const queue = this.queue(interaction.guild);

    if (!queue.isReady) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("I am not in a voice channel")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
      return;
    }

    if (interaction.member.voice.channel!.id !== queue.voiceChannelId) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("You are not in the same voice channel as me")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
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
        new EmbedBuilder()
          .setTitle("⏭ Skipped current track")
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
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
        new EmbedBuilder()
          .setTitle("🔀 Mixed tracks")
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
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
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("The queue is already paused")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
      return;
    }

    queue.pause();
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("⏸ Paused current track")
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
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
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("The queue is already playing")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
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
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("There is no track playing")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
      return;
    }

    const state = queue.seek(time * 1e3);
    if (!state) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Error")
            .setDescription("Invalid seek time")
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
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
        new EmbedBuilder()
          .setTitle("👋 Left voice channel")
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  }
}
