import { jwtDecode } from "jwt-decode";

const assignRole = (userRoles) => {
  // userRoles is an array of role objects, so check if it includes "ADMIN"
  const roleNames = Array.isArray(userRoles)
    ? userRoles.map((role) => role.name) // Extract role names from the role array
    : [userRoles.name]; // Adjust for single string case if necessary

  if (roleNames.includes("ADMIN")) {
    return "ADMIN";
  } else if (roleNames.includes("STAFF")) {
    return "STAFF";
  } else if (roleNames.includes("SUPPLIER")) {
    return "SUPPLIER";
  } else {
    return "MEMBER";
  }
};

export const decode = (token) => {
  const decoded = jwtDecode(token);
  const roles =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const role = assignRole(roles);

  return {
    accountId: decoded.AccountId,
    expire: decoded.exp,
    role: role,
  };
};
