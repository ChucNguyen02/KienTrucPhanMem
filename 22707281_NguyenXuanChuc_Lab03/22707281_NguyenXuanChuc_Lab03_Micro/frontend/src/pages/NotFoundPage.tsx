import { Link } from 'react-router-dom';

export function NotFoundPage() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-2xl font-bold text-slate-900">404</p>
            <p className="mt-2 text-slate-600">Khong tim thay trang ban yeu cau.</p>
            <Link to="/" className="mt-4 inline-block rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white">
                Ve trang chu
            </Link>
        </div>
    );
}
