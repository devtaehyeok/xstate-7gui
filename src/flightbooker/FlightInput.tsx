import React, { useState } from "react";

const FlightInput: React.FC<{
  value: any;
  onChange: any;
  disabled?: boolean;
  error: any;
  label: string;
}> = ({ value, onChange, disabled, error, label }) => {
  const [touched, setTouched] = useState(false);

  return (
    <>
      <label data-state={error && touched ? "error" : "idle"}>
        <span>{label}</span>
        <input
          name="startDate"
          placeholder="Start date"
          type="date"
          onChange={(e) => {
            onChange(e.target.value);
          }}
          value={value}
          disabled={disabled}
          onBlur={(e) => setTouched(true)}
        />
      </label>
    </>
  );
};

export default FlightInput;
