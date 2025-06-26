import { Navigate, Route } from "react-router";
import Activities from "../pages/Activities";
import ActivitiesKanban from "../pages/Activities/ActivitiessKanban";
import AdvancePayment from "../pages/AdvancePayment";
import AppointmentLetters from "../pages/AppointmentLetters";
import AppraisalEntries from "../pages/AppraisalEntries";
import ArrearAdjustments from "../pages/ArrearAdjustments";
import AssetAssignment from "../pages/AssetAssignment";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Calls from "../pages/call";
import CampaignsList from "../pages/Campaign";
import Candidate from "../pages/Candidate";
import Cases from "../pages/Case";
import Companies from "../pages/companies/";
import CompanyDetail from "../pages/companies/CompanyDetail";
import CompetencyTracking from "../pages/CompetencyTracking";
import ContactDetail from "../pages/contacts/";
import ContactList from "../pages/contacts/contactList";
import BanksList from "../pages/crm-settings/bank";
import CallResult from "../pages/crm-settings/callResult";
import CallStatus from "../pages/crm-settings/calls";
import CallPurpose from "../pages/crm-settings/callsPurpose";
import CallType from "../pages/crm-settings/callType";
import ContactStage from "../pages/crm-settings/contact-stages";
import BranchList from "../pages/crm-settings/core-hr/branch";
import Company from "../pages/crm-settings/core-hr/company";
import DepanrtmentList from "../pages/crm-settings/core-hr/department";
import DesignationList from "../pages/crm-settings/core-hr/designation";
import EmployeeCategoryList from "../pages/crm-settings/core-hr/employeeCategory";
import EmployeeTypeList from "../pages/crm-settings/core-hr/employmentType";
import CountriesList from "../pages/crm-settings/country";
import Industries from "../pages/crm-settings/industries";
import HolidayCalenderList from "../pages/crm-settings/leaveAndAttendance/HolidayCalender";
import LeaveBalance from "../pages/crm-settings/leaveAndAttendance/LeaveBalance";
import LeaveTypeList from "../pages/crm-settings/leaveAndAttendance/LeaveType";
import ShiftList from "../pages/crm-settings/leaveAndAttendance/Shifts";
import WorkTemplateList from "../pages/crm-settings/leaveAndAttendance/WorkSchedule";
import LostReason from "../pages/crm-settings/lost-reasons";
import MeetingTypes from "../pages/crm-settings/meetingType";
import Modules from "../pages/crm-settings/Modules";
import CurrencyList from "../pages/crm-settings/payroll-statutory/currency";
import LoneType from "../pages/crm-settings/payroll-statutory/loneTpye";
import Paycomponent from "../pages/crm-settings/payroll-statutory/paycomponent";
import ProvidentFund from "../pages/crm-settings/payroll-statutory/providentFund";
import SalaryStructure from "../pages/crm-settings/payroll-statutory/salarystructure";
import StatutoryRates from "../pages/crm-settings/payroll-statutory/statutoryRates";
import TaxRelirf from "../pages/crm-settings/payroll-statutory/taxRegime";
import TaxRegime from "../pages/crm-settings/payroll-statutory/texRegim";
import GoalCategoryMaster from "../pages/crm-settings/performance/goalCategoryMaster";
import KpiMaster from "../pages/crm-settings/performance/kpi-Master";
import RatingScaleMaster from "../pages/crm-settings/performance/ratingScaleMaster";
import ReviewTemplateMaster from "../pages/crm-settings/performance/ReviewTemplateMaster";
import ProductCategory from "../pages/crm-settings/ProductCategory";
import AssetTypeMaster from "../pages/crm-settings/recruitment&Talent/assetTypeMaster";
import AwardTypeMaster from "../pages/crm-settings/recruitment&Talent/awardTypeMaster";
import DisciplinaryPenaltyMaster from "../pages/crm-settings/recruitment&Talent/disciplinaryPenaltyMaster";
import DocumentTypeMaster from "../pages/crm-settings/recruitment&Talent/documentTypeMaster";
import GrievanceTypeMaster from "../pages/crm-settings/recruitment&Talent/grievanceTypeMaster";
import JobCategoryMaster from "../pages/crm-settings/recruitment&Talent/jobCategoryMaster";
import LetterTypeMaster from "../pages/crm-settings/recruitment&Talent/letterTypeMaster";
import SurveyMaster from "../pages/crm-settings/recruitment&Talent/surveyMaster";
import WorkLifeEventTypeMaster from "../pages/crm-settings/recruitment&Talent/workLifeEventTypeMaster";
import SourceList from "../pages/crm-settings/sources";
import StateList from "../pages/crm-settings/state";
import TaxSetUpList from "../pages/crm-settings/TaxSetUp";
import DailyAttendance from "../pages/dailyAttendance";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import DealList from "../pages/deals";
import DealDetail from "../pages/deals/DealDetail";
import DealsKanban from "../pages/deals/DealsKanban";
import DisciplinaryActionLog from "../pages/disciplinaryActionLog";
import Documents from "../pages/Documents";
import EmployeeList from "../pages/Employee";
import AddEmployee from "../pages/Employee/AddEmployee";
import EmployeeDetail from "../pages/Employee/EmployeeDetail";
import EmployeeAttachment from "../pages/EmployeeAttachment";
import EmployeeSuggestion from "../pages/EmployeeSuggestion";
import EmploymentContracts from "../pages/EmploymentContracts";
import ExitClearance from "../pages/ExitClearance";
import ExitInterview from "../pages/ExitInterview";
import GoalSheetAssignment from "../pages/goalSheetAssignment";
import GrievanceSubmission from "../pages/grievanceSubmission";
import HelpdeskTicket from "../pages/HelpdeskTicket";
import JobPosting from "../pages/jobPosting";
import KPIProgress from "../pages/KPIProgress";
import LeadsList from "../pages/leads";
import LeadsDetail from "../pages/leads/LeadsDetail";
import LeadsKanban from "../pages/leads/LeadsKanban";
import LeaveApplications from "../pages/leaveApplications";
import LeaveEncashment from "../pages/LeaveEncashment";
import LoanRequests from "../pages/loanRequests";
import {
  default as Dashboard,
  default as DealsDashboard,
} from "../pages/main-menu/deals-dashboard";
import LeadsDashboard from "../pages/main-menu/leads-dashboard";
import ProjectDashboard from "../pages/main-menu/project-dashboard";
import MonthlyPayroll from "../pages/MonthlyPayroll";
import NotificationsLog from "../pages/Notifications";
import OfferLetters from "../pages/OfferLetters";
import Orders from "../pages/Order";
import PayslipViewer from "../pages/payslipViewer";
import Pipelines from "../pages/pipelines/";
import PipelineDetail from "../pages/pipelines/PipelineDetail";
import PriceBook from "../pages/priceBooks";
import ProbationReview from "../pages/probationReview";
import Product from "../pages/Product";
import Projects from "../pages/projects";
import ProjectDetail from "../pages/projects/ProjectsDetail";
import PurchaseInvoice from "../pages/purchaseInvoice";
import PurchaseOrders from "../pages/purchaseOrder";
import Quotation from "../pages/Quotation";
import RecognitionAwards from "../pages/RecognitionAwards";
import RelievingLetter from "../pages/RelievingLetter";
import ResumeUpload from "../pages/resumeUpload";
import SalesInvoice from "../pages/salesInvoice";
import CustomFields from "../pages/settings/app-settings/CustomFields";
import InvoiceSettings from "../pages/settings/app-settings/InvoiceSettings";
import Printers from "../pages/settings/app-settings/Printers";
import BankAccounts from "../pages/settings/financial-settings/BankAccounts";
import PaymentGateways from "../pages/settings/financial-settings/PaymentGateways";
import TaxRates from "../pages/settings/financial-settings/TaxRates";
import ConnectedApps from "../pages/settings/general-settings/ConnectedApp";
import Notifications from "../pages/settings/general-settings/Notifications";
import Profile from "../pages/settings/general-settings/Profile";
import Security from "../pages/settings/general-settings/Security";
import BanIpAddress from "../pages/settings/other-settings/BanIpAddress";
import Storage from "../pages/settings/other-settings/Storage";
import EmailSettings from "../pages/settings/system-settings/EmailSettings";
import GdprCookies from "../pages/settings/system-settings/GdprCookies";
import SmsGateways from "../pages/settings/system-settings/SmsGateways";
import Appearance from "../pages/settings/website-settings/Appearance";
import CompanySettings from "../pages/settings/website-settings/CompanySettings";
import Language from "../pages/settings/website-settings/LanguageWeb";
import Localization from "../pages/settings/website-settings/Localization";
import Preference from "../pages/settings/website-settings/Preference";
import Prefixes from "../pages/settings/website-settings/Prefixes";
import Solutions from "../pages/Solutions";
import SuccessionPlanningEntry from "../pages/successionPlanningEntry";
import SurveyResponse from "../pages/SurveyResponse";
import TimeSheet from "../pages/TimeSheet";
import TrainingFeedbackEntry from "../pages/trainingFeedbackEntry";
import TrainingSessionSchedule from "../pages/trainingSessionSchedule";
import TravelReimbursement from "../pages/TravelReimbursement";
import Manageusers from "../pages/user-management/manage-users";
import UserDetail from "../pages/user-management/manage-users/UserDetail";
import RolesPermissions from "../pages/user-management/roles";
import Vendor from "../pages/Vendor";
import VendorDetail from "../pages/Vendor/VendorDetail";
import WarningLetters from "../pages/WarningLetters";
import WorkLifeEventLog from "../pages/WorkLifeEventLog";
import WPSFileGenerator from "../pages/WPSFileGenerator";
import CandidateDetail from "../pages/Candidate/CandidateDetail";
import { all_routes } from "./all_routes";
import MedicalRecord from "../pages/MedicalRecord";
import CurrenciesList from "../pages/crm-settings/currency";
import TaxSlab from "../pages/crm-settings/taxSlab";
import CostCenter from "../pages/crm-settings/costCenter";

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
    title: "Department",
  },
  {
    path: route.designation,
    element: <DesignationList />,
    route: Route,
    title: "Designation",
  },
  {
    path: route.employeeCategory,
    element: <EmployeeCategoryList />,
    route: Route,
    title: "Employee Category",
  },
  {
    path: route.employmentType,
    element: <EmployeeTypeList />,
    route: Route,
    title: "Employeetype",
  },
  {
    path: route.payComponent,
    element: <Paycomponent />,
    route: Route,
    title: "Pay Component",
  },
  {
    path: route.loneType,
    element: <LoneType />,
    route: Route,
    title: "Loan Type",
  },
  {
    path: route.reviewTemplateMaster,
    element: <ReviewTemplateMaster />,
    route: Route,
    title: "Review Template Master",
  },
  {
    path: route.ratingScaleMaster,
    element: <RatingScaleMaster />,
    route: Route,
    title: "Rating Scale Master",
  },
  {
    path: route.salaryStructure,
    element: <SalaryStructure />,
    route: Route,
    title: "Salary Structure",
  },
  {
    path: route.currency,
    element: <CurrencyList />,
    route: Route,
    title: "Currency",
  },
  {
    path: route.employee,
    element: <EmployeeList />,
    route: Route,
    title: "Employee",
  },

  {
    path: route.order,
    element: <Orders />,
    route: Route,
    title: "Orders",
  },
  {
    path: route.taxSlab,
    element: <TaxSlab />,
    route: Route,
    title: "Tax Slab",
  },
  {
    path: route.CostCenter,
    element: <CostCenter />,
    route: Route,
    title: "Cost Center",
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
    title: "Banks",
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
    title: "Statutory Rates",
  },
  {
    path: route.taxRelief,
    element: <TaxRelirf />,
    route: Route,
    title: "Tax Relief",
  },
  {
    path: route.taxRegime,
    element: <TaxRegime />,
    route: Route,
    title: "Tax Regime",
  },
  {
    path: route.candidates,
    element: <Candidate />,
    route: Route,
    title: "Candidate",
  },
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
    title: "Job Posting",
  },
  {
    path: route.offerLetters,
    element: <OfferLetters />,
    route: Route,
    title: "Offer Letters",
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
    path: route.leaveBalance,
    element: <LeaveBalance />,
    route: Route,
    title: "Leave Balance",
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
    title: "Holiday Calendar",
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
  {
    path: route.currency,
    element: <CurrenciesList />,
    route: Route,
    title: "Currencies",
  },
  {
    path: route.paymentGateways,
    element: <PaymentGateways />,
    route: Route,
    title: "Payment Gateways",
  },
  {
    path: route.kpiMaster,
    element: <KpiMaster />,
    route: Route,
    title: "KPI Progress Entry",
  },
  {
    path: route.goalCategoryMaster,
    element: <GoalCategoryMaster />,
    route: Route,
    title: "Goal Category Master",
  },
  {
    path: route.disciplinaryPenaltyMaster,
    element: <DisciplinaryPenaltyMaster />,
    route: Route,
    title: "Disciplinary Penalty Master",
  },
  {
    path: route.awardTypeMaster,
    element: <AwardTypeMaster />,
    route: Route,
    title: "Award Type Master",
  },
  {
    path: route.jobCategoryMaster,
    element: <JobCategoryMaster />,
    route: Route,
    title: "Job Category Master",
  },
  {
    path: route.grievanceTypeMaster,
    element: <GrievanceTypeMaster />,
    route: Route,
    title: "Grievance Type Master",
  },
  {
    path: route.workLifeEventTypeMaster,
    element: <WorkLifeEventTypeMaster />,
    route: Route,
    title: "Work Life Event Type Master",
  },
  {
    path: route.assetTypeMaster,
    element: <AssetTypeMaster />,
    route: Route,
    title: "Asset Type Master",
  },
  {
    path: route.leaveApplications,
    element: <LeaveApplications />,
    route: Route,
    title: "Leave Applications",
  },
  {
    path: route.letterTypeMaster,
    element: <LetterTypeMaster />,
    route: Route,
    title: "Letter Type Master",
  },
  {
    path: route.resumeUpload,
    element: <ResumeUpload />,
    route: Route,
    title: "Resume Upload",
  },
  {
    path: route.payslipViewer,
    element: <PayslipViewer />,
    route: Route,
    title: "Payslip Viewer",
  },
  {
    path: route.loanRequests,
    element: <LoanRequests />,
    route: Route,
    title: "Loan Requests",
  },

  {
    path: route.surveyMaster,
    element: <SurveyMaster />,
    route: Route,
    title: "Survey Master",
  },
  {
    path: route.documentTypeMaster,
    element: <DocumentTypeMaster />,
    route: Route,
    title: "Document Type Master",
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
    title: "Time Sheet Entry",
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
    title: "Disciplinary Action Log",
  },
  {
    path: route.grievanceSubmission,
    element: <GrievanceSubmission />,
    route: Route,
    title: "Grievance Submission",
  },
  {
    path: route.workLifeEventLog,
    element: <WorkLifeEventLog />,
    route: Route,
    title: "Work Life Event Log",
  },
  {
    path: route.competencyTracking,
    element: <CompetencyTracking />,
    route: Route,
    title: "Competency Tracking",
  },
  {
    path: route.monthlyPayroll,
    element: <MonthlyPayroll />,
    route: Route,
    title: "Monthly Payroll Processing",
  },
  {
    path: route.trainingSessionSchedule,
    element: <TrainingSessionSchedule />,
    route: Route,
    title: "Training Session Schedule",
  },
  {
    path: route.trainingFeedbackEntry,
    element: <TrainingFeedbackEntry />,
    route: Route,
    title: "Training Feedback Entry",
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
    title: "Succession Planning Entry",
  },
  {
    path: route.exitInterview,
    element: <ExitInterview />,
    route: Route,
    title: "Exit Interview",
  },
  {
    path: route.travelReimbursementClaims,
    element: <TravelReimbursement />,
    route: Route,
    title: " Travel & Reimbursement Claims",
  },

  {
    path: route.recognitionAwards,
    element: <RecognitionAwards />,
    route: Route,
    title: "Recognition Awards",
  },
  {
    path: route.exitClearance,
    element: <ExitClearance />,
    route: Route,
    title: "Exit Clearance Checklist",
  },
  {
    path: route.relievingLetter,
    element: <RelievingLetter />,
    route: Route,
    title: "Relieving Letter Generation",
  },
  {
    path: route.assetAssignment,
    element: <AssetAssignment />,
    route: Route,
    title: "Asset Assignment & Recovery",
  },
  {
    path: route.surveyResponse,
    element: <SurveyResponse />,
    route: Route,
    title: "Survey Response",
  },
  {
    path: route.employeeSuggestion,
    element: <EmployeeSuggestion />,
    route: Route,
    title: "Employee Suggestion",
  },
  {
    path: route.helpdeskTicket,
    element: <HelpdeskTicket />,
    route: Route,
    title: "Helpdesk Ticket",
  },
  {
    path: route.notificationsLog,
    element: <NotificationsLog />,
    route: Route,
    title: "Notification Center",
  },
  {
    path: route.employeeAttachment,
    element: <EmployeeAttachment />,
    route: Route,
    title: "Employee Attachment",
  },
  {
    path: route.advancePaymentEntry,
    element: <AdvancePayment />,
    route: Route,
    title: "Advance Payment Entry",
  },
  {
    path: route.arrearAdjustments,
    element: <ArrearAdjustments />,
    route: Route,
    title: "Arrear Adjustments",
  },
  {
    path: route.kpiProgress,
    element: <KPIProgress />,
    route: Route,
    title: "KPI Progress Entry",
  },
  {
    path: route.dailyAttendanceEntry,
    element: <DailyAttendance />,
    route: Route,
    title: "Daily Attendance Entry",
  },

  {
    path: route.goalSheetAssignment,
    element: <GoalSheetAssignment />,
    route: Route,
    title: "Goal Sheet Assignment",
  },
  {
    path: route.warningLetters,
    element: <WarningLetters />,
    route: Route,
    title: "Warning Letters",
  },
  {
    path: route.candidateDetail,
    element: <CandidateDetail />,
    route: Route,
    title: "Candidate Detail",
  },
  {
    path: route.medicalRecord,
    element: <MedicalRecord />,
    route: Route,
    title: "Medical Record",
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
