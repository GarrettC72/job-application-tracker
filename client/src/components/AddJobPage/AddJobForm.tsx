import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  Input,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";

import { getFragmentData } from "../../__generated__/fragment-masking";
import { addJobToCache } from "../../utils/cache";
import { useField, useNotification } from "../../hooks";
import { Activity, ActivityType } from "../../types";
import { CREATE_JOB } from "../../graphql/mutations";
import { JOB_DETAILS } from "../../graphql/fragments";
import { useAppSelector } from "../../app/hooks";

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
  const colorMode = useAppSelector(({ appearance }) => appearance.colorMode);

  const [createJob] = useMutation(CREATE_JOB, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
    },
    onCompleted: (result) => {
      const job = result.addJob;
      if (job) {
        const unmaskedJob = getFragmentData(JOB_DETAILS, job);
        notifyWith(
          `New job '${unmaskedJob.jobTitle} at ${unmaskedJob.companyName}' successfully saved`,
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
    update: (cache, result) => {
      const addedJob = result.data ? result.data.addJob : null;
      if (addedJob) {
        addJobToCache(cache, addedJob);
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
          {...companyName}
          error={companyName.value === ""}
        />
        <TextField label="Company Website" {...companyWebsite} />
      </div>
      <div>
        <TextField
          required
          label="Job Title"
          {...jobTitle}
          error={jobTitle.value === ""}
        />
        <TextField label="Job Posting Link" {...jobPostingLink} />
      </div>
      <div>
        <TextField label="Contact Name" {...contactName} />
        <TextField label="Contact Title" {...contactTitle} />
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
                sx={{
                  colorScheme: colorMode,
                }}
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
          {...notes}
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

export default AddJobForm;
