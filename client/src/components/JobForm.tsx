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
import { Link } from "react-router";

import { ActivityTypeValue, ActivityTypeLabel, JobFormFields } from "../types";
import { useAppSelector } from "../app/hooks";
import useJobForm from "../hooks/useJobForm";

interface Props {
  initalJobState?: JobFormFields;
  onSubmit: (data: JobFormFields) => void;
  loading: boolean;
}

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

const JobForm = ({ initalJobState, onSubmit, loading }: Props) => {
  const [state, dispatch] = useJobForm(initalJobState);
  const colorMode = useAppSelector(({ appearance }) => appearance.colorMode);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onSubmit(state);
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    dispatch({ type: "edit_text_field", payload: { name, value } });
  };

  const editActivity = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    dispatch({ type: "edit_activity", payload: { name, value, index } });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        "& .JobForm-textarea": { width: "50ch" },
      }}
    >
      <div>
        <TextField
          required
          label="Company Name"
          name="companyName"
          value={state.companyName}
          onChange={(e) => handleTextFieldChange(e)}
          error={state.companyName === ""}
        />
        <TextField
          label="Company Website"
          name="companyWebsite"
          value={state.companyWebsite}
          onChange={(e) => handleTextFieldChange(e)}
        />
      </div>
      <div>
        <TextField
          required
          label="Job Title"
          name="jobTitle"
          value={state.jobTitle}
          onChange={(e) => handleTextFieldChange(e)}
          error={state.jobTitle === ""}
        />
        <TextField
          label="Job Posting Link"
          name="jobPostingLink"
          value={state.jobPostingLink}
          onChange={(e) => handleTextFieldChange(e)}
        />
      </div>
      <div>
        <TextField
          label="Contact Name"
          name="contactName"
          value={state.contactName}
          onChange={(e) => handleTextFieldChange(e)}
        />
        <TextField
          label="Contact Title"
          name="contactTitle"
          value={state.contactTitle}
          onChange={(e) => handleTextFieldChange(e)}
        />
      </div>
      <Button
        type="button"
        sx={{ m: 1 }}
        onClick={() => dispatch({ type: "add_activity" })}
        variant="contained"
        startIcon={<Add />}
      >
        Add New Activity
      </Button>
      {state.activities.map((activity, index) => (
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
              required
              select
              id={`job-activity-input-${index}`}
              label="Activity"
              name="activityType"
              value={activity.activityType}
              onChange={(e) => editActivity(e, index)}
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
                required
                type="date"
                id={`job-date-input-${index}`}
                name="date"
                value={activity.date}
                onChange={(e) => editActivity(e, index)}
                error={activity.date === ""}
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
              multiline
              minRows={4}
              maxRows={4}
              label="Description"
              name="description"
              value={activity.description}
              onChange={(e) => editActivity(e, index)}
            />
          </div>
          <Button
            type="button"
            sx={{ m: 1 }}
            onClick={() =>
              dispatch({ type: "remove_activity", payload: index })
            }
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
          multiline
          minRows={5}
          maxRows={5}
          label="Notes"
          name="notes"
          value={state.notes}
          onChange={(e) => handleTextFieldChange(e)}
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

export default JobForm;
