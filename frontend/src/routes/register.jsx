import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { Api, createFormData } from "../common/utils";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function Register(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState(null);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentList, setDepartmentList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.post(Api("/department/all")).then(({ data: { code, message, data } }) => {
      setDepartmentList(data);
    });
  }, []);

  function handleRegister() {
    console.log("onRegister");
    axios({
      method: "POST",
      url: Api("/user/register"),
      data: createFormData({
        username: username,
        email: email,
        password: password,
        type: type,
        id: id,
        name: name,
        gender: gender,
        birthday: dayjs(birthday).unix(),
        address: address,
        department: department,
      }),
    }).then(({ data: { code, message, data } }) => {
      alert(data);
      if (code === 0) {
        navigate("/login");
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
        <TextField label="邮箱" value={email} onChange={(ev) => setEmail(ev.target.value)} />
        <TextField
          label="密码"
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <FormControl>
          <FormLabel>用户类型</FormLabel>
          <RadioGroup row value={type} onChange={(ev) => setType(ev.target.value)}>
            <FormControlLabel value={0} control={<Radio />} label="学生" />
            <FormControlLabel value={1} control={<Radio />} label="教师" />
          </RadioGroup>
        </FormControl>

        <TextField label="学工号" value={id} onChange={(ev) => setId(ev.target.value)} />
        <TextField label="姓名" value={name} onChange={(ev) => setName(ev.target.value)} />
        <FormControl>
          <FormLabel>性别</FormLabel>
          <RadioGroup row value={gender} onChange={(ev) => setGender(ev.target.value)}>
            <FormControlLabel value={0} control={<Radio />} label="男" />
            <FormControlLabel value={1} control={<Radio />} label="女" />
          </RadioGroup>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="出生日期" value={birthday} onChange={(value) => setBirthday(value)} />
        </LocalizationProvider>
        <TextField
          label="家庭住址"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
        />
        <FormControl>
          <InputLabel>学院</InputLabel>
          <Select label="学院" value={department} onChange={(ev) => setDepartment(ev.target.value)}>
            {departmentList.map((department) => (
              <MenuItem value={department.name} key={department.name}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => handleRegister()}>
          注册
        </Button>
      </Stack>
    </Container>
  );
}
export default Register;
