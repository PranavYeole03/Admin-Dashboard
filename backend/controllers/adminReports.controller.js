import PDFDocument from "pdfkit";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";

/* ================= COMMON DESIGN ================= */

/* HEADER */
const addHeader = (doc, title) => {
  doc.rect(0, 0, 612, 70).fill("#0f172a");

  doc
    .fillColor("#ffffff")
    .fontSize(18)
    .text(title, 40, 25);

  doc.moveDown(2);
  doc.fillColor("#000");
};

/* FOOTER */
const addFooter = (doc) => {
  const range = doc.bufferedPageRange();

  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);

    doc
      .fontSize(9)
      .fillColor("#666")
      .text(
        `Page ${i + 1} of ${range.count}`,
        0,
        doc.page.height - 30,
        { align: "center" }
      );
  }
};

/* INFO SECTION (DYNAMIC HEIGHT + PERFECT GAP) */
const infoSection = (doc, data) => {
  const padding = 20;
  const lineHeight = 18;

  const boxHeight = padding + data.length * lineHeight + 10;
  const startY = doc.y + 20;

  doc
    .roundedRect(40, startY, 520, boxHeight, 6)
    .fill("#f8fafc");

  let y = startY + padding;

  data.forEach((item) => {
    doc
      .fontSize(12)
      .fillColor("#111")
      .text(item, 60, y);
    y += lineHeight;
  });

  doc.y = startY + boxHeight + 20;
};

/* TABLE (PERFECT ALIGNMENT + PAGINATION) */
const drawTable = (doc, orders, title) => {
  let y = doc.y + 10;
  const rowHeight = 28;

  const col = {
    id: 50,
    details: 140,
    amount: 360,
    date: 450
  };

  /* HEADER */
  doc
    .roundedRect(40, y, 520, rowHeight, 5)
    .fill("#e2e8f0");

  doc
    .fillColor("#000")
    .fontSize(11)
    .text("Order ID", col.id, y + 8)
    .text("Details", col.details, y + 8)
    .text("Amount", col.amount, y + 8)
    .text("Date", col.date, y + 8);

  y += rowHeight + 8;

  /* ROWS */
  orders.forEach((order, i) => {

    if (y + rowHeight > doc.page.height - 60) {
      doc.addPage();
      addHeader(doc, title);
      y = 100;
    }

    if (i % 2 === 0) {
      doc
        .roundedRect(40, y - 2, 520, rowHeight, 4)
        .fill("#f9fafb");
    }

    doc
      .fillColor("#000")
      .fontSize(10)
      .text(order.id, col.id, y + 6)
      .text(order.details, col.details, y + 6, { width: 200 })
      .text(order.amount, col.amount, y + 6)
      .text(order.date, col.date, y + 6);

    y += rowHeight;
  });

  doc.y = y + 10;
};

/* ================= USER REPORT ================= */

export const downloadUserReport = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const orders = await Order.find({ user: id })
      .populate("shopOrders.shop", "name")
      .sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const doc = new PDFDocument({
      margin: 40,
      bufferPages: true
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=user-${user.fullName}.pdf`);

    doc.pipe(res);

    addHeader(doc, "FLETTO USER REPORT");

    infoSection(doc, [
      `Name: ${user.fullName}`,
      `Email: ${user.email}`,
      `Mobile: ${user.mobile}`,
      `Total Orders: ${totalOrders}`,
      `Total Spent: Rs.${totalSpent}`
    ]);

    const formattedOrders = orders.map(o => ({
      id: o._id.toString().slice(-6),
      details: o.shopOrders.map(s => s.shop?.name).join(", "),
      amount: `Rs.${o.totalAmount}`,
      date: new Date(o.createdAt).toDateString()
    }));

    drawTable(doc, formattedOrders, "FLETTO USER REPORT");

    addFooter(doc);
    doc.end();

  } catch (error) {
    res.status(500).json({ message: "User report error" });
  }
};

/* ================= OWNER REPORT ================= */

export const downloadOwnerReport = async (req, res) => {
  try {
    const { id } = req.params;

    const owner = await User.findOne({ _id: id, role: "owner" }).select("-password");
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    const shop = await Shop.findOne({ owner: id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const stats = await Order.aggregate([
      { $match: { "shopOrders.shop": shop._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalOrders = stats[0]?.totalOrders || 0;
    const totalRevenue = stats[0]?.totalRevenue || 0;

    const orders = await Order.find({ "shopOrders.shop": shop._id });

    const doc = new PDFDocument({
      margin: 40,
      bufferPages: true
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=owner-${owner.fullName}.pdf`);

    doc.pipe(res);

    addHeader(doc, "FLETTO OWNER REPORT");

    infoSection(doc, [
      `Name: ${owner.fullName}`,
      `Email: ${owner.email}`,
      `Mobile: ${owner.mobile}`,
      `Total Orders: ${totalOrders}`,
      `Revenue: Rs.${totalRevenue}`
    ]);

    const formattedOrders = orders.map(o => ({
      id: o._id.toString().slice(-6),
      details: "Shop Order",
      amount: `Rs.${o.totalAmount}`,
      date: new Date(o.createdAt).toDateString()
    }));

    drawTable(doc, formattedOrders, "FLETTO OWNER REPORT");

    addFooter(doc);
    doc.end();

  } catch (error) {
    res.status(500).json({ message: "Owner report error" });
  }
};

/* ================= DELIVERY REPORT ================= */

export const downloadDeliveryBoyReport = async (req, res) => {
  try {
    const { id } = req.params;

    const boy = await User.findById(id);
    if (!boy) return res.status(404).json({ message: "Delivery boy not found" });

    const orders = await Order.find({
      "shopOrders.assignedDeliveryBoy": id
    }).populate("user", "fullName mobile");

    const totalOrders = orders.length;
    const totalEarnings = totalOrders * 50;

    const doc = new PDFDocument({
      margin: 40,
      bufferPages: true
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=delivery-${boy.fullName}.pdf`);

    doc.pipe(res);

    addHeader(doc, "FLETTO DELIVERY REPORT");

    infoSection(doc, [
      `Name: ${boy.fullName}`,
      `Email: ${boy.email}`,
      `Mobile: ${boy.mobile}`,
      `Total Orders: ${totalOrders}`,
      `Earnings: Rs.${totalEarnings}`
    ]);

    const formattedOrders = orders.map(o => ({
      id: o._id.toString().slice(-6),
      details: o.user?.fullName || "N/A",
      amount: "Rs.50",
      date: new Date(o.createdAt).toDateString()
    }));

    drawTable(doc, formattedOrders, "FLETTO DELIVERY REPORT");

    addFooter(doc);
    doc.end();

  } catch (error) {
    res.status(500).json({ message: "Delivery report error" });
  }
};