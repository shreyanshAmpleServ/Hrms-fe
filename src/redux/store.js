// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import commonReducer from "./common/commonSlice";
import contactsReducer from "./contacts/contactSlice";
import dealReducer from "./deals";
import companyReducer from "./companies";
import pipelineReducer from "./pipelines";
import sourceReducer from "./source";
import lostReasonReducer from "./lostReasons";
import contactStages from "./contact-stages";
import industry from "./industry";
import calls from "./calls";
import callstatus from "./callStatus";
import callpurpose from "./callPurpose";
import callresult from "./callResult";
import calltype from "./callType";
import projects from "./projects";
import userReducer from "./manage-user";
import roleReducer from "./roles";
import leadsReducer from "./leads";
import statesReducer from "./state";
import countriesReducer from "./country";
import currencyReducer from "./currency";
import activitiesReducer from "./Activities";
import dashboardReducer from "./dashboard";
import vendorReducer from "./vendor";
import MeetingTypeReducer from "./meetingType";
import mappedStatesReducer from "./mappedState";
import modulesReducer from "./Modules";
import permissionsReducer from "./permissions";
import attachmentsReducer from "./attachment";
import productCategoryReducer from "./productCategory";
import productsReducer from "./products";
import taxSetupReducer from "./taxSetUp";
import orderReducer from "./order";
import quotationReducer from "./quotation";
import purchaseOrderReducer from "./purchaseOrder";
import salesInvoiceReducer from "./salesInvoice";
import purchaseInvoiceReducer from "./purchaseInvoice";
import priceBookReducer from "./priceBook";
import casesReducer from "./cases";
import solutionsReducer from "./solutions";
import campaignsReducer from "./campaign";
import bankReducer from "./bank";
import companynewReducer from "./company";
import branchReducer from "./branch";
import departmentReducer from "./department";
import designationReducer from "./designation";
import employeeTypeReducer from "./employee-type";
import employee_categoryReducer from "./employee-category";
import payComponentReducer from "./pay-component";
import salaryStructureReducer from "./salary-structure";
import statutoryRatesReducer from "./statutoryRate";
import taxReliefReducer from "./taxRelief";
import providentFundReducer from "./providentFund";
import taxRegimeReducer from "./taxRegime";
import KpiMasterReducer from "./kpiMaster";
import goalCategoryMasterReducer from "./goalCategoryMaster";
import reviewTemplateMasterReducer from "./reviewTemplateMaster";
import ratingScaleMasterReduer from "./ratingScaleMaster";
import jobCategoryMasterReduer from "./jobCategoryMaster";
import grievanceTypeReduer from "./grievanceTypeMaster";
import disciplinaryPenaltyReduer from "./disciplinaryPenalty";
import workLifeEventReduer from "./workLifeEventTypeMaster";
import awardTypeMasterReduer from "./awardType";
import letterTypeMasterReduer from "./letterType";
import documentTypeMasterReduer from "./documentType";
import surveyMasterReduer from "./surveyMaster";
import assetTypeMasterReduer from "./assetType";
import employeeReducer from "./Employee";
import shiftReducer from "./Shift";
import leaveTypeReducer from "./LeaveType";
import holidayCalenderReducer from "./HolidayCalender";
import WorkScheduleTempReducer from "./WorkScheduleTemp";
import JobPostingReducer from "./JobPosting";
import AppointmentLetters from "./AppointmentLetters";
import EmploymentContracts from "./EmployementContracts";
import LeaveEncashmentReducer from "./LeaveEncashment";
import TimeSheetReducer from "./TimeSheet";
import offerLettersReducer from "./offerLetters";
import resumeUploadReducer from "./resumeUpload";
import LeaveApplicationsReducer from "./leaveApplication";
import PayslipReducer from "./payslipViewer";
import loanRequestsReducer from "./loanRequests";
import LoneTypeReducer from "./loneType";
import appraisalEntriesReducer from "./AppraisalsEntries";
import DisciplinryActionLogReducer from "./disciplinaryActionLog";
import GrievanceSubmissionReducer from "./grievanceSubmission";
import workLifeEventLogReducer from "./WorkLifeEventLog";
import competencyTrackingReducer from "./CompetencyTracking";
import MonthlyPayrollProcessingReducer from "./monthlyPayrollProcessing";
import WpsFilesReducer from "./WPSFileGenerator";
import trainingSessionReducer from "./trainingSessionSchedule";
import TrainingFeedbackReducer from "./trainingFeedbackEntry";
import probationReviewReducer from "./ProbationReview";
import successionPlanningEntryReducer from "./successionPlanningEntry";
import exitInterviewReducer from "./ExitInterview";
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
    job_posting: JobPostingReducer,
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
    monthlyPayroll: MonthlyPayrollProcessingReducer,
    wpsFiles: WpsFilesReducer,
    trainingSession: trainingSessionReducer,
    trainingFeedback: TrainingFeedbackReducer,
    probationReview: probationReviewReducer,
    successionPlanning: successionPlanningEntryReducer,
    exitInterview: exitInterviewReducer,
  },
});

export default store;
