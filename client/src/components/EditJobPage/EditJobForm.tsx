import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";

import { Activity, ActivityType } from "../../types";
import { JOB_BY_ID, UPDATE_JOB, USER_JOBS } from "../../queries";
import { parseActivities } from "../../utils";
import { useNotification } from "../../hooks";

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

const EditJobForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobPostingLink, setJobPostingLink] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notes, setNotes] = useState("");

  const id = useParams().id ?? "";
  const notifyWith = useNotification();
  const navigate = useNavigate();

  const job = useQuery(JOB_BY_ID, {
    skip: !id,
    variables: { id },
    onCompleted: (data) => {
      const jobData = data.getJob;
      if (jobData) {
        setCompanyName(jobData.companyName);
        setCompanyWebsite(jobData.companyWebsite);
        setJobTitle(jobData.jobTitle);
        setJobPostingLink(jobData.jobPostingLink);
        setContactName(jobData.contactName);
        setContactTitle(jobData.contactTitle);
        setActivities(parseActivities(jobData.activities));
        setNotes(jobData.notes);
      }
    },
  });
  const [updateJob] = useMutation(UPDATE_JOB, {
    refetchQueries: [
      { query: USER_JOBS },
      { query: JOB_BY_ID, variables: { id } },
    ],
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
    },
    onCompleted: (result) => {
      const job = result.updateJob;
      if (job) {
        notifyWith(
          `Job '${job.jobTitle} at ${job.companyName}' successfully updated`,
          "success"
        );
        navigate("/");
      }
    },
  });

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const jobParams = {
      companyName,
      companyWebsite,
      jobTitle,
      jobPostingLink,
      contactName,
      contactTitle,
      activities,
      notes,
    };
    updateJob({ variables: { id, jobParams } });
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

  if (job.loading) {
    return <div>loading...</div>;
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        Company Name{" "}
        <input
          value={companyName}
          onChange={({ target }) => setCompanyName(target.value)}
          required
        />
      </div>
      <div>
        Company Website{" "}
        <input
          value={companyWebsite}
          onChange={({ target }) => setCompanyWebsite(target.value)}
        />
      </div>
      <div>
        Job Title{" "}
        <input
          value={jobTitle}
          onChange={({ target }) => setJobTitle(target.value)}
          required
        />
      </div>
      <div>
        Job Posting Link{" "}
        <input
          value={jobPostingLink}
          onChange={({ target }) => setJobPostingLink(target.value)}
        />
      </div>
      <div>
        Contact Name{" "}
        <input
          value={contactName}
          onChange={({ target }) => setContactName(target.value)}
        />
      </div>
      <div>
        Contact Title{" "}
        <input
          value={contactTitle}
          onChange={({ target }) => setContactTitle(target.value)}
        />
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
        <textarea
          value={notes}
          onChange={({ target }) => setNotes(target.value)}
          cols={60}
          rows={10}
          style={{ resize: "none" }}
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default EditJobForm;
