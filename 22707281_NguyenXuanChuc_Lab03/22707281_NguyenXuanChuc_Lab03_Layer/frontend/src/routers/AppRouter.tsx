import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import {
    CampaignManagerPage,
    HomePage,
    PointsReportingPage,
    RegistrationAttendancePage,
} from "../pages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "campaign-manager", element: <CampaignManagerPage /> },
            { path: "registration-attendance", element: <RegistrationAttendancePage /> },
            { path: "points-reporting", element: <PointsReportingPage /> },
            { path: "*", element: <Navigate to="/" replace /> },
        ],
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
