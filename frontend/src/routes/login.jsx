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

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { updateUsername } = useOutletContext();

  function handleLogin() {
    console.log("onLogin");
    axios({
      method: "POST",
      url: Api("/user/login"),
      data: createFormData({
        username: username,
        password: password,
      }),
    }).then(({ data: { code, message, data } }) => {
      alert(data);
      if (code === 0) {
        updateUsername();
        navigate("/");
      }
    });
  }

  return (
    <Container maxWidth="sm">
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        spacing={2}
        mx={4}
        sx={{ minHeight: "90vh" }}
      >
        <TextField
          label="用户名"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <TextField
          label="密码"
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <Button variant="contained" onClick={() => handleLogin()}>
          登录
        </Button>
      </Stack>
    </Container>
  );
}
export default Login;
