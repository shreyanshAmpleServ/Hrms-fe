import { CalendarOutlined } from "@ant-design/icons";
import { Avatar, Button, Rate, Spin, Steps } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  createInterviewStageRemark,
  fetchInterviewStageRemark,
} from "../../../../redux/InterviewStageRemark";
import { fetchInterviewStages } from "../../../../redux/InterviewStages";
import { fetchEmployee } from "../../../../redux/Employee";

const InterviewStages = ({ candidateDetail }) => {
  const [current, setCurrent] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();

  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );
  const { interviewStages } = useSelector(
    (state) => state.interviewStages || {}
  );
  const { interviewStageRemark, loading: interviewStageRemarkLoading } =
    useSelector((state) => state.interviewStageRemark || {});

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      interview_date: moment().toISOString(),
      remarks: "",
      rating: 0,
    },
  });

  const employeeOptions = useMemo(
    () =>
      employee?.data?.map((i) => ({
        label: `${i.employee_code} - ${i.full_name}`,
        value: i.id,
      })) || [],
    [employee?.data]
  );

  const stages = useMemo(
    () =>
      interviewStages?.data?.map((i) => ({
        id: i.id,
        title: i.stage_name || "",
        rating: i.rating || 0,
        description: i.description || "Pending",
      })) || [],
    [interviewStages?.data]
  );

  const currentStageIndex = useMemo(
    () =>
      interviewStages?.data?.findIndex(
        (i) => i.id === candidateDetail?.interview_stage
      ) ?? -1,
    [interviewStages?.data, candidateDetail?.interview_stage]
  );

  const currentStage = stages[current];

  useEffect(() => {
    dispatch(fetchInterviewStages());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEmployee({ search: searchValue }));
  }, [dispatch, searchValue]);

  useEffect(() => {
    if (candidateDetail?.id) {
      dispatch(fetchInterviewStageRemark({ candidate_id: candidateDetail.id }));
    }
  }, [dispatch, candidateDetail?.id]);

  useEffect(() => {
    if (interviewStageRemark?.data?.length === 0) {
      setCurrent(currentStageIndex);
    } else {
      setCurrent(currentStageIndex + 1);
    }
  }, [currentStageIndex, interviewStageRemark?.data?.length]);

  const handleSubmitRemark = useCallback(
    (data) => {
      dispatch(
        createInterviewStageRemark({
          candidate_id: candidateDetail.id,
          interview_stage_id: currentStage.id,
          rating: data.rating || 0,
          stage_name: currentStage.title,
          interview_date: data.interview_date || moment().toISOString(),
          remark: data.remarks || "",
          stage_id: currentStage.id,
          employee_id: data.employee_id || null,
          is_completed: current === stages.length - 1,
        })
      );
      setCurrent((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
      setModalVisible(false);
      reset();
    },
    [dispatch, candidateDetail?.id, currentStage, stages.length]
  );

  const handleNext = useCallback(() => {
    setModalVisible(true);
    reset();
  }, [reset]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderStageCard = useCallback(
    (stage, index) => (
      <div key={index} className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-4" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="d-flex align-items-start justify-content-between mb-3">
            <h6 className="card-title fw-semibold text-dark mb-0">
              {stage?.interview_stage_stage_id?.stage_name}
            </h6>
            <div className="d-flex align-items-center text-muted">
              <CalendarOutlined className="me-2" />
              <small>
                {stage?.createdate
                  ? moment(stage.createdate).format("DD-MM-YYYY")
                  : "N/A"}
              </small>
            </div>
          </div>

          <div className="mb-3 d-flex align-items-center">
            <span className="fw-medium text-dark me-2">Rating:</span>
            <Rate disabled value={stage.rating} allowHalf />
          </div>

          <div className="d-flex justify-content-between">
            <div>
              <span className="fw-medium text-dark">Feedback Remarks:</span>
              <p className="text-muted mt-1 mb-0">{stage.remark}</p>
            </div>
            <div className="d-flex align-items-end">
              <p className="text-muted mt-1 mb-0">
                <Avatar
                  src={stage?.interview_stage_employee_id?.profile_picture}
                  className="me-2 bg-primary"
                >
                  {stage?.interview_stage_employee_id?.full_name
                    ?.charAt(0)
                    ?.toUpperCase() || "M"}
                </Avatar>
                {stage?.interview_stage_employee_id?.full_name ||
                  "Mani Kant Sharma"}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    []
  );

  return (
    <div className="mb-3 card">
      <div className="card-body p-5">
        <div className="d-flex p-3 align-items-center justify-content-between flex-wrap row-gap-2 mb-5">
          <h4 className="mb-2">Interview Stages</h4>
          {current !== 5 && (
            <Button type="primary" onClick={handleNext}>
              Next Stage
            </Button>
          )}
        </div>

        <Steps
          progressDot
          current={current}
          items={stages}
          status={current >= stages.length - 1 ? "finish" : "process"}
        />

        <div className="mt-3">
          {interviewStageRemarkLoading ? (
            <div className="d-flex justify-content-center">
              <Spin />
            </div>
          ) : (
            interviewStageRemark?.data?.map(renderStageCard)
          )}
        </div>

        {modalVisible && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog" role="document">
              <form
                onSubmit={handleSubmit(handleSubmitRemark)}
                className="modal-content"
                autoComplete="off"
              >
                <div className="modal-header">
                  <h5 className="modal-title">
                    {currentStage?.title || "New Stage"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  />
                </div>
                <div
                  className="modal-body"
                  style={{ height: "70vh", overflowY: "auto" }}
                >
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="col-form-label">
                        Interviewer <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="employee_id"
                        control={control}
                        rules={{ required: "Interviewer is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={employeeOptions}
                            placeholder="Select Interviewer"
                            isLoading={employeeLoading}
                            value={
                              employeeOptions.find(
                                (emp) => emp.value === field.value
                              ) || null
                            }
                            onInputChange={setSearchValue}
                            onChange={(option) => field.onChange(option?.value)}
                            classNamePrefix="react-select"
                          />
                        )}
                      />
                      {errors.employee_id && (
                        <small className="text-danger">
                          {errors.employee_id.message}
                        </small>
                      )}
                    </div>
                    <div className="col-md-12">
                      <label className="col-form-label">
                        Date<span className="text-danger"> *</span>
                      </label>
                      <div className="mb-3 icon-form">
                        <span className="form-icon">
                          <i className="ti ti-calendar-check" />
                        </span>
                        <Controller
                          name="interview_date"
                          control={control}
                          rules={{ required: "Date is required!" }}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              className="form-control d-flex"
                              value={
                                field.value
                                  ? moment(field.value).format("DD-MM-YYYY")
                                  : null
                              }
                              onChange={field.onChange}
                              dateFormat="DD-MM-YYYY"
                            />
                          )}
                        />
                      </div>
                      {errors.interview_date && (
                        <small className="text-danger">
                          {errors.interview_date.message}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <label className="col-form-label">
                        Feedback Rating<span className="text-danger"> *</span>
                      </label>
                      <Controller
                        control={control}
                        name="rating"
                        render={({ field }) => (
                          <Rate
                            {...field}
                            className="form-control"
                            count={5}
                            allowHalf
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Remarks</label>
                        <Controller
                          control={control}
                          name="remarks"
                          render={({ field }) => (
                            <textarea
                              className="form-control"
                              {...field}
                              rows={3}
                              placeholder="Enter stage remarks"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save & Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewStages;
