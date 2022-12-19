export const getOrgCommRoleData =(user_comm_role) => {
    let comm_name = "";
    let role = "";
    let organization = "";
    for (var j = 0; j < 4; j++) {
      if (user_comm_role[j]){
          if(user_comm_role[j].community_name !== null)
            comm_name = comm_name !== "" ? `${comm_name}, ${user_comm_role[j].community_name}` : `${user_comm_role[j].community_name}`;
          if(user_comm_role[j].role !== null)
            role = role !== "" ? `${role}, ${user_comm_role[j].role_name}` : `${user_comm_role[j].role_name}`;
          if(user_comm_role[j].organization_name !== null)
            organization = organization !== "" ? organization.includes(user_comm_role[j].organization_name) ? organization : `${organization}, ${user_comm_role[j].organization_name}` : `${user_comm_role[j].organization_name}`
      }
    }
    return {comm_name, role, organization};
  }
