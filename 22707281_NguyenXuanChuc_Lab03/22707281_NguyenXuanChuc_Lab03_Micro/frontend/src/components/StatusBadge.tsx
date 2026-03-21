interface StatusBadgeProps {
    text: string;
    tone?: 'neutral' | 'success' | 'danger' | 'warning';
}

const toneClassMap: Record<NonNullable<StatusBadgeProps['tone']>, string> = {
    neutral: 'bg-slate-200 text-slate-700',
    success: 'bg-emerald-100 text-emerald-800',
    danger: 'bg-rose-100 text-rose-800',
    warning: 'bg-amber-100 text-amber-800',
};

export function StatusBadge({ text, tone = 'neutral' }: StatusBadgeProps) {
    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClassMap[tone]}`}>
            {text}
        </span>
    );
}
