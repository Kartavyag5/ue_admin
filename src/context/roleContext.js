import React from "react";

const RoleContext = React.createContext();
const RoleProvider = RoleContext.Provider;
const RoleConsumer = RoleContext.Consumer;

export { RoleProvider, RoleConsumer, RoleContext };
