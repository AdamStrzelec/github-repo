import React from "react";
import TextField from "@mui/material/TextField";
import { useSearchUsers } from "./hooks";
import { UserCard } from "../UserCard";
import styled from "@emotion/styled";
import InfiniteScroll from "react-infinite-scroll-component";

export const SearchUsers = () => {
  const {
    value,
    onChangeInput,
    validationErrors,
    items,
    totalItemsLength,
    error,
    isLoading,
    goToNextPage,
  } = useSearchUsers();

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
      ) : isLoading && !items.length ? (
        <h2>Loading...</h2>
      ) : items.length ? (
        <InfiniteScrollList
          dataLength={totalItemsLength}
          next={goToNextPage}
          hasMore={totalItemsLength > items.length}
          loader={<h2>Loading...</h2>}
        >
          {items.map((item) => {
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
          })}
        </InfiniteScrollList>
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

const InfiniteScrollList = styled(InfiniteScroll)({
  width: 600,
});
