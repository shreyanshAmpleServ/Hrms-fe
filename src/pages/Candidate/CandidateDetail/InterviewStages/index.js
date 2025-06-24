import { Steps } from "antd";
import moment from "moment";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";

const initialStages = [
  {
    title: "Screening",
    description: "Pending Screening",
  },
  {
    title: "Technical Interview",
    description: "Pending Technical Interview",
  },
  {
    title: "Managerial Round",
    description: "Pending Managerial Round",
  },
  {
    title: "HR Discussion",
    description: "Pending HR Discussion",
  },
  {
    title: "Offer",
    description: "Pending Offer",
  },
];

const InterviewStages = () => {
  const [current, setCurrent] = useState(0);

  const [stages, setStages] = useState(initialStages);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: moment().toISOString(),
      remarks: "",
    },
  });

  const handleNext = () => {
    setModalVisible(true);
  };

  const handleSave = () => {
    const newStages = [...stages];
    newStages[current].description = `${getValues("remarks")} on ${moment(
      getValues("date")
    ).format("DD-MMM-YYYY")}.`;
    setStages(newStages);
    setCurrent((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    setModalVisible(false);
    reset();
  };

  return (
    <div className="mb-3 card">
      <div className="card-body p-5">
        <div className="d-flex p-2 align-items-center justify-content-between flex-wrap row-gap-2 mb-3">
          <h4 className="mb-2">Interview Stages</h4>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={current >= stages.length}
          >
            Next Stage
          </button>
        </div>

        <Steps progressDot current={current} items={stages} />

        <div
          className={`modal fade ${modalVisible ? "show d-block" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <form
              onSubmit={handleSubmit(handleSave)}
              className="modal-content"
              autoComplete="off"
            >
              <div className="modal-header">
                <h5 className="modal-title">
                  Update Stage: {stages[current]?.title || "New Stage"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <label className="col-form-label">
                      Date<span className="text-danger"> *</span>
                    </label>
                    <div className="mb-3 icon-form">
                      <span className="form-icon">
                        <i className="ti ti-calendar-check" />
                      </span>
                      <Controller
                        name="date"
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
                    {errors.date && (
                      <small className="text-danger">
                        {errors.date.message}
                      </small>
                    )}
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
                  onClick={() => setModalVisible(false)}
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
      </div>
    </div>
  );
};

export default InterviewStages;
