import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function MasterLayout(){
 return (
  <div className="min-h-screen flex">
   <aside className="w-64 p-5 border-r">
    <h2 className="font-bold mb-6">Panel Maestro</h2>
    <nav className="space-y-3">
      <Link to="/master/restaurants">Restaurantes</Link>
      <Link to="/master/users">Usuarios</Link>
    </nav>
   </aside>
   <main className="flex-1 p-6"><Outlet/></main>
  </div>
 );
}
