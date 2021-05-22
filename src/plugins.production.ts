import nameUpdater from './plugins/name-updater';
import chatEarner from './plugins/chat-earner';
import bankInfo from './plugins/bank-info';

const CHANNEL_DISCORD_GAMES_TRIVIA = '493061298486116352';
const SECONDS_IN_HOUR = 60 * 60;

export default [
  nameUpdater(),
  chatEarner([CHANNEL_DISCORD_GAMES_TRIVIA], SECONDS_IN_HOUR),
  bankInfo(),
];
