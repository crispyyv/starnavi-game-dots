/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { TextField, MenuItem } from "@material-ui/core";

export const GameSettings = ({ settings = {}, onChange, mode }) => {
  return (
    <div className="game-mode">
      <TextField
        select
        label="Pick game mode"
        className="select"
        value={mode}
        onChange={onChange}
      >
        {Object.keys(settings).map((setting, i) => (
          <MenuItem key={i} value={setting}>
            {setting}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};
