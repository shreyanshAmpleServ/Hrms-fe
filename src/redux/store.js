// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import activitiesReducer from "./Activities";
import AdvancePaymentReducer from "./AdvancePayment";
import applicationSourceReducer from "./ApplicationSource";
import AppointmentLetters from "./AppointmentLetters";
import appraisalEntriesReducer from "./AppraisalsEntries";
import ArrearAdjustmentsReducer from "./ArrearAdjustments";
import assetAssignmentReducer from "./AssetAssignment";
import assetTypeMasterReduer from "./assetType";
import attachmentsReducer from "./attachment";
import AttendaceSummaryByReducer from "./AttendanceByEmployee";
import authReducer from "./auth/authSlice";
import awardTypeMasterReduer from "./awardType";
import bankReducer from "./bank";
import basicSalaryReducer from "./BasicSalary";
import branchReducer from "./branch";
import callpurpose from "./callPurpose";
import callresult from "./callResult";
import calls from "./calls";
import callstatus from "./callStatus";
import calltype from "./callType";
import campaignsReducer from "./campaign";
import candidateReducer from "./Candidate";
import casesReducer from "./cases";
import commonReducer from "./common/commonSlice";
import companyReducer from "./companies";
import companynewReducer from "./company";
import competencyTrackingReducer from "./CompetencyTracking";
import contactStages from "./contact-stages";
import contactsReducer from "./contacts/contactSlice";
import costCenterReducer from "./costCenter";
import countriesReducer from "./country";
import currencyReducer from "./currency";
import DailyAttendanceReducer from "./dailyAttendance";
import dashboardReducer from "./dashboard";
import attendanceOverviewReducer from "./Dashboards/AttendanceOverview";
import DashboardsCountReducer from "./Dashboards/DashboardsCount";
import EmployeeByDepartmentReducer from "./Dashboards/EmployeeByDepartment";
import EmployeeByDesignationsReducer from "./Dashboards/EmployeeByDesignations";
import EmployeeByStatusReducer from "./Dashboards/EmployeeByStatus";
import upcomingAnniversariesReducer from "./Dashboards/UpcomingAnniversaries";
import upcomingBirthdaysReducer from "./Dashboards/UpcomingBirthdays";
import dealReducer from "./deals";
import departmentReducer from "./department";
import designationReducer from "./designation";
import DisciplinryActionLogReducer from "./disciplinaryActionLog";
import disciplinaryPenaltyReduer from "./disciplinaryPenalty";
import documentTypeMasterReduer from "./documentType";
import employeeReducer from "./Employee";
import employee_categoryReducer from "./employee-category";
import employeeTypeReducer from "./employee-type";
import EmployeeAttachmentReducer from "./EmployeeAttachment";
import employeeDashboardReducer from "./employeeDashboard";
import employeeSuggestionReducer from "./EmployeeSuggestion";
import EmploymentContracts from "./EmployementContracts";
import exitClearanceReducer from "./ExitClearance";
import exitInterviewReducer from "./ExitInterview";
import goalCategoryMasterReducer from "./goalCategoryMaster";
import GoalSheetReducer from "./GoalSheetAssignment";
import GrievanceSubmissionReducer from "./grievanceSubmission";
import grievanceTypeReduer from "./grievanceTypeMaster";
import helpdeskTicketReducer from "./HelpdeskTicket";
import holidayCalenderReducer from "./HolidayCalender";
import hrLettersReducer from "./HRLetters";
import industry from "./industry";
import interviewStageRemarkReducer from "./InterviewStageRemark";
import interviewStagesReducer from "./InterviewStages";
import jobCategoryMasterReduer from "./jobCategoryMaster";
import JobPostingReducer from "./JobPosting";
import KpiMasterReducer from "./kpiMaster";
import KPIProgressReducer from "./KPIProgress";
import leadsReducer from "./leads";
import LeaveApplicationsReducer from "./leaveApplication";
import leaveBalanceReducer from "./leaveBalance";
import LeaveEncashmentReducer from "./LeaveEncashment";
import leaveTypeReducer from "./LeaveType";
import letterTypeMasterReduer from "./letterType";
import LoanEmiReducer from "./LoanEmi";
import LoanMasterReducer from "./LoanMaster";
import loanRequestsReducer from "./loanRequests";
import LoneTypeReducer from "./loneType";
import lostReasonReducer from "./lostReasons";
import userReducer from "./manage-user";
import mappedStatesReducer from "./mappedState";
import medicalRecordReducer from "./MedicalRecord";
import MeetingTypeReducer from "./meetingType";
import midMonthPayrollReducer from "./MidMonthPayroll";
import modulesReducer from "./Modules";
import MonthlyPayrollReducer from "./MonthlyPayroll";
import NotificationsLogReducer from "./Notifications";
import offerLettersReducer from "./offerLetters";
import orderReducer from "./order";
import overtimeMasterReducer from "./overTimeMaster";
import overtimePayrollReducer from "./OverTimePayroll";
import payComponentReducer from "./pay-component";
import PayslipReducer from "./payslipViewer";
import permissionsReducer from "./permissions";
import pipelineReducer from "./pipelines";
import priceBookReducer from "./priceBook";
import probationReviewReducer from "./ProbationReview";
import productCategoryReducer from "./productCategory";
import productsReducer from "./products";
import projects from "./projects";
import providentFundReducer from "./providentFund";
import purchaseInvoiceReducer from "./purchaseInvoice";
import purchaseOrderReducer from "./purchaseOrder";
import quotationReducer from "./quotation";
import ratingScaleMasterReduer from "./ratingScaleMaster";
import RecognitionAwardReducer from "./RecognitionAwards";
import relievingLetterReducer from "./RelievingLetter";
import resumeUploadReducer from "./resumeUpload";
import reviewTemplateMasterReducer from "./reviewTemplateMaster";
import roleReducer from "./roles";
import salaryStructureReducer from "./salary-structure";
import salesInvoiceReducer from "./salesInvoice";
import settingsReducer from "./Settings";
import shiftReducer from "./Shift";
import solutionsReducer from "./solutions";
import sourceReducer from "./source";
import statesReducer from "./state";
import statutoryRatesReducer from "./statutoryRate";
import successionPlanningEntryReducer from "./successionPlanningEntry";
import surveyMasterReduer from "./surveyMaster";
import surveyResponseReducer from "./SurveyResponse";
import taxRegimeReducer from "./taxRegime";
import taxReliefReducer from "./taxRelief";
import taxSetupReducer from "./taxSetUp";
import taxSlabReducer from "./taxSlab";
import TimeSheetReducer from "./TimeSheet";
import TrainingFeedbackReducer from "./trainingFeedbackEntry";
import trainingSessionReducer from "./trainingSessionSchedule";
import TravelReimbursementReducer from "./TravelReimbursement";
import vendorReducer from "./vendor";
import WarningLettersReducer from "./WarningLetters";
import workLifeEventLogReducer from "./WorkLifeEventLog";
import workLifeEventReduer from "./workLifeEventTypeMaster";
import WorkScheduleTempReducer from "./WorkScheduleTemp";
import WpsFilesReducer from "./WPSFileGenerator";
import approvalSetupReducer from "./ApprovalSetup";
import requestReducer from "./Request";
import approvalReportsReducer from "./ApprovalReports";

const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    common: commonReducer,
    contacts: contactsReducer,
    deals: dealReducer,
    companies: companyReducer,
    pipelines: pipelineReducer,
    sources: sourceReducer,
    lostReasons: lostReasonReducer,
    contactStages: contactStages,
    industries: industry,
    callStatuses: callstatus,
    calls: calls,
    callPurposes: callpurpose,
    callResults: callresult,
    callTypes: calltype,
    projects: projects,
    users: userReducer,
    roles: roleReducer,
    leads: leadsReducer,
    states: statesReducer,
    mappedStates: mappedStatesReducer,
    countries: countriesReducer,
    currencies: currencyReducer,
    activities: activitiesReducer,
    vendor: vendorReducer,
    meetingTypes: MeetingTypeReducer,
    modules: modulesReducer,
    permissions: permissionsReducer,
    attachments: attachmentsReducer,
    productCategories: productCategoryReducer,
    products: productsReducer,
    taxs: taxSetupReducer,
    orders: orderReducer,
    quotations: quotationReducer,
    purchaseOrders: purchaseOrderReducer,
    salesInvoices: salesInvoiceReducer,
    purchaseInvoices: purchaseInvoiceReducer,
    priceBooks: priceBookReducer,
    cases: casesReducer,
    solutions: solutionsReducer,
    campaigns: campaignsReducer,
    bank: bankReducer,
    company: companynewReducer,
    branch: branchReducer,
    department: departmentReducer,
    designation: designationReducer,
    employmentType: employeeTypeReducer,
    employee_category: employee_categoryReducer,
    payComponent: payComponentReducer,
    salaryStructure: salaryStructureReducer,
    statutoryRates: statutoryRatesReducer,
    taxRelief: taxReliefReducer,
    providentFund: providentFundReducer,
    taxRegime: taxRegimeReducer,
    KpiMaster: KpiMasterReducer,
    goalCategoryMaster: goalCategoryMasterReducer,
    reviewTemplateMaster: reviewTemplateMasterReducer,
    ratingScaleMaster: ratingScaleMasterReduer,
    jobCategoryMaster: jobCategoryMasterReduer,
    grievanceType: grievanceTypeReduer,
    disciplinary_penalty: disciplinaryPenaltyReduer,
    workLifeEvent: workLifeEventReduer,
    awardTypeMaster: awardTypeMasterReduer,
    letterTypeMaster: letterTypeMasterReduer,
    documentTypeMaster: documentTypeMasterReduer,
    surveyMaster: surveyMasterReduer,
    assetTypeMaster: assetTypeMasterReduer,
    employee: employeeReducer,
    shift: shiftReducer,
    leaveType: leaveTypeReducer,
    holidayCalender: holidayCalenderReducer,
    WorkScheduleTemp: WorkScheduleTempReducer,
    JobPosting: JobPostingReducer,
    appointment: AppointmentLetters,
    contracts: EmploymentContracts,
    leaveEncashment: LeaveEncashmentReducer,
    timeSheet: TimeSheetReducer,
    offer_letter: offerLettersReducer,
    resume_upload: resumeUploadReducer,
    leave_Applications: LeaveApplicationsReducer,
    payslip: PayslipReducer,
    loan_requests: loanRequestsReducer,
    lone_type: LoneTypeReducer,
    appraisalEntries: appraisalEntriesReducer,
    loan_type: LoneTypeReducer,
    disciplinryAction: DisciplinryActionLogReducer,
    grievanceSubmission: GrievanceSubmissionReducer,
    workLifeEventLog: workLifeEventLogReducer,
    competencyTracking: competencyTrackingReducer,
    wpsFiles: WpsFilesReducer,
    trainingSession: trainingSessionReducer,
    trainingFeedback: TrainingFeedbackReducer,
    probationReview: probationReviewReducer,
    successionPlanning: successionPlanningEntryReducer,
    exitInterview: exitInterviewReducer,
    travelReimbursement: TravelReimbursementReducer,
    recognitionAwards: RecognitionAwardReducer,
    exitClearance: exitClearanceReducer,
    relievingLetter: relievingLetterReducer,
    assetAssignment: assetAssignmentReducer,
    surveyResponse: surveyResponseReducer,
    employeeSuggestion: employeeSuggestionReducer,
    helpdeskTicket: helpdeskTicketReducer,
    Notifications: NotificationsLogReducer,
    employeeAttachment: EmployeeAttachmentReducer,
    advancePayment: AdvancePaymentReducer,
    monthlyPayroll: MonthlyPayrollReducer,
    arrearAdjustments: ArrearAdjustmentsReducer,
    dailyAttendance: DailyAttendanceReducer,
    goalSheet: GoalSheetReducer,
    kpiProgress: KPIProgressReducer,
    warningLetters: WarningLettersReducer,
    AttendaceSummarys: AttendaceSummaryByReducer,
    dashboardsCount: DashboardsCountReducer,
    employeeByDepartment: EmployeeByDepartmentReducer,
    employeeByDesignations: EmployeeByDesignationsReducer,
    employeeByStatus: EmployeeByStatusReducer,
    upcomingBirthdays: upcomingBirthdaysReducer,
    upcomingAnniversaries: upcomingAnniversariesReducer,
    attendanceOverview: attendanceOverviewReducer,
    leaveBalance: leaveBalanceReducer,
    candidate: candidateReducer,
    medicalRecord: medicalRecordReducer,
    applicationSource: applicationSourceReducer,
    interviewStages: interviewStagesReducer,
    interviewStageRemark: interviewStageRemarkReducer,
    hrLetters: hrLettersReducer,
    taxSlab: taxSlabReducer,
    costCenter: costCenterReducer,
    basicSalary: basicSalaryReducer,
    midMonthPayroll: midMonthPayrollReducer,
    overtimePayroll: overtimePayrollReducer,
    employeeDashboard: employeeDashboardReducer,
    loanEmi: LoanEmiReducer,
    loanMaster: LoanMasterReducer,
    overtimeMaster: overtimeMasterReducer,
    settings: settingsReducer,
    request: requestReducer,
    approvalSetup: approvalSetupReducer,
    approvalReports: approvalReportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
