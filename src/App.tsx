import { useState, useEffect } from "react";
import { Product, Order, Employee, SaleRecord } from "./types";
import { Database } from "./database";
import Navbar from "./components/Navbar";
import CustomerView from "./components/CustomerView";
import EmployeeView from "./components/EmployeeView";
import AdminView from "./components/AdminView";
import { Users2, Shield, Eye, HelpCircle, Kanban } from "lucide-react";

export default function App() {
  // Roles de usuario del sistema ("client" es por defecto al entrar)
  const [currentRole, setCurrentRole] = useState<"client" | "employee" | "admin">("client");

  // Estados réplica de la "Base de Datos Local"
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);

  // Carrito de compras global (Persistencia en Sesión/State)
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Carga inicial sincronizada
  useEffect(() => {
    refreshProducts();
    refreshOrders();
    refreshEmployees();
    refreshSales();
  }, []);

  // Métodos de refresco de datos (Similitud con Real-Time Streams de Firestore)
  const refreshProducts = () => {
    setProducts(Database.getProducts());
  };

  const refreshOrders = () => {
    setOrders(Database.getOrders());
  };

  const refreshEmployees = () => {
    setEmployees(Database.getEmployees());
  };

  const refreshSales = () => {
    setSales(Database.getSalesHistory());
  };

  // Ítems totales en carrito de compra
  const totalCartCount = cart.reduce((acc, current) => acc + current.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between selection:bg-orange-500 selection:text-black">
      
      {/* Barra de Navegación Premium */}
      <Navbar 
        currentRole={currentRole} 
        onRoleChange={(role) => {
          setCurrentRole(role);
          // Si cambian a empleado o admin, cerramos el carrito para evitar ruidos de UI
          if (role !== "client") {
            setIsCartOpen(false);
          }
        }} 
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Riel Rápido de Información del Sistema / Modos de Prueba */}
      <div className="bg-neutral-900/40 border-b border-neutral-900 py-2.5 px-6 shrink-0">
        <div className="mx-auto max-w-7xl flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            <Kanban className="h-4 w-4 text-orange-500" />
            <span>ENFOQUE KANBAN ACTIVO</span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider">
            <span className="text-neutral-500">¿Cómo probar el flujo completo?</span>
            <div className="flex gap-2 flex-wrap text-neutral-400">
              <span>1. Agrega puffers a tu bolsa como <strong className="text-white">Cliente</strong></span>
              <span className="text-neutral-700">•</span>
              <span>2. Transiciona pedidos en el tablero como <strong className="text-orange-450">Empleado</strong></span>
              <span className="text-neutral-700">•</span>
              <span>3. Modifica precios u observa métricas de venta como <strong className="text-amber-400">Administrador</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Área Dinámica de Trabajo Principal */}
      <div className="flex-1">
        {currentRole === "client" && (
          <CustomerView 
            products={products}
            onRefreshProducts={refreshProducts}
            cart={cart}
            onSetCart={setCart}
            onOpenCartToggle={isCartOpen}
            onCloseCartToggle={() => setIsCartOpen(false)}
          />
        )}

        {currentRole === "employee" && (
          <EmployeeView 
            products={products}
            orders={orders}
            onRefreshOrders={refreshOrders}
            onRefreshProducts={refreshProducts}
          />
        )}

        {currentRole === "admin" && (
          <AdminView 
            products={products}
            employees={employees}
            sales={sales}
            onRefreshProducts={refreshProducts}
            onRefreshEmployees={refreshEmployees}
            onRefreshSales={refreshSales}
          />
        )}
      </div>

      {/* Footer corporativo de "The Julián puffs" - Diseñado con simplicidad y elegancia */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-10 px-6 mt-12">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="left flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-sans font-bold tracking-widest uppercase text-xs text-white">
              THE JULIÁN <span className="text-orange-500 font-light">puffs co.</span>
            </h3>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">
              PROYECTO INTEGROR DE ALMACÉN INTELIGENTE © 2026
            </p>
          </div>

          <div className="center text-center">
            <p className="text-[10px] text-neutral-400 leading-relaxed font-light max-w-md">
              Diseño de software guiado bajo conceptos de análisis ágiles (tablero de tarjetas con límites wip) y modelado de datos NoSQL integrado en React 19 & Tailwind CSS v4.
            </p>
          </div>

          <div className="right text-[10px] font-mono text-neutral-500 uppercase tracking-widest text-center md:text-right">
            <span>SOPORTE DE TEMPORADA EXTREMA</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
