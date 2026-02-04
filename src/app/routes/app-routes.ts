export const AppRoutes = {
    /** landingPage
     * -----------------------
     *  landing page for the website where users can navigate to other websites within the angular app
    */
    landingPage: '/',

    
    /** employeeManagement
     * -----------------------
     * The home page for the employee management system website.
    */
    employeeManagement: '/EmployeeManagement',
    createEmployee: '/EmployeeManagement/create',
    updateEmployee: (id: string | number) => `/EmployeeManagement/update/${id}`,

    
    /** worldMap
     * -----------------------
     * The home page for the world map website.
     */
    worldMap: '/WorldMap'
};