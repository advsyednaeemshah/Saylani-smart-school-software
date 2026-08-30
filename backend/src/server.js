require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));

// ==================== DATABASE MODELS ====================

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    studentClass: { type: String, default: "Student" },
  },
  { timestamps: true }
);

const complaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trackingId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    studentClass: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    seats: { type: Number, default: 100 },
    gradient: { type: String, default: "science" },
  },
  { timestamps: true }
);

const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    studentClass: { type: String, required: true },
  },
  { timestamps: true }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const studyTaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    deadline: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    availability: {
      type: String,
      enum: ["Available", "Issued"],
      default: "Available",
    },
    color: { type: String, default: "emerald" },
    code: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, book: 1 }, { unique: true });

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    description: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    studentClass: { type: String, required: true },
    payment: { type: String, required: true },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    subtotal: { type: Number, required: true },
    serviceFee: { type: Number, default: 20 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Preparing", "Ready", "Collected"],
      default: "Preparing",
    },
  },
  { timestamps: true }
);

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Complaint = mongoose.model("Complaint", complaintSchema);
const Event = mongoose.model("Event", eventSchema);
const Registration = mongoose.model("Registration", registrationSchema);
const StudyTask = mongoose.model("StudyTask", studyTaskSchema);
const Book = mongoose.model("Book", bookSchema);
const Favorite = mongoose.model("Favorite", favoriteSchema);
const MenuItem = mongoose.model("MenuItem", menuItemSchema);
const Order = mongoose.model("Order", orderSchema);
const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

// ==================== HELPERS ====================

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const protect = async (request, response, next) => {
  try {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return response.status(401).json({ message: "Authentication required." });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return response.status(401).json({ message: "User account not found." });
    }

    request.user = user;
    next();
  } catch {
    response.status(401).json({ message: "Invalid or expired login token." });
  }
};

const handleError = (response, error) => {
  console.error(error);

  if (error.code === 11000) {
    return response.status(409).json({
      message: "This record already exists.",
    });
  }

  response.status(500).json({
    message: "Server error. Please try again.",
  });
};

// ==================== SYSTEM ROUTES ====================

app.get("/", (request, response) => {
  response.json({
    name: "Saylani Smart School API",
    status: "Online",
    database: "MongoDB",
    backend: "Express.js",
  });
});

app.get("/api/health", async (request, response) => {
  response.json({
    status: "healthy",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString(),
  });
});

// ==================== AUTHENTICATION ====================

app.post("/api/auth/signup", async (request, response) => {
  try {
    const { name, email, password, studentClass } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return response.status(400).json({
        message: "Password must contain at least six characters.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return response.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      studentClass,
    });

    response.status(201).json({
      token: createToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentClass: user.studentClass,
      },
    });
  } catch (error) {
    handleError(response, error);
  }
});

app.post("/api/auth/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    response.json({
      token: createToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentClass: user.studentClass,
      },
    });
  } catch (error) {
    handleError(response, error);
  }
});

app.get("/api/auth/me", protect, async (request, response) => {
  response.json({ user: request.user });
});

// ==================== COMPLAINTS CRUD ====================

app.get("/api/complaints", protect, async (request, response) => {
  try {
    const complaints = await Complaint.find({
      user: request.user._id,
    }).sort({ createdAt: -1 });

    response.json(complaints);
  } catch (error) {
    handleError(response, error);
  }
});

app.post("/api/complaints", protect, async (request, response) => {
  try {
    const { name, studentClass, category, title, description } = request.body;

    if (!name || !studentClass || !category || !title || !description) {
      return response.status(400).json({
        message: "All complaint fields are required.",
      });
    }

    const complaint = await Complaint.create({
      user: request.user._id,
      trackingId: `CMP-${Date.now().toString().slice(-7)}`,
      name,
      studentClass,
      category,
      title,
      description,
    });

    response.status(201).json(complaint);
  } catch (error) {
    handleError(response, error);
  }
});

app.put("/api/complaints/:id", protect, async (request, response) => {
  try {
    const complaint = await Complaint.findOneAndUpdate(
      { _id: request.params.id, user: request.user._id },
      request.body,
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return response.status(404).json({ message: "Complaint not found." });
    }

    response.json(complaint);
  } catch (error) {
    handleError(response, error);
  }
});

app.delete("/api/complaints/:id", protect, async (request, response) => {
  try {
    const complaint = await Complaint.findOneAndDelete({
      _id: request.params.id,
      user: request.user._id,
    });

    if (!complaint) {
      return response.status(404).json({ message: "Complaint not found." });
    }

    response.json({ message: "Complaint deleted successfully." });
  } catch (error) {
    handleError(response, error);
  }
});

// ==================== EVENTS AND REGISTRATION ====================

app.get("/api/events", async (request, response) => {
  try {
    response.json(await Event.find().sort({ createdAt: 1 }));
  } catch (error) {
    handleError(response, error);
  }
});

app.get("/api/events/:id", async (request, response) => {
  try {
    const event = await Event.findById(request.params.id);

    if (!event) {
      return response.status(404).json({ message: "Event not found." });
    }

    response.json(event);
  } catch (error) {
    handleError(response, error);
  }
});

app.post("/api/registrations", protect, async (request, response) => {
  try {
    const { eventId, name, email, studentClass } = request.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return response.status(404).json({ message: "Event not found." });
    }

    const registration = await Registration.create({
      user: request.user._id,
      event: eventId,
      name,
      email,
      studentClass,
    });

    response.status(201).json(registration);
  } catch (error) {
    handleError(response, error);
  }
});

app.get("/api/registrations", protect, async (request, response) => {
  try {
    const registrations = await Registration.find({
      user: request.user._id,
    }).populate("event");

    response.json(registrations);
  } catch (error) {
    handleError(response, error);
  }
});

// ==================== STUDY TASKS CRUD ====================

app.get("/api/tasks", protect, async (request, response) => {
  try {
    response.json(
      await StudyTask.find({ user: request.user._id }).sort({
        deadline: 1,
      })
    );
  } catch (error) {
    handleError(response, error);
  }
});

app.post("/api/tasks", protect, async (request, response) => {
  try {
    const { title, subject, priority, deadline } = request.body;

    if (!title || !subject || !deadline) {
      return response.status(400).json({
        message: "Title, subject, and deadline are required.",
      });
    }

    const task = await StudyTask.create({
      user: request.user._id,
      title,
      subject,
      priority,
      deadline,
    });

    response.status(201).json(task);
  } catch (error) {
    handleError(response, error);
  }
});

app.put("/api/tasks/:id", protect, async (request, response) => {
  try {
    const task = await StudyTask.findOneAndUpdate(
      { _id: request.params.id, user: request.user._id },
      request.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return response.status(404).json({ message: "Study task not found." });
    }

    response.json(task);
  } catch (error) {
    handleError(response, error);
  }
});

app.delete("/api/tasks/:id", protect, async (request, response) => {
  try {
    const task = await StudyTask.findOneAndDelete({
      _id: request.params.id,
      user: request.user._id,
    });

    if (!task) {
      return response.status(404).json({ message: "Study task not found." });
    }

    response.json({ message: "Study task deleted successfully." });
  } catch (error) {
    handleError(response, error);
  }
});

// ==================== LIBRARY ====================

app.get("/api/books", async (request, response) => {
  try {
    response.json(await Book.find().sort({ title: 1 }));
  } catch (error) {
    handleError(response, error);
  }
});

app.get("/api/favorites", protect, async (request, response) => {
  try {
    const favorites = await Favorite.find({
      user: request.user._id,
    }).populate("book");

    response.json(favorites);
  } catch (error) {
    handleError(response, error);
  }
});

app.post("/api/favorites/:bookId", protect, async (request, response) => {
  try {
    const current = await Favorite.findOne({
      user: request.user._id,
      book: request.params.bookId,
    });

    if (current) {
      await current.deleteOne();
      return response.json({
        favorite: false,
        message: "Book removed from favorites.",
      });
    }

    await Favorite.create({
      user: request.user._id,
      book: request.params.bookId,
    });

    response.status(201).json({
      favorite: true,
      message: "Book added to favorites.",
    });
  } catch (error) {
    handleError(response, error);
  }
});

// ==================== CANTEEN ====================

app.get("/api/menu", async (request, response) => {
  try {
    response.json(
      await MenuItem.find({ available: true }).sort({ category: 1 })
    );
  } catch (error) {
    handleError(response, error);
  }
});

app.post("/api/orders", protect, async (request, response) => {
  try {
    const { studentName, studentClass, payment, items } = request.body;

    if (!studentName || !studentClass || !items || items.length === 0) {
      return response.status(400).json({
        message: "Student details and order items are required.",
      });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    const serviceFee = 20;

    const order = await Order.create({
      user: request.user._id,
      orderNumber: `ORD-${Date.now().toString().slice(-7)}`,
      studentName,
      studentClass,
      payment,
      items,
      subtotal,
      serviceFee,
      total: subtotal + serviceFee,
    });

    response.status(201).json(order);
  } catch (error) {
    handleError(response, error);
  }
});

app.get("/api/orders", protect, async (request, response) => {
  try {
    response.json(
      await Order.find({ user: request.user._id }).sort({
        createdAt: -1,
      })
    );
  } catch (error) {
    handleError(response, error);
  }
});

// ==================== PORTFOLIO CONTACT ====================

app.post("/api/contact", async (request, response) => {
  try {
    const { name, email, message } = request.body;

    if (!name || !email || !message) {
      return response.status(400).json({
        message: "Name, email, and message are required.",
      });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    response.status(201).json({
      message: "Your message was received successfully.",
      id: contactMessage._id,
    });
  } catch (error) {
    handleError(response, error);
  }
});

// ==================== STARTER DATABASE DATA ====================

const seedDatabase = async () => {
  if ((await Event.countDocuments()) === 0) {
    await Event.insertMany([
      {
        title: "Annual Science Exhibition",
        date: "September 18, 2026",
        time: "9:00 AM – 2:00 PM",
        venue: "Main School Auditorium",
        category: "Academic",
        description:
          "Student experiments, robotics demonstrations, and creative solutions.",
        seats: 120,
        gradient: "science",
      },
      {
        title: "Inter-School Sports Gala",
        date: "September 24, 2026",
        time: "8:00 AM – 4:00 PM",
        venue: "Saylani Smart School Sports Ground",
        category: "Sports",
        description:
          "Cricket, football, athletics, badminton, and team activities.",
        seats: 250,
        gradient: "sports",
      },
      {
        title: "Creative Arts Festival",
        date: "October 2, 2026",
        time: "10:00 AM – 3:00 PM",
        venue: "Arts and Culture Hall",
        category: "Arts",
        description:
          "Painting, crafts, photography, music, and live performances.",
        seats: 90,
        gradient: "arts",
      },
      {
        title: "Career Guidance Seminar",
        date: "October 8, 2026",
        time: "11:00 AM – 1:00 PM",
        venue: "Conference Room A",
        category: "Seminar",
        description:
          "Future study options, important skills, and career pathways.",
        seats: 70,
        gradient: "career",
      },
    ]);
  }

  if ((await Book.countDocuments()) === 0) {
    await Book.insertMany([
      {
        title: "The Secret Garden",
        author: "Frances Hodgson Burnett",
        category: "Fiction",
        availability: "Available",
        color: "emerald",
        code: "SG",
        rating: 4.8,
        description:
          "A timeless story about friendship, discovery, and healing.",
      },
      {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        category: "Science",
        availability: "Available",
        color: "navy",
        code: "HT",
        rating: 4.9,
        description:
          "An accessible exploration of the universe, time, and black holes.",
      },
      {
        title: "The Story of Mathematics",
        author: "Richard Mankiewicz",
        category: "Mathematics",
        availability: "Issued",
        color: "orange",
        code: "M+",
        rating: 4.6,
        description:
          "Discover how mathematical ideas transformed the world.",
      },
      {
        title: "Pakistan: A Modern History",
        author: "Ian Talbot",
        category: "History",
        availability: "Available",
        color: "green",
        code: "PK",
        rating: 4.5,
        description:
          "An introduction to Pakistan's history and modern development.",
      },
      {
        title: "The Little Prince",
        author: "Antoine de Saint-Exupery",
        category: "Fiction",
        availability: "Available",
        color: "purple",
        code: "LP",
        rating: 4.9,
        description:
          "A beautiful story about imagination, responsibility, and friendship.",
      },
      {
        title: "Computer Science Essentials",
        author: "Saylani Smart School Publications",
        category: "Technology",
        availability: "Issued",
        color: "cyan",
        code: "</>",
        rating: 4.7,
        description:
          "Programming, algorithms, systems, networks, and digital safety.",
      },
    ]);
  }

  if ((await MenuItem.countDocuments()) === 0) {
    await MenuItem.insertMany([
      {
        name: "Chicken Sandwich",
        price: 280,
        category: "Meals",
        icon: "Sandwich",
        color: "orange",
        description: "Grilled chicken, vegetables, cheese, and house sauce.",
      },
      {
        name: "Vegetable Pizza",
        price: 350,
        category: "Meals",
        icon: "Pizza",
        color: "red",
        description: "Vegetables, mozzarella, tomato sauce, and herbs.",
      },
      {
        name: "Fruit Salad",
        price: 180,
        category: "Healthy",
        icon: "Fruit",
        color: "pink",
        description: "A colorful mix of fresh seasonal fruit.",
      },
      {
        name: "Chicken Biryani",
        price: 320,
        category: "Meals",
        icon: "Biryani",
        color: "yellow",
        description: "Aromatic rice, chicken, herbs, spices, and raita.",
      },
      {
        name: "Fresh Orange Juice",
        price: 150,
        category: "Drinks",
        icon: "Juice",
        color: "orange",
        description: "Fresh orange juice without artificial colors.",
      },
      {
        name: "Chocolate Muffin",
        price: 120,
        category: "Snacks",
        icon: "Muffin",
        color: "brown",
        description: "A soft chocolate muffin baked fresh.",
      },
      {
        name: "French Fries",
        price: 160,
        category: "Snacks",
        icon: "Fries",
        color: "yellow",
        description: "Crispy golden fries with tomato sauce.",
      },
      {
        name: "Mineral Water",
        price: 60,
        category: "Drinks",
        icon: "Water",
        color: "blue",
        description: "A chilled bottle of clean mineral water.",
      },
    ]);
  }
};

// ==================== SERVER START ====================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected: eduverse_school");
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Saylani Smart School API running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

