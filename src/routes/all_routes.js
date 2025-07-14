export const all_routes = {
  // AUTHENTICATION
  login: "/login",
  register: "/register",

  // DASHBOARDS
  dashboard: "/dashboard",
  dashboardEmployee: "/dashboard-employee",
  dealsDashboard: "/dashboard/deals-dashboard",
  leadsDashboard: "/dashboard/leads-dashboard",
  projectDashboard: "/dashboard/project-dashboard",

  // CRM - CONTACTS & LEADS
  contacts: "/contacts",
  contactDetail: "/contacts/:id",
  contactGrid: "/contact-grid",
  leads: "/leads",
  leadsDetail: "/leads/:id",
  leadskanban: "/leads-kanban",

  // CRM - COMPANIES & PIPELINES
  companies: "/companies",
  companyDetails: "/companies/:id",
  pipelines: "/pipelines",
  pipelineDetail: "/pipelines/:id",

  // CRM - DEALS
  deals: "/deals",
  dealtDetail: "/deals/:id",
  dealsKanban: "/deals-kanban",

  // CRM - ACTIVITIES
  activityCalls: "/crm/activity-calls",
  activityKanban: "/crm/activity-kanban",
  activityMail: "/crm/activity-mail",
  activityMeeting: "/crm/activity-meeting",
  activityTask: "/crm/activity-task",
  activities: "/crm/activities",

  // CRM - CALLS
  calls: "/calls",

  // CRM - PROJECTS
  jobPosting: "/job-posting",
  employee: "/employee",
  addEmployee: "/add-employee",
  employeeDetails: "/employee/:id",
  appointmentLetter: "/appointment-letter",

  // CRM - OTHERS
  campaigns: "/campaigns",
  cases: "/cases",
  solutions: "/solutions",

  // HRMS - MASTER DATA
  assetTypeMaster: "/asset-type-master",
  awardTypeMaster: "/award-type-master",
  company: "/company",
  department: "/department",
  designation: "/designation",
  disciplinaryPenaltyMaster: "/disciplinary-penalty-master",
  documentTypeMaster: "/document-type-master",
  employeeCategory: "/employee-category",
  employmentType: "/employment-type",
  goalCategoryMaster: "/goal-category-master",
  grievanceTypeMaster: "/grievance-type-master",
  jobCategoryMaster: "/job-category-master",
  kpiMaster: "/kpi-master",
  letterTypeMaster: "/letter-type-master",
  payComponent: "/pay-component",
  providentFund: "/provident-fund",
  ratingScaleMaster: "/rating-scale-master",
  reviewTemplateMaster: "/review-template-master",
  salaryStructure: "/salary-structure",
  statutoryRates: "/statutory-rates",
  surveyMaster: "/survey-master",
  taxRegime: "/tax-regime",
  taxRelief: "/tax-relief",
  workLifeEventTypeMaster: "/work-life-event-type-master",

  // HRMS - EMPLOYEE MANAGEMENT
  candidates: "/candidates",
  candidateDetail: "/candidate/:id",
  employeeAttachment: "/employee-attachments",
  employmentContracts: "/employment-contracts",
  exitClearance: "/exit-clearance",
  exitInterview: "/exit-interview",
  offerLetters: "/offer-letters",
  relievingLetter: "/relieving-letter",
  resumeUpload: "/resume-upload",

  // HRMS - LEAVE & ATTENDANCE
  dailyAttendanceEntry: "/daily-attendance-entry",
  holidayCalender: "/holiday-calender",
  leaveApplications: "/leave-applications",
  leaveBalance: "/leave-balance",
  leaveEncashment: "/leave-encashment",
  leaveType: "/leave-type",
  shift: "/shift",
  timeSheet: "/time-sheet",
  workSchedule: "/work-schedule",

  // HRMS - PAYROLL & FINANCE
  advancePaymentEntry: "/advance-payment-entry",
  arrearAdjustments: "/arrear-adjustments",
  basicPayroll: "/component-assignment",
  kpiProgress: "/kpi-progress",
  loanRequests: "/loan-requests",
  loneType: "/lone-type",
  monthlyPayroll: "/monthly-payroll-processing",
  midMonthPayroll: "/mid-month-payroll-processing",
  overTimePayroll: "/overtime-payroll-processing",
  payslipViewer: "/payslip-viewer",
  wpsFileGenerator: "/wps-file-generator",
  loanMaster: "/loan-master",
  overTimeMaster: "/overtime-master",
  // HRMS - PERFORMANCE & APPRAISALS
  appraisalEntries: "/appraisal-entries",
  goalSheetAssignment: "/goal-sheet-assignment",

  // HRMS - TRAINING & DEVELOPMENT
  probationReview: "/probation-review",
  successionPlanningEntry: "/succession-planning-entry",
  trainingFeedbackEntry: "/training-feedback-entry",
  trainingSessionSchedule: "/training-session-schedule",

  // HRMS - RECOGNITION & AWARDS
  recognitionAwards: "/recognition-awards",

  // HRMS - DISCIPLINARY & GRIEVANCE
  disciplinaryActionLog: "/disciplinary-action-log",
  grievanceSubmission: "/grievance-submission",
  warningLetters: "/warning-letters",

  // HRMS - SUGGESTIONS, SURVEYS, EVENTS
  employeeSuggestion: "/employee-suggestion",
  surveyResponse: "/survey-response",
  workLifeEventLog: "/work-life-event-log",

  // HRMS - ASSET & DOCUMENTS
  assetAssignment: "/asset-assignment",
  documents: "/documents",

  // HRMS - COMPETENCY & TRACKING
  competencyTracking: "/competency-tracking",

  // HRMS - OTHERS
  helpdeskTicket: "/helpdesk-ticket",
  notifications: "/notifications",
  notificationsLog: "/notifications-log",
  travelReimbursementClaims: "/travel-reimbursement-claims",

  // HRMS - MEDICAL
  medicalRecord: "/medical-record",

  // HRMS - COST CENTER
  CostCenter: "/cost-center",

  // HRMS - TAX
  taxSlab: "/tax-slab",

  // HRMS - CURRENCY
  currency: "/currency",

  // USER MANAGEMENT
  manageusers: "/manage-users",
  manageusersDetails: "/manage-users/:id",
  rolesPermissions: "/roles-permissions",

  // VENDOR MANAGEMENT
  vendor: "vendor",
  VendorDetail: "vendor/:id",

  // PRODUCTS & ORDERS
  banks: "/banks",
  order: "/order",
  priceBook: "/price-book",
  productCategory: "/product-category",
  products: "/products",
  purchaseInvoice: "/purchase-invoice",
  purchaseOrder: "/purchase-order",
  quotation: "/quotation",
  salesInvoice: "/sales-invoice",
  taxSetUp: "/tax-setup",

  // SETTINGS - GENERAL
  connectedApps: "/general-settings/connected-apps",
  notification: "/general-settings/notification",
  profile: "/general-settings/profile",
  security: "/general-settings/security",

  // SETTINGS - WEBSITE
  appearance: "/website-settings/appearance",
  companySettings: "/website-settings/company-settings",
  language: "/website-settings/language",
  languageWeb: "/website-settings/language-web",
  localization: "/website-settings/localization",
  preference: "/website-settings/preference",
  prefixes: "/website-settings/prefixes",

  // SETTINGS - APP
  customFields: "/app-settings/custom-fields",
  invoiceSettings: "/app-settings/invoice-settings",
  printers: "/app-settings/printers",

  // SETTINGS - SYSTEM
  emailSettings: "/system-settings/storage",
  gdprCookies: "/system-settings/gdpr-cookies",
  smsGateways: "/system-settings/sms-gateways",

  // SETTINGS - FINANCIAL
  bankAccounts: "/financial-settings/bank-accounts",
  paymentGateways: "/financial-settings/payment-gateways",
  taxRates: "/financial-settings/tax-rates",

  // SETTINGS - OTHER
  banIpAddrress: "/other-settings/ban-ip-address",
  storage: "/other-settings/storage",

  // MISCELLANEOUS
  meetingType: "/meeting-type",
  modules: "/modules",
  sources: "/sources",
  lostReason: "/lost-reasons",
  contactStage: "/contact-stages",
  industries: "/industries",
  callStatus: "/call-status",
  callResult: "/call-result",
  callPurpose: "/call-purpose",
  callType: "/call-types",
  projects: "/projects",
  projectDetails: "/projects/:id",
  state: "/state",
  country: "/country",
};
