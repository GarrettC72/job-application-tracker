import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Input,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";

import { getFragmentData } from "../../__generated__/fragment-masking";
import { addJobToCache } from "../../utils/cache";
import { Activity, ActivityTypeLabel, ActivityTypeValue } from "../../types";
import { CREATE_JOB } from "../../graphql/mutations";
import { JOB_DETAILS } from "../../graphql/fragments";
import { useAppSelector } from "../../app/hooks";
import useField from "../../hooks/useField";
import useNotification from "../../hooks/useNotification";

interface ActivityTypeOption {
  value: ActivityTypeValue;
  label: string;
}

const activityTypeOptions: ActivityTypeOption[] = Object.values(
  ActivityTypeValue
).map((v) => ({
  value: v,
  label: ActivityTypeLabel[v].toString(),
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

  const [createJob, { loading }] = useMutation(CREATE_JOB, {
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
      activityType: ActivityTypeValue.APPLIED,
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
        sx={{ m: 1 }}
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
              <InputLabel
                sx={{ color: activity.date === "" ? "error.main" : undefined }}
                htmlFor={`job-date-input-${index}`}
              >
                Date
              </InputLabel>
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
                  color: activity.date === "" ? "error.main" : undefined,
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
            sx={{ m: 1 }}
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
      <Button
        sx={{ m: 1 }}
        type="button"
        component={Link}
        to="/"
        variant="contained"
      >
        Cancel
      </Button>
      <Box sx={{ m: 1, display: "inline-block", position: "relative" }}>
        <Button type="submit" variant="contained" disabled={loading}>
          Save
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default AddJobForm;
