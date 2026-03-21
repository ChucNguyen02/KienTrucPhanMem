import { NavLink, Outlet } from 'react-router-dom';
import { appNavItems } from '../constants/navigation';

export function AppLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 text-slate-800">
            <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
                <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-sky-600">Plugin Based CMS</p>
                        <h1 className="text-lg font-bold md:text-2xl">Volunteer Campaign Portal</h1>
                    </div>
                    <nav className="flex flex-wrap gap-2">
                        {appNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    [
                                        'rounded-lg border px-3 py-2 text-sm font-semibold transition',
                                        isActive
                                            ? 'border-sky-600 bg-sky-600 text-white'
                                            : 'border-slate-300 bg-white text-slate-700 hover:border-sky-500 hover:text-sky-700',
                                    ].join(' ')
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </header>
            <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-10">
                <Outlet />
            </main>
        </div>
    );
}
