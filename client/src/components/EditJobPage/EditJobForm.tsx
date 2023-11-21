import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  Input,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { Activity, ActivityType } from "../../types";
import { JOB_BY_ID, USER_JOBS } from "../../graphql/queries";
import { UPDATE_JOB } from "../../graphql/mutations";
import { JOB_DETAILS } from "../../graphql/fragments";
import { parseActivities } from "../../utils";
import { useNotification } from "../../hooks";
import { getFragmentData } from "../../__generated__/fragment-masking";

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

  const jobId = useParams().id ?? "";
  const notifyWith = useNotification();
  const navigate = useNavigate();

  const job = useQuery(JOB_BY_ID, {
    skip: !jobId,
    variables: { id: jobId },
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
    update: (cache, result) => {
      const updatedJob = result.data ? result.data.updateJob : null;
      if (updatedJob) {
        const {
          __typename,
          companyName,
          companyWebsite,
          jobTitle,
          jobPostingLink,
          contactName,
          contactTitle,
          activities,
          notes,
          latestActivity,
          dateCreated,
          lastModified,
          id,
        } = updatedJob;
        const simpleJobUpdate = {
          __typename,
          companyName,
          jobTitle,
          latestActivity,
          dateCreated,
          lastModified,
          id,
        };
        const detailedJobUpdate = {
          __typename,
          companyName,
          companyWebsite,
          jobTitle,
          jobPostingLink,
          contactName,
          contactTitle,
          activities,
          notes,
          id,
        };
        cache.updateQuery({ query: USER_JOBS }, (data) => {
          if (data) {
            return {
              allJobs: data.allJobs.map((job) => {
                const unmaskedJob = getFragmentData(JOB_DETAILS, job);
                return unmaskedJob.id !== id ? unmaskedJob : simpleJobUpdate;
              }),
            };
          }
        });
        cache.updateQuery({ query: JOB_BY_ID, variables: { id } }, (data) => {
          if (data) {
            return {
              getJob: detailedJobUpdate,
            };
          }
        });
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
    updateJob({ variables: { id: jobId, jobParams } });
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
    return (
      <Typography variant="body1" align="center">
        Loading...
      </Typography>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        "& .JobForm-textarea": { width: "50ch" },
        "& .MuiButton-root": { m: 1 },
      }}
    >
      <div>
        <TextField
          required
          label="Company Name"
          value={companyName}
          onChange={({ target }) => setCompanyName(target.value)}
          error={companyName === ""}
        />
        <TextField
          label="Company Website"
          value={companyWebsite}
          onChange={({ target }) => setCompanyWebsite(target.value)}
        />
      </div>
      <div>
        <TextField
          required
          label="Job Title"
          value={jobTitle}
          onChange={({ target }) => setJobTitle(target.value)}
          error={jobTitle === ""}
        />
        <TextField
          label="Job Posting Link"
          value={jobPostingLink}
          onChange={({ target }) => setJobPostingLink(target.value)}
        />
      </div>
      <div>
        <TextField
          label="Contact Name"
          value={contactName}
          onChange={({ target }) => setContactName(target.value)}
        />
        <TextField
          label="Contact Title"
          value={contactTitle}
          onChange={({ target }) => setContactTitle(target.value)}
        />
      </div>
      <Button
        type="button"
        onClick={addAcitivity}
        variant="contained"
        startIcon={<Add />}
      >
        Add New Activity
      </Button>
      {activities.map((activity, index) => (
        <div
          style={{
            border: "solid",
            borderRadius: "8px",
            borderColor: "gray",
            width: "max-content",
            paddingTop: "8px",
            margin: "8px",
          }}
          key={index}
        >
          <div style={{ display: "flex" }}>
            <TextField
              name="activityType"
              label="Activity"
              id={`job-activity-input-${index}`}
              select
              value={activity.activityType}
              onChange={({ target }) =>
                editActivity(target.name, target.value, index)
              }
              required
            >
              {activityTypeOptions.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <div style={{ margin: "8px" }}>
              <InputLabel htmlFor={`job-date-input-${index}`}>Date</InputLabel>
              <Input
                name="date"
                type="date"
                id={`job-date-input-${index}`}
                value={activity.date}
                onChange={({ target }) =>
                  editActivity(target.name, target.value, index)
                }
                error={activity.date === ""}
                required
              />
            </div>
          </div>
          <div style={{ width: "min-content" }}>
            <TextField
              className="JobForm-textarea"
              name="description"
              label="Description"
              multiline
              minRows={4}
              maxRows={4}
              value={activity.description}
              onChange={({ target }) =>
                editActivity(target.name, target.value, index)
              }
            />
          </div>
          <Button
            type="button"
            onClick={() => removeActivity(index)}
            variant="contained"
            startIcon={<Remove />}
          >
            Remove
          </Button>
        </div>
      ))}
      <div>
        <TextField
          className="JobForm-textarea"
          name="notes"
          label="Notes"
          value={notes}
          onChange={({ target }) => setNotes(target.value)}
          multiline
          minRows={5}
          maxRows={5}
        />
      </div>
      <Button type="button" component={Link} to="/" variant="contained">
        Cancel
      </Button>
      <Button type="submit" variant="contained">
        Save
      </Button>
    </Box>
  );
};

export default EditJobForm;
