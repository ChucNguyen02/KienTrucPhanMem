import { FormEvent, useEffect, useMemo, useState } from 'react';

type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPING' | 'DELIVERED';

type OrderResponse = {
    id: number;
    customerName: string;
    productName: string;
    amount: number;
    status: OrderStatus;
    trackingCode: string | null;
};

type CreateOrderRequest = {
    customerName: string;
    productName: string;
    amount: number;
};

const POLLING_INTERVAL_MS = 2500;
const RUNNING_STATUSES: OrderStatus[] = ['PENDING', 'PAID'];

const statusClassMap: Record<OrderStatus, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    PAID: 'bg-sky-100 text-sky-800',
    SHIPPING: 'bg-emerald-100 text-emerald-800',
    DELIVERED: 'bg-green-200 text-green-900',
};

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(path, {
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers ?? {}),
        },
        ...init,
    });

    if (!response.ok) {
        const fallbackMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
            const text = await response.text();
            throw new Error(text || fallbackMessage);
        } catch {
            throw new Error(fallbackMessage);
        }
    }

    return (await response.json()) as T;
}

function formatMoney(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(amount);
}

function App() {
    const [createForm, setCreateForm] = useState<CreateOrderRequest>({
        customerName: '',
        productName: '',
        amount: 100000,
    });
    const [lookupId, setLookupId] = useState('');

    const [currentOrder, setCurrentOrder] = useState<OrderResponse | null>(null);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingLookup, setLoadingLookup] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);

    const isRunning = useMemo(
        () => (currentOrder ? RUNNING_STATUSES.includes(currentOrder.status) : false),
        [currentOrder],
    );

    async function fetchOrderById(orderId: number, silent = false): Promise<void> {
        try {
            if (!silent) {
                setLoadingLookup(true);
            }
            const order = await apiRequest<OrderResponse>(`/api/orders/${orderId}`);
            setCurrentOrder(order);
            setErrorMessage(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Cannot fetch order';
            setErrorMessage(message);
        } finally {
            setLoadingLookup(false);
        }
    }

    async function handleCreateOrder(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setLoadingCreate(true);
        setErrorMessage(null);
        setInfoMessage(null);

        try {
            const payload: CreateOrderRequest = {
                customerName: createForm.customerName.trim(),
                productName: createForm.productName.trim(),
                amount: Number(createForm.amount),
            };

            const created = await apiRequest<OrderResponse>('/api/orders', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            setCurrentOrder(created);
            setLookupId(String(created.id));
            setInfoMessage('Order created successfully. Tracking has started.');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Cannot create order';
            setErrorMessage(message);
        } finally {
            setLoadingCreate(false);
        }
    }

    async function handleLookupOrder(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setErrorMessage(null);
        setInfoMessage(null);

        const parsedId = Number(lookupId);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            setErrorMessage('Order ID must be a positive integer.');
            return;
        }

        await fetchOrderById(parsedId);
    }

    useEffect(() => {
        if (!currentOrder || !isRunning) {
            return;
        }

        const intervalId = window.setInterval(() => {
            void fetchOrderById(currentOrder.id, true);
        }, POLLING_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, [currentOrder, isRunning]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-indigo-100 p-6 text-slate-900 sm:p-10">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <header className="rounded-2xl bg-white/70 p-6 shadow-glow backdrop-blur">
                    <p className="text-sm uppercase tracking-[0.2em] text-sky-700">Mini E-commerce Workflow</p>
                    <h1 className="mt-2 text-3xl font-bold">Order Pipeline Dashboard</h1>
                    <p className="mt-2 text-slate-700">
                        This UI talks to order-service (<span className="font-semibold">localhost:8081</span>) and auto-refreshes status while payment/shipping services process events.
                    </p>
                </header>

                <section className="grid gap-6 lg:grid-cols-2">
                    <form
                        onSubmit={(event) => {
                            void handleCreateOrder(event);
                        }}
                        className="rounded-2xl bg-white p-6 shadow-lg"
                    >
                        <h2 className="text-xl font-semibold">Create Order</h2>
                        <p className="mt-1 text-sm text-slate-600">POST /api/orders</p>

                        <div className="mt-5 space-y-4">
                            <label className="block text-sm font-medium">
                                Customer Name
                                <input
                                    value={createForm.customerName}
                                    onChange={(event) => {
                                        setCreateForm((prev) => ({ ...prev, customerName: event.target.value }));
                                    }}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                                    placeholder="Nguyen Van A"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium">
                                Product Name
                                <input
                                    value={createForm.productName}
                                    onChange={(event) => {
                                        setCreateForm((prev) => ({ ...prev, productName: event.target.value }));
                                    }}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                                    placeholder="Laptop"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium">
                                Amount (VND)
                                <input
                                    type="number"
                                    min="1"
                                    step="1000"
                                    value={createForm.amount}
                                    onChange={(event) => {
                                        setCreateForm((prev) => ({ ...prev, amount: Number(event.target.value) }));
                                    }}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                                    required
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingCreate}
                            className="mt-5 w-full rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            {loadingCreate ? 'Creating...' : 'Create Order'}
                        </button>
                    </form>

                    <form
                        onSubmit={(event) => {
                            void handleLookupOrder(event);
                        }}
                        className="rounded-2xl bg-white p-6 shadow-lg"
                    >
                        <h2 className="text-xl font-semibold">Lookup Order</h2>
                        <p className="mt-1 text-sm text-slate-600">GET /api/orders/{'{orderId}'}</p>

                        <div className="mt-5 space-y-4">
                            <label className="block text-sm font-medium">
                                Order ID
                                <input
                                    type="number"
                                    min="1"
                                    value={lookupId}
                                    onChange={(event) => setLookupId(event.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                                    placeholder="1"
                                    required
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingLookup}
                            className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            {loadingLookup ? 'Loading...' : 'Get Order'}
                        </button>

                        <p className="mt-4 text-sm text-slate-600">
                            Polling: {isRunning ? `ON (every ${POLLING_INTERVAL_MS / 1000}s)` : 'OFF'}
                        </p>
                    </form>
                </section>

                {errorMessage ? (
                    <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
                ) : null}

                {infoMessage ? (
                    <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{infoMessage}</div>
                ) : null}

                <section className="rounded-2xl bg-white p-6 shadow-lg">
                    <h2 className="text-xl font-semibold">Order Snapshot</h2>
                    {!currentOrder ? (
                        <p className="mt-3 text-slate-600">No order selected yet.</p>
                    ) : (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <StatCard label="Order ID" value={String(currentOrder.id)} />
                            <StatCard label="Customer" value={currentOrder.customerName} />
                            <StatCard label="Product" value={currentOrder.productName} />
                            <StatCard label="Amount" value={formatMoney(currentOrder.amount)} />
                            <div className="rounded-xl border border-slate-200 p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                                <span
                                    className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${statusClassMap[currentOrder.status]}`}
                                >
                                    {currentOrder.status}
                                </span>
                            </div>
                            <StatCard label="Tracking Code" value={currentOrder.trackingCode ?? 'Not generated yet'} />
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

type StatCardProps = {
    label: string;
    value: string;
};

function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-2 break-all text-sm font-semibold text-slate-900">{value}</p>
        </div>
    );
}

export default App;
