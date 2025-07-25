/**
 * Custom hook to check user permissions for a specific module.
 *
 * @param {string} name - The name of the module to check permissions for.
 * @returns {{
 *   isView: boolean,
 *   isCreate: boolean,
 *   isUpdate: boolean,
 *   isDelete: boolean
 * }} Object containing boolean flags for view, create, update, and delete permissions.
 *
 * @example
 * const { isView, isCreate } = usePermissions("Candidate");
 * if (isCreate) {
 *   // show create button
 * }
 */
const usePermissions = (name) => {
  const permissions = JSON?.parse(localStorage.getItem("permissions")) || [];
  const isAdmin = localStorage.getItem("role")?.includes("admin") || false;

  const modulePermissions =
    permissions.find((i) => i?.module_name === name)?.permissions || {};

  return {
    isView: isAdmin || modulePermissions.view || false,
    isCreate: isAdmin || modulePermissions.create || false,
    isUpdate: isAdmin || modulePermissions.update || false,
    isDelete: isAdmin || modulePermissions.delete || false,
  };
};

export default usePermissions;
