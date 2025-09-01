import React from "react";
import Rating from "@mui/material/Rating";

type RatingTypes = {
  value: number | null;
  setValue?: React.Dispatch<React.SetStateAction<number | null>>;
  disabled?: boolean;
};

const RatingStar: React.FC<RatingTypes> = ({ value, setValue, disabled }) => {
  return (
    <>
      <Rating
        name="simple-controlled"
        value={value}
        readOnly={disabled ? true : false}
        onChange={(event, newValue) => {
          console.log(event)
          if(setValue){
            setValue(newValue);
          }
        }}
        precision={0.5}
      />
    </>
  );
};

export default RatingStar;
