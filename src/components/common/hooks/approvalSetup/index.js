import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovalSetupByRequestType } from "../../../../redux/ApprovalSetup";

const useApprovals = (requestType) => {
  const dispatch = useDispatch();
  const { approvalSetupByRequestType } = useSelector(
    (state) => state.approvalSetup
  );

  const approvals = approvalSetupByRequestType?.request_approval_request;
  const no_of_approvers = approvalSetupByRequestType?.no_of_approvers;

  console.log(approvals, no_of_approvers);

  React.useEffect(() => {
    dispatch(fetchApprovalSetupByRequestType(requestType));
  }, [dispatch, requestType]);

  return { approvals, no_of_approvers };
};

export default useApprovals;
