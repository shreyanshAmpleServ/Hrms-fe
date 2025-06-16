const PermissionAccess = (name) => {
  // const permissions =JSON?.parse(localStorage.getItem("permissions"))
  // const isAdmin = localStorage?.getItem("role")
  // const allPermissions = permissions?.filter((i)=>i?.module_name === name)?.[0]?.permissions
  // // const isView = allPermissions?.view
  // // const isCreate = allPermissions?.create
  // // const isUpdate = allPermissions?.update
  // // const isDelete = allPermissions?.delete
  //   return allPermissions

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === name
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  return {
    isView: isAdmin || allPermissions?.view,
    isCreate: isAdmin || allPermissions?.create,
    isUpdate: isAdmin || allPermissions?.update,
    isDelete: isAdmin || allPermissions?.delete,
  };
};

export default PermissionAccess;
