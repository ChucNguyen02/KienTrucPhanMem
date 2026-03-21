import clsx from "clsx";

interface StatusBadgeProps {
    label: string;
    tone?: "green" | "yellow" | "red" | "blue" | "gray";
}

const toneMap = {
    green: "bg-emerald-100 text-emerald-700",
    yellow: "bg-amber-100 text-amber-700",
    red: "bg-rose-100 text-rose-700",
    blue: "bg-sky-100 text-sky-700",
    gray: "bg-slate-100 text-slate-700",
};

export const StatusBadge = ({ label, tone = "gray" }: StatusBadgeProps) => {
    return (
        <span className={clsx("inline-flex rounded-full px-3 py-1 text-xs font-semibold", toneMap[tone])}>
            {label}
        </span>
    );
};
