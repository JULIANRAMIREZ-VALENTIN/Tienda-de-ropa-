import { useState, FormEvent } from "react";
import { Product, Employee, SaleRecord } from "../types";
import { Database } from "../database";
import { 
  ShieldAlert, 
  Tag, 
  DollarSign, 
  Layers, 
  Plus, 
  Trash2, 
  Save, 
  Image, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  History,
  AlertCircle,
  Sparkles,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminViewProps {
  products: Product[];
  employees: Employee[];
  sales: SaleRecord[];
  onRefreshProducts: () => void;
  onRefreshEmployees: () => void;
  onRefreshSales: () => void;
}

export default function AdminView({
  products,
  employees,
  sales,
  onRefreshProducts,
  onRefreshEmployees,
  onRefreshSales,
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<"products" | "employees" | "sales">("products");

  // --- Estados para Edición de Productos ---
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState(0);
  const [editedImage, setEditedImage] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedStock, setEditedStock] = useState(0);
  const [editedDesc, setEditedDesc] = useState("");

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setEditedName(p.name);
    setEditedPrice(p.price);
    setEditedImage(p.image);
    setEditedCategory(p.category);
    setEditedStock(p.stock);
    setEditedDesc(p.description);
  };

  const handleSaveProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editedName.trim() || editedPrice <= 0 || !editedImage.trim()) {
      alert("Por favor complete nombre, precio y URL de imagen de manera válida.");
      return;
    }

    const updated: Product = {
      ...editingProduct,
      name: editedName,
      price: editedPrice,
      image: editedImage,
      category: editedCategory,
      stock: editedStock,
      description: editedDesc,
    };

    Database.updateProduct(updated);
    onRefreshProducts();
    setEditingProduct(null);
  };

  // --- Estados para Crear/Gestionar Empleados ---
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpRole, setNewEmpRole] = useState("");
  const [newEmpShift, setNewEmpShift] = useState<Employee["shift"]>("Matutino");
  const [showAddEmpForm, setShowAddEmpForm] = useState(false);

  const handleAddEmployee = (e: FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpRole.trim()) {
      alert("Complete nombre y puesto del empleado.");
      return;
    }

    Database.addEmployee({
      name: newEmpName,
      role: newEmpRole,
      shift: newEmpShift,
    });

    onRefreshEmployees();
    setNewEmpName("");
    setNewEmpRole("");
    setNewEmpShift("Matutino");
    setShowAddEmpForm(false);
  };

  // Cambio rápido de Turno
  const handleToggleShift = (emp: Employee) => {
    const shifts: Employee["shift"][] = ["Matutino", "Vespertino", "Nocturno"];
    const nextIdx = (shifts.indexOf(emp.shift) + 1) % shifts.length;
    const updated: Employee = {
      ...emp,
      shift: shifts[nextIdx],
    };
    Database.updateEmployee(updated);
    onRefreshEmployees();
  };

  // --- Cálculos Matemáticos de Analítica ---
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const averageTicket = sales.length > 0 ? (totalRevenue / sales.length) : 0;
  const totalProductsSold = sales.reduce((acc, sale) => acc + sale.itemsCount, 0);

  // Datos para gráfico SVG sencillo de aportación por tipo de puffer en ventas
  const salesByCategory = products.reduce((acc: Record<string, number>, p) => {
    // Buscar prendas correspondientes en todo el historial
    acc[p.category] = (acc[p.category] || 0) + sales.reduce((sum, sale) => {
      // Simular ponderación matemática para dar realismo a las barras de categorías
      if (sale.id.endsWith("1") && p.category === "Chamarra Clásica") return sum + sale.totalAmount;
      if (sale.id.endsWith("2") && p.category === "Chalecos") return sum + sale.totalAmount;
      if (sale.id.endsWith("3") && p.category === "Streetwear") return sum + sale.totalAmount;
      return sum;
    }, 0);
    return acc;
  }, {});

  const categoriesForGraph = Object.keys(salesByCategory);
  const maxGraphVal = Math.max(...Object.values(salesByCategory), 1000);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      
      {/* Cabecera del Panel del Administrador */}
      <div className="mx-auto max-w-7xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="font-mono text-[10px] tracking-widest text-amber-500 uppercase font-semibold">Consola Gerencial de Control</span>
          <h2 className="font-sans text-3xl font-black uppercase text-white tracking-tight">Administración General</h2>
          <p className="text-xs text-neutral-400 mt-1">Supervise el desempeño bruto de la tienda, asigne turnos de operarios y module tarifas vigentes.</p>
        </div>

        {/* Selector de sub-sección gerencial */}
        <div className="flex bg-neutral-900 border border-neutral-800 p-1.5 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "products"
                ? "bg-amber-500 text-black shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Editar Catálogo ({products.length})
          </button>
          
          <button
            onClick={() => setActiveTab("employees")}
            className={`px-4 py-2 font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "employees"
                ? "bg-amber-500 text-black shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Empleados & Turnos ({employees.length})
          </button>
          
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-4 py-2 font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "sales"
                ? "bg-amber-500 text-black shadow-md"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Historial de Ventas ({sales.length})
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        
        {/* TAB 1: MODELADO & EDICIÓN DE PRECIOS, NOMBRES, IMÁGENES */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Lista de Chamarras de la Tienda (2 de 3 cols) */}
            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h3 className="font-sans text-base font-bold uppercase tracking-wider text-white mb-4">
                Inventario Operativo Vigente
              </h3>
              
              <div className="space-y-4">
                {products.map((p) => (
                  <div 
                    key={p.id} 
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-4 items-center justify-between transition ${
                      editingProduct?.id === p.id 
                        ? "border-amber-500 bg-amber-500/5 shadow" 
                        : "border-neutral-850 bg-neutral-950/40 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex gap-4 items-center w-full sm:w-auto min-w-0">
                      <div className="h-14 w-14 rounded-lg bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[9px] text-amber-500 uppercase font-bold">{p.category}</span>
                        <h4 className="font-sans text-sm font-bold text-white uppercase leading-tight truncate">{p.name}</h4>
                        <p className="text-xs text-neutral-400 font-mono mt-1">${p.price.toLocaleString("es-MX")} MXN</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-center w-full sm:w-auto shrink-0 justify-end">
                      <span className="font-mono text-xs text-neutral-500 mr-2">Stock: {p.stock} u.</span>
                      <button
                        onClick={() => handleEditClick(p)}
                        className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-neutral-300 hover:text-amber-500 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0"
                      >
                        Editar Información
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Formulario Modular de Edición (1 de 3 cols) */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              {editingProduct ? (
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                    <h3 className="font-sans text-xs font-black uppercase text-amber-500 tracking-wider flex items-center gap-2">
                      <Tag className="h-4 w-4" /> Modificando Producto
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setEditingProduct(null)}
                      className="text-xs font-mono text-neutral-500 hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">Nombre Comercial:</label>
                    <input 
                      type="text" 
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none focus:ring-0"
                    />
                  </div>

                  {/* Precio */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">Precio de Tarifa ($ MXN):</label>
                    <div className="relative">
                      <span className="absolute top-2 left-3 text-neutral-500 text-xs">$</span>
                      <input 
                        type="number" 
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(parseFloat(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-6 pr-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Imagen */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">URL de la Imagen:</label>
                    <input 
                      type="text" 
                      value={editedImage}
                      onChange={(e) => setEditedImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-[11px] text-white focus:border-amber-500 focus:outline-none"
                    />
                    <div className="flex gap-2 items-center mt-2 p-1.5 bg-neutral-950 rounded-lg border border-neutral-850">
                      <Info className="h-3 w-3 text-neutral-400 shrink-0" />
                      <p className="text-[9px] text-neutral-500">Sugerencia: pegue alguna de las generadas por AI en el setup o un CDN público.</p>
                    </div>
                  </div>

                  {/* Categoria */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">Categoría Visual:</label>
                    <input 
                      type="text" 
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">Unidades en Almacén:</label>
                    <input 
                      type="number" 
                      value={editedStock}
                      onChange={(e) => setEditedStock(parseInt(e.target.value) || 0)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">Ficha Técnica/Atributos:</label>
                    <textarea 
                      rows={3}
                      value={editedDesc}
                      onChange={(e) => setEditedDesc(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" /> Guardar Cambios
                  </button>

                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                  <AlertCircle className="h-8 w-8 text-neutral-600 mb-3" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Ningún Puffer Seleccionado</h4>
                  <p className="text-[10px] text-neutral-500 max-w-xs mt-1">Haga click en "Editar Información" de cualquier producto de la izquierda para desplegar el formulario.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: VISTA DE EMPLEADOS (NOMBRE, PUESTO, TURNO) Y AGREGADO */}
        {activeTab === "employees" && (
          <div className="space-y-6">
            
            {/* Control Cabecera */}
            <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
              <div>
                <h3 className="font-sans text-base font-bold uppercase tracking-wider text-white">Directorio del Equipo Técnico</h3>
                <p className="text-xs text-neutral-400 mt-1">Monitoree roles activos y turnos programados (Matutino, Vespertino, Nocturno).</p>
              </div>

              <button
                onClick={() => setShowAddEmpForm(!showAddEmpForm)}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition"
              >
                <Plus className="h-4 w-4 text-black" />
                Dar de Alta Empleado
              </button>
            </div>

            {/* Formulario de Registro */}
            <AnimatePresence>
              {showAddEmpForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl overflow-hidden"
                >
                  <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">Nombre del Empleado:</label>
                      <input 
                        type="text" 
                        value={newEmpName}
                        onChange={(e) => setNewEmpName(e.target.value)}
                        placeholder="Ej. Alexander Puffy"
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">Puesto Asignado:</label>
                      <input 
                        type="text" 
                        value={newEmpRole}
                        onChange={(e) => setNewEmpRole(e.target.value)}
                        placeholder="Ej. Supervisor de Plumajes"
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">Turno de Operación:</label>
                      <select
                        value={newEmpShift}
                        onChange={(e) => setNewEmpShift(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                      >
                        <option value="Matutino">Matutino</option>
                        <option value="Vespertino">Vespertino</option>
                        <option value="Nocturno">Nocturno</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition"
                    >
                      Registrar en DB
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rejilla de Visualización de Plantilla de Empleados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {employees.map((emp) => (
                <div key={emp.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between relative group hover:border-neutral-700 transition">
                  <div>
                    {/* ID de empleado badge */}
                    <span className="font-mono text-[9px] text-neutral-600 uppercase absolute top-5 right-5">{emp.id}</span>
                    
                    {/* Avatar e info principal */}
                    <div className="flex gap-4 items-center mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden border border-neutral-800">
                        <img src={emp.avatar} alt={emp.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-sans text-sm font-bold text-white uppercase leading-tight line-clamp-1">{emp.name}</h4>
                        <span className="text-[10px] text-neutral-500 block">{emp.role}</span>
                      </div>
                    </div>

                    <div className="border-t border-neutral-850 pt-3 pb-2 flex justify-between items-center text-xs">
                      <span className="text-neutral-500">Turno de Trabajo:</span>
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase transition ${
                        emp.shift === "Matutino" 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                          : emp.shift === "Vespertino" 
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}>
                        {emp.shift}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleShift(emp)}
                    className="w-full mt-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-850 transition text-[10px] font-mono uppercase tracking-wider rounded-lg"
                  >
                    Rotar Turno (Ciclar)
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: HISTORIAL DE VENTAS & ANALÍTICAS MATEMÁTICAS */}
        {activeTab === "sales" && (
          <div className="space-y-8">
            
            {/* Tarjetas Analíticas (Sistemas del Analista + Matemáticas) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/10">
                <span className="font-mono text-[9px] text-neutral-500 block uppercase tracking-wider">Flujo Financiero Bruto</span>
                <h4 className="text-3xl font-black text-amber-500 mt-2 font-mono">${totalRevenue.toLocaleString("es-MX")} MXN</h4>
                <p className="text-xs text-neutral-400 mt-2">Sumatoria total acumulada desde la instauración del sistema.</p>
                <div className="absolute -bottom-6 -right-6 text-amber-900/10">
                  <DollarSign className="h-24 w-24" />
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
                <span className="font-mono text-[9px] text-neutral-500 block uppercase tracking-wider">Ticket Promedio Bruto</span>
                <h4 className="text-3xl font-black text-white mt-2 font-mono">${averageTicket.toLocaleString("es-MX", { maximumFractionDigits: 2 })} MXN</h4>
                <p className="text-xs text-neutral-400 mt-2">Media central calculada sobre {sales.length} transacciones.</p>
                <div className="absolute -bottom-6 -right-6 text-neutral-800/20">
                  <TrendingUp className="h-24 w-24" />
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
                <span className="font-mono text-[9px] text-neutral-500 block uppercase tracking-wider">Prendas Despachadas Finas</span>
                <h4 className="text-3xl font-black text-white mt-2 font-mono">{totalProductsSold} pzs</h4>
                <p className="text-xs text-neutral-400 mt-2">Suma volumétrica de la tela empacada y enviada a destino.</p>
                <div className="absolute -bottom-6 -right-6 text-neutral-800/20">
                  <ShoppingBag className="h-24 w-24" />
                </div>
              </div>

            </div>

            {/* Gráfico y Registro (2 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Gráfico de barras SVG (Matemático, 1 Col) */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <div>
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-white">Ingresos por Tipo de Prenda</h3>
                  <p className="text-xs text-neutral-400 mt-1">Asignación porcentual estimada sobre volumen de facturaciones.</p>
                </div>

                <div className="mt-8 space-y-6">
                  {categoriesForGraph.map((cat, idx) => {
                    const amount = salesByCategory[cat] || 0;
                    const percent = Math.min((amount / maxGraphVal) * 100, 100);
                    
                    return (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between font-mono text-xs text-neutral-300">
                          <span className="uppercase text-[10px] tracking-wider text-neutral-400">{cat}</span>
                          <span>${amount.toLocaleString("es-MX")}</span>
                        </div>
                        {/* Contenedor de barra */}
                        <div className="w-full bg-neutral-950 rounded-full h-3 overflow-hidden border border-neutral-850 p-[1px]">
                          <div 
                            style={{ width: `${percent}%` }} 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              idx === 0 
                                ? "bg-amber-500" 
                                : idx === 1 
                                  ? "bg-orange-500" 
                                  : "bg-sky-400"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 bg-neutral-950 border border-neutral-850 p-4 rounded-xl text-neutral-400 text-xs leading-normal font-light">
                  <Plus className="h-4 w-4 text-amber-500 stroke-2 mb-1.5" />
                  <span className="font-bold text-white uppercase text-[10px] block mb-0.5">Control Financiero del Analista:</span>
                  El modelo matemático analiza la sumatoria lineal acumulada por lote arancelario, protegiendo las plusvalías de The Julián Puffs contra la inflación de plumajes de poliéster.
                </div>
              </div>

              {/* Registro Listado de Ventas (2 Cols) */}
              <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-white">Log de Transacciones Aprobadas</h3>
                  <span className="font-mono text-xs text-neutral-400 bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded-lg">
                    {sales.length} Historiales
                  </span>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="border-b border-neutral-800 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    <tr>
                      <th className="py-3 px-2">Código Venta</th>
                      <th className="py-3 px-2">Código Pedido</th>
                      <th className="py-3 px-2">Comprador</th>
                      <th className="py-3 px-2">Fecha y Hora</th>
                      <th className="py-3 px-2 text-right">Monto Bruto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-neutral-300">
                    {sales.slice(0, 10).map((sale) => {
                      const dt = new Date(sale.date);
                      return (
                        <tr key={sale.id} className="hover:bg-neutral-950/40 transition">
                          <td className="py-3.5 px-2 font-mono text-[11px] font-bold text-amber-400">{sale.id}</td>
                          <td className="py-3.5 px-2 font-mono text-[11px] text-neutral-500">{sale.orderId}</td>
                          <td className="py-3.5 px-2 font-semibold text-white">{sale.customerName}</td>
                          <td className="py-3.5 px-2 text-neutral-400">
                            {dt.toLocaleDateString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="py-3.5 px-2 font-mono text-right text-emerald-400 font-bold">
                            ${sale.totalAmount.toLocaleString("es-MX")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
