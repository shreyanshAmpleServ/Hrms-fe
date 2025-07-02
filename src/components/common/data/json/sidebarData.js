import { all_routes } from "../../../../routes/all_routes";
const route = all_routes;

export const SidebarData = (userType) => {
  return [
    {
      label: "HRMS",
      submenuOpen: true,
      showSubRoute: false,
      submenuHdr: "Inventory",
      submenuItems: [
        {
          label: "Dashboard",
          link: userType?.includes("admin")
            ? route.dasshboard
            : route.employeeDashboard,
          icon: "ti ti-layout-dashboard",
          showSubRoute: false,
          submenu: false,
        },
        {
          label: "Employee",
          link: route.employee,
          icon: "ti ti-users",
          showSubRoute: false,
          submenu: false,
        },
        {
          label: "Onboarding & Hiring",
          icon: "ti ti-user-plus",
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
              label: "Candidates",
              link: route.candidates,
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
          icon: "ti ti-calendar-time",
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
          icon: "ti ti-receipt-tax",
          showSubRoute: false,
          submenu: true,
          submenuItems: [
            {
              label: "Monthly Payroll Processing",
              link: route.monthlyPayroll,
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Mid Month Payroll Processing",
              link: route.midMonthPayroll,
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Over Time Payroll Processing",
              link: route.overTimePayroll,
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Component Assignment",
              link: route.basicPayroll,
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Payslip Viewer",
              link: route.payslipViewer,
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Arrear Adjustments",
              link: route.arrearAdjustments,
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
              label: "Advance Payment Entry",
              link: route.advancePaymentEntry,
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "WPS File Generator",
              link: route.wpsFileGenerator,
              showSubRoute: false,
              submenu: false,
            },
          ],
        },
        {
          label: "Performance Manage...",
          icon: "ti ti-chart-bar",
          showSubRoute: true,
          submenu: true,
          submenuItems: [
            {
              label: "Performance Appraisal Entry",
              link: route.appraisalEntries,
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "KPI Progress Entry",
              link: route.kpiProgress,
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Goal Sheet Assignment",
              link: route.goalSheetAssignment,
              showSubRoute: false,
              submenu: false,
            },
          ],
        },

        {
          label: "Grievance & Disciplinary",
          link: route.callStatus,
          icon: "ti ti-alert-triangle",
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
            {
              label: "Warning Letters",
              link: route.warningLetters,
              showSubRoute: false,
              submenu: false,
            },
          ],
        },
        {
          label: "Training & Competency",
          icon: "ti ti-school",
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
          icon: "ti ti-lifebuoy",
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
              label: "Medical Record",
              link: route.medicalRecord,
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
          icon: "ti ti-plane",
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
          icon: "ti ti-clipboard-check",
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
          icon: "ti ti-headset",
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
              label: "Notification Center",
              link: route.notificationsLog,
              showSubRoute: false,
              submenu: false,
            },
          ],
        },
      ],
    },
    {
      label: "HRMS SETTINGS",
      submenuOpen: true,
      submenuHdr: "Sales",
      submenu: false,
      showSubRoute: false,
      submenuItems: [
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
              label: "HR Letters",
              link: route.hrLetter,
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
              icon: "ti ti-building-factory",
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
            {
              label: "Tax Slab",
              link: route.taxSlab,
              showSubRoute: false,
            },
            {
              label: "Cost Center",
              link: route.CostCenter,
              showSubRoute: false,
            },
            {
              label: "Projects",
              link: route.projects,
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
              icon: "ti ti-building-factory",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Goal Category Master",
              link: route.goalCategoryMaster,
              icon: "ti ti-building-factory",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Review Template Master",
              link: route.reviewTemplateMaster,
              icon: "ti ti-building-factory",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Rating Scale Master",
              link: route.ratingScaleMaster,
              icon: "ti ti-building-factory",
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
              icon: "ti ti-building-factory",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Grievance Type Master",
              link: route.grievanceTypeMaster,
              icon: "ti ti-building-factory",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Disciplinary Penalty Master",
              link: route.disciplinaryPenaltyMaster,
              icon: "ti ti-building-factory",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Work Life Event Type Master",
              link: route.workLifeEventTypeMaster,
              icon: "ti ti-building-factory",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Award Type Master",
              link: route.awardTypeMaster,
              icon: "ti ti-building-factory",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Letter Type Master",
              link: route.letterTypeMaster,
              icon: "ti ti-building-factory",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Document Type Master",
              link: route.documentTypeMaster,
              icon: "ti ti-building-factory",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Survey Master",
              link: route.surveyMaster,
              icon: "ti ti-building-factory",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Asset Type Master",
              link: route.assetTypeMaster,
              icon: "ti ti-building-factory",
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
              label: "Leave Balance",
              link: route.leaveBalance,
              showSubRoute: false,
              submenu: false,
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
        {
          label: "Country",
          link: route.country,
          icon: "ti ti-globe",
          showSubRoute: false,
          submenu: false,
        },
        {
          label: "State",
          link: route.state,
          icon: "ti ti-map-pin",
          showSubRoute: false,
          submenu: false,
        },

        {
          label: "Modules",
          link: route.modules,
          icon: "ti ti-align-box-left-middle",
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
  ];
};
