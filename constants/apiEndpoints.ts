
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
    tutorProfile: `${API_BASE_URL}/profiles/tutors`,
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
    studentRequestById: (id:string) => `${API_BASE_URL}/student-request/${id}`,
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

    // status
    // Payment Status
    paymentStatus: `${API_BASE_URL}/status/payment`,
    createPaymentStatus: `${API_BASE_URL}/status/payment/create`,
    updatePaymentStatus: (status_id: string) => `${API_BASE_URL}/status/payment/update/${status_id}`,
    deletePaymentStatus: (status_id: string) => `${API_BASE_URL}/status/payment/delete/${status_id}`,

    // Schedule Status
    scheduleStatus: `${API_BASE_URL}/status/schedule`,
    createScheduleStatus: `${API_BASE_URL}/status/schedule/create`,
    updateScheduleStatus: (status_id: string) => `${API_BASE_URL}/status/schedule/update/${status_id}`,
    deleteScheduleStatus: (status_id: string) => `${API_BASE_URL}/status/schedule/delete/${status_id}`,

    // Student Request Status
    studentRequestStatus: `${API_BASE_URL}/status/student-request`,
    createStudentRequestStatus: `${API_BASE_URL}/status/student-request/create`,
    updateStudentRequestStatus: (status_id: string) => `${API_BASE_URL}/status/student-request/update/${status_id}`,
    deleteStudentRequestStatus: (status_id: string) => `${API_BASE_URL}/status/student-request/delete/${status_id}`,

    // Tutor Application Status
    tutorApplicationStatus: `${API_BASE_URL}/status/tutor-application`,
    createTutorApplicationStatus: `${API_BASE_URL}/status/tutor-application/create`,
    updateTutorApplicationStatus: (status_id: string) => `${API_BASE_URL}/status/tutor-application/update/${status_id}`,
    deleteTutorApplicationStatus: (status_id: string) => `${API_BASE_URL}/status/tutor-application/delete/${status_id}`,

    // Class Status
    classesStatus: `${API_BASE_URL}/status/class`,
    createClassStatus: `${API_BASE_URL}/status/class/create`,
    updateClassStatus: (status_id: string) => `${API_BASE_URL}/status/class/update/${status_id}`,
    deleteClassStatus: (status_id: string) => `${API_BASE_URL}/status/class/delete/${status_id}`,

    // Class Registration
    classRegistration: `${API_BASE_URL}/class-registration`,
    classRegistrationByClass: (class_id: string) => `${API_BASE_URL}/class-registration/get-by-class/${class_id}`,
    classRegistrationById: (registration_id: string) => `${API_BASE_URL}/class-registration/get-by-id/${registration_id}`,
    classRegistrationByStudent: (student_id: string) => `${API_BASE_URL}/class-registration/get-by-student/${student_id}`,
    createClassRegistration: `${API_BASE_URL}/class-registration/create`,
    deleteClassRegistration: (registration_id: string) => `${API_BASE_URL}/class-registration/delete/${registration_id}`,

    // Schedule
    schedulesByClass: (class_id: string) => `${API_BASE_URL}/schedules/get-by-class/${class_id}`,
    schedulesById: (schedule_id: string) => `${API_BASE_URL}/schedules/get-by-id/${schedule_id}`,
    createSchedule: `${API_BASE_URL}/schedules/create`,
    createBulkSchedules: `${API_BASE_URL}/schedules/create-bulk-schedules`,
    updateSchedule: (schedule_id: string) => `${API_BASE_URL}/schedules/update/${schedule_id}`,
    deleteSchedule: (schedule_id: string) => `${API_BASE_URL}/schedules/delete/${schedule_id}`,

    // Addresses
    addresses: `${API_BASE_URL}/addresses`,
    addressById: (user_request_class_id: string) => `${API_BASE_URL}/addresses/get-by-id/${user_request_class_id}`,
    createAddress: `${API_BASE_URL}/addresses/create`,
    updateAddress: (address_id: string) => `${API_BASE_URL}/addresses/update/${address_id}`,
    deleteAddress: (address_id: string) => `${API_BASE_URL}/addresses/delete/${address_id}`,
}