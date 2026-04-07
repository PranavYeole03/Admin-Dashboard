import User from "../models/user.model.js"
import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"


export const getDashboardStats = async (req, res) => {

  try {

    const totalUsers = await User.countDocuments({ role: "user" })
    const totalOrders = await Order.countDocuments()
    const totalShops = await Shop.countDocuments()
    const totalDeliveryBoy = await User.countDocuments({ role: "deliveryBoy" })
    const totalOwner = await User.countDocuments({ role: "owner" })


    const revenue = await Order.aggregate([

      { $unwind: "$shopOrders" },

      {
        $match: {
          "shopOrders.status": "delivered"
        }
      },

      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$shopOrders.subtotal" },
          totalDelivered: { $sum: 1 }
        }
      }

    ])

    const totalRevenue = revenue[0]?.totalRevenue || 0
    const totalDeliveredOrders = revenue[0]?.totalDelivered || 0

    res.json({
      totalUsers,
      totalOrders,
      totalShops,
      totalRevenue,
      totalDeliveredOrders,
      totalDeliveryBoy,
      totalOwner
    })

  } catch (error) {

    res.status(500).json({ message: "Dashboard stats error" })

  }

}

export const getMonthlyRevenue = async (req, res) => {
  try {

    const data = await Order.aggregate([

      { $unwind: "$shopOrders" },

      {
        $match: {
          "shopOrders.status": "delivered"
        }
      },

      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$shopOrders.subtotal" },
          orders: { $sum: 1 }
        }
      },

      { $sort: { _id: 1 } }

    ])

    res.json(data)

  } catch (error) {
    res.status(500).json({ message: "Monthly revenue error" })
  }
}

export const getDailyRevenue = async (req, res) => {

  try {

    const data = await Order.aggregate([

      { $unwind: "$shopOrders" },

      {
        $match: {
          "shopOrders.status": "delivered"
        }
      },

      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$shopOrders.subtotal" },
          orders: { $sum: 1 }
        }
      },

      { $sort: { "_id.month": 1, "_id.day": 1 } }

    ])

    res.json(data)

  } catch (error) {

    res.status(500).json({
      message: "Daily revenue error"
    })

  }

}

export const getUsers = async (req, res) => {

  try {

    const { sort } = req.query;

    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    const result = await Promise.all(

      users.map(async (user) => {

        const orders = await Order.find({ user: user._id });

        const totalOrders = orders.length;

        const totalSpent = orders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        const lastOrder = orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0];

        return {

          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,

          totalOrders,
          totalSpent,

          createdAt: user.createdAt,
          lastOrderDate: lastOrder ? lastOrder.createdAt : null

        };

      })

    );

    // Sorting logic
    if (sort === "orders") {
      result.sort((a, b) => b.totalOrders - a.totalOrders);
    }

    if (sort === "spent") {
      result.sort((a, b) => b.totalSpent - a.totalSpent);
    }

    if (sort === "latest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: "Get users error"
    });

  }

};

export const getUserDetails = async (req, res) => {

  try {

    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const orders = await Order.find({ user: id })
      .populate("shopOrders.shop", "name")
      .sort({ createdAt: -1 });

    const totalOrders = orders.length;

    const totalSpent = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    res.json({
      profile: user,
      orders,
      stats: {
        totalOrders,
        totalSpent
      }
    });

  } catch (error) {

    res.status(500).json({
      message: "User details error"
    });

  }

};

export const blockUser = async (req, res) => {

  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      message: user.isBlocked
        ? "User blocked"
        : "User unblocked"
    });

  } catch (error) {

    res.status(500).json({
      message: "Block user error"
    });

  }

};

/* DELETE user */
export const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Delete user error",
      error
    });

  }
};

export const getOwners = async (req, res) => {
  try {

    const owners = await User.find({ role: "owner" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json(owners);

  } catch (error) {

    return res.status(500).json({
      message: "Get owners error",
      error
    });

  }
};

export const deleteOwner = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "Owner not found"
      });
    }

    return res.status(200).json({
      message: "Owner deleted successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Delete owner error",
      error
    });

  }
};

const DELIVERY_FEE = 50;

export const getDeliveryBoys = async (req, res) => {

  try {

    const deliveryBoys = await User.find({ role: "deliveryBoy" })
      .select("fullName email mobile isOnline")
      .sort({ createdAt: -1 });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await Promise.all(

      deliveryBoys.map(async (boy) => {

        const orders = await Order.find({
          "shopOrders.assignedDeliveryBoy": boy._id
        });

        let totalOrders = 0;
        let todayOrders = 0;

        orders.forEach(order => {

          order.shopOrders.forEach(shopOrder => {

            if (
              shopOrder.assignedDeliveryBoy &&
              shopOrder.assignedDeliveryBoy.toString() === boy._id.toString()
            ) {

              totalOrders++;

              if (new Date(order.createdAt) >= todayStart) {
                todayOrders++;
              }

            }

          });

        });

        const todayEarnings = todayOrders * DELIVERY_FEE;
        const totalEarnings = totalOrders * DELIVERY_FEE;

        return {

          _id: boy._id,
          fullName: boy.fullName,
          email: boy.email,
          mobile: boy.mobile,
          isOnline: boy.isOnline || false,

          totalOrders,
          todayOrders,
          todayEarnings,
          totalEarnings

        };

      })

    );

    return res.status(200).json(result);

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching delivery boys",
      error
    });

  }

};

export const getDeliveryBoyDetails = async (req, res) => {

  try {

    const { id } = req.params;

    const boy = await User.findById(id)
      .select("fullName email mobile isOnline");

    if (!boy) {

      return res.status(404).json({
        message: "Delivery boy not found"
      });

    }

    const orders = await Order.find({
      "shopOrders.assignedDeliveryBoy": id
    })
      .populate("user", "fullName mobile")
      .sort({ createdAt: -1 });

    return res.status(200).json({

      profile: {
        fullName: boy.fullName,
        email: boy.email,
        mobile: boy.mobile,
        isOnline: boy.isOnline
      },

      orders

    });

  } catch (error) {

    return res.status(500).json({
      message: "Error fetching delivery boy details",
      error
    });

  }

};

export const getAdminDeliveryAnalytics = async (req, res) => {

  try {

    const orders = await Order.find({
      "shopOrders.assignedDeliveryBoy": { $exists: true }
    });

    const dailyStats = {};

    orders.forEach(order => {

      order.shopOrders.forEach(shopOrder => {

        if (shopOrder.assignedDeliveryBoy) {

          const date = new Date(order.createdAt)
            .toISOString()
            .split("T")[0];

          if (!dailyStats[date]) {
            dailyStats[date] = 0;
          }

          dailyStats[date]++;

        }

      });

    });

    const dailyChart = Object.keys(dailyStats).map(date => ({
      date,
      deliveries: dailyStats[date],
      revenue: dailyStats[date] * DELIVERY_FEE
    }));

    const totalDeliveries = dailyChart.reduce(
      (sum, d) => sum + d.deliveries,
      0
    );

    const totalRevenue = totalDeliveries * DELIVERY_FEE;

    const deliveryBoys = await User.countDocuments({
      role: "deliveryBoy"
    });

    const onlineBoys = await User.countDocuments({
      role: "deliveryBoy",
      isOnline: true
    });

    res.json({

      totalDeliveries,
      totalRevenue,
      deliveryBoys,
      onlineBoys,

      dailyChart

    });

  } catch (error) {

    res.status(500).json({
      message: "Analytics error",
      error
    });

  }

};

export const deleteDeliveryBoy = async (req, res) => {

  try {

    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {

      return res.status(404).json({
        message: "Delivery boy not found"
      });

    }

    return res.status(200).json({
      message: "Delivery boy deleted successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Delete delivery boy error",
      error
    });

  }

};

export const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user", "fullName email mobile")
      .populate("shopOrders.shop", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);

  } catch (error) {

    return res.status(500).json({
      message: "Get orders error",
      error
    });

  }
};

export const getOrdersByStatus = async (req, res) => {
  try {

    const { status } = req.query;

    const orders = await Order.find({
      "shopOrders.status": status
    })
      .populate("user", "fullName email mobile")
      .populate("shopOrders.shop", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);

  } catch (error) {

    return res.status(500).json({
      message: "Get orders error"
    });

  }
};

export const getOrdersAnalytics = async (req, res) => {

  try {

    const analytics = await Order.aggregate([

      { $unwind: "$shopOrders" },

      {
        $group: {
          _id: "$shopOrders.status",
          value: { $sum: 1 }
        }
      }

    ])

    const formatted = analytics.map(a => ({
      name: a._id,
      value: a.value
    }))

    res.status(200).json(formatted)

  } catch (error) {

    res.status(500).json({
      message: "Analytics error"
    })

  }

}

export const getOwnerStats = async (req, res) => {

  try {

    const { id } = req.params;

    // find owner
    const owner = await User.findById(id).select("fullName email mobile");

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // find shop of that owner
    const shop = await Shop.findOne({ owner: id });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // get all orders that contain this shop
    const orders = await Order.find({
      payment: true,
      "shopOrders.shop": shop._id
    });

    let totalOrders = 0;
    let totalRevenue = 0;
    let itemsSold = 0;
    let todayRevenue = 0;

    const today = new Date().toDateString();

    const dailyRevenueMap = {};

    orders.forEach(order => {

      order.shopOrders.forEach(shopOrder => {

        if (shopOrder.shop.toString() === shop._id.toString()) {

          if (shopOrder.status === "delivered") {

            totalOrders += 1;

            totalRevenue += shopOrder.subtotal;

            if (new Date(order.createdAt).toDateString() === today) {
              todayRevenue += shopOrder.subtotal;
            }

            // items sold
            shopOrder.shopOrderItems.forEach(item => {
              itemsSold += item.quantity;
            });

            // daily chart
            const day = new Date(order.createdAt)
              .toLocaleDateString("en-US", { weekday: "short" });

            if (!dailyRevenueMap[day]) {
              dailyRevenueMap[day] = 0;
            }

            dailyRevenueMap[day] += shopOrder.subtotal;

          }

        }

      });

    });

    const dailyRevenue = Object.keys(dailyRevenueMap).map(day => ({
      date: day,
      revenue: dailyRevenueMap[day]
    }));

    res.json({
      shopName: shop.name,
      email: owner.email,
      mobile: owner.mobile,
      totalOrders,
      totalRevenue,
      todayRevenue,
      itemsSold,
      dailyRevenue
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Owner dashboard error"
    });

  }

};

export const searchUsers = async (req, res) => {

  try {

    const { search = "", sort = "latest" } = req.query;

    const matchStage = {
      role: "user"
    };

    if (search) {
      matchStage.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    let sortStage = { createdAt: -1 };

    if (sort === "orders") {
      sortStage = { totalOrders: -1 };
    }

    if (sort === "spent") {
      sortStage = { totalSpent: -1 };
    }

    const users = await User.aggregate([

      { $match: matchStage },

      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user",
          as: "orders"
        }
      },

      {
        $addFields: {
          totalOrders: { $size: "$orders" },
          totalSpent: { $sum: "$orders.totalAmount" }
        }
      },

      {
        $project: {
          password: 0,
          orders: 0
        }
      },

      { $sort: sortStage }

    ]);

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: "Search users error"
    });

  }

};

export const searchOwners = async (req, res) => {

  try {

    const { search } = req.query;

    let filter = {
      role: "owner"
    };

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const owners = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(owners);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

export const searchDeliveryBoys = async (req, res) => {

  try {

    const { search } = req.query;

    let filter = { role: "deliveryBoy" };

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } }
      ];
    }

    const deliveryBoys = await User.find(filter)
      .select("fullName email mobile isOnline")
      .sort({ createdAt: -1 });

    const DELIVERY_FEE = 50;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await Promise.all(

      deliveryBoys.map(async (boy) => {

        const orders = await Order.find({
          "shopOrders.assignedDeliveryBoy": boy._id
        });

        let totalOrders = 0;
        let todayOrders = 0;

        orders.forEach(order => {

          order.shopOrders.forEach(shopOrder => {

            if (
              shopOrder.assignedDeliveryBoy &&
              shopOrder.assignedDeliveryBoy.toString() === boy._id.toString()
            ) {

              totalOrders++;

              if (new Date(order.createdAt) >= todayStart) {
                todayOrders++;
              }

            }

          });

        });

        const todayEarnings = todayOrders * DELIVERY_FEE;
        const totalEarnings = totalOrders * DELIVERY_FEE;

        return {
          _id: boy._id,
          fullName: boy.fullName,
          mobile: boy.mobile,
          isOnline: boy.isOnline || false,

          todayOrders,
          totalOrders,
          todayEarnings,
          totalEarnings
        };

      })

    );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: "Search delivery boy error"
    });

  }

};

export const searchOrders = async (req, res) => {

  try {

    const { search, status } = req.query;

    const matchStage = {};

    if (status) {
      matchStage["shopOrders.status"] = status;
    }

    const pipeline = [
      { $match: matchStage },

      {
        $addFields: {
          orderIdString: { $toString: "$_id" }
        }
      }
    ];

    if (search) {
      pipeline.push({
        $match: {
          orderIdString: { $regex: search, $options: "i" }
        }
      });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } }
    );

    const orders = await Order.aggregate(pipeline);

    const populatedOrders = await Order.populate(orders, [
      { path: "user", select: "fullName email mobile" },
      { path: "shopOrders.shop", select: "name" }
    ]);

    res.json(populatedOrders);

  } catch (error) {

    res.status(500).json({
      message: "Search orders error"
    });

  }

};

export const getRecentOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate("user", "fullName mobile")
      .populate("shopOrders.shop", "name")
      .sort({ createdAt: -1 })
      .limit(5)

    res.json(orders)

  } catch (error) {

    res.status(500).json({
      message: "Recent orders error"
    })

  }

}

export const getTopRestaurants = async (req, res) => {

  try {

    const data = await Order.aggregate([

      { $unwind: "$shopOrders" },

      {
        $match: {
          "shopOrders.status": "delivered"
        }
      },

      {
        $group: {
          _id: "$shopOrders.shop",
          totalOrders: { $sum: 1 },
          revenue: { $sum: "$shopOrders.subtotal" }
        }
      },

      { $sort: { totalOrders: -1 } },
      { $limit: 5 }

    ])

    const populated = await Shop.populate(data, {
      path: "_id",
      select: "name"
    })

    res.json(populated)

  } catch (error) {

    res.status(500).json({
      message: "Top restaurants error"
    })

  }

}

export const getTopDeliveryPartners = async (req, res) => {

  try {

    const data = await Order.aggregate([

      { $unwind: "$shopOrders" },

      {
        $match: {
          "shopOrders.assignedDeliveryBoy": { $ne: null }
        }
      },

      {
        $group: {
          _id: "$shopOrders.assignedDeliveryBoy",
          totalOrders: { $sum: 1 }
        }
      },

      { $sort: { totalOrders: -1 } },
      { $limit: 5 }

    ])

    const populated = await User.populate(data, {
      path: "_id",
      select: "fullName"
    })

    res.json(populated)

  } catch (error) {

    res.status(500).json({
      message: "Top delivery error"
    })

  }

}

export const getFilteredOrderAnalytics = async (req, res) => {

  try {

    const { range } = req.query

    let startDate = new Date()

    if (range === "today") {
      startDate.setHours(0, 0, 0, 0)
    }

    if (range === "week") {
      startDate.setDate(startDate.getDate() - 7)
    }

    if (range === "month") {
      startDate.setMonth(startDate.getMonth() - 1)
    }

    const data = await Order.aggregate([

      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },

      { $unwind: "$shopOrders" },

      {
        $group: {
          _id: "$shopOrders.status",
          value: { $sum: 1 }
        }
      }

    ])

    const formatted = data.map(d => ({
      name: d._id,
      value: d.value
    }))

    res.json(formatted)

  } catch (error) {

    res.status(500).json({
      message: "Analytics filter error"
    })

  }

}

export const getOrdersLast7Days = async (req, res) => {

  try {

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);
    last7Days.setHours(0, 0, 0, 0);

    const data = await Order.aggregate([

      { $unwind: "$shopOrders" },

      {
        $match: {
          createdAt: { $gte: last7Days },
          "shopOrders.status": "delivered"
        }
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d/%m",
              date: "$createdAt"
            }
          },
          orders: { $sum: 1 }
        }
      },

      { $sort: { _id: 1 } }

    ])

    const formatted = data.map(item => ({
      day: item._id,
      orders: item.orders
    }))

    res.json(formatted)

  } catch (error) {

    res.status(500).json({
      message: "Orders activity error"
    })

  }

}

export const getOrdersLast30Days = async (req, res) => {

  try {

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 29);
    last30Days.setHours(0, 0, 0, 0);

    const data = await Order.aggregate([

      { $unwind: "$shopOrders" },

      {
        $match: {
          createdAt: { $gte: last30Days },
          "shopOrders.status": "delivered"
        }
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d/%m",
              date: "$createdAt"
            }
          },
          orders: { $sum: 1 }
        }
      },

      { $sort: { _id: 1 } }

    ])

    const formatted = data.map(item => ({
      day: item._id,
      orders: item.orders
    }))

    res.json(formatted)

  } catch (error) {

    res.status(500).json({
      message: "Orders last 30 days error"
    })

  }

}