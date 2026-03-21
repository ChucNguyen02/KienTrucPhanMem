interface PageTitleProps {
    title: string;
    subtitle: string;
}

export const PageTitle = ({ title, subtitle }: PageTitleProps) => {
    return (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-slate-600 md:text-base">{subtitle}</p>
        </div>
    );
};
