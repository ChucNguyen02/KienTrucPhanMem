import type { PropsWithChildren } from "react";

export const Panel = ({ children }: PropsWithChildren) => {
    return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">{children}</section>;
};
