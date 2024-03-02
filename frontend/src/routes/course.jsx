import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";

import axios from "axios";
import { Api, createFormData } from "../common/utils";
import FullFeaturedCrudGrid from "../components/data-grid";
import dayjs from "dayjs";
import { useNavigate, useOutletContext } from "react-router-dom";
import PermissionDenied from "./permission-denied";

function Course(props) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [teacher, setTeacher] = useState("");
  const [department, setDepartment] = useState("");

  const [courses, setCourses] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  const { auth } = useOutletContext();

  function fetchCourses() {
    axios.post(Api("/course/all")).then(({ data: { code, message, data } }) => {
      if (code === 0) {
        setCourses(data);
      }
    });
  }

  useEffect(() => {
    if (auth >= 2) {
      fetchCourses();
    }
  }, [auth]);

  useEffect(() => {
    if (auth >= 2) {
      axios.post(Api("/department/all")).then(({ data: { code, message, data } }) => {
        if (code === 0) {
          setDepartmentList(data);
        }
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth >= 3) {
      axios.post(Api("/teacher/all")).then(({ data: { code, message, data } }) => {
        if (code === 0) {
          setTeacherList(data);
        }
      });
    }
  }, [auth]);

  const columns = [
    { field: "id", headerName: "课程号", width: 150, editable: false },
    { field: "name", headerName: "课程名", width: 150, editable: true },
    { field: "time", headerName: "上课时间", width: 150, editable: true },
    { field: "capacity", headerName: "课容量", width: 100, type: "number", editable: true },
    { field: "student_count", headerName: "已选人数", width: 100, type: "number", editable: false },
    auth >= 3
      ? {
          field: "teacher",
          headerName: "主讲教师",
          width: 150,
          type: "singleSelect",
          valueOptions: teacherList.map((teacher) => ({ value: teacher.id, label: teacher.name })),
          editable: true,
        }
      : {
          field: "teacher_name",
          headerName: "主讲教师",
          width: 150,
          editable: false,
        },
    {
      field: "department",
      headerName: "学院",
      width: 150,
      type: "singleSelect",
      valueOptions: departmentList.map((department) => department.name),
      editable: true,
    },
  ];

  async function handleEdit(newRow) {
    const {
      data: { code, message, data },
    } = await axios({
      method: "POST",
      url: Api("/course/edit"),
      data: createFormData({
        id: newRow.id,
        name: newRow.name,
        time: newRow.time,
        capacity: newRow.capacity,
        teacher: newRow.teacher,
        department: newRow.department,
      }),
    });
    alert(data);
    console.log(newRow);
    return code;
  }

  async function handleDelete(id) {
    const {
      data: { code, message, data },
    } = await axios({
      method: "POST",
      url: Api("/course/delete"),
      data: createFormData({
        id: id,
      }),
    });
    alert(data);
    console.log(id);
    return code;
  }

  function handleCreate() {
    axios({
      method: "POST",
      url: Api("/course/create"),
      data: createFormData({
        id: id,
        name: name,
        time: time,
        capacity: capacity,
        teacher: teacher,
        department: department,
      }),
    }).then(({ data: { code, message, data } }) => {
      alert(data);
      if (code === 0) {
        fetchCourses();
      }
    });
  }

  return (
    <>
      {auth >= 2 ? (
        <Container sx={{ mt: 4 }}>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="strench"
            spacing={2}
            mx={4}
            sx={{ minHeight: "90vh" }}
          >
            <FullFeaturedCrudGrid
              columns={columns}
              rows={courses}
              setRows={setCourses}
              editable={true}
              handleEdit={handleEdit}
              deletable={true}
              handleDelete={handleDelete}
            />
            <Typography variant="h6">创建课程</Typography>
            <TextField label="课程号" value={id} onChange={(ev) => setId(ev.target.value)} />
            <TextField label="课程名" value={name} onChange={(ev) => setName(ev.target.value)} />
            <TextField label="上课时间" value={time} onChange={(ev) => setTime(ev.target.value)} />
            <TextField
              label="课容量"
              type="number"
              value={capacity}
              onChange={(ev) => setCapacity(ev.target.value)}
            />
            {auth >= 3 ? (
              <FormControl>
                <InputLabel>主讲教师</InputLabel>
                <Select
                  label="主讲教师"
                  value={teacher}
                  onChange={(ev) => setTeacher(ev.target.value)}
                >
                  {teacherList.map((teacher) => (
                    <MenuItem value={teacher.id} key={teacher.id}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              ""
            )}
            <FormControl>
              <InputLabel>学院</InputLabel>
              <Select
                label="学院"
                value={department}
                onChange={(ev) => setDepartment(ev.target.value)}
              >
                {departmentList.map((department) => (
                  <MenuItem value={department.name} key={department.name}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={() => handleCreate()}>
              创建
            </Button>
          </Stack>
        </Container>
      ) : (
        <PermissionDenied />
      )}
    </>
  );
}
export default Course;
