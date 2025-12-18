// src/utils/auth.js

import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isRoleAllowed = (allowedRoleIds, userRoleId) => {
  if (!allowedRoleIds) return true; // null = todos
  return allowedRoleIds.includes(userRoleId);
};

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    const now = Date.now() / 1000;

    if (exp < now) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch (e) {
    localStorage.removeItem("token");
    return false;
  }
};

export const canAccess = (itemSection, user) => {
  if (user.businessId === 1) return true;

  if (!itemSection.allowedRoleIds) return true;

  return itemSection.allowedRoleIds.includes(user.roleId) && !itemSection.onlySystem;
};

export const canAccessSection = (section, user) => {
  const countAccessibleItems = section.items.reduce((count, item) => {
    if (canAccess(item, user)) {
      return count + 1;
    }
    return count;
  }, 0);

  return countAccessibleItems > 0;
}