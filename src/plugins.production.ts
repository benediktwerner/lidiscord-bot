import nameUpdater from './plugins/name-updater';
import chatEarner from './plugins/chat-earner';
import pointsInfo from './plugins/points-info';
import roleEarner from './plugins/role-earner';

const CHANNEL_DISCORD_GAMES_TRIVIA = '493061298486116352';
const SECONDS_IN_HOUR = 60 * 60;

// Use `.roleid Name` to find role IDs
const ROLE_IMAGES = '477557270943760386';
const ROLE_NEW_ROLE = '695720622407417886';

export default [
  nameUpdater(),
  chatEarner({
    period: SECONDS_IN_HOUR,
    excludeChannels: [CHANNEL_DISCORD_GAMES_TRIVIA],
    excludeRoles: [ROLE_NEW_ROLE],
  }),
  roleEarner({
    rewards: [{ roleId: ROLE_IMAGES, requirement: 150 }],
  }),
  pointsInfo({
    includeChannels: [CHANNEL_DISCORD_GAMES_TRIVIA],
  }),
];
