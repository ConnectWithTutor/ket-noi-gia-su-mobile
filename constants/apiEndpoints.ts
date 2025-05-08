
import { API_BASE_URL } from "@/services/api"
export const API_ENDPOINTS = {
    // Auth
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,

    // Role
    roles: `${API_BASE_URL}/roles`,
    rolesById: (role_id: string) => `${API_BASE_URL}/roles/${role_id}`,

    // User
    users: `${API_BASE_URL}/users/`,
    activedUsers: `${API_BASE_URL}/users/activated`,
    notActivedUsers: `${API_BASE_URL}/users/not-activated`,
    userByRole: (role_id: string) => `${API_BASE_URL}/users/${role_id}`,
    userById: (user_id: string) => `${API_BASE_URL}/users/${user_id}`,
    userVerify: (user_id: string) => `${API_BASE_URL}/users/activate/${user_id}`,
    updateUser: (user_id: string) => `${API_BASE_URL}/users/update/${user_id}`,
    deleteUser: (user_id: string) => `${API_BASE_URL}/users/delete/${user_id}`,

    // Tutor Profile
    tutorProfileById: (user_id: string) => `${API_BASE_URL}/profiles/tutors/${user_id}`,
    updateTutorProfiles: (user_id: string) => `${API_BASE_URL}/profiles/tutors/update/${user_id}`,
    approveTutorProfiles: (user_id: string) => `${API_BASE_URL}/profiles/tutors/approve/${user_id}`,

    // Student Profile
    studentProfileById: (user_id: string) => `${API_BASE_URL}/profiles/students/${user_id}`,
    updateStudentProfiles: (user_id: string) => `${API_BASE_URL}/profiles/student/update/${user_id}`,

    // Subject
    subjects: `${API_BASE_URL}/subjects`,
    createSubject: `${API_BASE_URL}/subjects/create`,
    updateSubject: (subject_id: string) => `${API_BASE_URL}/subjects/update/${subject_id}`,
    deleteSubject: (subject_id: string) => `${API_BASE_URL}/subjects/delete/${subject_id}`,

    // Class
    classes: `${API_BASE_URL}/classes`,
    classesByStatus: (status_id: string) => `${API_BASE_URL}/classes/get-by-status/${status_id}`,
    classesById: (class_id: string) => `${API_BASE_URL}/classes/get-by-id/${class_id}`,
    createClasses: `${API_BASE_URL}/classes/create`,
    updateClasses: (class_id: string) => `${API_BASE_URL}/classes/update/${class_id}`,
    deleteClasses: (class_id: string) => `${API_BASE_URL}/classes/delete/${class_id}`,

    // Student Request
    studentRequest: `${API_BASE_URL}/student-request`,
    studentRequestByLocation: (location: string) => `${API_BASE_URL}/student-request/get-by-location/${location}`,
    studentRequestByUser: (user_id: string) => `${API_BASE_URL}/student-request/get-by-user/${user_id}`,
    createStudentRequest: `${API_BASE_URL}/student-request/create`,
    updateStudentRequest: (request_id: string) => `${API_BASE_URL}/student-request/update/${request_id}`,
    deleteStudentRequest: (request_id: string) => `${API_BASE_URL}/student-request/delete/${request_id}`,

    // Tutor Application
    tutorApplication: `${API_BASE_URL}/tutor-application`,
    tutorApplicationByUser: (user_id: string) => `${API_BASE_URL}/tutor-application/get-by-user/${user_id}`,
    tutorApplicationByStatus: (status_id: string) => `${API_BASE_URL}/tutor-application/get-by-status/${status_id}`,
    createTutorApplication: `${API_BASE_URL}/tutor-application/create`,
    updateTutorApplication: (application_id: string) => `${API_BASE_URL}/tutor-application/update/${application_id}`,
    deleteTutorApplication: (application_id: string) => `${API_BASE_URL}/tutor-application/delete/${application_id}`,
}