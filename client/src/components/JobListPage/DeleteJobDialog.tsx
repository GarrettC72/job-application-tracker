import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface Props {
  open: boolean;
  dialogText: string;
  onClose: () => void;
  onConfirm: () => void;
  disabled: boolean;
}

const DeleteJobDialog = ({
  open,
  dialogText,
  onClose,
  onConfirm,
  disabled,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete this job?</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} disabled={disabled}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteJobDialog;
