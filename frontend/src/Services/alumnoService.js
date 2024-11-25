import ApiService from "../Services/apiServices";

const alumnoService = {
  getAlumnos: async (token) => {
    try {
      const response = await ApiService.get(
        `students/available-classes`,
        token
      );
      return response;
    } catch (err) {
      console.error("Error al obtener actividades:", err);
      throw err;
    }
  },
  getStudentClasses: async (token) => {
    try {
      let student_info = localStorage.getItem("user");
      student_info = JSON.parse(student_info)[0];
      console.log(student_info);
      const response = await ApiService.get(
        `student/${student_info.person_id}/class-information`,
        token
      );
      console.log(response);
      return response;
    } catch (err) {
      console.error("Error al obtener clases:", err);
      throw err;
    }
  },
  enrollStudent: async (classId, studentId, token) => {
    try {
      const body = { student_id: studentId };
      const response = await ApiService.post(
        `classes/${classId}/enroll-student`,
        body,
        "application/json",
        token
      );
      return response;
    } catch (err) {
      console.error("Error al inscribir al estudiante:", err);
      throw err;
    }
  },
  removeStudentFromClass: async (classId) => {
    try {
      let student_info = localStorage.getItem("user");
      student_info = JSON.parse(student_info)[0];
      console.log(student_info.person_id);
      const body = { student_id: student_info.person_id };
      const token = localStorage.getItem("token");
      const response = await ApiService.delete(
        `classes/${classId}/remove-student`,
        token,
        body
      );
      return response;
    } catch (err) {
      console.error("Error al inscribir al estudiante:", err);
      throw err;
    }
  },
};

export default alumnoService;
