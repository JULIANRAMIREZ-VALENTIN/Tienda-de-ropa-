import { useState } from "react";
import { Product, Order } from "../types";
import { Database } from "../database";
import { 
  ClipboardList, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Truck,
  Layers,
  Sparkles,
  Search
} from "lucide-react";
import { motion } from "motion/react";

interface EmployeeViewProps {
  products: Product[];
  orders: Order[];
  onRefreshOrders: () => void;
  onRefreshProducts: () => void;
}

export default function EmployeeView({
  products,
  orders,
  onRefreshOrders,
  onRefreshProducts,
}: EmployeeViewProps) {
  const [activeTab, setActiveTab] = useState<"kanban" | "inventory">("kanban");
  const [searchQuery, setSearchQuery] = useState("");

  // Definición de columnas de Kanban ágil
  const COLUMN_STATUSES: Order["status"][] = ["Pendiente", "En preparación", "Enviado", "Entregado"];

  const getOrderStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Pendiente": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "En preparación": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Enviado": return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "Entregado": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  const getColumnIcon = (status: Order["status"]) => {
    switch (status) {
      case "Pendiente": return <ClipboardList className="h-4 w-4 text-rose-400" />;
      case "En preparación": return <Layers className="h-4 w-4 text-orange-400" />;
      case "Enviado": return <Truck className="h-4 w-4 text-sky-400" />;
      case "Entregado": return <Check className="h-4 w-4 text-emerald-400" />;
    }
  };

  // Mover pedido en el flujo Kanban (Matemática de transiciones de estado)
  const shiftOrderStatus = (orderId: string, currentStatus: Order["status"], direction: "next" | "prev") => {
    const currentIndex = COLUMN_STATUSES.indexOf(currentStatus);
    let targetIndex = currentIndex;
    
    if (direction === "next" && currentIndex < COLUMN_STATUSES.length - 1) {
      targetIndex += 1;
    } else if (direction === "prev" && currentIndex > 0) {
      targetIndex -= 1;
    }

    if (targetIndex !== currentIndex) {
      const nextStatus = COLUMN_STATUSES[targetIndex];
      Database.updateOrderStatus(orderId, nextStatus);
      onRefreshOrders();
      onRefreshProducts(); // Por si hubiese que recalcular stock (p.ej. al entregar o cancelar)
    }
  };

  // Cálculos matemáticos rápidos del sistema del analista
  const pendingOrdersCount = orders.filter(o => o.status === "Pendiente").length;
  const preparingOrdersCount = orders.filter(o => o.status === "En preparación").length;
  const inTransitCount = orders.filter(o => o.status === "Enviado").length;
  const totalItemsCountInOrders = orders.reduce((acc, order) => {
    return acc + order.items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  // Filtrar inventario por búsqueda para empleados
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      
      {/* Encabezado de la Sección de Operaciones de Empleados */}
      <div className="mx-auto max-w-7xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] tracking-widest text-orange-500 uppercase font-semibold">Consola del Diseñador Kanban</span>
          <h2 className="font-sans text-3xl font-black uppercase text-white tracking-tight">Estación de Trabajo de Empleados</h2>
          <p className="text-xs text-neutral-400 mt-1">Supervise inventario ofrecido y distribuya despachos mediante el tablero de tarjetas restrictivas.</p>
        </div>

        {/* Switches de subsecciones */}
        <div className="flex bg-neutral-900 border border-neutral-800 p-1.5 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab("kanban")}
            className={`px-4 py-2 font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "kanban"
                ? "bg-orange-600 text-white shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Tablero Kanban ({orders.length} Pedidos)
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "inventory"
                ? "bg-orange-600 text-white shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Prendas Ofrecidas ({products.length} Chamarras)
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        {activeTab === "kanban" ? (
          <div>
            {/* KPI Cards / Metodología Ágil para el analista */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                <p className="font-mono text-xs tracking-wider text-neutral-400 uppercase">Cola Pendientes</p>
                <h4 className="text-3xl font-black tracking-tight text-white mt-2 font-mono">{pendingOrdersCount}</h4>
                <div className="absolute top-4 right-4 bg-rose-500/10 p-2 rounded-lg text-rose-500">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div className="mt-2 text-[10px] text-neutral-500">Pedidos aguardando aprobación.</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                <p className="font-mono text-xs tracking-wider text-neutral-400 uppercase">En Taller</p>
                <h4 className="text-3xl font-black tracking-tight text-orange-500 mt-2 font-mono">{preparingOrdersCount}</h4>
                <div className="absolute top-4 right-4 bg-orange-500/10 p-2 rounded-lg text-orange-500">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="mt-2 text-[10px] text-neutral-500">Puffers siendo envueltos y listos.</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                <p className="font-mono text-xs tracking-wider text-neutral-400 uppercase">En Tránsito</p>
                <h4 className="text-3xl font-black tracking-tight text-sky-450 mt-2 font-mono">{inTransitCount}</h4>
                <div className="absolute top-4 right-4 bg-sky-500/10 p-2 rounded-lg text-sky-400">
                  <Truck className="h-4 w-4" />
                </div>
                <div className="mt-2 text-[10px] text-neutral-500">En ruta con operador logístico.</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                <p className="font-mono text-xs tracking-wider text-neutral-400 uppercase">Volumen Despachado</p>
                <h4 className="text-3xl font-black tracking-tight text-emerald-400 mt-2 font-mono">{totalItemsCountInOrders} pzas</h4>
                <div className="absolute top-4 right-4 bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                  <Package className="h-4 w-4" />
                </div>
                <div className="mt-2 text-[10px] text-neutral-500">Piezas totales registradas en pedidos.</div>
              </div>
            </div>

            {/* TABLERO KANBAN DE PEDIDOS */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start overflow-x-auto pb-4">
              {COLUMN_STATUSES.map((status) => {
                const columnOrders = orders.filter((o) => o.status === status);
                return (
                  <div 
                    key={status} 
                    className="bg-neutral-920 border border-neutral-800 rounded-2xl p-4 shrink-0 w-full min-w-[280px]"
                  >
                    {/* Header de la Columna */}
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        {getColumnIcon(status)}
                        <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-white">
                          {status}
                        </h3>
                      </div>
                      <span className="font-mono text-[10px] bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded-md text-neutral-400">
                        {columnOrders.length}
                      </span>
                    </div>

                    {/* Lista de tarjetas */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide">
                      {columnOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 border border-dashed border-neutral-850 rounded-xl text-neutral-500">
                          <Package className="h-5 w-5 mb-2 stroke-1 text-neutral-600" />
                          <span className="text-[10px] font-mono tracking-wider uppercase">Sin Pedidos</span>
                        </div>
                      ) : (
                        columnOrders.map((order) => {
                          const dateObj = new Date(order.createdAt);
                          const formattedDate = dateObj.toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          });

                          return (
                            <motion.div
                              layoutId={order.id}
                              key={order.id}
                              className="bg-neutral-950 border border-neutral-850 rounded-xl p-4.5 hover:border-neutral-750 transition shadow-md"
                            >
                              {/* Tarjeta cabecera */}
                              <div className="flex items-center justify-between mb-3 border-b border-neutral-900 pb-2">
                                <span className="font-mono text-[10px] font-bold text-neutral-400">{order.id}</span>
                                <span className="font-mono text-[10px] font-black text-orange-500">${order.total.toLocaleString("es-MX")}</span>
                              </div>

                              {/* Datos del cliente - Enfatizado en las instrucciones */}
                              <div className="space-y-1.5 text-xs text-neutral-300 mb-4 bg-neutral-900/40 p-2.5 rounded-lg border border-neutral-900">
                                <p className="font-sans font-bold text-white uppercase tracking-wider text-[10px]">Cliente:</p>
                                <p className="font-semibold text-orange-400 text-xs">{order.customerName}</p>
                                
                                <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mt-2">
                                  <Mail className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                                  <span className="truncate">{order.customerEmail}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                                  <Phone className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                                  <span>{order.customerPhone}</span>
                                </div>
                                <div className="flex items-start gap-1.5 text-neutral-450 text-[11px] leading-relaxed pt-1 border-t border-neutral-900/60 mt-1">
                                  <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-500 mt-0.5" />
                                  <span className="line-clamp-2 italic">{order.customerAddress}</span>
                                </div>
                              </div>

                              {/* Concepto / Ropa seleccionada */}
                              <div className="space-y-2 mb-4">
                                <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">Ropa Ordenada:</p>
                                {order.items.map((it, idx) => (
                                  <div key={idx} className="flex gap-2.5 items-center text-xs bg-neutral-900/20 py-1.5 px-2 rounded border border-neutral-900">
                                    <img src={it.image} className="h-6 w-6 object-cover rounded" referrerPolicy="no-referrer" />
                                    <div className="flex-1 min-w-0">
                                      <p className="truncate text-neutral-350 font-medium">{it.name}</p>
                                      <p className="text-[10px] text-neutral-500 font-mono italic">Cant: {it.quantity} x ${it.price}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Controles de transición Kanban */}
                              <div className="flex justify-between items-center pt-2.5 border-t border-neutral-900 gap-2">
                                <button
                                  onClick={() => shiftOrderStatus(order.id, order.status, "prev")}
                                  disabled={status === "Pendiente"}
                                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-neutral-900 rounded-lg border border-neutral-850 text-neutral-400 transition"
                                  title="Devolver etapa"
                                >
                                  <ChevronLeft className="h-3.5 w-3.5" />
                                </button>

                                <span className={`text-[9px] border font-mono uppercase tracking-wider px-2 py-0.5 rounded ${getOrderStatusColor(order.status)}`}>
                                  {status === "Pendiente" && "Aprobar"}
                                  {status === "En preparación" && "Surtido"}
                                  {status === "Enviado" && "En Ruta"}
                                  {status === "Entregado" && "Terminado"}
                                </span>

                                <button
                                  onClick={() => shiftOrderStatus(order.id, order.status, "next")}
                                  disabled={status === "Entregado"}
                                  className="p-1.5 bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white disabled:opacity-30 disabled:bg-neutral-900 disabled:text-neutral-500 rounded-lg border border-orange-500/20 transition"
                                  title="Avanzar etapa"
                                >
                                  <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {/* Marca temporal */}
                              <div className="flex items-center gap-1.5 justify-end text-[9px] text-neutral-600 mt-2.5">
                                <Calendar className="h-3 w-3" />
                                <span>{formattedDate}</span>
                              </div>

                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* TAB DE PRENDAS QUE SE VENDEN ORIGINALMENTE */
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-neutral-800">
              <div>
                <h3 className="font-sans text-lg font-bold uppercase tracking-wider text-white">Prendas Ofrecidas en el Almacén</h3>
                <p className="text-xs text-neutral-400 mt-1">Lista interna de ropa que ofrece mi tienda y está visible actualmente para clientes.</p>
              </div>

              {/* Cajabuscar */}
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 w-full sm:w-64 text-xs">
                <Search className="h-3.5 w-3.5 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Buscar en inventario..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent focus:outline-none focus:ring-0 max-w-full text-white placeholder-neutral-500"
                />
              </div>
            </div>

            {/* Listadoclásic */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex gap-4 hover:border-neutral-750 transition">
                  <div className="h-20 w-20 bg-neutral-900 border border-neutral-850 rounded-lg overflow-hidden shrink-0">
                    <img src={p.image} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <span className="font-mono text-[9px] text-orange-500 uppercase tracking-wide block mb-0.5">{p.category}</span>
                      <h4 className="font-sans text-xs font-bold text-white uppercase leading-tight truncate">{p.name}</h4>
                      <p className="text-[10px] text-neutral-500 truncate mt-1">{p.description}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-900">
                      <span className="font-mono font-black text-xs text-neutral-300">
                        ${p.price.toLocaleString("es-MX")} <span className="text-[8px] font-normal text-neutral-500">MXN</span>
                      </span>

                      <span className={`font-mono text-[10px] font-bold py-0.5 px-2 rounded ${
                        p.stock > 10 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" 
                          : p.stock > 0 
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                            : "bg-red-500/10 text-red-400 border border-red-500/10"
                      }`}>
                        Stock: {p.stock} pzas
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
