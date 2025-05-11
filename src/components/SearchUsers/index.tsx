import React, { useRef } from "react";
import TextField from "@mui/material/TextField";
import { useForm, SubmitHandler, useController } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "react-query";
import { UsersResult } from "./types";
import { useSearchUsers } from "./hooks";

interface IFormInput {
  userName: string;
}

const schema = Yup.object().shape({
  userName: Yup.string()
    .required("User name is required")
    .min(3, "Min. 3 characters required")
    .max(30, "You can input max 30 characters"),
});

export const SearchUsers = () => {
  const { value, onChangeInput, errors, data } = useSearchUsers();
  console.log(data);

  return (
    <div>
      <TextField
        label="Input user name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={onChangeInput}
        name={"userName"}
        value={value}
        error={!!errors.userName}
        helperText={errors.userName?.message}
      />
    </div>
  );
};
