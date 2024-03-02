import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";

import axios from "axios";
import { Api, createFormData } from "../common/utils";
import FullFeaturedCrudGrid from "../components/data-grid";
import dayjs from "dayjs";
import { useNavigate, useOutletContext } from "react-router-dom";
import PermissionDenied from "./permission-denied";

function Department(props) {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  const { auth } = useOutletContext();

  function fetchDepartments() {
    axios.post(Api("/department/all")).then(({ data: { code, message, data } }) => {
      if (code === 0) {
        setDepartments(data);
      }
    });
  }

  useEffect(() => {
    if (auth >= 3) {
      fetchDepartments();
    }
  }, [auth]);

  const columns = [{ field: "name", headerName: "学院", width: 900, editable: true }];

  async function handleDelete(id) {
    const {
      data: { code, message, data },
    } = await axios({
      method: "POST",
      url: Api("/department/delete"),
      data: createFormData({
        name: id,
      }),
    });
    alert(data);
    console.log(id);
    return code;
  }

  function handleCreate() {
    axios({
      method: "POST",
      url: Api("/department/create"),
      data: createFormData({
        name: name,
      }),
    }).then(({ data: { code, message, data } }) => {
      alert(data);
      if (code === 0) {
        fetchDepartments();
      }
    });
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
              rows={departments}
              setRows={setDepartments}
              editable={false}
              handleEdit={null}
              deletable={true}
              handleDelete={handleDelete}
            />
            <Typography variant="h6">创建学院</Typography>
            <TextField label="学院名" value={name} onChange={(ev) => setName(ev.target.value)} />
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
export default Department;
