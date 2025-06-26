import React, { useEffect, useMemo, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setExpandMenu } from "../../../redux/common/commonSlice";
import { SidebarData } from "../data/json/sidebarData";

const Sidebar = () => {
  const Location = useLocation();
  const dispatch = useDispatch();
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const Permissions = localStorage.getItem("permissions")
    ? JSON?.parse(localStorage.getItem("permissions"))
    : [];

  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [openMain, setOpenMain] = useState("HRMS");

  const toggleSidebar = (title) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  const toggle = () => {
    dispatch(setExpandMenu(true));
  };

  const toggle2 = () => {
    dispatch(setExpandMenu(false));
  };

  const toggleMainSection = (label) => {
    setOpenMain((prev) => (prev === label ? "" : label));
  };

  // Enhanced search function that searches through all levels
  const searchInAllLevels = (item, searchTerm) => {
    const term = searchTerm.toLowerCase();

    // Check main item label
    if (item.label?.toLowerCase().includes(term)) {
      return true;
    }

    // Check submenu items (level 2)
    if (
      item.submenuItems?.some((subItem) => {
        // Check submenu item label
        if (subItem.label?.toLowerCase().includes(term)) {
          return true;
        }

        // Check nested submenu items (level 3)
        if (
          subItem.submenuItems?.some((nestedItem) =>
            nestedItem.label?.toLowerCase().includes(term)
          )
        ) {
          return true;
        }

        return false;
      })
    ) {
      return true;
    }

    // Check direct links
    if (item.links?.some((link) => link?.toLowerCase().includes(term))) {
      return true;
    }

    return false;
  };

  // Filter function for submenu items
  const filterSubmenuItems = (submenuItems, searchTerm) => {
    if (!searchTerm) return submenuItems;

    return submenuItems?.filter((item) => {
      const term = searchTerm.toLowerCase();

      // Check if current item matches
      if (item.label?.toLowerCase().includes(term)) {
        return true;
      }

      // Check if any nested item matches
      if (
        item.submenuItems?.some((nestedItem) =>
          nestedItem.label?.toLowerCase().includes(term)
        )
      ) {
        return true;
      }

      return false;
    });
  };

  // Filter function for nested submenu items
  const filterNestedSubmenuItems = (nestedItems, searchTerm) => {
    if (!searchTerm) return nestedItems;

    return nestedItems?.filter((item) =>
      item.label?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Memoized filtered data to improve performance
  const filteredSidebarData = useMemo(() => {
    if (!search) return SidebarData;

    return SidebarData.filter((mainLabel) =>
      searchInAllLevels(mainLabel, search)
    );
  }, [search, SidebarData]);

  useEffect(() => {
    setSubopen(localStorage.getItem("menuOpened"));
    // Select all 'submenu' elements
    const submenus = document.querySelectorAll(".submenu");
    // Loop through each 'submenu'
    submenus.forEach((submenu) => {
      // Find all 'li' elements within the 'submenu'
      const listItems = submenu.querySelectorAll("li");
      submenu.classList.remove("active");
      // Check if any 'li' has the 'active' class
      listItems.forEach((item) => {
        if (item.classList.contains("active")) {
          // Add 'active' class to the 'submenu'
          submenu.classList.add("active");
          return;
        }
      });
    });
  }, [Location.pathname]);

  // Auto-expand sections when searching
  useEffect(() => {
    if (search) {
      // Auto-expand main sections that have matching results
      const matchingMainLabels = filteredSidebarData.map((item) => item.label);
      if (matchingMainLabels.length > 0) {
        setOpenMain(matchingMainLabels[0]); // Open first matching section
      }
    }
  }, [search, filteredSidebarData]);

  const isMatch = (subLink, currentPath) => {
    if (!subLink || !currentPath) return false;

    const subLinkParts = subLink.split("/");
    const pathParts = currentPath.split("/");

    if (subLinkParts.length !== pathParts.length) return false;

    return subLinkParts.every(
      (part, index) => part.startsWith(":") || part === pathParts[index]
    );
  };

  return (
    <>
      <div
        className="sidebar"
        id="sidebar"
        onMouseEnter={toggle}
        onMouseLeave={toggle2}
      >
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                <li className="clinicdropdown theme">
                  <Link to="/profile">
                    <img
                      src={
                        user?.profile_img || "assets/img/profiles/avatar-14.jpg"
                      }
                      className="img-fluid"
                      alt="Profile"
                    />
                    <div className="user-names text-capitalize">
                      <h5>{`${user?.full_name}`}</h5>
                      <h6>{`${user?.hrms_d_user_role[0]?.hrms_m_role?.["role_name"]}`}</h6>
                    </div>
                  </Link>
                </li>
              </ul>

              {/* Enhanced Search Input */}
              <li className="d-flex mb-3 w-100 justify-content-end">
                <div className="position-relative icon-form w-100">
                  <span className="form-icon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search menus..."
                    className="form-control"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                </div>
              </li>

              <ul>
                {filteredSidebarData?.map((mainLabel, index) => (
                  <li className="clinicdropdown" key={index}>
                    <div
                      className="d-flex justify-content-between fw-bolder border-bottom"
                      onClick={() => toggleMainSection(mainLabel.label)}
                    >
                      <h6 className="submenu-hdr fw-bold">
                        {mainLabel?.label}
                        {search && (
                          <span className="badge bg-primary ms-2 small">
                            {filterSubmenuItems(mainLabel.submenuItems, search)
                              ?.length || 0}
                          </span>
                        )}
                      </h6>
                      {openMain === mainLabel.label ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowUp />
                      )}
                    </div>

                    <ul
                      style={{
                        display:
                          openMain === mainLabel.label || search
                            ? "block"
                            : "none",
                      }}
                    >
                      {filterSubmenuItems(mainLabel.submenuItems, search)?.map(
                        (title) => {
                          let link_array = [];
                          if ("submenuItems" in title) {
                            title.submenuItems?.forEach((link) => {
                              link_array.push(link?.link);
                              if (link?.submenu && "submenuItems" in link) {
                                link.submenuItems?.forEach((item) => {
                                  link_array.push(item?.link);
                                });
                              }
                            });
                          }
                          title.links = link_array;

                          // **Filter items based on permissions**
                          const hasPermission = isAdmin
                            ? true
                            : Permissions.some(
                                (permission) =>
                                  permission.module_name
                                    ?.trim()
                                    ?.toLowerCase() ===
                                    title.label?.trim()?.toLowerCase() &&
                                  Object.values(permission.permissions).some(
                                    (perm) => perm === true
                                  )
                              );

                          if (!hasPermission) return null;

                          return (
                            <li className="submenu" key={title?.label}>
                              <Link
                                to={title?.submenu ? "#" : title?.link}
                                onClick={() => toggleSidebar(title?.label)}
                                className={`${
                                  subOpen === title?.label ? "subdrop" : ""
                                } ${
                                  title?.links?.includes(Location.pathname)
                                    ? "active"
                                    : ""
                                } ${
                                  title?.submenuItems
                                    ?.map((link) => link?.link)
                                    .includes(Location.pathname) ||
                                  title?.link === Location.pathname
                                    ? "active"
                                    : "" ||
                                        isMatch(
                                          title?.subLink1,
                                          Location.pathname
                                        )
                                      ? "active"
                                      : "" ||
                                          isMatch(
                                            title?.subLink2,
                                            Location.pathname
                                          )
                                        ? "active"
                                        : "" ||
                                            title?.subLink3 ===
                                              Location.pathname
                                          ? "active"
                                          : "" ||
                                              title?.subLink4 ===
                                                Location.pathname
                                            ? "active"
                                            : ""
                                }`}
                              >
                                <i className={title.icon}></i>
                                <span>{title?.label}</span>
                                <span
                                  className={title?.submenu ? "menu-arrow" : ""}
                                />
                              </Link>

                              <ul
                                style={{
                                  display:
                                    subOpen === title?.label || search
                                      ? "block"
                                      : "none",
                                }}
                              >
                                {filterNestedSubmenuItems(
                                  title?.submenuItems,
                                  search
                                )?.map((item) => (
                                  <li
                                    className="submenu submenu-two"
                                    key={item.label}
                                  >
                                    <Link
                                      to={item?.link}
                                      className={`${
                                        item?.submenuItems
                                          ?.map((link) => link?.link)
                                          .includes(Location.pathname) ||
                                        item?.link === Location.pathname
                                          ? "active subdrop"
                                          : ""
                                      } `}
                                      onClick={() => {
                                        toggleSubsidebar(item?.label);
                                      }}
                                    >
                                      {item?.label}

                                      <span
                                        className={
                                          item?.submenu ? "menu-arrow" : ""
                                        }
                                      />
                                    </Link>

                                    <ul
                                      style={{
                                        display:
                                          subsidebar === item?.label || search
                                            ? "block"
                                            : "none",
                                      }}
                                    >
                                      {filterNestedSubmenuItems(
                                        item?.submenuItems,
                                        search
                                      )?.map((items) => (
                                        <li key={items.label}>
                                          <Link
                                            to={items?.link}
                                            className={`${
                                              subsidebar === items?.label
                                                ? "submenu-two subdrop"
                                                : "submenu-two"
                                            } ${
                                              items?.submenuItems
                                                ?.map((link) => link.link)
                                                .includes(Location.pathname) ||
                                              items?.link === Location.pathname
                                                ? "active"
                                                : ""
                                            }`}
                                          >
                                            {items?.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </li>
                ))}
              </ul>

              {/* No Results Message */}
              {search && filteredSidebarData.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted">
                    No menu items found for &quot;{search}&quot;
                  </p>
                  <small className="text-muted">Try different keywords</small>
                </div>
              )}
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default Sidebar;
