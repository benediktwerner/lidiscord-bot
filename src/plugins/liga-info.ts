import axios from 'axios';
import { formatDuration, intervalToDuration } from 'date-fns';
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

export default function (): Plugin {
  return {
    name: 'liga-info',
    async onMessage({ command, message }) {
      if (command === 'liga') {
        message.reply(
          `the Lichess Discord Bundesliga Team can be found at https://lichess.org/team/${TEAM_ID}`
        );
      }

      if (command === 'nextliga') {
        const tournaments = await getTournaments();
        const upcoming = tournaments!
          .filter(
            (tournament) => tournament.secondsToStart && tournament.teamBattle
          )
          .reverse();

        if (upcoming.length) {
          const next = upcoming[0];
          const whenString = formatDuration(
            intervalToDuration({
              start: new Date(),
              end: new Date(next.startsAt),
            }),
            { format: ['days', 'hours', 'minutes'] }
          );
          message.reply(
            `the next Liga tournament is in ${whenString} - https://lichess.org/tournament/${next.id}`
          );
        } else {
          message.reply(`there is no Liga tourament scheduled`);
        }
      }

      if (command === 'lastliga') {
        const tournaments = await getTournaments();
        const historic = tournaments!.filter(
          (tournament) => tournament.winner && tournament.teamBattle
        );

        if (historic.length) {
          const last = historic[0];
          message.reply(
            `the last Liga tournament was https://lichess.org/tournament/${last.id}`
          );
        } else {
          message.reply(`there is was no previous Liga tournament`);
        }
      }
    },
  };
}
