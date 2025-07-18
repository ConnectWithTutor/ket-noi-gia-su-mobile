
import { API_BASE_URL,PREFIX,SOCKET_URL } from "@/constants/config";
const API_BASE = `${API_BASE_URL}${PREFIX}`;
const API_SOCKET = `${SOCKET_URL}${PREFIX}`;
export const API_ENDPOINTS = {
    // Auth
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
    logout: `${API_BASE}/auth/logout`,
    me: `${API_BASE}/auth/me`,

    // Zoom API
    createZoomMeeting: (schedule_id: string) => `${API_BASE}/zoom-api/create-meeting/${schedule_id}`,

    // Role
    roles: `${API_BASE}/roles`,
    rolesById: (role_id: string) => `${API_BASE}/roles/${role_id}`,

    // User
    users: `${API_BASE}/users/`,
    activedUsers: `${API_BASE}/users/activated`,
    notActivedUsers: `${API_BASE}/users/not-activated`,
    userActivate: (user_id: string) => `${API_BASE}/users/activate/${user_id}`,
    userByRole: (role_id: string) => `${API_BASE}/users/${role_id}`,
    userById: (user_id: string) => `${API_BASE}/users/${user_id}`,
    userVerify: (user_id: string) => `${API_BASE}/users/activate/${user_id}`,
    updateUser: (user_id: string) => `${API_BASE}/users/update/${user_id}`,
    deleteUser: (user_id: string) => `${API_BASE}/users/delete/${user_id}`,

    // Tutor Profile
    tutorProfile: `${API_BASE}/profiles/tutors`,
    tutorProfileById: (user_id: string) => `${API_BASE}/profiles/tutors/${user_id}`,
    updateTutorProfiles: (user_id: string) => `${API_BASE}/profiles/tutors/update/${user_id}`,
    approveTutorProfiles: (user_id: string) => `${API_BASE}/profiles/tutors/approve/${user_id}`,

    // Student Profile
    studentProfileById: (user_id: string) => `${API_BASE}/profiles/students/${user_id}`,
    updateStudentProfiles: (user_id: string) => `${API_BASE}/profiles/students/update/${user_id}`,

    // Subject
    subjects: `${API_BASE}/subjects`,
    subjectById: (subject_id: string) => `${API_BASE}/subjects/get-by-id/${subject_id}`,
    createSubject: `${API_BASE}/subjects/create`,
    updateSubject: (subject_id: string) => `${API_BASE}/subjects/update/${subject_id}`,
    deleteSubject: (subject_id: string) => `${API_BASE}/subjects/delete/${subject_id}`,  
    
    // Class
    classes: `${API_BASE}/classes`,
    findBestClasses: `${API_BASE}/classes/find-best-classes`,
    classesByUser: (user_id: string) => `${API_BASE}/classes/get-by-user/${user_id}`,
    classesByStatus: (status_id: string) => `${API_BASE}/classes/get-by-status/${status_id}`,
    classesById: (class_id: string) => `${API_BASE}/classes/get-by-id/${class_id}`,
    createClasses: `${API_BASE}/classes/create`,
    createClassRegistrationWithUsername: `${API_BASE}/class-registration/create-with-username`,
    updateClasses: (class_id: string) => `${API_BASE}/classes/update/${class_id}`,
    deleteClasses: (class_id: string) => `${API_BASE}/classes/delete/${class_id}`,
    rateClasses:  `${API_BASE}/evaluation/create`,
    getClassEvaluationsByRecipientId: (user_id: string) => `${API_BASE}/evaluation/get-by-recipient/${user_id}`,
    getAllEvaluations: `${API_BASE}/evaluation`,
    // Student Request
    studentRequest: `${API_BASE}/student-request`,
    studentRequestById: (id:string) => `${API_BASE}/student-request/${id}`,
    studentRequestByLocation: (location: string) => `${API_BASE}/student-request/get-by-location/${location}`,
    studentRequestByUser: (user_id: string) => `${API_BASE}/student-request/get-by-user/${user_id}`,
    createStudentRequest: `${API_BASE}/student-request/create`,
    updateStudentRequest: (request_id: string) => `${API_BASE}/student-request/update/${request_id}`,
    deleteStudentRequest: (request_id: string) => `${API_BASE}/student-request/delete/${request_id}`,

    // Tutor Application
    tutorApplication: `${API_BASE}/tutor-application`,
    tutorApplicationByUser: (user_id: string) => `${API_BASE}/tutor-application/get-by-user/${user_id}`,
    tutorApplicationByStatus: (status_id: string) => `${API_BASE}/tutor-application/get-by-status/${status_id}`,
    createTutorApplication: `${API_BASE}/tutor-application/create`,
    updateTutorApplication: (application_id: string) => `${API_BASE}/tutor-application/update/${application_id}`,
    deleteTutorApplication: (application_id: string) => `${API_BASE}/tutor-application/delete/${application_id}`,

    // status
    // Payment Status
    paymentStatus: `${API_BASE}/status/payment`,
    createPaymentStatus: `${API_BASE}/status/payment/create`,
    updatePaymentStatus: (status_id: string) => `${API_BASE}/status/payment/update/${status_id}`,
    deletePaymentStatus: (status_id: string) => `${API_BASE}/status/payment/delete/${status_id}`,

    // Schedule Status
    scheduleStatus: `${API_BASE}/status/schedule`,
    createScheduleStatus: `${API_BASE}/status/schedule/create`,
    updateScheduleStatus: (status_id: string) => `${API_BASE}/status/schedule/update/${status_id}`,
    deleteScheduleStatus: (status_id: string) => `${API_BASE}/status/schedule/delete/${status_id}`,

    // Student Request Status
    studentRequestStatus: `${API_BASE}/status/student-request`,
    createStudentRequestStatus: `${API_BASE}/status/student-request/create`,
    updateStudentRequestStatus: (status_id: string) => `${API_BASE}/status/student-request/update/${status_id}`,
    deleteStudentRequestStatus: (status_id: string) => `${API_BASE}/status/student-request/delete/${status_id}`,

    // Tutor Application Status
    tutorApplicationStatus: `${API_BASE}/status/tutor-application`,
    createTutorApplicationStatus: `${API_BASE}/status/tutor-application/create`,
    updateTutorApplicationStatus: (status_id: string) => `${API_BASE}/status/tutor-application/update/${status_id}`,
    deleteTutorApplicationStatus: (status_id: string) => `${API_BASE}/status/tutor-application/delete/${status_id}`,

    // Class Status
    classesStatus: `${API_BASE}/status/class`,
    createClassStatus: `${API_BASE}/status/class/create`,
    updateClassStatus: (status_id: string) => `${API_BASE}/status/class/update/${status_id}`,
    deleteClassStatus: (status_id: string) => `${API_BASE}/status/class/delete/${status_id}`,

    // Class Registration
    classRegistration: `${API_BASE}/class-registration`,
    classRegistrationByClass: (class_id: string) => `${API_BASE}/class-registration/get-by-class/${class_id}`,
    classRegistrationById: (registration_id: string) => `${API_BASE}/class-registration/get-by-id/${registration_id}`,
    classRegistrationByStudent: (student_id: string) => `${API_BASE}/class-registration/get-by-student/${student_id}`,
    createClassRegistration: `${API_BASE}/class-registration/create`,
    deleteClassRegistration: (registration_id: string) => `${API_BASE}/class-registration/delete/${registration_id}`,

    // Schedule
    schedulesByClass: (class_id: string) => `${API_BASE}/schedules/get-by-class/${class_id}`,
    schedulesById: (schedule_id: string) => `${API_BASE}/schedules/get-by-id/${schedule_id}`,
    createSchedule: `${API_BASE}/schedules/create`,
    createBulkSchedules: `${API_BASE}/schedules/create-bulk-schedules`,
    updateSchedule: (schedule_id: string) => `${API_BASE}/schedules/update/${schedule_id}`,
    deleteSchedule: (schedule_id: string) => `${API_BASE}/schedules/delete/${schedule_id}`,

    // Addresses
    addresses: `${API_BASE}/addresses`,
    addressById: (user_request_class_id: string) => `${API_BASE}/addresses/get-by-id/${user_request_class_id}`,
    createAddress: `${API_BASE}/addresses/create`,
    updateAddress: (address_id: string) => `${API_BASE}/addresses/update/${address_id}`,
    deleteAddress: (address_id: string) => `${API_BASE}/addresses/delete/${address_id}`,

    //Payment
    payments: `${API_BASE}/payments`,
    paymentsByUser: (user_id: string) => `${API_BASE}/payments/get-by-user/${user_id}`,
    paymentById: (payment_registration_id: string) => `${API_BASE}/payments/get-by-id/${payment_registration_id}`,
    vnpayReturn: `${API_BASE}/payments/vnpay_return`,
    paymentOrder: `${API_BASE}/payments/pay-order`,
    paymentMethods: `${API_BASE}/payment-methods/`,
    paymentMethodById: (method_id: string) => `${API_BASE}/payment-methods/get-by-id/${method_id}`,

    //Complaint
    complaints: `${API_BASE}/complaint`,
    complaintsByStatus: (status_name: string) => `${API_BASE}/complaint/get-by-status/${status_name}`,
    complaintById: (complaint_id: string) => `${API_BASE}/complaint/get-by-id/${complaint_id}`,
    createComplaint: `${API_BASE}/complaint/create`,
    updateComplaint: (complaint_id: string) => `${API_BASE}/complaint/update/${complaint_id}`,
    deleteComplaint: (complaint_id: string) => `${API_BASE}/complaint/delete/${complaint_id}`,

    //Complaint Type
    complaintTypes: `${API_BASE}/complaint-type/`,
    complaintTypeById: (type_id: string) => `${API_BASE}/complaint-type/get-by-id/${type_id}`,
    createComplaintType: `${API_BASE}/complaint-type/create`,
}