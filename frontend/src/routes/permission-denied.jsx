import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import axios from "axios";
import { Api, createFormData } from "../common/utils";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function PermissionDenied(props) {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        mx={4}
        sx={{ minHeight: "90vh" }}
      >
        <Typography variant="h6">您没有权限</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          返回上一页
        </Button>
      </Stack>
    </Container>
  );
}
export default PermissionDenied;
