import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function MasterLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 p-5 border-r bg-white">
        <h2 className="font-bold text-xl mb-6">Panel Maestro</h2>
        <nav className="space-y-3 flex flex-col">
          <Link to="/dashboard">Volver al dashboard</Link>
          <Link to="/master/restaurants">Solicitudes y restaurantes</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
