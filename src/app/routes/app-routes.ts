export const AppRoutes = {
    /** landingPage
     * -----------------------
     *  landing page for the website for users can navigate to other utilities
    */
    landingPage: '/',

    
    /** employeeTable
     * -----------------------
     * The body page for the employee management system
    */
    employeeManagement: '/EmployeeManagement',
    createEmployee: '/EmployeeManagement/create',
    updateEmployee: (id: string | number) => `/EmployeeManagement/update/${id}`,
};