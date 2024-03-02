import Config from "./config";

function Api(path) {
  return Config.API_PREFIX + path;
}

function createFormData(obj) {
  const formData = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    formData.append(k, v);
  });
  return formData;
}

export { Api, createFormData };
