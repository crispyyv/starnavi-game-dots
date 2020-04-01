import React from "react";

export const Square = props => {
  const { isBlue, isGreen, isRed, clickable, started } = props;
  const styles = {
    backgroundColor: isBlue
      ? "blue"
      : isGreen
      ? "green"
      : isRed
      ? "red"
      : "white",
    cursor: started && clickable ? "pointer" : "default"
  };

  return (
    <div
      className="square"
      style={styles}
      onClick={props.onClick}
      data-id={props.id}
    ></div>
  );
};
