import { useState } from "react";

const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  const handleChange = (name, value) => {
    setValues({ ...values, [name]: value });
    // Only validate and set errors if form is dirty (i.e., after submit)
    if (dirty && validate) {
      setErrors({ ...errors, [name]: validate(name, value, values) });
    }
  };

  const handleSubmit = (onSubmit) => {
    setDirty(true);
    const newErrors = {};
    Object.keys(values).forEach((key) => {
      if (validate) {
        newErrors[key] = validate(key, values[key], values);
      }
    });
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((e) => e);
    if (!hasError) {
      onSubmit(values);
    }
  };

  return {
    values,
    errors: dirty ? errors : {}, // Only show errors if dirty
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
    dirty,
  };
};

export default useForm;
