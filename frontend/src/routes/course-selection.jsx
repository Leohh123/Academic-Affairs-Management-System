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

function CourseSelection(props) {
  const [course, setCourse] = useState("");

  const [selections, setSelections] = useState([]);
  const [courseList, setCourseList] = useState([]);

  const { auth } = useOutletContext();

  function fetchSelections() {
    axios.post(Api("/course-selection/all")).then(({ data: { code, message, data } }) => {
      if (code === 0) {
        setSelections(data);
      }
    });
  }

  function fetchCourses() {
    axios.post(Api("/course/all")).then(({ data: { code, message, data } }) => {
      if (code === 0) {
        setCourseList(data);
      }
    });
  }

  useEffect(() => {
    if (auth >= 1) {
      fetchSelections();
    }
  }, [auth]);

  useEffect(() => {
    if (auth >= 1) {
      fetchCourses();
    }
  }, [auth]);

  const columns = [
    { field: "student", headerName: "学号", width: 150, editable: false },
    { field: "student_name", headerName: "学生姓名", width: 150, editable: false },
    { field: "course", headerName: "课程号", width: 150, editable: false },
    { field: "course_name", headerName: "课程名", width: 150, editable: false },
    { field: "score", headerName: "成绩", width: 150, type: "number", editable: auth >= 2 },
  ];

  async function handleEdit(newRow) {
    const {
      data: { code, message, data },
    } = await axios({
      method: "POST",
      url: Api("/course-selection/edit"),
      data: createFormData({
        id: newRow.id,
        score: newRow.score,
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
      url: Api("/course-selection/delete"),
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
      url: Api("/course-selection/create"),
      data: createFormData({
        course: course,
      }),
    }).then(({ data: { code, message, data } }) => {
      alert(data);
      if (code === 0) {
        fetchSelections();
        fetchCourses();
      }
    });
  }

  return (
    <>
      {auth >= 1 ? (
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
              rows={selections}
              setRows={setSelections}
              editable={auth >= 2}
              handleEdit={handleEdit}
              deletable={true}
              handleDelete={handleDelete}
            />
            {auth === 1 ? (
              <>
                <Typography variant="h6">选课</Typography>
                <FormControl>
                  <InputLabel>课程</InputLabel>
                  <Select label="课程" value={course} onChange={(ev) => setCourse(ev.target.value)}>
                    {courseList.map((course) => (
                      <MenuItem value={course.id} key={course.id}>
                        {course.name} （已选 {course.student_count} / {course.capacity}）
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={() => handleCreate()}>
                  提交
                </Button>
              </>
            ) : (
              ""
            )}
          </Stack>
        </Container>
      ) : (
        <PermissionDenied />
      )}
    </>
  );
}
export default CourseSelection;
