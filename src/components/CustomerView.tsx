import { useState, FormEvent } from "react";
import { Product, OrderItem } from "../types";
import { Database } from "../database";
import { 
  Search, 
  SlidersHorizontal, 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  CheckCircle,
  Truck,
  ArrowRight,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CustomerViewProps {
  products: Product[];
  onRefreshProducts: () => void;
  cart: { product: Product; quantity: number }[];
  onSetCart: (cart: { product: Product; quantity: number }[]) => void;
  onOpenCartToggle: boolean;
  onCloseCartToggle: () => void;
}

export default function CustomerView({
  products,
  onRefreshProducts,
  cart,
  onSetCart,
  onOpenCartToggle,
  onCloseCartToggle,
}: CustomerViewProps) {
  // Búsqueda y Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [showFilters, setShowFilters] = useState(false);

  // Detalle del Producto
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Proceso de Compra
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "success">("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Categorías Únicas
  const categories = ["Todas", ...Array.from(new Set(products.map((p) => p.category)))];

  // Productos Filtrados y Procesados Matemáticamente
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || p.category === selectedCategory;
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Operaciones del Carrito
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updatedCart = [...cart];
    if (existingIndex !== -1) {
      const currentQty = updatedCart[existingIndex].quantity;
      if (currentQty >= product.stock) {
        alert(`Lo sentimos, el stock actual de este puffer es de ${product.stock} unidades.`);
        return;
      }
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({ product, quantity: 1 });
    }
    onSetCart(updatedCart);
  };

  const updateQuantity = (productId: string, delta: number) => {
    const index = cart.findIndex((item) => item.product.id === productId);
    if (index === -1) return;
    const item = cart[index];
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      // Validar contra Stock disponible en base de datos
      const originalProduct = products.find((p) => p.id === productId);
      if (originalProduct && newQty > originalProduct.stock) {
        alert(`Disculpe, el límite máximo disponible en almacén es de ${originalProduct.stock} unidades.`);
        return;
      }
      const updatedCart = [...cart];
      updatedCart[index].quantity = newQty;
      onSetCart(updatedCart);
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    onSetCart(updatedCart);
  };

  const cartTotal = cart.reduce((acc, current) => acc + current.product.price * current.quantity, 0);
  const cartItemsCount = cart.reduce((acc, current) => acc + current.quantity, 0);

  // Validación de Formulario y Envío
  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "El nombre es requerido.";
    if (!formData.email.trim()) {
      errors.email = "El correo de contacto es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Formato de correo no válido.";
    }
    if (!formData.phone.trim()) {
      errors.phone = "El teléfono de contacto es requerido.";
    } else if (!/^[0-9+-\s]{8,15}$/.test(formData.phone)) {
      errors.phone = "El teléfono debe ser numérico de 8 a 15 dígitos.";
    }
    if (!formData.address.trim()) errors.address = "La dirección de entrega es obligatoria.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsProcessing(true);

    // Simular retraso de procesamiento para dar un toque realista e interactivo
    setTimeout(() => {
      // Mapear al modelo de la DB
      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      try {
        const placedOrder = Database.addOrder({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          items: orderItems,
          total: cartTotal,
        });

        // Completado con Éxito
        setOrderSuccessId(placedOrder.id);
        setCheckoutStep("success");
        onSetCart([]); // Vaciar bolsa
        onRefreshProducts(); // Actualizar inventarios
      } catch (err) {
        console.error(err);
        alert("Ocurrió un error al procesar el pedido con la base de datos.");
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  const resetCheckout = () => {
    setCheckoutStep("cart");
    setFormData({ name: "", email: "", phone: "", address: "" });
    setFormErrors({});
    onCloseCartToggle();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500 selection:text-black">
      
      {/* 1. Hero Banner - Diseñado como catálogo minimalista de alta calidad */}
      <section className="relative overflow-hidden bg-neutral-900 border-b border-neutral-800">
        {/* Imagen de fondo sutil con máscara */}
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-15 filter grayscale blur-[2px]"></div>
        
        {/* Luces decorativas */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-orange-600/10 blur-[120px]"></div>
        <div className="absolute top-1/2 right-1/4 h-60 w-60 rounded-full bg-amber-500/5 blur-[100px]"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-28 flex flex-col md:flex-row items-center gap-12 justify-between">
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 font-mono text-xs text-orange-400 uppercase tracking-widest mb-6">
              <Sparkles className="h-3 w-3" />
              Colección Otoño-Invierno 2026
            </div>
            <h1 className="font-sans text-4xl sm:text-6xl font-black tracking-tight leading-none text-white uppercase mb-6">
              THE JULIÁN <br />
              <span className="text-orange-500">PUFFS CO.</span>
            </h1>
            <p className="text-neutral-400 text-lg font-light leading-relaxed mb-8">
              Chamarras acolchadas de lujo técnico para el hombre contemporáneo. Diseñadas científicamente para ofrecer máxima protección térmica y volumetrías estéticas audaces.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#catalogo"
                className="group flex items-center gap-3 bg-white text-black font-semibold text-xs uppercase tracking-widest px-8 py-4.5 rounded-xl transition hover:bg-neutral-200"
              >
                Explorar Catálogo 
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <div className="hidden sm:flex items-center gap-3 px-6 py-4.5 text-neutral-400 font-mono text-xs">
                <Truck className="h-4 w-4 text-orange-500" />
                Soporte y Envíos Gratis a Todo México
              </div>
            </div>
          </div>

          {/* Tarjeta de Producto Destacado */}
          <div className="relative group max-w-xs bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden p-4 shadow-2xl shadow-black/60 hidden lg:block">
            <span className="absolute top-6 left-6 z-10 rounded-md bg-amber-500 text-black px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider">
              BEST SELLER
            </span>
            <div className="overflow-hidden rounded-xl bg-neutral-900 aspect-square mb-4">
              <img 
                src="/src/assets/images/classic_puffer_1779335458432.png" 
                alt="Silver Jacket" 
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-sans text-sm font-bold tracking-tight text-white uppercase leading-tight line-clamp-1">
                Classic Silver Puffer Jacket
              </h3>
              <p className="font-mono text-xs font-bold text-orange-500">$2,499</p>
            </div>
            <p className="text-[11px] text-neutral-500 mb-4 line-clamp-2">
              Nuestro diseño icónico con laminado metalizado de alta retención de temperatura.
            </p>
            <button
              onClick={() => {
                const prod = products.find(p => p.id === "1");
                if (prod) addToCart(prod);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider transition"
            >
              <Plus className="h-3 w-3" /> Añadir al Carrito
            </button>
          </div>
        </div>
      </section>

      {/* 2. Catálogo principal e interactivos */}
      <main id="catalogo" className="mx-auto max-w-7xl px-6 py-16">
        
        {/* Barra de Filtros / Herramientas de búsqueda */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
            <div>
              <h2 className="font-sans text-2xl font-bold uppercase tracking-widest text-white">
                Prendas Técnicas <span className="font-mono text-sm text-neutral-500 font-normal">({filteredProducts.length} puffers)</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">Filtre por categoría, busque modelos o ajuste el rango de precios.</p>
            </div>

            {/* Input buscar */}
            <div className="flex items-center gap-3 max-w-md w-full md:w-80 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5">
              <Search className="h-4 w-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Buscar chamarra, estilo o detalles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-0"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="hover:text-orange-500">
                  <X className="h-3 w-3 text-neutral-500" />
                </button>
              )}
            </div>

            {/* Botón Filtros Desplegables */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 border px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                showFilters 
                  ? "bg-orange-600 text-white border-orange-600" 
                  : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Intervalo de Precios {showFilters ? "(Abierto)" : ""}
            </button>
          </div>

          {/* Panel de Filtros de Precios y Categorías */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-neutral-900/60 border-b border-neutral-800"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 px-1">
                  {/* Categoría Selector */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-3">Categorías de corte:</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs tracking-wide transition ${
                            selectedCategory === cat
                              ? "bg-orange-600 text-white font-medium"
                              : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:bg-neutral-800"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Range matemáticas */}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center justify-between font-mono text-xs text-neutral-400 mb-2">
                      <span>Rango de Presupuesto:</span>
                      <span className="text-orange-500 font-bold">${minPrice} MXN - ${maxPrice} MXN</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input 
                          type="range"
                          min="0"
                          max="5000"
                          step="100"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                          className="w-full accent-orange-600 bg-neutral-800 rounded-lg cursor-pointer h-2"
                        />
                      </div>
                      <button 
                        onClick={() => { setMinPrice(0); setMaxPrice(5000); }}
                        className="text-[10px] font-mono text-neutral-500 hover:text-white uppercase transition border border-neutral-800 rounded p-1"
                      >
                        Resetear
                      </button>
                    </div>
                    <p className="mt-2 text-[10px] text-neutral-500 italic">Precios basados en cotización arancelaria de plumas e hilo premium de The Julián Puffs.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fila rápida de Categorías */}
          {!showFilters && (
            <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 shrink-0 rounded-xl text-xs font-medium uppercase tracking-wider transition ${
                    selectedCategory === cat
                      ? "bg-white text-black font-semibold"
                      : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Rejilla principal del catálogo */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-800 rounded-3xl">
            <ShoppingBag className="h-10 w-10 text-neutral-600 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Sin puffers que coincidan</h3>
            <p className="text-xs text-neutral-400 max-w-sm">No encontramos abrigos bajo estos criterios. Pruebe reduciendo las palabras de búsqueda o ampliando el rango de precios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => {
              const isOutOfStock = p.stock <= 0;
              return (
                <motion.div 
                  key={p.id}
                  layout
                  className="group flex flex-col justify-between bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden p-4 relative transition hover:border-neutral-700/80 hover:shadow-xl hover:shadow-orange-950/10"
                >
                  {/* Stock Alert */}
                  {p.stock <= 3 && p.stock > 0 && (
                    <span className="absolute top-6 left-6 z-10 rounded bg-red-600 text-white font-mono text-[9px] font-semibold px-2 py-0.5 uppercase tracking-wide">
                      ¡Solo {p.stock} pzas!
                    </span>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-neutral-900 border border-neutral-700 text-neutral-400 font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl">
                        Agotado por Temporada
                      </span>
                    </div>
                  )}

                  {/* Imagen clickable */}
                  <div 
                    onClick={() => setSelectedProduct(p)}
                    className="overflow-hidden rounded-xl bg-neutral-900 aspect-square mb-4 cursor-pointer relative"
                  >
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                      <span className="text-white border border-white/40 bg-neutral-950/80 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                        Ver Detalles Técnicos
                      </span>
                    </div>
                  </div>

                  {/* Metadatos */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-2">
                      <span>{p.category}</span>
                      <span>Stock: {p.stock} u.</span>
                    </div>
                    <h3 
                      onClick={() => setSelectedProduct(p)}
                      className="text-base font-bold tracking-tight text-white uppercase mb-2 group-hover:text-orange-500 transition cursor-pointer leading-tight line-clamp-1"
                    >
                      {p.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-2 mb-4">
                      {p.description}
                    </p>
                  </div>

                  {/* Botón compra */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900 mt-2">
                    <span className="font-mono text-lg font-black text-orange-500">
                      ${p.price.toLocaleString("es-MX", { minimumFractionDigits: 0 })} <span className="text-[10px] font-normal text-neutral-500">MXN</span>
                    </span>
                    <button
                      onClick={() => addToCart(p)}
                      disabled={isOutOfStock}
                      className="flex items-center gap-2 bg-neutral-900 hover:bg-orange-600 hover:text-white border border-neutral-800 hover:border-orange-600 text-neutral-300 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-300"
                    >
                      <Plus className="h-3 w-3" /> Añadir
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* 4. Modal zoom de producto */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden p-6 md:p-8"
            >
              {/* Botón cerrar */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Visual */}
                <div className="bg-neutral-950 rounded-2xl overflow-hidden aspect-square border border-neutral-800">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info técnica */}
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="inline-block rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider mb-4">
                      Categoría: {selectedProduct.category}
                    </span>
                    <h2 className="text-2xl font-black uppercase text-white tracking-tight mb-2">
                      {selectedProduct.name}
                    </h2>
                    
                    <div className="font-mono text-2xl font-extrabold text-orange-500 mb-6">
                      ${selectedProduct.price.toLocaleString("es-MX")} <span className="text-xs font-normal text-neutral-400">MXN</span>
                    </div>

                    <div className="border-t border-b border-neutral-800 py-4 mb-6">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">Especificaciones de Fabricación:</h4>
                      <p className="text-xs text-neutral-300 leading-relaxed font-light">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-neutral-950 border border-neutral-800 p-3 rounded-xl mb-6 text-xs">
                      <div>
                        <span className="text-neutral-500 block mb-1">Estatus en Tienda:</span>
                        <span className={`${selectedProduct.stock > 0 ? "text-emerald-400" : "text-red-400"} font-bold`}>
                          {selectedProduct.stock > 0 ? "Disponible en Stock" : "Agotado temporal"}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block mb-1">Volumen en Almacén:</span>
                        <span className="font-mono text-white font-bold">{selectedProduct.stock} prendas</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock <= 0}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-800 hover:shadow-lg hover:shadow-orange-900/10 disabled:text-neutral-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider transition"
                  >
                    {selectedProduct.stock > 0 ? "Añadir a la Bolsa de Compras" : "Agotado"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Carrito Lateral (Drawer) */}
      <AnimatePresence>
        {onOpenCartToggle && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
            
            {/* Overlay click de cerrado */}
            <div className="absolute inset-0 z-0" onClick={onCloseCartToggle} />

            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col justify-between shadow-2xl"
            >
              {/* Cabecera Bolsa */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-orange-500" />
                  <h3 className="font-sans text-base font-bold uppercase tracking-wider">Tu Bolsa de Compras</h3>
                  <span className="font-mono text-xs text-neutral-400 bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded-md">
                    {cartItemsCount} pzas
                  </span>
                </div>
                <button 
                  onClick={onCloseCartToggle}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Contenido Dinámico según Paso del Checkout */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                
                {/* PASO 1: Lista de Carrito */}
                {checkoutStep === "cart" && (
                  cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                      <ShoppingBag className="h-12 w-12 text-neutral-700 mb-4 stroke-1" />
                      <h4 className="text-sm font-bold uppercase text-white tracking-widest mb-1">La bolsa está vacía</h4>
                      <p className="text-xs text-neutral-400 max-w-xs">Añada un abrigo acolchado de alta calidad de nuestro catálogo para iniciar su pedido.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-4 bg-neutral-950 border border-neutral-850 p-3 rounded-xl relative">
                          <div className="h-16 w-16 bg-neutral-900 rounded-lg overflow-hidden shrink-0 border border-neutral-800">
                            <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <h4 className="font-sans text-xs font-bold uppercase text-white leading-tight truncate pr-6">{item.product.name}</h4>
                              <span className="font-mono text-[10px] text-neutral-500 uppercase">{item.product.category}</span>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              {/* Controles de qty */}
                              <div className="flex items-center gap-1 bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
                                <button 
                                  onClick={() => updateQuantity(item.product.id, -1)}
                                  className="p-1 text-neutral-450 hover:text-white transition"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="font-mono text-xs font-bold text-white px-2.5 min-w-[20px] text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.product.id, 1)}
                                  className="p-1 text-neutral-450 hover:text-white transition"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              {/* Precio calculado */}
                              <span className="font-mono text-xs font-bold text-orange-500">
                                ${(item.product.price * item.quantity).toLocaleString("es-MX")}
                              </span>
                            </div>
                          </div>

                          {/* Eliminar fila */}
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="absolute top-3 right-3 text-neutral-500 hover:text-red-500 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Info adicional fiscal/garantía */}
                      <div className="flex gap-3 bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-[11px] text-neutral-400 mt-6 leading-relaxed">
                        <Info className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white mb-0.5">Control de Stock Tecnológico</p>
                          Al dar click en pagar, el sistema descontará automáticamente los puffers del inventario del almacén general.
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* PASO 2: Formulario de Información Personal */}
                {checkoutStep === "form" && (
                  <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="border-b border-neutral-800 pb-3 mb-4">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">Datos de Contacto & Envío</h4>
                      <p className="text-[11px] text-neutral-500">Escriba su información real para que el empleado coordine su envío por Kanban.</p>
                    </div>

                    {/* Nombre */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-450 mb-1.5 font-semibold">Su Nombre Completo:</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej. Juan de Dios Julián"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:border-orange-500 focus:ring-0 focus:outline-none"
                      />
                      {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
                    </div>

                    {/* Correo */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-450 mb-1.5 font-semibold">Correo de Notificaciones:</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ejemplo@correo.com"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:border-orange-500 focus:ring-0 focus:outline-none"
                      />
                      {formErrors.email && <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>}
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-450 mb-1.5 font-semibold">Celular / Teléfono:</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Ej. +52 5512345678"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:border-orange-500 focus:ring-0 focus:outline-none"
                      />
                      {formErrors.phone && <p className="text-red-500 text-[10px] mt-1">{formErrors.phone}</p>}
                    </div>

                    {/* Dirección */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-450 mb-1.5 font-semibold">Dirección de Entrega Completa:</label>
                      <textarea 
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Calle, Número, Colonia, Alcaldía/Municipio, Código Postal y Estado"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:border-orange-500 focus:ring-0 focus:outline-none resize-none"
                      />
                      {formErrors.address && <p className="text-red-500 text-[10px] mt-1">{formErrors.address}</p>}
                    </div>

                    <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl flex items-start gap-2 text-[10px] text-neutral-500 leading-normal">
                      <Truck className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />
                      Estimación: Recibirá el pedido a través de paquetería express dentro de las próximas 24 a 48 horas tras ser aprobado en el tablero.
                    </div>
                  </form>
                )}

                {/* PASO 3: Pantalla Éxito */}
                {checkoutStep === "success" && (
                  <div className="flex flex-col items-center justify-center text-center py-12 h-full">
                    <div className="relative">
                      <CheckCircle className="h-16 w-16 text-emerald-500 mb-6 shrink-0" />
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-black uppercase text-white tracking-widest mb-2">¡Pedido Registrado con Éxito!</h4>
                    <p className="font-mono text-xs text-orange-400 mb-6 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
                      ID: <span className="text-white font-bold">{orderSuccessId}</span>
                    </p>
                    
                    <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl text-left text-xs text-neutral-400 space-y-2 mb-8 w-full">
                      <p className="font-bold text-white uppercase text-[10px] border-b border-neutral-800 pb-1 font-mono tracking-wider">Flujo de Sistemas (Kanban):</p>
                      <p>1. Su pedido fue guardado en el documento Firestore local de "The Julián Puffs".</p>
                      <p>2. Los empleados han recibido una alerta en su vista de operaciones.</p>
                      <p>3. Puede cambiar el rol a <strong className="text-orange-400">"Empleado"</strong> arriba para verificar y avanzar el pedido en el tablero ágil.</p>
                    </div>

                    <button
                      onClick={resetCheckout}
                      className="w-full py-3.5 bg-white text-black font-semibold rounded-xl text-xs uppercase tracking-widest hover:bg-neutral-200 transition"
                    >
                      Seguir Comprando
                    </button>
                  </div>
                )}

              </div>

              {/* Footer Totalizadores / Acciones */}
              {checkoutStep !== "success" && cart.length > 0 && (
                <div className="p-6 bg-neutral-950 border-t border-neutral-800 space-y-4">
                  <div className="space-y-1.5 font-mono text-xs text-neutral-400">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${cartTotal.toLocaleString("es-MX")} MXN</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío Nacional:</span>
                      <span className="text-emerald-400 font-bold">GRATIS</span>
                    </div>
                    <div className="flex justify-between text-white text-sm font-bold border-t border-neutral-800 pt-2.5">
                      <span>TOTAL APRECIABLE:</span>
                      <span className="text-orange-500">${cartTotal.toLocaleString("es-MX")} MXN</span>
                    </div>
                  </div>

                  {checkoutStep === "cart" ? (
                    <button
                      onClick={() => setCheckoutStep("form")}
                      className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition hover:shadow-lg hover:shadow-orange-950/20"
                    >
                      Proceder a Envío <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep("cart")}
                        className="px-4 py-4 bg-neutral-900 hover:bg-neutral-855 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0"
                      >
                        Atrás
                      </button>
                      <button
                        type="submit"
                        form="checkout-form"
                        disabled={isProcessing}
                        className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition disabled:bg-neutral-850 disabled:text-neutral-500"
                      >
                        {isProcessing ? (
                          <>Procesando Base de Datos...</>
                        ) : (
                          <>Efectuar Compra de Puffer <CheckCircle className="h-4 w-4" /></>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
