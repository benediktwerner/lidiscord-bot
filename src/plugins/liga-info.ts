import axios from 'axios';
import { format, formatDuration, intervalToDuration, isPast } from 'date-fns';
import { MessageEmbed } from 'discord.js';
import { throttle } from 'lodash';

import { Plugin } from './plugin';

const TEAM_ID = 'lichess-discord-bundesliga-team';

async function _getTournaments(): Promise<Tournament[]> {
  const response = await axios.get<string>(
    `https://lichess.org/api/team/${TEAM_ID}/arena?max=10`
  );

  const tournaments: Tournament[] = response.data
    .split('\n')
    .filter((x) => x)
    .map((line) => JSON.parse(line));

  return tournaments;
}
const getTournaments = throttle(_getTournaments, 1000 * 60 * 5, {
  leading: true,
  trailing: false,
});

async function getNextLigaTournament(): Promise<Tournament | null> {
  const unfinished = (await getTournaments()!).filter(
    (tournament) => tournament.teamBattle && !isPast(tournament.finishesAt)
  );
  return unfinished[unfinished.length - 1] || null;
}

async function getLastLigaTournament(): Promise<Tournament | null> {
  const finished = (await getTournaments()!).filter(
    (tournament) => tournament.teamBattle && isPast(tournament.finishesAt)
  );
  return finished[0] || null;
}

type Tournament = {
  id: string;
  createdBy: string;
  system: string;
  minutes: number;
  clock: { limit: number; increment: number };
  rated: boolean;
  fullName: string;
  nbPlayers: number;
  variant: { key: string; short: string; name: string };
  startsAt: number;
  finishesAt: number;
  status: number;
  perf: { icon: string; key: string; name: string; position: number };
  winner?: { id: string; name: string; title: string };
  secondsToStart?: number;
  secondsToFinish?: number;
  teamBattle?: { teams: string[]; nbLeaders: number };
};

export default function ({
  ligaWarriorRole,
}: {
  ligaWarriorRole: string;
}): Plugin {
  return {
    name: 'liga-info',
    async onMessage({ command, member, message }) {
      if (command === 'liga') {
        const next = await getNextLigaTournament();
        const last = await getLastLigaTournament();

        const embed = new MessageEmbed() // Set the main content of the embed
          .setTitle('Lichess Discord Bundesliga Team')
          .setColor(0x8ab7ff)
          .setDescription(
            `
On Thursdays and Sundays members of the server play together in the Lichess Bundesliga. You can join the team on [lichess.org](https://lichess.org/team/${TEAM_ID}).
If you want to be notified on Discord before tournaments, use !joinliga.
`
          )
          .addField('Next tournament', getTournamentField(next), true)
          .addField('Last tournament', getTournamentField(last), true);

        message.channel.send(embed);
      }

      if (command === 'nextliga') {
        const next = await getNextLigaTournament();
        if (next) {
          if (isPast(next.startsAt)) {
            message.channel.send(
              `The next Liga tournament is live now! - ${getTournamentLink(
                next
              )}`
            );
          } else {
            const whenString = formatDuration(
              intervalToDuration({
                start: new Date(),
                end: new Date(next.startsAt),
              }),
              { format: ['days', 'hours', 'minutes'] }
            );
            message.channel.send(
              `The next Liga tournament is in ${whenString} - ${getTournamentLink(
                next
              )}`
            );
          }
        } else {
          message.channel.send(`There is no Liga tournament scheduled`);
        }
      }

      if (command === 'lastliga') {
        const last = await getLastLigaTournament();
        if (last) {
          message.channel.send(
            `The last Liga tournament was ${getTournamentLink(last)}`
          );
        } else {
          message.channel.send(`There is was no previous Liga tournament`);
        }
      }

      if (command === 'joinliga') {
        await member.roles.add(ligaWarriorRole);
        message.reply('welcome to the team!');
      }

      if (command === 'leaveliga') {
        await member.roles.remove(ligaWarriorRole);
        message.reply(
          'you will no longer be notified of tournaments :pensive:'
        );
      }
    },
  };
}

function getTournamentField(tournament: Tournament | null): string {
  if (!tournament) {
    return 'None';
  }

  const timeControl = `${tournament.clock.limit / 60}+${
    tournament.clock.increment
  }`;
  const date = format(tournament.startsAt, 'do LLLL');
  const link = getTournamentLink(tournament);
  return `[${date}, ${timeControl}](${link})`;
}

function getTournamentLink(tournament: Tournament): string {
  return `https://lichess.org/tournament/${tournament.id}`;
}
