import { addPoints, updateAwardedRoles } from '../db/users.js';
import log from '../log.js';
import { memberHasAnyRole } from '../utils/members.js';
import { Plugin } from './plugin.js';

type Reward = {
    requirement: number;
    roleId: string;
};

export default function ({
    period,
    amount,
    excludeChannels,
    excludeRoles,
    rewards,
}: {
    period: number;
    amount: number;
    excludeChannels: string[];
    excludeRoles: string[];
    rewards: Reward[];
}): Plugin {
    return {
        name: 'points',

        async onMessage({ message, member, channel, command, user, guild }) {
            if (memberHasAnyRole(member, excludeRoles) || excludeChannels.includes(channel.id) || command) {
                return;
            }

            const secondsSinceLastPoints = (+new Date() - user.lastPointsTimestamp) / 1000 / 60;
            const chance = secondsSinceLastPoints / period;
            if (chance < Math.random()) {
                return;
            }

            const newPoints = addPoints(user.id, amount);
            log(
                `${message.author.username} earned ${amount} points in ${message.channel.name} for a new total of ${newPoints}`
            );

            const awardedRoleIds = user.awardedRoleIds ? user.awardedRoleIds.split(',') : [];
            const rolesToAdd = rewards.filter(
                ({ roleId, requirement }) => newPoints >= requirement && !awardedRoleIds.includes(roleId)
            );

            if (rolesToAdd.length === 0) {
                return;
            }

            for (const reward of rolesToAdd) {
                const role = guild.roles.resolve(reward.roleId);
                log(`${user.name} has been rewarded role ${role?.name || reward.roleId}`);
                await member.roles.add(reward.roleId);
                awardedRoleIds.push(reward.roleId);
            }

            updateAwardedRoles(user.id, awardedRoleIds.join(','));
        },
    };
}
