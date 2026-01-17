type UserRole = "ADMIN" | "KASIR" | "WAITER" | "KITCHEN";

/**
 * Returns the appropriate redirect path based on user role
 */
export function getRoleRedirectPath(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "KASIR":
      return "/cashier";
    case "WAITER":
      return "/waiter";
    case "KITCHEN":
      return "/kitchen";
    default:
      return "/";
  }
}
