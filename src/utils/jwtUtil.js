import { jwtDecode } from "jwt-decode";

const assignRole = (userRoles) => {
  const roleNames = Array.isArray(userRoles) ? userRoles : [userRoles];

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
  console.log(decoded); // In ra để kiểm tra token chứa những thông tin gì

  const roles =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const mainRole = assignRole(roles);

  return {
    accountId: decoded.AccountId,
    expire: decoded.exp,
    mainRole: mainRole, // Sử dụng mainRole thay vì role
  };
};
