import React from "react";
import TextField from "@mui/material/TextField";
import { useSearchUsers } from "./hooks";
import { UserCard } from "../UserCard";
import styled from "@emotion/styled";

export const SearchUsers = () => {
  const { value, onChangeInput, validationErrors, data, error, isLoading } =
    useSearchUsers();

  return (
    <CenteredWrapper>
      <TextField
        label="Input user name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={onChangeInput}
        name={"userName"}
        value={value}
        error={!!validationErrors.userName}
        helperText={validationErrors.userName?.message}
      />
      {error ? (
        <h2>Something went wrong</h2>
      ) : isLoading ? (
        <h2>Loading</h2>
      ) : data?.items?.length ? (
        data.items.map((item) => {
          const { avatar_url, html_url, login, type, id } = item;

          return (
            <UserCard
              key={id}
              avatar_url={avatar_url}
              html_url={html_url}
              login={login}
              type={type}
            />
          );
        })
      ) : (
        <h2>No data to display</h2>
      )}
    </CenteredWrapper>
  );
};

const CenteredWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});
