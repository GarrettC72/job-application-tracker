import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useField, useNotification } from "../../hooks";
import { ActivityType } from "../../types";
import { Activity } from "../../types";
import { CREATE_JOB, USER_JOBS } from "../../queries";

interface ActivityTypeOption {
  value: ActivityType;
  label: string;
}

const activityTypeOptions: ActivityTypeOption[] = Object.values(
  ActivityType
).map((v) => ({
  value: v,
  label: v.toString(),
}));

const AddJobForm = () => {
  const { reset: resetCompanyName, ...companyName } = useField("text");
  const { reset: resetCompanyWebsite, ...companyWebsite } = useField("text");
  const { reset: resetJobTitle, ...jobTitle } = useField("text");
  const { reset: resetJobPostingLink, ...jobPostingLink } = useField("text");
  const { reset: resetContactName, ...contactName } = useField("text");
  const { reset: resetContactTitle, ...contactTitle } = useField("text");
  const [activities, setActivities] = useState<Activity[]>([]);
  const { reset: resetNotes, ...notes } = useField("text");

  const notifyWith = useNotification();
  const navigate = useNavigate();

  const [createJob] = useMutation(CREATE_JOB, {
    refetchQueries: [{ query: USER_JOBS }],
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
    },
    onCompleted: (result) => {
      const job = result.addJob;
      if (job) {
        notifyWith(
          `New job '${job.jobTitle} at ${job.companyName}' successfully saved`,
          "success"
        );
        resetCompanyName();
        resetCompanyWebsite();
        resetJobTitle();
        resetJobPostingLink();
        resetContactName();
        resetContactTitle();
        resetNotes();
        navigate("/");
      }
    },
  });

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const jobParams = {
      companyName: companyName.value,
      companyWebsite: companyWebsite.value,
      jobTitle: jobTitle.value,
      jobPostingLink: jobPostingLink.value,
      contactName: contactName.value,
      contactTitle: contactTitle.value,
      activities,
      notes: notes.value,
    };
    createJob({ variables: { jobParams } });
  };

  const addAcitivity = () => {
    const newActivity: Activity = {
      activityType: ActivityType.Applied,
      date: "",
      description: "",
    };
    setActivities(activities.concat(newActivity));
  };

  const editActivity = (name: string, value: string, index: number) => {
    const updatedActivities = activities.map((activity, i) =>
      i === index ? { ...activity, [name]: value } : activity
    );
    setActivities(updatedActivities);
  };

  const removeActivity = (index: number) => {
    const activitiesToUpdate = activities.slice();
    activitiesToUpdate.splice(index, 1);
    setActivities(activitiesToUpdate);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        Company Name <input {...companyName} required />
      </div>
      <div>
        Company Website <input {...companyWebsite} />
      </div>
      <div>
        Job Title <input {...jobTitle} required />
      </div>
      <div>
        Job Posting Link <input {...jobPostingLink} />
      </div>
      <div>
        Contact Name <input {...contactName} />
      </div>
      <div>
        Contact Title <input {...contactTitle} />
      </div>
      <button type="button" onClick={addAcitivity}>
        Add New Activity
      </button>
      {activities.map((activity, index) => (
        <div style={{ border: "solid" }} key={index}>
          <div>
            Activity{" "}
            <select
              name="activityType"
              value={activity.activityType}
              onChange={({ target }) =>
                editActivity(target.name, target.value, index)
              }
            >
              {activityTypeOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            Date{" "}
            <input
              name="date"
              type="date"
              value={activity.date}
              onChange={({ target }) =>
                editActivity(target.name, target.value, index)
              }
              required
            />
          </div>
          <div>
            <span style={{ verticalAlign: "top" }}>Description </span>
            <textarea
              name="description"
              value={activity.description}
              onChange={({ target }) =>
                editActivity(target.name, target.value, index)
              }
              cols={30}
              rows={5}
              style={{ resize: "none" }}
            />
          </div>
          <button type="button" onClick={() => removeActivity(index)}>
            Remove
          </button>
        </div>
      ))}
      <div>
        <span style={{ verticalAlign: "top" }}>Notes </span>
        <textarea {...notes} cols={60} rows={10} style={{ resize: "none" }} />
      </div>
      <button onClick={() => navigate("/")}>Cancel</button>
      <button type="submit">Save</button>
    </form>
  );
};

export default AddJobForm;
