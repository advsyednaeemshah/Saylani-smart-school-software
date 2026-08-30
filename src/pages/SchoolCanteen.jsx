import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Utensils,
} from "lucide-react";

const menuItems = [
  {
    id: 1,
    name: "Chicken Sandwich",
    price: 280,
    category: "Meals",
    icon: "🥪",
    color: "orange",
    description: "Grilled chicken, fresh vegetables, cheese, and house sauce in toasted bread.",
  },
  {
    id: 2,
    name: "Vegetable Pizza",
    price: 350,
    category: "Meals",
    icon: "🍕",
    color: "red",
    description: "Fresh vegetables, mozzarella cheese, tomato sauce, and herbs on a soft crust.",
  },
  {
    id: 3,
    name: "Fruit Salad",
    price: 180,
    category: "Healthy",
    icon: "🍓",
    color: "pink",
    description: "A colorful seasonal mix of apples, bananas, oranges, berries, and grapes.",
  },
  {
    id: 4,
    name: "Chicken Biryani",
    price: 320,
    category: "Meals",
    icon: "🍛",
    color: "yellow",
    description: "Aromatic rice cooked with tender chicken, herbs, spices, and fresh raita.",
  },
  {
    id: 5,
    name: "Fresh Orange Juice",
    price: 150,
    category: "Drinks",
    icon: "🍊",
    color: "orange",
    description: "Freshly prepared orange juice without artificial colors or preservatives.",
  },
  {
    id: 6,
    name: "Chocolate Muffin",
    price: 120,
    category: "Snacks",
    icon: "🧁",
    color: "brown",
    description: "A soft chocolate muffin baked fresh and served as a delicious school snack.",
  },
  {
    id: 7,
    name: "French Fries",
    price: 160,
    category: "Snacks",
    icon: "🍟",
    color: "yellow",
    description: "Crispy golden potato fries lightly seasoned and served with tomato sauce.",
  },
  {
    id: 8,
    name: "Mineral Water",
    price: 60,
    category: "Drinks",
    icon: "💧",
    color: "blue",
    description: "A chilled bottle of clean mineral water for a fresh and healthy school day.",
  },
];

function SchoolCanteen() {
  const [view, setView] = useState("menu");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [student, setStudent] = useState({
    name: "",
    studentClass: "",
    payment: "Cash at Counter",
  });

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eduverse-canteen-cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("eduverse-canteen-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = subtotal > 0 ? 20 : 0;
  const total = subtotal + serviceFee;

  const addToCart = (food) => {
    const existing = cart.find((item) => item.id === food.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }

    setSelectedItem(null);
  };

  const updateQuantity = (id, amount) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const openCart = () => {
    setView("cart");
    setSelectedItem(null);
    setOrderPlaced(false);
  };

  const submitOrder = (event) => {
    event.preventDefault();

    if (!student.name.trim() || !student.studentClass.trim() || cart.length === 0) {
      return;
    }

    setOrderPlaced(true);
    setCart([]);
  };

  if (selectedItem) {
    return (
      <main className="canteen-page">
        <div className="container canteen-detail-page">
          <button className="canteen-back" onClick={() => setSelectedItem(null)}>
            <ChevronLeft /> Back to Menu
          </button>

          <section className="food-detail-card">
            <div className={`large-food-visual ${selectedItem.color}`}>
              <span>{selectedItem.icon}</span>
            </div>

            <div className="food-detail-content">
              <span className="canteen-label">{selectedItem.category}</span>
              <h1>{selectedItem.name}</h1>
              <p>{selectedItem.description}</p>

              <div className="nutrition-grid">
                <div><strong>Fresh</strong><span>Daily prepared</span></div>
                <div><strong>10–15 min</strong><span>Preparation</span></div>
                <div><strong>Student</strong><span>Friendly meal</span></div>
              </div>

              <div className="detail-price">
                <span>PRICE</span>
                <strong>Rs. {selectedItem.price}</strong>
              </div>

              <button className="canteen-primary" onClick={() => addToCart(selectedItem)}>
                <ShoppingCart /> Add to Cart
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (view === "cart") {
    return (
      <main className="canteen-page">
        <section className="cart-header">
          <div className="container">
            <button className="canteen-back light" onClick={() => setView("menu")}>
              <ChevronLeft /> Continue Shopping
            </button>
            <h1>Your Canteen Cart</h1>
            <p>Review your food items before checkout.</p>
          </div>
        </section>

        <div className="container cart-layout">
          <section className="content-card cart-items-card">
            <div className="cart-title">
              <div>
                <span className="canteen-label">YOUR ORDER</span>
                <h2>{itemCount} items selected</h2>
              </div>
              <ShoppingBag />
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <ShoppingCart />
                <h3>Your cart is empty</h3>
                <p>Add food from the school canteen menu.</p>
                <button className="canteen-primary" onClick={() => setView("menu")}>
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="cart-item-list">
                {cart.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <div className={`cart-food-icon ${item.color}`}>{item.icon}</div>
                    <div className="cart-food-info">
                      <span>{item.category}</span>
                      <h3>{item.name}</h3>
                      <p>Rs. {item.price} each</p>
                    </div>

                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, -1)}><Minus /></button>
                      <strong>{item.quantity}</strong>
                      <button onClick={() => updateQuantity(item.id, 1)}><Plus /></button>
                    </div>

                    <strong className="cart-line-price">
                      Rs. {item.price * item.quantity}
                    </strong>

                    <button className="cart-remove" onClick={() => removeItem(item.id)}>
                      <Trash2 />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="order-summary">
            <span className="canteen-label">ORDER SUMMARY</span>
            <h2>Checkout details</h2>

            <div className="summary-line">
              <span>Subtotal</span><strong>Rs. {subtotal}</strong>
            </div>
            <div className="summary-line">
              <span>Service fee</span><strong>Rs. {serviceFee}</strong>
            </div>
            <div className="summary-total">
              <span>Total</span><strong>Rs. {total}</strong>
            </div>

            <button
              className="canteen-primary"
              disabled={cart.length === 0}
              onClick={() => setView("checkout")}
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </main>
    );
  }

  if (view === "checkout") {
    return (
      <main className="canteen-page">
        <div className="container checkout-page">
          {orderPlaced ? (
            <section className="order-success">
              <span><CheckCircle2 /></span>
              <h1>Order placed successfully!</h1>
              <p>
                Thank you, {student.name}. Your canteen order is being prepared.
                Collect it from the counter in approximately 10–15 minutes.
              </p>
              <button className="canteen-primary" onClick={() => {
                setView("menu");
                setOrderPlaced(false);
                setStudent({ name: "", studentClass: "", payment: "Cash at Counter" });
              }}>
                Return to Menu
              </button>
            </section>
          ) : (
            <section className="checkout-grid">
              <article className="content-card checkout-form-card">
                <button className="canteen-back" onClick={openCart}>
                  <ChevronLeft /> Return to Cart
                </button>
                <span className="canteen-label">FINAL STEP</span>
                <h1>Complete your order</h1>
                <p>Enter the student information for order collection.</p>

                <form className="school-form" onSubmit={submitOrder}>
                  <label>
                    Student name *
                    <input
                      value={student.name}
                      onChange={(event) =>
                        setStudent({ ...student, name: event.target.value })
                      }
                      placeholder="Enter full name"
                    />
                  </label>

                  <label>
                    Class *
                    <input
                      value={student.studentClass}
                      onChange={(event) =>
                        setStudent({ ...student, studentClass: event.target.value })
                      }
                      placeholder="Example: Class 10-A"
                    />
                  </label>

                  <label>
                    Payment method
                    <select
                      value={student.payment}
                      onChange={(event) =>
                        setStudent({ ...student, payment: event.target.value })
                      }
                    >
                      <option>Cash at Counter</option>
                      <option>Student Meal Card</option>
                    </select>
                  </label>

                  <button className="canteen-primary" type="submit">
                    Confirm Order · Rs. {total}
                  </button>
                </form>
              </article>

              <aside className="checkout-summary">
                <ShoppingBag />
                <span>YOUR ORDER</span>
                <h2>{itemCount} canteen items</h2>
                {cart.map((item) => (
                  <div key={item.id}>
                    <span>{item.quantity} × {item.name}</span>
                    <strong>Rs. {item.quantity * item.price}</strong>
                  </div>
                ))}
                <div className="checkout-total">
                  <span>Total payment</span>
                  <strong>Rs. {total}</strong>
                </div>
              </aside>
            </section>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="canteen-page">
      <section className="canteen-hero">
        <div className="container canteen-hero-grid">
          <div>
            <span className="task-label">TASK 05 · FRESH SCHOOL MEALS</span>
            <h1>Good food.<br /><span>Better school days.</span></h1>
            <p>
              Explore fresh, affordable, and student-friendly meals prepared
              for a healthy and energetic learning day.
            </p>
          </div>

          <div className="canteen-feature">
            <span className="feature-emoji">🍱</span>
            <div>
              <small>TODAY'S SPECIAL</small>
              <h3>Chicken Biryani</h3>
              <p>Fresh raita included · Rs. 320</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container canteen-content">
        <section className="canteen-toolbar">
          <div className="canteen-search">
            <Search />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the canteen menu..."
            />
          </div>

          <button className="cart-button" onClick={openCart}>
            <ShoppingCart />
            My Cart
            <span>{itemCount}</span>
          </button>
        </section>

        <div className="canteen-category-list">
          {["All", "Meals", "Healthy", "Snacks", "Drinks"].map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="canteen-heading">
          <div>
            <span className="canteen-label">TODAY'S MENU</span>
            <h2>Fresh choices for every student</h2>
          </div>
          <p>{filteredItems.length} items available</p>
        </div>

        <section className="food-grid">
          {filteredItems.map((food) => (
            <article className="food-card" key={food.id}>
              <div className={`food-visual ${food.color}`}>
                <span>{food.icon}</span>
                <small>{food.category}</small>
              </div>

              <div className="food-card-content">
                <h3>{food.name}</h3>
                <p>{food.description}</p>

                <div className="food-price-row">
                  <strong>Rs. {food.price}</strong>
                  <span>Fresh today</span>
                </div>

                <div className="food-actions">
                  <button onClick={() => setSelectedItem(food)}>View Item</button>
                  <button onClick={() => addToCart(food)}>
                    <Plus /> Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

export default SchoolCanteen;

