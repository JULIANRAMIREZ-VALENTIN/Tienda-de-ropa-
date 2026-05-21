import { Product, Order, Employee, SaleRecord } from "./types";

// Claves de LocalStorage
const STORAGE_KEYS = {
  PRODUCTS: "the_julian_puffs_products",
  ORDERS: "the_julian_puffs_orders",
  EMPLOYEES: "the_julian_puffs_employees",
  SALES: "the_julian_puffs_sales",
};

// Datos iniciales si la "base de datos" está vacía
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Classic Silver Puffer Jacket",
    price: 2499,
    description: "Chamarra acolchada de alto loft en plata metalizada brillante con aislamiento térmico premium. Cuenta con forro de retención térmica de última generación, puños ajustables con cremallera y capucha protectora desmontable. Diseñada para el frío ártico y la elegancia urbana.",
    image: "/src/assets/images/classic_puffer_1779335458432.png",
    category: "Chamarra Clásica",
    stock: 12,
  },
  {
    id: "2",
    name: "Matte Black Streetwear Puffer",
    price: 2899,
    description: "Silueta holgada y moderna streetwear en color negro mate profundo. Fabricada con poliéster técnico reciclado con ripstop ultrafuerte y recubrimiento impermeable DWR. Cremalleras impermeables YKK y capucha integrada de perfil alto.",
    image: "/src/assets/images/street_hoodie_1779335474068.png",
    category: "Streetwear",
    stock: 18,
  },
  {
    id: "3",
    name: "Burned Orange Tech Vest",
    price: 1799,
    description: "Chaleco puffer ultraligero y de perfil bajo en espectacular tono naranja quemado (interior de alta visibilidad). Confeccionado para capas versátiles con bolsillos con velcro y costuras ergonómicas selladas.",
    image: "/src/assets/images/orange_vest_1779335488435.png",
    category: "Chalecos",
    stock: 20,
  },
  {
    id: "4",
    name: "Deep Forest Heavy Parka",
    price: 3499,
    description: "Chamarra larga estilo parca acolchada premium en color verde oliva profundo. Forro de borrega suave en la capucha, cordones elásticos gruesos con herrajes metálicos y relleno sintético térmico que imita el plumón de ganso.",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=600&auto=format&fit=crop",
    category: "Parcas Largas",
    stock: 8,
  },
  {
    id: "5",
    name: "Yellow Active Ultralight",
    price: 1999,
    description: "Chamarra empacable de peso pluma en amarillo mostaza dinámico. Cuenta con microcanales deflectores de calor, ideal para senderismo de montaña o salidas nocturnas frescas. Se comprime en su propio bolsillo lateral.",
    image: "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=600&auto=format&fit=crop",
    category: "Ultraligeras",
    stock: 24,
  },
  {
    id: "6",
    name: "Polar White Athlete Snow-Puffer",
    price: 3199,
    description: "Chamarra de alto rendimiento para deportes invernales en color blanco polar con acentos en gris neutro. Trampa de nieve interna antideslizante con botones a presión, ventilación en axilas y bolsillo especial para pase de esquí.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
    category: "Deportivas",
    stock: 14,
  },
];

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "emp_1",
    name: "Julián Castro",
    role: "Director de Operaciones & Fundador",
    shift: "Matutino",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: "emp_2",
    name: "Carlos Méndez",
    role: "Analista Kanban & Logística",
    shift: "Vespertino",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: "emp_3",
    name: "Sofía Ruiz",
    role: "Supervisora de Inventario",
    shift: "Matutino",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: "emp_4",
    name: "Mateo Torres",
    role: "Coordinador de Calidad de Rellenos",
    shift: "Nocturno",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=120&auto=format&fit=crop",
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-9281",
    customerName: "Andrés Alanís",
    customerEmail: "andres.alanis@gmail.com",
    customerAddress: "Av. Universidad 1200, Ciudad de México, CP 03100",
    customerPhone: "55-1234-5678",
    items: [
      {
        productId: "1",
        name: "Classic Silver Puffer Jacket",
        price: 2499,
        quantity: 1,
        image: "/src/assets/images/classic_puffer_1779335458432.png",
      },
    ],
    total: 2499,
    status: "Pendiente",
    createdAt: "2026-05-20T18:30:00Z",
  },
  {
    id: "ORD-7392",
    customerName: "Rodrigo Gutiérrez",
    customerEmail: "rodrigo.gutier@outlook.com",
    customerAddress: "Calle de Goya 45, Col. Insurgentes Mixcoac, CP 03910",
    customerPhone: "55-9876-5432",
    items: [
      {
        productId: "3",
        name: "Burned Orange Tech Vest",
        price: 1799,
        quantity: 2,
        image: "/src/assets/images/orange_vest_1779335488435.png",
      },
    ],
    total: 3598,
    status: "En preparación",
    createdAt: "2026-05-21T02:15:00Z",
  },
  {
    id: "ORD-5103",
    customerName: "Eduardo Castillo",
    customerEmail: "lalo.castillo88@yahoo.com",
    customerAddress: "Paseo de la Reforma 222, Col. Juárez, CP 06600",
    customerPhone: "55-4321-8765",
    items: [
      {
        productId: "2",
        name: "Matte Black Streetwear Puffer",
        price: 2899,
        quantity: 1,
        image: "/src/assets/images/street_hoodie_1779335474068.png",
      },
    ],
    total: 2899,
    status: "Enviado",
    createdAt: "2026-05-20T10:45:00Z",
  },
];

const INITIAL_SALES: SaleRecord[] = [
  {
    id: "SALE-101",
    orderId: "ORD-4021",
    customerName: "Juan Pablo García",
    date: "2026-05-18T14:20:00Z",
    totalAmount: 2499,
    itemsCount: 1,
  },
  {
    id: "SALE-102",
    orderId: "ORD-3012",
    customerName: "Felipe Calderón",
    date: "2026-05-19T09:12:00Z",
    totalAmount: 4398,
    itemsCount: 2,
  },
  {
    id: "SALE-103",
    orderId: "ORD-2093",
    customerName: "Damián Alcázar",
    date: "2026-05-19T17:40:00Z",
    totalAmount: 5798,
    itemsCount: 2,
  },
  {
    id: "SALE-104",
    orderId: "ORD-1205",
    customerName: "Sebastián Yatra",
    date: "2026-05-20T13:10:00Z",
    totalAmount: 3499,
    itemsCount: 1,
  },
];

// Inicializar base de datos local
const getLocalData = <T>(key: string, initial: T[]): T[] => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initial;
  }
};

const setLocalData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Exportar funciones de base de datos
export const Database = {
  getProducts: (): Product[] => {
    return getLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  saveProducts: (products: Product[]): void => {
    setLocalData(STORAGE_KEYS.PRODUCTS, products);
  },

  updateProduct: (updated: Product): void => {
    const list = Database.getProducts();
    const index = list.findIndex((p) => p.id === updated.id);
    if (index !== -1) {
      list[index] = updated;
      Database.saveProducts(list);
    }
  },

  getOrders: (): Order[] => {
    return getLocalData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  saveOrders: (orders: Order[]): void => {
    setLocalData(STORAGE_KEYS.ORDERS, orders);
  },

  updateOrderStatus: (orderId: string, status: Order["status"]): Order[] => {
    const list = Database.getOrders();
    const index = list.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      const oldStatus = list[index].status;
      list[index].status = status;
      Database.saveOrders(list);

      // Si pasa a "Entregado" y no estaba entregado, agregamos automáticamente un historial de venta
      if (status === "Entregado" && oldStatus !== "Entregado") {
        const order = list[index];
        const newSale: SaleRecord = {
          id: `SALE-${Math.floor(100 + Math.random() * 900)}`,
          orderId: order.id,
          customerName: order.customerName,
          date: new Date().toISOString(),
          totalAmount: order.total,
          itemsCount: order.items.reduce((acc, current) => acc + current.quantity, 0),
        };
        const sales = Database.getSalesHistory();
        sales.unshift(newSale);
        Database.saveSalesHistory(sales);
      }
    }
    return list;
  },

  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">): Order => {
    const list = Database.getOrders();
    const newOrder: Order = {
      ...order,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: "Pendiente",
    };
    list.unshift(newOrder);
    Database.saveOrders(list);

    // Descontar inventario (Matemática de control de stock)
    const products = Database.getProducts();
    let inventoryChanged = false;
    newOrder.items.forEach((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
        inventoryChanged = true;
      }
    });
    if (inventoryChanged) {
      Database.saveProducts(products);
    }

    return newOrder;
  },

  getEmployees: (): Employee[] => {
    return getLocalData(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
  },

  saveEmployees: (employees: Employee[]): void => {
    setLocalData(STORAGE_KEYS.EMPLOYEES, employees);
  },

  addEmployee: (employee: Omit<Employee, "id" | "avatar">): Employee => {
    const list = Database.getEmployees();
    const newEmp: Employee = {
      ...employee,
      id: `emp_${Math.floor(5 + Math.random() * 1000)}`,
      avatar: `https://images.unsplash.com/photo-${[
        "1534528741775-53994a69daeb",
        "1506794778202-cad84cf45f1d",
        "1492562080023-ab3db95bfbce",
        "1438761681033-6461ffad8d80"
      ][Math.floor(Math.random() * 4)]}?q=80&w=120&auto=format&fit=crop`,
    };
    list.push(newEmp);
    Database.saveEmployees(list);
    return newEmp;
  },

  updateEmployee: (updated: Employee): void => {
    const list = Database.getEmployees();
    const idx = list.findIndex((e) => e.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
      Database.saveEmployees(list);
    }
  },

  getSalesHistory: (): SaleRecord[] => {
    return getLocalData(STORAGE_KEYS.SALES, INITIAL_SALES);
  },

  saveSalesHistory: (sales: SaleRecord[]): void => {
    setLocalData(STORAGE_KEYS.SALES, sales);
  },
};
