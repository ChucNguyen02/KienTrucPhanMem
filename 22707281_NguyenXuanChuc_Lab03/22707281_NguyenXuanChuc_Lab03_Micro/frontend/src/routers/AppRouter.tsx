import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { CampaignManagerPage } from '../pages/CampaignManagerPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RegistrationAttendancePage } from '../pages/RegistrationAttendancePage';
import { ReportsPage } from '../pages/ReportsPage';

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'admin/campaigns', element: <CampaignManagerPage /> },
            { path: 'admin/registration', element: <RegistrationAttendancePage /> },
            { path: 'admin/reports', element: <ReportsPage /> },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);
