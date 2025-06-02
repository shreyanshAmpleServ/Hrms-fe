import { all_routes } from "../../../../routes/all_routes";
const route = all_routes;
export const SidebarData = [
  {
    label: "HRMS",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Inventory",
    submenuItems: [
      {
        label: "Dashboard",
        link: route.dasshboard,
        icon: "ti ti-layout-dashboard",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Employee",
        link: route.employee,
        icon: "ti ti-id-badge",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Onboarding & Hiring",
        icon: "ti ti-id-badge",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Job Posting",
            link: route.jobPosting,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Offer Letters",
            link: route.offerLetters,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Appointment Letters",
            link: route.appointmentLetter,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Employment Contracts",
            link: route.employmentContracts,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Resume Upload",
            link: route.resumeUpload,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Leave & Attendance",
        icon: "ti ti-file-text", // updated icon
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Leave Applications",
            link: route.leaveApplications,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Leave Encashment",
            link: route.leaveEncashment,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Time Sheet Entry",
            link: route.timeSheet,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Daily Attendance Entry",
            link: route.dailyAttendanceEntry,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Payroll & Finance",
        icon: "ti ti-file-text", // updated icon
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Payslip Viewer",
            link: route.payslipViewer,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Loan Requests",
            link: route.loanRequests,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "WPS File Generator",
            link: route.wpsFileGenerator,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Monthly Payroll Processing",
            link: route.monthlyPayrollProcessing,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Performance Manage...",
        icon: "ti ti-chart-line",
        showSubRoute: true,
        submenu: true,
        submenuItems: [
          {
            label: "Performance Appraisal Entry",
            link: route.appraisalEntries,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },

      {
        label: "Grievance & Disciplinary",
        link: route.callStatus,
        icon: "ti ti-briefcase",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Disciplinary Action Log",
            link: route.disciplinaryActionLog,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Grievance Submission",
            link: route.grievanceSubmission,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Training & Competency",
        icon: "ti ti-file-text", // updated icon
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Work Life Event Log",
            link: route.workLifeEventLog,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Training Session Schedule",
            link: route.trainingSessionSchedule,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Training Feedback Entry",
            link: route.trainingFeedbackEntry,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Competency Tracking",
            link: route.competencyTracking,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },

      {
        label: "Life Events & HR Ops",
        link: route.callStatus,
        icon: "ti ti-briefcase",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Probation Review",
            link: route.probationReview,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Succession Planning Entry",
            link: route.successionPlanningEntry,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Exit Interview",
            link: route.exitInterview,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Exit Clearance Checklist",
            link: route.exitClearance,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Relieving Letter Generation",
            link: route.relievingLetter,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Travel & Asset Manage...",
        link: route.callStatus,
        icon: "ti ti-briefcase",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Travel & Reimbursement Claims",
            link: route.travelReimbursementClaims,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Asset Assignment & Recovery",
            link: route.assetAssignment,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Surveys & Engagement",
        icon: "ti ti-briefcase",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Survey Response",
            link: route.surveyResponse,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Employee Suggestion",
            link: route.employeeSuggestion,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Recognition Awards",
            link: route.recognitionAwards,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },
      {
        label: "Helpdesk & Notifications",
        icon: "ti ti-briefcase",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Helpdesk Ticket",
            link: route.helpdeskTicket,
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Notifications",
            link: route.notifications,
            showSubRoute: false,
            submenu: false,
          },
        ],
      },

      // {
      //   label: "Leads",
      //   link: route.leads,
      //   subLink1: route.leadsDetail,
      //   subLink2: route.leadskanban,
      //   icon: "ti ti-chart-arcs",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Contacts",
      //   link: route.contacts,
      //   subLink1: route.contactDetail,
      //   subLink2: route.contactGrid,
      //   icon: "ti ti-user-up",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Companies",
      //   link: route.companies,
      //   subLink1: route.companyDetails,
      //   subLink2: route.companiesGrid,
      //   icon: "ti ti-building-community",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Deals",
      //   link: route.deals,
      //   subLink1: route.dealtDetail,
      //   subLink2: route.dealsKanban,
      //   icon: "ti ti-medal",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Activities",
      //   link: route.activities,
      //   subLink1: `${route.activities}/Task`,
      //   subLink2: route.activityTask,
      //   subLink3: route.activityMail,
      //   subLink4: route.activityCalls,
      //   icon: "ti ti-bounce-right",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Calls",
      //   link: route.calls,
      //   // subLink1: route.dealtDetail,
      //   // subLink2: route.dealsKanban,
      //   icon: "ti ti-phone",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Campaigns",
      //   link: route.campaigns,
      //   // subLink1: route.dealtDetail,
      //   // subLink2: route.dealsKanban,
      //   icon: "ti ti-sitemap",
      //   showSubRoute: false,
      //   submenu: false,
      // },

      // {
      //   label: "Pipeline",
      //   link: route.pipelines,
      //   subLink1: route.pipelineDetail,
      //   subLink2: route.pipelineGrid,
      //   icon: "ti ti-timeline-event-exclamation",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Documents",
      //   link: route.documents,
      //   icon: "ti ti-file-type-doc",
      //   showSubRoute: false,
      //   submenu: false,
      // },

      // {
      //   label: "Projects",
      //   link: route.projects,
      //   subLink1: route.projectDetails,
      //   icon: "ti ti-atom-2",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Quotation",
      //   link: route.quotation,
      //   icon: "ti ti-clipboard-text",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Orders",
      //   link: route.order,
      //   // subLink1: route.projectDetails,
      //   icon: "ti ti-truck-delivery",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Sales Invoice",
      //   link: route.salesInvoice,
      //   // subLink1: route.projectDetails,
      //   icon: "ti ti-file-invoice",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Purchase Order",
      //   link: route.purchaseOrder,
      //   icon: "ti ti-truck-delivery",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Purchase Invoice",
      //   link: route.purchaseInvoice,
      //   // subLink1: route.projectDetails,
      //   icon: "ti ti-file-invoice",
      //   showSubRoute: false,
      //   submenu: false,
      // },
    ],
  },
  {
    label: "HRMS SETTINGS",
    submenuOpen: true,
    submenuHdr: "Sales",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      // {
      //   label: "Vendor",
      //   link: route.vendor,
      //   icon: "ti ti-user-filled",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Products",
      //   link: route.products,
      //   icon: "ti ti-sitemap",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Price Book",
      //   link: route.priceBook,
      //   icon: "ti ti-clipboard-text",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Cases",
      //   link: route.cases,
      //   icon: "ti ti-coin",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Solutions",
      //   link: route.solutions,
      //   icon: "ti ti-notes",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Sources",
      //   link: route.sources,
      //   icon: "ti ti-artboard",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Lead Status",
      //   link: route.lostReason,
      //   icon: "ti ti-message-exclamation",
      //   showSubRoute: false,
      //   submenu: false,
      // },

      // {
      //   label: "Contact Stage",
      //   link: route.contactStage,
      //   icon: "ti ti-steam",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Industry",
      //   link: route.industries,
      //   icon: "ti ti-building-factory",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Call",
      //   link: route.callStatus,
      //   icon: "ti ti-phone-check",
      //   showSubRoute: false,
      //   submenu: true,
      //   submenuItems: [
      //     {
      //       label: "Call Status",
      //       link: route.callStatus,
      //       icon: "ti ti-phone-check",
      //       showSubRoute: true,
      //     },
      //     {
      //       label: "Call Purpose",
      //       link: route.callPurpose,
      //       showSubRoute: false,
      //     },
      //     {
      //       label: "Call Result",
      //       link: route.callResult,
      //       showSubRoute: false,
      //     },
      //     {
      //       label: "Call Types",
      //       link: route.callType,
      //       showSubRoute: false,
      //     },
      //   ]
      // },
      {
        label: "Core HR",
        link: route.callStatus,
        icon: "ti ti-user-cog",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Company",
            link: route.company,
            icon: "ti ti-phone-check",
            showSubRoute: false,
          },
          {
            label: "Branch",
            link: route.branch,
            showSubRoute: false,
          },
          {
            label: "Department",
            link: route.department,
            showSubRoute: false,
          },
          {
            label: "Designation",
            link: route.designation,
            showSubRoute: false,
          },
          {
            label: "Employee Category",
            link: route.employeeCategory,
            showSubRoute: false,
          },
          {
            label: "Employment Type",
            link: route.employmentType,
            showSubRoute: false,
          },
        ],
      },

      {
        label: "Payroll & Statutory",
        link: route.callStatus,
        icon: "ti ti-receipt-tax",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Banks",
            link: route.banks,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Pay Component",
            link: route.payComponent,
            showSubRoute: false,
          },
          {
            label: "Salary Structure",
            link: route.salaryStructure,
            showSubRoute: false,
          },
          {
            label: "Currency",
            link: route.currency,
            showSubRoute: false,
          },
          {
            label: "Statutory Rates",
            link: route.statutoryRates,
            showSubRoute: false,
          },
          {
            label: "Tax Regime",
            link: route.taxRegime,
            showSubRoute: false,
          },
          {
            label: "Loan Type",
            link: route.loneType,
            showSubRoute: false,
          },
          {
            label: "Provident Fund",
            link: route.providentFund,
            showSubRoute: false,
          },
          {
            label: "Tax Relief",
            link: route.taxRelief,
            showSubRoute: false,
          },
        ],
      },

      {
        label: "Performane",
        link: route.callStatus,
        icon: "ti ti-chart-bar",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "KPI Master",
            link: route.kpiMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Goal Category Master",
            link: route.goalCategoryMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Review Template Master",
            link: route.reviewTemplateMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Rating Scale Master",
            link: route.ratingScaleMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
        ],
      },

      {
        label: "Recruitment & Talent",
        link: route.callStatus,
        icon: "ti ti-briefcase",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Job Category Master",
            link: route.jobCategoryMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Grievance Type Master",
            link: route.grievanceTypeMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Disciplinary Penalty Master",
            link: route.disciplinaryPenaltyMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Work Life Event Type Master",
            link: route.workLifeEventTypeMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Award Type Master",
            link: route.awardTypeMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Letter Type Master",
            link: route.letterTypeMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Document Type Master",
            link: route.documentTypeMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Survey Master",
            link: route.surveyMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
          {
            label: "Asset Type Master",
            link: route.assetTypeMaster,
            icon: "ti ti-building-factory", // Icon for Country
            showSubRoute: false,
            submenu: false,
          },
        ],
      },

      {
        label: "Leave & Attandance",
        link: route.callStatus,
        icon: "ti ti-phone-check",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Shift",
            link: route.shift,
            showSubRoute: false,
          },
          {
            label: "Leave Type",
            link: route.leaveType,
            showSubRoute: false,
          },
          {
            label: "Holiday Calendar",
            link: route.holidayCalender,
            showSubRoute: false,
          },
          {
            label: "Work Schedule",
            link: route.workSchedule,
            showSubRoute: false,
          },
        ],
      },
      // {
      //   label: "Meeting Types",
      //   link: route.meetingType,
      //   icon: "ti ti-calendar-time", // Icon for Country
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Product Category",
      //   link: route.productCategory,
      //   icon: "ti ti-category", // Icon for Country
      //   showSubRoute: false,
      //   submenu: false,
      // },

      // {
      //   label: "Tax Setup",
      //   link: route.taxSetUp,
      //   icon: "ti ti-receipt-tax", // Icon for Country
      //   showSubRoute: false,
      //   submenu: false,
      // },
      {
        label: "Country",
        link: route.country,
        icon: "ti ti-globe", // Icon for Country
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "State",
        link: route.state,
        icon: "ti ti-map-pin", // Icon for State
        showSubRoute: false,
        submenu: false,
      },

      {
        label: "Modules",
        link: route.modules,
        icon: "ti ti-align-box-left-middle", // Updated icon for Currency
        showSubRoute: false,
        submenu: false,
      },
    ],
  },
  {
    label: "USER MANAGEMENT",
    submenuOpen: true,
    submenuHdr: "Sales",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      {
        label: "Manage Users",
        link: route.manageusers,
        icon: "ti ti-file-invoice",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Roles & Permission",
        link: route.rolesPermissions,
        icon: "ti ti-navigation-cog",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },

  // {
  //   label: "Settings",
  //   submenu: true,
  //   showSubRoute: false,
  //   submenuHdr: "Settings",
  //   submenuItems: [
  //     {
  //       label: "General Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-settings-cog",
  //       submenuItems: [
  //         { label: "Profile", link: route.profile },
  //         { label: "Security", link: route.security },
  //         { label: "Notifications", link: route.notification },
  //         { label: "Connected Apps", link: route.connectedApps },
  //       ],
  //     },
  //     {
  //       label: "Website Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-world-cog",
  //       submenuItems: [
  //         {
  //           label: "Company Settings",
  //           link: route.companySettings,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Localization",
  //           link: route.localization,
  //           showSubRoute: false,
  //         },
  //         { label: "Prefixes", link: route.prefixes, showSubRoute: false },
  //         { label: "Preference", link: route.preference, showSubRoute: false },
  //         { label: "Appearance", link: route.appearance, showSubRoute: false },
  //         {
  //           label: "Language",
  //           link: route.language,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "App Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-apps",
  //       submenuItems: [
  //         {
  //           label: "Invoice",
  //           link: route.invoiceSettings,
  //           showSubRoute: false,
  //         },
  //         { label: "Printer", link: route.printers, showSubRoute: false },
  //         {
  //           label: "Custom Fields",
  //           link: route.customFields,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "System Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-device-laptop",
  //       submenuItems: [
  //         { label: "Email", link: route.emailSettings, showSubRoute: false },
  //         {
  //           label: "SMS Gateways",
  //           link: route.smsGateways,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "GDPR Cookies",
  //           link: route.gdprCookies,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "Financial Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-moneybag",
  //       submenuItems: [
  //         {
  //           label: "Payment Gateway",
  //           link: route.paymentGateways,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Bank Accounts",
  //           link: route.bankAccounts,
  //           showSubRoute: false,
  //         },
  //         { label: "Tax Rates", link: route.taxRates, showSubRoute: false },
  //         {
  //           label: "Currencies",
  //           link: route.currencies,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "Other Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-flag-cog",
  //       submenuItems: [
  //         { label: "Storage", link: route.storage, showSubRoute: false },
  //         {
  //           label: "Ban IP Address",
  //           link: route.banIpAddrress,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //   ],
  // },
];
