import { ShoppingBag, Shield, Users2, Eye, UserCheck } from "lucide-react";

interface NavbarProps {
  currentRole: "client" | "employee" | "admin";
  onRoleChange: (role: "client" | "employee" | "admin") => void;
  cartCount: number;
  onOpenCart?: () => void;
}

export default function Navbar({
  currentRole,
  onRoleChange,
  cartCount,
  onOpenCart,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-[40] w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md text-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Brand Logo - Designed with high craft, Inter tracking-widest */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600 font-mono font-bold tracking-tighter text-white shadow-lg shadow-orange-900/30">
            JP
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500"></span>
            </span>
          </div>
          <div>
            <h1 className="font-sans text-xl font-bold tracking-widest text-white uppercase">
              THE JULIÁN <span className="text-orange-500 font-light">puffs</span>
            </h1>
            <p className="font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
              SYSTEMS ANALYST • KANBAN EDITION 2026
            </p>
          </div>
        </div>

        {/* View Switches / Roles */}
        <nav className="hidden md:flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          <button
            onClick={() => onRoleChange("client")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${
              currentRole === "client"
                ? "bg-white text-black shadow-md font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Cliente
          </button>
          
          <button
            onClick={() => onRoleChange("employee")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${
              currentRole === "employee"
                ? "bg-orange-600 text-white shadow-md font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            Empleado
          </button>
          
          <button
            onClick={() => onRoleChange("admin")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${
              currentRole === "admin"
                ? "bg-amber-500 text-black shadow-md font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            Administrador
          </button>
        </nav>

        {/* Right tools (Cart, mobile picker) */}
        <div className="flex items-center gap-4">
          {/* Active indicator */}
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-neutral-900 border border-neutral-800 py-1.5 px-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
              Base de Datos: Firebase Local
            </span>
          </div>

          {currentRole === "client" && onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-white transition hover:border-neutral-700 hover:bg-neutral-800"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 font-mono text-[10px] font-bold text-white shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Quick interactive dropdown for small screens */}
          <div className="flex md:hidden items-center">
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as any)}
              className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs font-medium text-white uppercase tracking-wider focus:outline-none focus:border-orange-500"
            >
              <option value="client">Cliente</option>
              <option value="employee">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>
        
      </div>
    </header>
  );
}
