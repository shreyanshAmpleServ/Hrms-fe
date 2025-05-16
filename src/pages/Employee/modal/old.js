// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import Select from "react-select";
// // import {
// //     setCampaignTogglePopup,
// //     setCampaignTogglePopupTwo,
// // } from "../data/redux/commonSlice";
// import { TimePicker } from "antd";
// import DefaultEditor from "react-simple-wysiwyg";
// // import type { Dayjs } from "dayjs";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import DatePicker from "react-datepicker";
// import { Controller, useForm } from "react-hook-form";
// import ImageWithBasePath from "../../../components/common/imageWithBasePath";
// import {
//   addActivities,
//   deleteActivities,
//   fetchActivityTypes,
//   updateActivities,
// } from "../../../redux/Activities";
// import { fetchCompanies } from "../../../redux/companies";
// import { fetchContacts } from "../../../redux/contacts/contactSlice";
// import { fetchDeals } from "../../../redux/deals";
// import { fetchUsers } from "../../../redux/manage-user";
// import { fetchProjects } from "../../../redux/projects";
// import { CampaignStatusOptions, CampaignTypeOptions, StatusOptions } from "../../../components/common/selectoption/selectoption";
// import { fetchLeads } from "../../../redux/leads";
// import { createCampaign, updateCampaign } from "../../../redux/campaign";



// const ActivitiesModal = ({ setCampaign, campaign }) => {
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedType, setSelectedType] = useState();
//   const dispatch = useDispatch();
//   dayjs.extend(customParseFormat);
//   const {
//     control,
//     handleSubmit,
//     register,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       name: "",
//       status: "",
//       type: "",
//       start_date: new Date(),
//       end_date: new Date(),
//       exp_revenue: "",
//       camp_cost: "",
//       owner_id: null,
//       description: "",
//       lead_ids: [],
//       contact_ids: [],
//       is_active: "Y"
//     },
//   });

//   React.useEffect(
//     () => {
//       if (campaign) {
//         reset({
//           name: campaign?.name || "",
//           status: campaign?.status || "",
//           type: campaign?.type || null,
//           start_date: campaign?.start_date || new Date(),
//           end_date: campaign?.end_date || new Date(),
//           exp_revenue: campaign?.exp_revenue || "",
//           camp_cost: campaign?.camp_cost || "",
//           owner_id: campaign?.owner_id || null,
//           description: campaign?.description || "",
//           lead_ids: campaign?.campaign_leads?.map((data) => ({ label: data.title, value: data.id })) || [],
//           contact_ids: campaign?.campaign_contact?.map((data) => ({ label: `${data?.firstName} ${data?.lastName}`, value: data.id })) || [],
//           is_active: campaign?.is_active || "Y"
//         });
//       } else {
//         reset({
//           name: "",
//           status: "",
//           type: null,
//           start_date: new Date(),
//           end_date: new Date(),
//           exp_revenue: "",
//           camp_cost: "",
//           owner_id: null,
//           description: "",
//           lead_ids: [],
//           contact_ids: [],
//           is_active: "Y"
//         });
//         setSelectedType(null);
//       }
//     },
//     [campaign],
//     reset
//   );
//   React.useEffect(() => {
//     dispatch(fetchContacts({ search: searchValue }));
//   }, [dispatch, searchValue]);
//   const { loading } = useSelector((state) => state?.activities);
//   React.useEffect(() => {
//     dispatch(fetchLeads());
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const { deals } = useSelector((state) => state.deals);
//   const { leads } = useSelector((state) => state.leads);
//   const { contacts } = useSelector((state) => state.contacts);
//   const { users } = useSelector((state) => state.users);

//   const onSubmit = async (data) => {
//     const finalData = {
//       ...data,
//       contact_ids: data.contact_ids?.map((contact) => contact.value),
//       lead_ids: data.lead_ids?.map((contact) => contact.value),
//       start_date: new Date(data.start_date),
//       end_date: new Date(data.end_date)
//     };
//     const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
//     try {
//       campaign
//         ? await dispatch(
//           updateCampaign({
//             id: campaign.id,
//             campaignData: finalData
//           })
//         ).unwrap()
//         : await dispatch(createCampaign(finalData)).unwrap();
//       closeButton.click();
//       reset();
//       setCampaign(null);
//     } catch (error) {
//       closeButton.click();
//     }
//   };

//   const deleteData = () => {
//     if (campaign) {
//       dispatch(deleteActivities(campaign));
//       // navigate(`/crm/activities`); // Navigate to the specified route
//       // setShowDeleteModal(false); // Close the modal
//       setCampaign(null);
//     }
//   };
//   useEffect(() => {
//     const offcanvasElement = document.getElementById("offcanvas_add");
//     if (offcanvasElement) {
//       const handleModalClose = () => {
//         setCampaign(null);
//       };
//       offcanvasElement.addEventListener(
//         "hidden.bs.offcanvas",
//         handleModalClose
//       );
//       return () => {
//         offcanvasElement.removeEventListener(
//           "hidden.bs.offcanvas",
//           handleModalClose
//         );
//       };
//     }
//   }, []);
//   return (
//     <div
//       className="offcanvas offcanvas-end offcanvas-large"
//       tabIndex={-1}
//       id="offcanvas_add_company"
//     >
//       <div className="offcanvas-header border-bottom">
//         <h5 className="fw-semibold">Add New Company</h5>
//         <button
//           type="button"
//           className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
//           data-bs-dismiss="offcanvas"
//           aria-label="Close"
//         >
//           <i className="ti ti-x" />
//         </button>
//       </div>
//       <div className="offcanvas-body">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <input
//             type="hidden"
//             {...register("entityType", { value: "company" })}
//           />
//           <div className="accordion" id="company_accordion">
//             {/* Basic Info */}
//             <div className="accordion-item rounded mb-3">
//               <div className="accordion-header">
//                 <Link
//                   to="#"
//                   className="accordion-button accordion-custom-button bg-white rounded fw-medium text-dark"
//                   data-bs-toggle="collapse"
//                   data-bs-target="#company_basic"
//                 >
//                   <span className="avatar avatar-md rounded text-dark border me-2">
//                     <i className="ti ti-building fs-20" />
//                   </span>
//                   Basic Info
//                 </Link>
//               </div>
//               <div
//                 className="accordion-collapse collapse show"
//                 id="company_basic"
//                 data-bs-parent="#company_accordion"
//               >
//                 <div className="accordion-body border-top">
//                   <div className="row">
//                     <div className="col-md-12">
//                       <div className="mb-3">
//                         <div className="profile-upload">
//                           <div className="profile-upload-img">
//                             <span>
//                               <i className="ti ti-photo" />
//                             </span>
//                             {selectedLogo && (
//                               <img
//                                 src={URL.createObjectURL(selectedLogo)}
//                                 alt="Company Logo"
//                                 className="preview"
//                               />
//                             )}
//                             <button
//                               type="button"
//                               className="profile-remove"
//                               onClick={() => setSelectedLogo(null)}
//                             >
//                               <i className="ti ti-x" />
//                             </button>
//                           </div>
//                           <div className="profile-upload-content">
//                             <label className="profile-upload-btn">
//                               <i className="ti ti-file-broken" /> Upload Logo
//                               <input
//                                 type="file"
//                                 className="input-img"
//                                 accept="image/*"
//                                 onChange={handleLogoChange}
//                               />
//                             </label>
//                             <p>JPG, GIF or PNG. Max size of 800K</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">
//                           Company Name <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           {...register("name", {
//                             required: "Company name is required",
//                           })}
//                         />
//                         {errors.name && (
//                           <small className="text-danger">
//                             {errors.name.message}
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">
//                           Registration Number
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           {...register("registrationNumber")}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">
//                           Email <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="email"
//                           className="form-control"
//                           {...register("email", {
//                             required: "Email is required",
//                           })}
//                         />
//                         {errors.email && (
//                           <small className="text-danger">
//                             {errors.email.message}
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">
//                           Phone <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           {...register("phone", {
//                             required: "Phone number is required",
//                           })}
//                         />
//                         {errors.phone && (
//                           <small className="text-danger">
//                             {errors.phone.message}
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">Website</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           {...register("website")}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">
//                           Industry Type <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           {...register("industryType", {
//                             required: "Industry type is required",
//                           })}
//                         />
//                         {errors.industryType && (
//                           <small className="text-danger">
//                             {errors.industryType.message}
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">Annual Revenue</label>
//                         <input
//                           type="number"
//                           step="0.01"
//                           className="form-control"
//                           {...register("annualRevenue")}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">Employee Count</label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           {...register("employeeCount")}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">
//                           Business Type <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           {...register("businessType", {
//                             required: "Business type is required",
//                           })}
//                         />
//                         {errors.businessType && (
//                           <small className="text-danger">
//                             {errors.businessType.message}
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                     {/* Contact Fields */}
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">
//                           Primary Contact Name{" "}
//                           <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           {...register("primaryContactName", {
//                             required: "Primary contact name is required",
//                           })}
//                         />
//                         {errors.primaryContactName && (
//                           <small className="text-danger">
//                             {errors.primaryContactName.message}
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">
//                           Primary Contact Role
//                           <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           {...register("primaryContactRole", {
//                             required: "Primary contact role is required",
//                           })}
//                         />
//                         {errors.primaryContactRole && (
//                           <small className="text-danger">
//                             {errors.primaryContactRole.message}
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">
//                           Primary Contact Email{" "}
//                           <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="email"
//                           className="form-control"
//                           {...register("primaryContactEmail", {
//                             required: "Primary contact email is required",
//                           })}
//                         />
//                         {errors.primaryContactEmail && (
//                           <small className="text-danger">
//                             {errors.primaryContactEmail.message}
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="col-form-label">
//                           Primary Contact Phone
//                           <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           {...register("primaryContactPhone", {
//                             required: "Primary contact phone is required",
//                           })}
//                         />
//                         {errors.primaryContactPhone && (
//                           <small className="text-danger">
//                             {errors.primaryContactPhone.message}
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                     <div className="col-md-12">
//                       <div className="mb-3">
//                         <label className="col-form-label">Address</label>
//                         <textarea
//                           className="form-control"
//                           rows="3"
//                           {...register("address")}
//                         ></textarea>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="d-flex align-items-center justify-content-end">
//             <button
//               type="button"
//               data-bs-dismiss="offcanvas"
//               className="btn btn-light me-2"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={loading}
//             >
//               {loading ? "Creating..." : "Create"}
//               {loading && (
//                 <div
//                   style={{
//                     height: "15px",
//                     width: "15px",
//                   }}
//                   className="spinner-border ml-2 text-light"
//                   role="status"
//                 >
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
// export default ActivitiesModal;
