export const getTopUserRole = (roles) => {
  if (roles["SUPER_ADMIN"]) return "SUPER_ADMIN";
  else if (roles["UE_CORP_ADMIN"]) return "UE_CORP_ADMIN";
  else if (roles["ORGANIZATION_ADMIN"]) return "ORGANIZATION_ADMIN";
  else if (roles["COMMUNITY_ADMIN"]) return "COMMUNITY_ADMIN";
  else if (roles["GAME_HOST"]) return "GAME_HOST";
  else if (roles["FAMILY_OR_FRIEND"]) return "FAMILY_OR_FRIEND";
  else if (roles["RESIDENT"]) return "RESIDENT";
};
