function hasAuthority(user, roles: string[]) {
  if (!user || !user.roles || !user.roles.length) {
    return false;
  }
  return !!user.roles.find(r => {
    return !!roles.find(mr => r.name.toLowerCase() === mr.toLowerCase());
  });
}

export const Role = {
  hasAuthority
};
