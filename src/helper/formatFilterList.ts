const formatLicenseList = (licenseList) => {
  return licenseList.map(function (option) {
    return { label: option.license_number, value: option.license_id };
  });
};

const formatPersonOptionList = (personsDataforFilter) => {
  return personsDataforFilter.map(function (option) {
    return {
      label: option.first_name + " " + option.last_name,
      value: option.user_id,
    };
  });
};

const formatCommunityOptionsList = (communityforFilter) => {
  return communityforFilter.map(function (option) {
    return { label: option.community_name, value: option.community_id };
  });
};

const formatOrganizationOptionsList = (organizationforFilter) => {
  return organizationforFilter.map(function (option) {
    return { label: option.organization_name, value: option.organization_id };
  });
};

const formatGameList = (gamesListFilterData) => {
  return gamesListFilterData.map(function (option) {
    return { label: option.game_name, value: option.game_id };
  });
};

const formatGameLevelList = (gameLevelFilterData) => {
  return gameLevelFilterData.map(function (option) {
    return { label: option.game_level_name, value: option.game_level };
  });
};
const formatRolelList = (roleFilterData) => {
  return roleFilterData.map(function (option) {
    return { label: option.role_name, value: option.role_id };
  });
};
const formatCatagorylList = (catagoryFilterData) => {
  return catagoryFilterData.map(function (option) {
    return { label: option.category_name, value: option.puzzle_category_id };
  });
};

export {
  formatOrganizationOptionsList,
  formatPersonOptionList,
  formatCommunityOptionsList,
  formatLicenseList,
  formatGameList,
  formatGameLevelList,
  formatRolelList,
  formatCatagorylList
};
