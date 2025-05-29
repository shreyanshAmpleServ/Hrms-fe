import { Navigate, Route } from "react-router";
import Dashboard from "../pages/main-menu/deals-dashboard";
import { all_routes } from "./all_routes";

import ContactDetail from "../pages/contacts/";
import ContactList from "../pages/contacts/contactList";

import LeadsList from "../pages/leads";
import LeadsDetail from "../pages/leads/LeadsDetail";
import LeadsKanban from "../pages/leads/LeadsKanban";

import Companies from "../pages/companies/";
import CompanyDetail from "../pages/companies/CompanyDetail";

import BranchList from "../pages/crm-settings/core-hr/branch";
import Company from "../pages/crm-settings/core-hr/company";
import DepanrtmentList from "../pages/crm-settings/core-hr/department";
import DesignationList from "../pages/crm-settings/core-hr/designation";
import Employee_CategoryList from "../pages/crm-settings/core-hr/employeeCategory";
import Employee_TypeList from "../pages/crm-settings/core-hr/employmentType";

import JobPosting from "../pages/jobPosting";

import OfferLetters from "../pages/OfferLetters";
import Pipelines from "../pages/pipelines/";
import PipelineDetail from "../pages/pipelines/PipelineDetail";

import Login from "../pages/auth/Login";
import DealList from "../pages/deals";
import DealDetail from "../pages/deals/DealDetail";
import DealsKanban from "../pages/deals/DealsKanban";

//CRM Settings
import Calls from "../pages/call";
import BanksList from "../pages/crm-settings/bank";
import CallResult from "../pages/crm-settings/callResult";
import CallStatus from "../pages/crm-settings/calls";
import CallPurpose from "../pages/crm-settings/callsPurpose";
import CallType from "../pages/crm-settings/callType";
import ContactStage from "../pages/crm-settings/contact-stages";
import Industries from "../pages/crm-settings/industries";
import LostReason from "../pages/crm-settings/lost-reasons";
import SourceList from "../pages/crm-settings/sources";

import ProjectDetail from "../pages/projects/ProjectsDetail";

import Projects from "../pages/projects";

import CountriesList from "../pages/crm-settings/country";
import CurrencyList from "../pages/crm-settings/payroll-statutory/currency";
import StateList from "../pages/crm-settings/state";
import EmployeeList from "../pages/Employee";

// USER MANAGEMENT
import Manageusers from "../pages/user-management/manage-users";
import UserDetail from "../pages/user-management/manage-users/UserDetail";

import RolesPermissions from "../pages/user-management/roles";

// SETTINGS //
import ConnectedApps from "../pages/settings/general-settings/ConnectedApp";
import Notifications from "../pages/settings/general-settings/Notifications";
import Profile from "../pages/settings/general-settings/Profile";
import Security from "../pages/settings/general-settings/Security";

import Appearance from "../pages/settings/website-settings/Appearance";
import CompanySettings from "../pages/settings/website-settings/CompanySettings";
import Language from "../pages/settings/website-settings/LanguageWeb";
import Localization from "../pages/settings/website-settings/Localization";
import Preference from "../pages/settings/website-settings/Preference";
import Prefixes from "../pages/settings/website-settings/Prefixes";

import CustomFields from "../pages/settings/app-settings/CustomFields";
import InvoiceSettings from "../pages/settings/app-settings/InvoiceSettings";
import Printers from "../pages/settings/app-settings/Printers";

import EmailSettings from "../pages/settings/system-settings/EmailSettings";
import GdprCookies from "../pages/settings/system-settings/GdprCookies";
import SmsGateways from "../pages/settings/system-settings/SmsGateways";

import BankAccounts from "../pages/settings/financial-settings/BankAccounts";
// import Currencies from "../pages/settings/financial-settings/Currencies";
import PaymentGateways from "../pages/settings/financial-settings/PaymentGateways";
import BanIpAddress from "../pages/settings/other-settings/BanIpAddress";
import Storage from "../pages/settings/other-settings/Storage";

import Paycomponent from "../pages/crm-settings/payroll-statutory/paycomponent";
import SalaryStructure from "../pages/crm-settings/payroll-statutory/salarystructure";
import TaxRelirf from "../pages/crm-settings/payroll-statutory/taxRegime";
import ProvidentFund from "../pages/crm-settings/payroll-statutory/providentFund";
import TaxRegime from "../pages/crm-settings/payroll-statutory/texRegim";
import KpiMaster from "../pages/crm-settings/performance/kpi-Master";
import GoalCategoryMaster from "../pages/crm-settings/performance/goalCategoryMaster";
import ReviewTemplateMaster from "../pages/crm-settings/performance/ReviewTemplateMaster";
import RatingScaleMaster from "../pages/crm-settings/performance/ratingScaleMaster";
import JobCategoryMaster from "../pages/crm-settings/recruitment&Talent/jobCategoryMaster";
import GrievanceTypeMaster from "../pages/crm-settings/recruitment&Talent/grievanceTypeMaster";
import DisciplinaryPenaltyMaster from "../pages/crm-settings/recruitment&Talent/disciplinaryPenaltyMaster";
import WorkLifeEventTypeMaster from "../pages/crm-settings/recruitment&Talent/workLifeEventTypeMaster";
import AwardTypeMaster from "../pages/crm-settings/recruitment&Talent/awardTypeMaster";
import LetterTypeMaster from "../pages/crm-settings/recruitment&Talent/letterTypeMaster";
import DocumentTypeMaster from "../pages/crm-settings/recruitment&Talent/documentTypeMaster";
import SurveyMaster from "../pages/crm-settings/recruitment&Talent/surveyMaster";
import AssetTypeMaster from "../pages/crm-settings/recruitment&Talent/assetTypeMaster";
// import CurrenciesList from "../pages/crm-settings/payroll-statutory/currency";
import TaxRates from "../pages/settings/financial-settings/TaxRates";
import StatutoryRates from "../pages/crm-settings/payroll-statutory/statutoryRates";
import Activities from "../pages/Activities";
import MeetingTypes from "../pages/crm-settings/meetingType";
import Modules from "../pages/crm-settings/Modules";
import DealsDashboard from "../pages/main-menu/deals-dashboard";
import LeadsDashboard from "../pages/main-menu/leads-dashboard";
import ProjectDashboard from "../pages/main-menu/project-dashboard";
import Vendor from "../pages/Vendor";
import VendorDetail from "../pages/Vendor/VendorDetail";

import LoneType from "../pages/crm-settings/payroll-statutory/loneTpye";
import LoanRequests from "../pages/loanRequests";
import LeaveApplications from "../pages/leaveApplications";
import AddEmployee from "../pages/Employee/AddEmployee";
import ResumeUpload from "../pages/resumeUpload";
import ActivitiesKanban from "../pages/Activities/ActivitiessKanban";
import PayslipViewer from "../pages/payslipViewer";
// import ManufacturerList from "../pages/crm-settings/Manufacturer";
import Register from "../pages/auth/Register";
import CampaignsList from "../pages/Campaign";
import Cases from "../pages/Case";
import LeaveTypeList from "../pages/crm-settings/leaveAndAttendance/LeaveType";
import ShiftList from "../pages/crm-settings/leaveAndAttendance/Shifts";
import ProductCategory from "../pages/crm-settings/ProductCategory";
import TaxSetUpList from "../pages/crm-settings/TaxSetUp";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import Documents from "../pages/Documents";
import Orders from "../pages/Order";
import PriceBook from "../pages/priceBooks";
import Product from "../pages/Product";
import PurchaseInvoice from "../pages/purchaseInvoice";
import PurchaseOrders from "../pages/purchaseOrder";
import Quotation from "../pages/Quotation";
import SalesInvoice from "../pages/salesInvoice";
import Solutions from "../pages/Solutions";
import HolidayCalenderList from "../pages/crm-settings/leaveAndAttendance/HolidayCalender";
import WorkTemplateList from "../pages/crm-settings/leaveAndAttendance/WorkSchedule";
import AppointmentLetters from "../pages/AppointmentLetters";
import EmploymentContracts from "../pages/EmploymentContracts";
import EmployeeDetail from "../pages/Employee/EmployeeDetail";
import LeaveEncashment from "../pages/LeaveEncashment";
import TimeSheet from "../pages/TimeSheet";
import AppraisalEntries from "../pages/AppraisalEntries";
import WPSFileGenerator from "../pages/WPSFileGenerator";
import DisciplinaryActionLog from "../pages/disciplinaryActionLog";
import GrievanceSubmission from "../pages/grievanceSubmission";
import MonthlyPayrollProcessing from "../pages/monthlyPayrollProcessing";
import TrainingSessionSchedule from "../pages/trainingSessionSchedule";
import TrainingFeedbackEntry from "../pages/trainingFeedbackEntry";
import ProbationReview from "../pages/probationReview";
import SuccessionPlanningEntry from "../pages/successionPlanningEntry";
// // Export components individually

export { Dashboard, Login };
const route = all_routes;

export const privateRoutes = [
  {
    path: route.dasshboard,
    element: <AdminDashboard />,
    route: Route,
    title: "Admin Dashboard",
  },
  {
    path: route.leads,
    element: <LeadsList />,
    route: Route,
    title: "Leads",
  },
  {
    path: route.contacts,
    element: <ContactList />,
    route: Route,
    title: "Contacts",
  },
  {
    path: route.companies,
    element: <Companies />,
    route: Route,
    title: "Companies",
  },
  {
    path: route.deals,
    element: <DealList />,
    route: Route,
    title: "Deals",
  },
  {
    path: route.activities,
    element: <Activities />,
    route: Route,
    title: "Activities",
  },
  {
    path: `${route.activities}/:name`,
    element: <Activities />,
    route: Route,
    title: "Activities",
  },
  {
    path: route.calls,
    element: <Calls />,
    route: Route,
    title: "Calls",
  },
  {
    path: route.campaigns,
    element: <CampaignsList />,
    route: Route,
    title: "Campaign",
  },
  {
    path: route.documents,
    element: <Documents />,
    route: Route,
    title: "Documents",
  },
  {
    path: route.projects,
    element: <Projects />,
    route: Route,
    title: "Projects Listing",
  },
  {
    path: route.quotation,
    element: <Quotation />,
    route: Route,
    title: "Quotation",
  },

  {
    path: route.company,
    element: <Company />,
    route: Route,
    title: "Company",
  },
  {
    path: route.branch,
    element: <BranchList />,
    route: Route,
    title: "Branch",
  },
  {
    path: route.department,
    element: <DepanrtmentList />,
    route: Route,
    title: "department",
  },
  {
    path: route.designation,
    element: <DesignationList />,
    route: Route,
    title: "designation",
  },
  {
    path: route.employeeCategory,
    element: <Employee_CategoryList />,
    route: Route,
    title: "employeeCategory",
  },
  {
    path: route.employmentType,
    element: <Employee_TypeList />,
    route: Route,
    title: "employeetype",
  },
  {
    path: route.payComponent,
    element: <Paycomponent />,
    route: Route,
    title: "paycomponent",
  },
  {
    path: route.loneType,
    element: <LoneType />,
    route: Route,
    title: "lonetype",
  },
  {
    path: route.reviewTemplateMaster,
    element: <ReviewTemplateMaster />,
    route: Route,
    title: "reviewTemplateMaster",
  },
  {
    path: route.ratingScaleMaster,
    element: <RatingScaleMaster />,
    route: Route,
    title: "ratingScaleMaster",
  },
  {
    path: route.salaryStructure,
    element: <SalaryStructure />,
    route: Route,
    title: "salarystructure",
  },
  {
    path: route.currency,
    element: <CurrencyList />,
    route: Route,
    title: "salarystructure",
  },
  {
    path: route.employee,
    element: <EmployeeList />,
    route: Route,
    title: "employee",
  },

  {
    path: route.order,
    element: <Orders />,
    route: Route,
    title: "Orders",
  },
  {
    path: route.salesInvoice,
    element: <SalesInvoice />,
    route: Route,
    title: "Sales Invoice",
  },
  {
    path: route.purchaseOrder,
    element: <PurchaseOrders />,
    route: Route,
    title: "Purchase Order",
  },
  {
    path: route.purchaseInvoice,
    element: <PurchaseInvoice />,
    route: Route,
    title: "Purchase Invoice",
  },
  {
    path: route.pipelines,
    element: <Pipelines />,
    route: Route,
    title: "Pipelines",
  },
  {
    path: route.vendor,
    element: <Vendor />,
    route: Route,
    title: "Vendor",
  },
  {
    path: route.products,
    element: <Product />,
    route: Route,
    title: "Products",
  },
  {
    path: route.priceBook,
    element: <PriceBook />,
    route: Route,
    title: "Price Book",
  },
  {
    path: route.cases,
    element: <Cases />,
    route: Route,
    title: "Cases",
  },
  {
    path: route.solutions,
    element: <Solutions />,
    route: Route,
    title: "Solutions",
  },
  {
    path: route.sources,
    element: <SourceList />,
    route: Route,
    title: "Sources",
  },
  {
    path: route.lostReason,
    element: <LostReason />,
    route: Route,
    title: "Lead Status",
  },
  {
    path: route.contactStage,
    element: <ContactStage />,
    route: Route,
    title: "Contact Stage",
  },
  {
    path: route.industries,
    element: <Industries />,
    route: Route,
    title: "Industry",
  },
  {
    path: route.callStatus,
    element: <CallStatus />,
    route: Route,
    title: "Call Status",
  },
  {
    path: route.meetingType,
    element: <MeetingTypes />,
    route: Route,
    title: "Meeting Type",
  },
  {
    path: route.productCategory,
    element: <ProductCategory />,
    route: Route,
    title: "Product Category",
  },
  {
    path: route.banks,
    element: <BanksList />,
    route: Route,
    title: "banks",
  },

  {
    path: route.taxSetUp,
    element: <TaxSetUpList />,
    route: Route,
    title: "Tax Setup",
  },
  {
    path: route.providentFund,
    element: <ProvidentFund />,
    route: Route,
    title: "Provident Fund",
  },
  {
    path: route.country,
    element: <CountriesList />,
    route: Route,
    title: "Country",
  },
  {
    path: route.state,
    element: <StateList />,
    route: Route,
    title: "State",
  },
  {
    path: route.statutoryRates,
    element: <StatutoryRates />,
    route: Route,
    title: "StatutoryRates",
  },
  {
    path: route.taxRelief,
    element: <TaxRelirf />,
    route: Route,
    title: "TaxRelief",
  },
  {
    path: route.taxRegime,
    element: <TaxRegime />,
    route: Route,
    title: "Tax Regime",
  },
  // {
  //   path: route.currency,
  //   element: <CurrenciesList />,
  //   route: Route,
  //   title: "Currency",
  // },
  {
    path: route.modules,
    element: <Modules />,
    route: Route,
    title: "Modules",
  },
  {
    path: route.manageusers,
    element: <Manageusers />,
    route: Route,
    title: "Manage Users",
  },
  {
    path: route.rolesPermissions,
    element: <RolesPermissions />,
    route: Route,
    title: "Roles & Permission",
  },
  {
    path: route.VendorDetail,
    element: <VendorDetail />,
    route: Route,
    title: "Vendor Details",
  },

  {
    path: route.companyDetails,
    element: <CompanyDetail />,
    route: Route,
    title: "Companies Detail",
  },
  {
    path: route.addEmployee,
    element: <AddEmployee />,
    route: Route,
    title: "Companies Detail",
  },
  {
    path: route.projectDetails,
    element: <ProjectDetail />,
    route: Route,
    title: "Projects Detail",
  },
  {
    path: route.jobPosting,
    element: <JobPosting />,
    route: Route,
    title: "jobPosting",
  },
  {
    path: route.offerLetters,
    element: <OfferLetters />,
    route: Route,
    title: "OfferLetters",
  },
  {
    path: route.callResult,
    element: <CallResult />,
    route: Route,
    title: "Call Result",
  },
  {
    path: route.callPurpose,
    element: <CallPurpose />,
    route: Route,
    title: "Call Purpose",
  },
  {
    path: route.callType,
    element: <CallType />,
    route: Route,
    title: "Call Type",
  },
  {
    path: route.shift,
    element: <ShiftList />,
    route: Route,
    title: "Shift",
  },
  {
    path: route.leaveType,
    element: <LeaveTypeList />,
    route: Route,
    title: "Leave Type",
  },
  {
    path: route.holidayCalender,
    element: <HolidayCalenderList />,
    route: Route,
    title: "Holiday Calender",
  },
  {
    path: route.workSchedule,
    element: <WorkTemplateList />,
    route: Route,
    title: "Work Schedule Template",
  },
  {
    path: route.leadsDetail,
    element: <LeadsDetail />,
    route: Route,
    title: "Leads Detail",
  },
  {
    path: route.leadskanban,
    element: <LeadsKanban />,
    route: Route,
    title: "Leads Kanban",
  },
  {
    path: route.pipelineDetail,
    element: <PipelineDetail />,
    route: Route,
    title: "Pipelines Detail",
  },
  {
    path: route.contactDetail,
    element: <ContactDetail />,
    route: Route,
    title: "Contacts Detail",
  },
  {
    path: route.manageusersDetails,
    element: <UserDetail />,
    route: Route,
    title: "Manage Users Details",
  },

  {
    path: route.activityKanban,
    element: <ActivitiesKanban />,
    route: Route,
    title: "Activities",
  },
  {
    path: route.dealtDetail,
    element: <DealDetail />,
    route: Route,
    title: "Deals Detail",
  },
  {
    path: route.dealsKanban,
    element: <DealsKanban />,
    route: Route,
    title: "Deals Kanban",
  },

  // Settings //
  {
    path: route.connectedApps,
    element: <ConnectedApps />,
    route: Route,
    title: "ConnectedApps",
  },
  {
    path: route.notification,
    element: <Notifications />,
    route: Route,
    title: "Notifications",
  },
  {
    path: route.profile,
    element: <Profile />,
    route: Route,
    title: "Profile",
  },
  {
    path: route.security,
    element: <Security />,
    route: Route,
    title: "Security",
  },

  {
    path: route.appearance,
    element: <Appearance />,
    route: Route,
    title: "Appearance",
  },
  {
    path: route.companySettings,
    element: <CompanySettings />,
    route: Route,
    title: "Companies Settings",
  },
  {
    path: route.language,
    element: <Language />,
    route: Route,
    title: "Language",
  },
  {
    path: route.localization,
    element: <Localization />,
    route: Route,
  },
  {
    path: route.preference,
    element: <Preference />,
    route: Route,
    title: "Preference",
  },
  {
    path: route.prefixes,
    element: <Prefixes />,
    route: Route,
    title: "Prefixes",
  },

  {
    path: route.customFields,
    element: <CustomFields />,
    route: Route,
    title: "Custom Fields",
  },
  {
    path: route.invoiceSettings,
    element: <InvoiceSettings />,
    route: Route,
    title: "Invoice Settings",
  },
  {
    path: route.printers,
    element: <Printers />,
    route: Route,
    title: "Printers",
  },

  {
    path: route.emailSettings,
    element: <EmailSettings />,
    route: Route,
    title: "Email Settings",
  },
  {
    path: route.gdprCookies,
    element: <GdprCookies />,
    route: Route,
    title: "Gdpr Cookies",
  },
  {
    path: route.smsGateways,
    element: <SmsGateways />,
    route: Route,
    title: "Sms Gateways",
  },

  {
    path: route.bankAccounts,
    element: <BankAccounts />,
    route: Route,
    title: "Bank Accounts",
  },
  // {
  //   path: route.currencies,
  //   element: <Currencies />,
  //   route: Route,
  //   title: 'Currencies'
  // },
  {
    path: route.paymentGateways,
    element: <PaymentGateways />,
    route: Route,
    title: "PaymentGateways",
  },
  {
    path: route.kpiMaster,
    element: <KpiMaster />,
    route: Route,
    title: "KpiMaster",
  },
  {
    path: route.goalCategoryMaster,
    element: <GoalCategoryMaster />,
    route: Route,
    title: "goalCategoryMaster",
  },
  {
    path: route.disciplinaryPenaltyMaster,
    element: <DisciplinaryPenaltyMaster />,
    route: Route,
    title: "disciplinaryPenaltyMaster",
  },
  {
    path: route.awardTypeMaster,
    element: <AwardTypeMaster />,
    route: Route,
    title: "awardTypeMaster",
  },
  {
    path: route.jobCategoryMaster,
    element: <JobCategoryMaster />,
    route: Route,
    title: "jobCategoryMaster",
  },
  {
    path: route.grievanceTypeMaster,
    element: <GrievanceTypeMaster />,
    route: Route,
    title: "GrievanceTypeMaster",
  },
  {
    path: route.workLifeEventTypeMaster,
    element: <WorkLifeEventTypeMaster />,
    route: Route,
    title: "workLifeEventTypeMaster",
  },
  {
    path: route.assetTypeMaster,
    element: <AssetTypeMaster />,
    route: Route,
    title: "workLifeEventTypeMaster",
  },
  {
    path: route.leaveApplications,
    element: <LeaveApplications />,
    route: Route,
    title: "LeaveApplications",
  },
  {
    path: route.letterTypeMaster,
    element: <LetterTypeMaster />,
    route: Route,
    title: "letterTypeMaster",
  },
  {
    path: route.resumeUpload,
    element: <ResumeUpload />,
    route: Route,
    title: "resumeUpload",
  },
  {
    path: route.payslipViewer,
    element: <PayslipViewer />,
    route: Route,
    title: "PayslipViewer",
  },
  {
    path: route.loanRequests,
    element: <LoanRequests />,
    route: Route,
    title: "loanRequests",
  },

  {
    path: route.surveyMaster,
    element: <SurveyMaster />,
    route: Route,
    title: "surveyMaster",
  },
  {
    path: route.documentTypeMaster,
    element: <DocumentTypeMaster />,
    route: Route,
    title: "documentTypeMaster",
  },
  {
    path: route.taxRates,
    element: <TaxRates />,
    route: Route,
    title: "TaxRates",
  },

  {
    path: route.banIpAddrress,
    element: <BanIpAddress />,
    route: Route,
    title: "BanIpAddress",
  },
  {
    path: route.storage,
    element: <Storage />,
    route: Route,
    title: "Storage",
  },
  /////////// Settings /////////////////////

  {
    path: "/",
    name: "Root",
    element: <Navigate to="/login" />,
    route: Route,
    title: "Login",
  },

  {
    path: route.dealsDashboard,
    element: <DealsDashboard />,
    route: Route,
    title: "Deals Dashboard",
  },
  {
    path: route.leadsDashboard,
    element: <LeadsDashboard />,
    route: Route,
    title: "Leads Dashboard",
  },
  {
    path: route.projectDashboard,
    element: <ProjectDashboard />,
    route: Route,
    title: "Projects Dashboard",
  },
  {
    path: route.appointmentLetter,
    element: <AppointmentLetters />,
    route: Route,
    title: "Appointment Letters",
  },
  {
    path: route.employmentContracts,
    element: <EmploymentContracts />,
    route: Route,
    title: "Employment Contracts",
  },
  {
    path: route.employeeDetails,
    element: <EmployeeDetail />,
    route: Route,
    title: "Employee Details",
  },
  {
    path: route.leaveEncashment,
    element: <LeaveEncashment />,
    route: Route,
    title: "Leave Encashment",
  },
  {
    path: route.timeSheet,
    element: <TimeSheet />,
    route: Route,
    title: "Time Sheet",
  },
  {
    path: route.appraisalEntries,
    element: <AppraisalEntries />,
    route: Route,
    title: "Appraisal Entries",
  },
  {
    path: route.wpsFileGenerator,
    element: <WPSFileGenerator />,
    route: Route,
    title: "WPS File Generator",
  },
  {
    path: route.disciplinaryActionLog,
    element: <DisciplinaryActionLog />,
    route: Route,
    title: "disciplinary ActionLog",
  },
  {
    path: route.grievanceSubmission,
    element: <GrievanceSubmission />,
    route: Route,
    title: "grievance Submission",
  },
  {
    path: route.monthlyPayrollProcessing,
    element: <MonthlyPayrollProcessing />,
    route: Route,
    title: "Monthly Payroll Processing",
  },
  {
    path: route.trainingSessionSchedule,
    element: <TrainingSessionSchedule />,
    route: Route,
    title: "training Session Schedule",
  },
  {
    path: route.trainingFeedbackEntry,
    element: <TrainingFeedbackEntry />,
    route: Route,
    title: "training Session Schedule",
  },
  {
    path: route.probationReview,
    element: <ProbationReview />,
    route: Route,
    title: "Probation Review",
  },

  {
    path: route.successionPlanningEntry,
    element: <SuccessionPlanningEntry />,
    route: Route,
    title: "Probation Review",
  },
];

export const publicRoutes = [
  {
    path: route.login,
    element: <Login />,
    route: Route,
    title: "Login",
  },
  {
    path: route.register,
    // name: "Root",
    element: <Register />,
    route: Route,
    title: "Register",
  },
];
