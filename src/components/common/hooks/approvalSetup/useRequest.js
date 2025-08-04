import React from "react";
import { useDispatch, useSelector } from "react-redux";
import logger from "utils/logger";
import { fetchRequest } from "../../../../redux/Request";

const useRequest = (requestType, referenceId) => {
  const dispatch = useDispatch();
  const { request } = useSelector((state) => state.request);

  logger.log(request);

  React.useEffect(() => {
    if (requestType && referenceId) {
      dispatch(fetchRequest({ requestType, referenceId }));
    }
  }, [requestType, referenceId]);

  return { request };
};

export default useRequest;
