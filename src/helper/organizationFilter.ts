const getOrganizationCommunityFilter = (
  FormattedOptionList,
  handleChange,
  handleScroll,
  handleSearch,
  handleOrganizationToggle,
  formattedCommunityList,
  handleCommunityChange,
  handleCommunitySearch,
  handleCommuniytScroll,
  handleCommunityToggle
) => {
  let filterList = [
    {
      label: "Organizations",
      type: "MultiSelectDropDown",
      optionsList: FormattedOptionList,
      name: "Organizations",
      title: "Search for Organization",
      searchText: "Search for Organization",
      handleChange: handleChange,
      noOptionText: "No data found",
      handleSearch: handleSearch,
      handleScroll: handleScroll,
      handleToggle: handleOrganizationToggle,

    },
    {
      label: "Communities",
      type: "MultiSelectDropDown",
      optionsList: formattedCommunityList,
      name: "Communities",
      title: "Search for Community",
      searchText: "Search for Community",
      handleChange: handleCommunityChange,
      noOptionText: "No data found",
      handleSearch: handleCommunitySearch,
      handleScroll: handleCommuniytScroll,
      handleToggle: handleCommunityToggle

    },
  ];
  return filterList;
};

export { getOrganizationCommunityFilter };
