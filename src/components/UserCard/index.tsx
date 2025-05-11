import React from "react";
import { UsersResult } from "../SearchUsers/types";
import { Card, Typography, Avatar, CardActionArea, Box } from "@mui/material";

export interface UserCardProps
  extends Pick<
    NonNullable<UsersResult["items"][number]>,
    "avatar_url" | "login" | "html_url" | "type"
  > {}

export const UserCard = ({
  avatar_url,
  html_url,
  login,
  type,
}: UserCardProps) => {
  const handleClick = () => {
    window.open(html_url, "_blank");
  };

  return (
    <Card sx={{ maxWidth: 500, width: "100%", m: 2 }}>
      <CardActionArea onClick={handleClick}>
        <Box display="flex" alignItems="center" p={2}>
          <Avatar
            alt={login}
            src={avatar_url}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">{login}</Typography>
            <Typography variant="body2" color="text.secondary">
              {type}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};
