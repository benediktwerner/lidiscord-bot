import nameUpdater from './plugins/name-updater';
import chatEarner from './plugins/chat-earner';
import bankInfo from './plugins/bank-info';
import roleEarner from './plugins/role-earner';

const CHANNEL_DISCORD_GAMES_TRIVIA = '493061298486116352';
const SECONDS_IN_HOUR = 60 * 60;

// Use `.roleid Name` to find role IDs
const ROLE_IMAGES = '477557270943760386';

export default [
  nameUpdater(),
  chatEarner([CHANNEL_DISCORD_GAMES_TRIVIA], SECONDS_IN_HOUR),
  roleEarner([{ roleId: ROLE_IMAGES, requirement: 200 }]),
  bankInfo(),
];
