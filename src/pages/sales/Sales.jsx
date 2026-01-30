import { useState } from "react";

export default function Sales() {
  const [products] = useState([
    { id: 1, name: "Coca Cola 350ml", price: 2000, stock: 10 },
    { id: 2, name: "Papas", price: 1500, stock: 5 },
    { id: 3, name: "Galletas 1", price: 1000, stock: 4 },
    { id: 4, name: "Galletas 2", price: 1000, stock: 10 },
    { id: 5, name: "Galletas 3", price: 1000, stock: 10 },
    { id: 6, name: "Galletas 4", price: 1000, stock: 10 },
    { id: 7, name: "Galletas 5", price: 1000, stock: 10 },
    { id: 8, name: "Galletas 6", price: 1000, stock: 10 },
    { id: 9, name: "Galletas 7", price: 1000, stock: 15 },
    { id: 10, name: "Galletas 8", price: 1000, stock: 10 },
    { id: 11, name: "Galletas 9", price: 1000, stock: 10 },
    { id: 12, name: "Galletas 10", price: 1000, stock: 10 },
    { id: 13, name: "Galletas 11", price: 1000, stock: 10 },
    { id: 14, name: "Galletas 12", price: 1000, stock: 3 },
    { id: 15, name: "Galletas 13", price: 1000, stock: 10 },
  ]);

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [amountPaid, setAmountPaid] = useState(""); // Pago del cliente

  const addToCart = (product) => {
    if (product.stock === 0) return;

    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        if (found.qty < product.stock) {
          return prev.map((p) =>
            p.id === product.id ? { ...p, qty: p.qty + 1 } : p
          );
        }
        return prev;
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, qty: p.qty + delta } : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  const total = cart.reduce((acc, p) => acc + p.price * p.qty, 0);

  const handlePayment = () => {
    const paid = parseFloat(amountPaid);
    if (isNaN(paid) || paid < total) {
      alert("El pago debe ser igual o mayor al total");
      return;
    }

    const change = paid - total;
    alert(`Pago recibido: $${paid}\nTotal: $${total}\nCambio a devolver: $${change}`);

    // Limpiar venta
    setCart([]);
    setAmountPaid("");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-100 h-[calc(90vh-2rem)]">
      {/* Productos */}
      <section className="lg:flex-2 bg-white rounded-2xl shadow-md p-5 flex flex-col">
        <input
          className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="🔍 Buscar producto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h3 className="text-xs sm:text-sm text-gray-400 mb-2">Productos más vendidos</h3>

        <div className="grid gap-4 overflow-y-auto"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {products
            .filter((p) =>
              p.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`rounded-2xl p-4 text-left transition-all duration-200 shadow-sm hover:shadow-md text-white ${product.stock === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : product.stock <= 5
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
              >
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="opacity-90 text-xs">${product.price}</p>
                <p className="text-xs mt-1 opacity-80">Stock: {product.stock}</p>
              </button>
            ))}
        </div>

      </section>

      {/* Carrito */}
      <aside className="lg:flex-1 bg-white rounded-2xl shadow-md p-4 flex flex-col h-[calc(90vh-2rem)]">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">🧾 Venta</h2>

        {/* Lista de productos con scroll */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {cart.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              Agrega productos para iniciar la venta
            </p>
          )}

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-gray-50 rounded-xl p-3 shadow-sm"
            >
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-gray-400">${item.price} x {item.qty}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item.id, -1)}
                  className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400"
                >
                  −
                </button>
                <span className="font-medium">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, 1)}
                  className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total y pago (sticky) */}
        <div className="pt-4 mt-4 border-t border-gray-300 sticky bottom-0 bg-white">
          <div className="flex justify-between mb-2 text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>${total}</span>
          </div>

          <input
            type="number"
            min={0}
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            placeholder="Monto recibido"
            className="w-full mb-2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {amountPaid && !isNaN(amountPaid) && Number(amountPaid) >= total && (
            <p className="mb-2 text-sm text-green-600">
              Cambio a devolver: ${Number(amountPaid) - total}
            </p>
          )}

          <button
            onClick={handlePayment}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold transition"
          >
            Cobrar
          </button>
          <button
            onClick={() => { setCart([]); setAmountPaid(""); }}
            className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition"
          >
            Cancelar
          </button>
        </div>
      </aside>
    </div>
  );
}
