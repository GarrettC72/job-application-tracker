import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { JobDetailsFragment } from "../../__generated__/graphql";
import { DELETE_JOB } from "../../graphql/mutations";
import { removeJobFromCache } from "../../utils/cache";
import useNotification from "../../hooks/useNotification";

interface Props {
  job: JobDetailsFragment | null;
  onClose: () => void;
}

const DeleteJobDialog = ({ job, onClose }: Props) => {
  const [deleteJob, { loading }] = useMutation(DELETE_JOB, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, "error");
      onClose();
    },
    onCompleted: (result) => {
      const job = result.deleteJob;
      if (job) {
        notifyWith(
          `Job '${job.jobTitle} at ${job.companyName}' successfully deleted`,
          "success"
        );
      }
      onClose();
    },
    update: (cache, result) => {
      const deletedJob = result.data ? result.data.deleteJob : null;
      if (deletedJob) {
        removeJobFromCache(cache, deletedJob.id);
      }
    },
  });

  const notifyWith = useNotification();

  const handleDelete = () => {
    if (job) {
      deleteJob({ variables: { id: job.id } });
    }
  };

  return (
    <Dialog
      open={job !== null}
      onClose={onClose}
      disableRestoreFocus={true}
      closeAfterTransition={true}
    >
      <DialogTitle>Delete this job?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {job
            ? `Delete job '${job.jobTitle} at ${job.companyName}'?`
            : "Delete job ' at '?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Box sx={{ position: "relative" }}>
          <Button onClick={handleDelete} disabled={loading}>
            Confirm
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
      </DialogActions>
    </Dialog>
  );
};

export default DeleteJobDialog;
