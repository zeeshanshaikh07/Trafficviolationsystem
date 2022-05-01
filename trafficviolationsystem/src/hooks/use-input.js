import { useState } from "react";

const useInput = (validateValue) => {
  const [value, setValue] = useState("");
  const [valueTouched, setValueTouched] = useState(false);

  const valueIsValid = validateValue(value);
  const hasError = !valueIsValid && valueTouched;

  const inputChangeHander = (event) => {
    setValue(event.target.value);
  };
  const inputBlurHandler = (event) => {
    setValueTouched(true);
  };

  const reset = () => {
    setValue("");
    setValueTouched(false);
  };

  return {
    value,
    hasError,
    valueIsValid,
    reset,
    inputChangeHander,
    inputBlurHandler,
  };
};

export default useInput;
