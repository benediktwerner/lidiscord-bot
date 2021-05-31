import axios from 'axios';
import { formatDuration, intervalToDuration, isPast } from 'date-fns';
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
  const finished = (await getTournaments()!)
    .reverse()
    .filter(
      (tournament) => tournament.teamBattle && !isPast(tournament.finishesAt)
    );
  return finished[0] || null;
}

async function getLastLigaTournament(): Promise<Tournament | null> {
  const unfinished = (await getTournaments()!).filter(
    (tournament) => tournament.teamBattle && isPast(tournament.finishesAt)
  );
  return unfinished[0] || null;
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
        message.channel.send(
          `The Lichess Discord Bundesliga Team can be found at https://lichess.org/team/${TEAM_ID}\n` +
            `Use !joinliga to be notified when tournaments are starting.`
        );
      }

      if (command === 'nextliga') {
        const next = await getNextLigaTournament();
        if (next) {
          if (isPast(next.startsAt)) {
            message.channel.send(
              `The next Liga tournament is live now! - https://lichess.org/tournament/${next.id}`
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
              `The next Liga tournament is in ${whenString} - https://lichess.org/tournament/${next.id}`
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
            `The last Liga tournament was https://lichess.org/tournament/${last.id}`
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
