import nameUpdater from './plugins/name-updater';
import chatEarner from './plugins/chat-earner';
import pointsInfo from './plugins/points-info';
import roleEarner from './plugins/role-earner';
import ligaInfo from './plugins/liga-info';
import customResponses from './plugins/custom-responses';
import ghostPingDetection from './plugins/ghost-ping-detection';

const CHANNEL_DISCORD_GAMES_TRIVIA = '493061298486116352';
const CHANNEL_NEW_PEEPS = '508080534648258563';
const SECONDS_IN_HOUR = 60 * 60;

// Use `.roleid Name` to find role IDs
const ROLE_IMAGES = '477557270943760386';
const ROLE_NEW_ROLE = '695720622407417886';
const ROLE_LIGA_WARRIOR = '766333186237399043';
const ROLE_CHAT_MOD = '473908351307087884';
const ROLE_ADMIN = '280718008727633921';

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
  ligaInfo({ ligaWarriorRole: ROLE_LIGA_WARRIOR }),
  customResponses({
    adminRoles: [ROLE_CHAT_MOD, ROLE_ADMIN],
  }),
  ghostPingDetection({
    logChannel: CHANNEL_NEW_PEEPS,
  }),
];
