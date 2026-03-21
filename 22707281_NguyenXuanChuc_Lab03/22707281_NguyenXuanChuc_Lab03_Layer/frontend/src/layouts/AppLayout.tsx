import { Outlet, NavLink } from "react-router-dom";
import { ChartColumnIncreasing, ClipboardCheck, Flag, House } from "lucide-react";

const navItems = [
    { to: "/", label: "Trang chủ", icon: House },
    { to: "/campaign-manager", label: "Campaign Manager", icon: Flag },
    { to: "/registration-attendance", label: "Đăng ký & Điểm danh", icon: ClipboardCheck },
    { to: "/points-reporting", label: "Points & Reporting", icon: ChartColumnIncreasing },
];

export const AppLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white text-slate-800">
            <header className="sticky top-0 z-10 border-b border-orange-200 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-slate-900">Volunteer CMS Plugins</h1>
                        <p className="text-sm text-slate-600">Campaign, Registration & Attendance, Points Reporting</p>
                    </div>
                    <nav className="flex flex-wrap gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${isActive
                                            ? "border-orange-300 bg-orange-100 text-orange-900"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-orange-200"
                                        }`
                                    }
                                >
                                    <Icon size={16} />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
                <Outlet />
            </main>
        </div>
    );
};
