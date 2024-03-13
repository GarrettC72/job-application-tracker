import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  Input,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";

import {
  FragmentType,
  getFragmentData,
} from "../../__generated__/fragment-masking";
import { parseActivities } from "../../utils/parser";
import { Activity, ActivityType } from "../../types";
import { UPDATE_JOB } from "../../graphql/mutations";
import { FULL_JOB_DETAILS } from "../../graphql/fragments";
import { useAppSelector } from "../../app/hooks";
import useNotification from "../../hooks/useNotification";

interface Props {
  jobFragment: FragmentType<typeof FULL_JOB_DETAILS>;
}

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

const EditJobForm = ({ jobFragment }: Props) => {
  const job = getFragmentData(FULL_JOB_DETAILS, jobFragment);
  const [companyName, setCompanyName] = useState(job.companyName);
  const [companyWebsite, setCompanyWebsite] = useState(job.companyWebsite);
  const [jobTitle, setJobTitle] = useState(job.jobTitle);
  const [jobPostingLink, setJobPostingLink] = useState(job.jobPostingLink);
  const [contactName, setContactName] = useState(job.contactName);
  const [contactTitle, setContactTitle] = useState(job.contactTitle);
  const [activities, setActivities] = useState<Activity[]>(
    parseActivities(job.activities)
  );
  const [notes, setNotes] = useState(job.notes);

  const colorMode = useAppSelector(({ appearance }) => appearance.colorMode);
  const notifyWith = useNotification();
  const navigate = useNavigate();

  const [updateJob, { loading: updateLoading }] = useMutation(UPDATE_JOB, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
    },
    onCompleted: (result) => {
      const job = result.updateJob;
      if (job) {
        const unmaskedJob = getFragmentData(FULL_JOB_DETAILS, job);
        notifyWith(
          `Job '${unmaskedJob.jobTitle} at ${unmaskedJob.companyName}' successfully updated`,
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
    updateJob({ variables: { id: job.id, jobParams } });
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
      <Button type="submit" variant="contained" disabled={updateLoading}>
        Save
      </Button>
    </Box>
  );
};

export default EditJobForm;
