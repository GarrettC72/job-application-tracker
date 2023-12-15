import { FormControlLabel, FormGroup, Switch } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setColorMode } from "./appearanceSlice";

const ColorMode = () => {
  const colorMode = useAppSelector((state) => state.appearance.colorMode);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setColorMode(event.target.checked));
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch checked={colorMode === "dark"} onChange={handleChange} />
        }
        label="Dark Mode"
        labelPlacement="start"
      />
    </FormGroup>
  );
};

export default ColorMode;
