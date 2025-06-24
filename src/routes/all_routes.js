export const all_routes = {
  dasshboard: "/dashboard",

  register: "/register",
  login: "/login",
  /*Contact-route*/
  contacts: "/contacts",
  contactDetail: "/contacts/:id",
  contactGrid: "/contact-grid",
  /*End Contact Route*/

  leadsDetail: "/leads/:id",
  leads: "/leads",
  leadskanban: "/leads-kanban",

  /* Calls */
  calls: "/calls",

  /*Compnay-route*/
  companies: "/companies",
  companyDetails: "/companies/:id",
  /*End Compnay Route*/

  /* pipeline-route*/
  pipelines: "/pipelines",
  pipelineDetail: "/pipelines/:id",
  /* /pipeline Route */

  /* Deals Route*/
  deals: "/deals",
  dealtDetail: "/deals/:id",
  dealsKanban: "/deals-kanban",
  /* /Deals Route */

  /* Activity Route */
  activityCalls: "/crm/activity-calls",
  activityMail: "/crm/activity-mail",
  activityTask: "/crm/activity-task",
  activityMeeting: "/crm/activity-meeting",
  activities: "/crm/activities",
  //CRM SETTINGS

  // core-hr //
  company: "/company",

  branch: "/branch",
  department: "/department",
  designation: "/designation",
  employeeCategory: "/employee-category",
  employmentType: "/employment-type",
  payComponent: "/pay-component",
  salaryStructure: "/salary-structure",
  statutoryRates: "/statutory-rates",
  taxRelief: "/tax-relief",
  providentFund: "/provident-fund",
  taxRegime: "/tax-regime",
  kpiMaster: "/kpi-master",
  goalCategoryMaster: "/goal-category-master",
  reviewTemplateMaster: "/review-template-master",
  ratingScaleMaster: "/rating-scale-master",
  jobCategoryMaster: "/job-category-master",
  grievanceTypeMaster: "/grievance-type-master",
  disciplinaryPenaltyMaster: "/disciplinary-penalty-master",
  workLifeEventTypeMaster: "/work-life-event-type-master",
  awardTypeMaster: "/award-type-master",
  letterTypeMaster: "/letter-type-master",
  documentTypeMaster: "/document-type-master",
  surveyMaster: "/survey-master",
  assetTypeMaster: "/asset-type-master",

  jobPosting: "/job-posting",
  employee: "/employee",
  addEmployee: "/add-employee",
  employeeDetails: "/employee/:id",

  // Appointment Letters
  appointmentLetter: "/appointment-letters",
  offerLetters: "/offer-letters",
  resumeUpload: "/resume-upload",
  leaveApplications: "/leave-applications",
  payslipViewer: "/payslip-viewer",
  loanRequests: "/loan-requests",
  loneType: "/lone-type",

  // Employment Contracts
  employmentContracts: "/employment-contracts",

  // Leave Encashment
  leaveEncashment: "/leave-encashment",

  // Time Sheet Entry
  timeSheet: "/time-sheet",

  // Appraisals Entry
  appraisalEntries: "/appraisal-entries",

  // WPS File Generator
  wpsFileGenerator: "/wps-file-generator",

  // Work Life Event Log
  workLifeEventLog: "/work-life-event-log",

  // Competency Tracking
  competencyTracking: "/competency-tracking",

  // Exit Interview
  exitInterview: "/exit-interview",

  // Exit Clearance
  exitClearance: "/exit-clearance",

  // Relieving Letter
  relievingLetter: "/relieving-letter",

  // Asset Assignment
  assetAssignment: "/asset-assignment",

  // Survey Response
  surveyResponse: "/survey-response",

  // Employee Suggestion
  employeeSuggestion: "/employee-suggestion",

  // Helpdesk Ticket
  helpdeskTicket: "/helpdesk-ticket",

  // Notifications
  notifications: "/notifications",

  // Employee Attachments
  employeeAttachment: "/employee-attachments",

  // Advance Payment Entry
  advancePaymentEntry: "/advance-payment-entry",

  // Monthly Payroll Processing
  monthlyPayroll: "/monthly-payroll-processing",

  // Arrear Adjustments
  arrearAdjustments: "/arrear-adjustments",

  // KPI Progress
  kpiProgress: "/kpi-progress",

  // Warning Letters
  warningLetters: "/warning-letters",

  // Leave Balance
  leaveBalance: "/leave-balance",

  currency: "/currency",
  // core-hr //

  /* Source Route*/
  sources: "/sources",
  /* lost reason*/
  lostReason: "/lost-reasons",
  /* contact-stages */
  contactStage: "/contact-stages",
  /* industries */
  industries: "/industries",
  /* call-statuses */
  callStatus: "/call-status",
  callResult: "/call-result",
  callPurpose: "/call-purpose",
  callType: "/call-types",
  /*projects */
  projects: "/projects",
  projectDetails: "/projects/:id",

  state: "/state",
  country: "/country",

  // Settings //
  connectedApps: "/general-settings/connected-apps",
  notification: "/general-settings/notification",
  profile: "/general-settings/profile",
  security: "/general-settings/security",

  appearance: "/website-settings/appearance",
  companySettings: "/website-settings/company-settings",
  language: "/website-settings/language",
  localization: "/website-settings/localization",
  preference: "/website-settings/preference",
  prefixes: "/website-settings/prefixes",
  languageWeb: "/website-settings/language-web",

  customFields: "/app-settings/custom-fields",
  invoiceSettings: "/app-settings/invoice-settings",
  printers: "/app-settings/printers",

  emailSettings: "/system-settings/storage",
  gdprCookies: "/system-settings/gdpr-cookies",
  smsGateways: "/system-settings/sms-gateways",

  bankAccounts: "/financial-settings/bank-accounts",
  // currencies: "/financial-settings/currencies",
  paymentGateways: "/financial-settings/payment-gateways",
  taxRates: "/financial-settings/tax-rates",

  banIpAddrress: "/other-settings/ban-ip-address",
  storage: "/other-settings/storage",

  disciplinaryActionLog: "/disciplinary-action-log",
  grievanceSubmission: "/grievance-Submission",
  trainingSessionSchedule: "/training-session-schedule",
  trainingFeedbackEntry: "/training-feedback-entry",
  probationReview: "/probation-review",
  successionPlanningEntry: "/succession-planning-entry",
  travelReimbursementClaims: "/travel-Reimbursement-Claims",
  recognitionAwards: "/Recognition-Awards",
  notificationsLog: "/notifications-log",
  dailyAttendanceEntry: "/daily-attendance-entry",
  goalSheetAssignment: "/goal-sheet-assignment",
  /* USER MANAGEMENT */
  manageusers: "/manage-users",
  manageusersDetails: "/manage-users/:id",

  rolesPermissions: "/roles-permissions",

  // dashboard routes
  dealsDashboard: "/dashboard/deals-dashboard",
  leadsDashboard: "/dashboard/leads-dashboard",
  projectDashboard: "/dashboard/project-dashboard",

  // Vendor
  vendor: "vendor",
  VendorDetail: "vendor/:id",

  // Meeting
  meetingType: "/meeting-type",

  modules: "/modules",

  documents: "/documents",
  activityKanban: "/crm/activity-kanban",

  productCategory: "/product-category",
  banks: "/banks",
  products: "/products",
  taxSetUp: "/tax-setup",
  order: "/order",
  quotation: "/quotation",
  purchaseOrder: "/purchase-order",
  salesInvoice: "/sales-invoice",
  purchaseInvoice: "/purchase-invoice",
  priceBook: "/price-book",
  cases: "/cases",
  solutions: "/solutions",
  campaigns: "/campaigns",

  shift: "/shift",
  leaveType: "/leave-type",
  holidayCalender: "/holiday-calender",
  workSchedule: "/work-schedule",
  candidate: "/candidate",
  candidateDetail: "/candidate/:id",
  medicalRecord: "/medical-record",
};
