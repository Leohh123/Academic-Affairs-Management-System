import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import axios from "axios";
import { Api } from "../common/utils";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function Root(props) {
  const [username, setUsername] = useState(null);
  const [auth, setAuth] = useState(2);

  const navigate = useNavigate();

  function updateUsername() {
    axios.post(Api("/user/status")).then(({ data: { code, message, data } }) => {
      setUsername(data.username);
      setAuth(data.auth);
      console.log(data);
    });
  }

  useEffect(() => updateUsername(), []);

  function handleLogout() {
    axios.post(Api("/user/logout")).then(({ data: { code, message, data } }) => {
      alert(data);
      if (code === 0) {
        setUsername(null);
        setAuth(0);
        navigate("/login");
      }
    });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            教务信息管理系统
            <Button color="inherit" size="large" sx={{ ml: 2 }} href="/student">
              学生管理
            </Button>
            <Button color="inherit" size="large" sx={{ ml: 2 }} href="/teacher">
              教师管理
            </Button>
            <Button color="inherit" size="large" sx={{ ml: 2 }} href="/course">
              课程管理
            </Button>
            <Button color="inherit" size="large" sx={{ ml: 2 }} href="/department">
              学院管理
            </Button>
            <Button color="inherit" size="large" sx={{ ml: 2 }} href="/course-selection">
              选课管理
            </Button>
          </Typography>
          {username == null ? (
            <>
              <Button color="inherit" size="large" href="/login">
                登录
              </Button>
              <Button color="inherit" size="large" href="/register">
                注册
              </Button>
            </>
          ) : (
            <>
              <Typography>您好，{username}！</Typography>
              <Button color="inherit" size="large" onClick={() => handleLogout()}>
                注销
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Outlet context={{ updateUsername, auth }} />
    </Box>
  );
}
export default Root;
