import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";

import axios from "axios";
import { Api, createFormData } from "../common/utils";
import FullFeaturedCrudGrid from "../components/data-grid";
import dayjs from "dayjs";
import { useNavigate, useOutletContext } from "react-router-dom";
import PermissionDenied from "./permission-denied";

function Teacher(props) {
  const [teachers, setTeachers] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const { auth } = useOutletContext();

  useEffect(() => {
    if (auth >= 3) {
      axios.post(Api("/teacher/all")).then(({ data: { code, message, data } }) => {
        if (code === 0) {
          setTeachers(data);
        }
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth >= 3) {
      axios.post(Api("/department/all")).then(({ data: { code, message, data } }) => {
        if (code === 0) {
          setDepartmentList(data);
        }
      });
    }
  }, [auth]);

  const columns = [
    { field: "id", headerName: "工号", width: 200, editable: false },
    { field: "name", headerName: "姓名", width: 100, editable: true },
    {
      field: "gender",
      headerName: "性别",
      width: 100,
      type: "singleSelect",
      valueOptions: [
        { value: 0, label: "男" },
        { value: 1, label: "女" },
      ],
      editable: true,
    },
    {
      field: "birthday",
      headerName: "出生日期",
      width: 150,
      type: "date",
      valueGetter: (params) => new Date(params.value),
      editable: true,
    },
    { field: "address", headerName: "家庭住址", width: 200, editable: true },
    {
      field: "department",
      headerName: "学院",
      width: 200,
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
      url: Api("/teacher/edit"),
      data: createFormData({
        id: newRow.id,
        name: newRow.name,
        gender: newRow.gender,
        birthday: dayjs(newRow.birthday).unix(),
        address: newRow.address,
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
      url: Api("/teacher/delete"),
      data: createFormData({
        id: id,
      }),
    });
    alert(data);
    console.log(id);
    return code;
  }

  return (
    <>
      {auth >= 3 ? (
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
              rows={teachers}
              setRows={setTeachers}
              editable={true}
              handleEdit={handleEdit}
              deletable={true}
              handleDelete={handleDelete}
            />
          </Stack>
        </Container>
      ) : (
        <PermissionDenied />
      )}
    </>
  );
}
export default Teacher;
