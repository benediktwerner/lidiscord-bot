import { GuildMember } from 'discord.js';

export function memberHasAnyRole(member: GuildMember, roles: string[]): boolean {
    return roles.some((roleId) => memberHasRole(member, roleId));
}

export function memberHasRole(member: GuildMember, roleId: string): boolean {
    return !!member.roles.resolve(roleId);
}
