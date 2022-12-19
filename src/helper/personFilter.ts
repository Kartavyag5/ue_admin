const getPersonFilterList = (
    personOptionList,
    onSelectPerson,
    handlePersonSearch,
    handlePersonScroll,
    handlePersonToggle,
    OrganizationOptionList,
    onSelectOrganization,
    handleOrganizationScroll,
    handleOrganizationSearch,
    handleOrganizationToggle,
    communityOptionList,
    onSelectCommunity,
    handleCommunitySearch,
    handleCommunityScroll,
    handleCommunityToggle,

  ) => {
    let filterList = [
      {
        label: "Names",
        type: "MultiSelectDropDown",
        optionsList: personOptionList,
        name: "name",
        title: "Search for Person",
        searchText: "Search for Person",
        handleChange: onSelectPerson,
        noOptionText: "No data found",
        handleSearch: handlePersonSearch,
        handleScroll: handlePersonScroll,
        handleToggle: handlePersonToggle,
      },
      {
        label: "Organizations",
        type: "MultiSelectDropDown",
        optionsList: OrganizationOptionList,
        name: "Organization",
        title: "Search for Organization",
        searchText: "Search for Organization",
        handleChange: onSelectOrganization,
        noOptionText: "No data found",
        handleSearch: handleOrganizationSearch,
        handleScroll: handleOrganizationScroll,
        handleToggle: handleOrganizationToggle,
      },
      {
        label: "Communities",
        type: "MultiSelectDropDown",
        optionsList: communityOptionList,
        name: "community",
        title: "Search for Community",
        searchText: "Search for Community",
        handleChange: onSelectCommunity,
        noOptionText: "No data found",
        handleSearch: handleCommunitySearch,
        handleScroll: handleCommunityScroll,
        handleToggle: handleCommunityToggle,
      },
    ];
    return filterList;
  };
  
  export { getPersonFilterList};