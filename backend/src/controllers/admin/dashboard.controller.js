import prisma from '../../utils/prisma.js';

const calculateTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const getDateRanges = (range) => {
  const now = new Date();
  let startDate = new Date();
  let prevStartDate = new Date();
  let prevEndDate = new Date();

  startDate.setHours(0, 0, 0, 0);

  if (range === 'today') {
    prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 1);
    prevEndDate = new Date(prevStartDate);
    prevEndDate.setHours(23, 59, 59, 999);
  } else if (range === '7d') {
    startDate.setDate(now.getDate() - 7);
    prevEndDate = new Date(startDate);
    prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 7);
  } else if (range === '30d') {
    startDate.setDate(now.getDate() - 30);
    prevEndDate = new Date(startDate);
    prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 30);
  } else if (range === 'thisMonth') {
    startDate.setDate(1);
    prevEndDate = new Date(startDate);
    prevEndDate.setMilliseconds(-1);
    prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(1);
    prevStartDate.setHours(0,0,0,0);
  } else if (range === 'thisYear') {
    startDate.setMonth(0, 1);
    prevEndDate = new Date(startDate);
    prevEndDate.setMilliseconds(-1);
    prevStartDate = new Date(prevEndDate);
    prevStartDate.setMonth(0, 1);
    prevStartDate.setHours(0,0,0,0);
  } else {
    // all time
    startDate = new Date(0); // 1970
    prevStartDate = new Date(0);
    prevEndDate = new Date(0);
  }

  return { startDate, prevStartDate, prevEndDate };
};

export const getDashboardStats = async (req, res) => {
  try {
    const range = req.query.range || '30d';
    const { startDate, prevStartDate, prevEndDate } = getDateRanges(range);

    const validOrderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'confirmed'];

    // 1. Current Period Orders
    const currentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: validOrderStatuses }
      },
      select: { total: true, createdAt: true, id: true }
    });

    // 2. Previous Period Orders
    const prevOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: prevStartDate, lt: prevEndDate },
        status: { in: validOrderStatuses }
      },
      select: { total: true }
    });

    // KPIs
    const totalRevenue = currentOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const prevRevenue = prevOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const revenueTrend = calculateTrend(totalRevenue, prevRevenue);

    const totalOrders = currentOrders.length;
    const prevOrdersCount = prevOrders.length;
    const ordersTrend = calculateTrend(totalOrders, prevOrdersCount);

    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const prevAov = prevOrdersCount > 0 ? prevRevenue / prevOrdersCount : 0;
    const aovTrend = calculateTrend(aov, prevAov);

    const currentCustomers = await prisma.user.count({ where: { role: 'customer', createdAt: { gte: startDate } } });
    const prevCustomers = await prisma.user.count({ where: { role: 'customer', createdAt: { gte: prevStartDate, lt: prevEndDate } } });
    const customersTrend = calculateTrend(currentCustomers, prevCustomers);

    // Revenue by Time (Line Chart)
    const revenueMap = {};
    if (range === 'thisYear' || range === 'all') {
      currentOrders.forEach(o => {
        const key = o.createdAt.toISOString().slice(0, 7); // YYYY-MM
        revenueMap[key] = (revenueMap[key] || 0) + Number(o.total);
      });
    } else {
      currentOrders.forEach(o => {
        const key = o.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
        revenueMap[key] = (revenueMap[key] || 0) + Number(o.total);
      });
    }
    
    // Sort chronological
    const revenueByDay = Object.keys(revenueMap).sort().map(date => ({
      date,
      revenue: revenueMap[date]
    }));

    // Orders By Status (Doughnut)
    const statusGroups = await prisma.order.groupBy({
      by: ['status'],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
    });
    const ordersByStatus = statusGroups.map(g => ({ status: g.status, count: g._count.id }));

    // Sales by Category & Top Products
    const orderItems = await prisma.orderItem.findMany({
      where: { order: { createdAt: { gte: startDate }, status: { in: validOrderStatuses } } },
      include: {
        product: {
          include: { 
            category: { include: { translations: true } }, 
            images: true, 
            translations: true 
          }
        }
      }
    });

    const categoryMap = {};
    const productMap = {};

    orderItems.forEach(item => {
      const catName = item.product?.category?.translations?.find(t => t.locale === 'en')?.name || item.product?.category?.translations?.[0]?.name || 'Uncategorized';
      categoryMap[catName] = (categoryMap[catName] || 0) + Number(item.totalPrice);

      const pId = item.productId;
      if (!productMap[pId]) {
        productMap[pId] = {
          id: pId,
          name: item.product?.translations?.find(t => t.locale === 'en')?.name || item.product?.translations?.[0]?.name || item.product?.slug,
          image: item.product?.images?.find(i => i.isPrimary)?.url || item.product?.images?.[0]?.url,
          revenue: 0,
          quantity: 0
        };
      }
      productMap[pId].revenue += Number(item.totalPrice);
      productMap[pId].quantity += item.quantity;
    });

    const salesByCategory = Object.keys(categoryMap).map(name => ({ category: name, revenue: categoryMap[name] })).sort((a,b) => b.revenue - a.revenue);
    const topProducts = Object.values(productMap).sort((a,b) => b.quantity - a.quantity).slice(0, 5);

    // Low Stock Alerts
    const lowStockAlerts = await prisma.product.findMany({
      where: { stockQuantity: { lte: 5 } },
      select: { id: true, slug: true, stockQuantity: true, images: true, translations: true },
      take: 5,
      orderBy: { stockQuantity: 'asc' }
    });

    const formattedLowStock = lowStockAlerts.map(p => ({
      id: p.id,
      name: p.translations?.find(t => t.locale === 'en')?.name || p.translations?.[0]?.name || p.slug,
      image: p.images?.find(i => i.isPrimary)?.url || p.images?.[0]?.url,
      stock: p.stockQuantity
    }));

    // Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true, email: true } } }
    });

    res.status(200).json({
      status: 'success',
      data: {
        kpis: {
          revenue: { current: totalRevenue, trend: revenueTrend },
          orders: { current: totalOrders, trend: ordersTrend },
          aov: { current: aov, trend: aovTrend },
          customers: { current: currentCustomers, trend: customersTrend }
        },
        charts: {
          revenueByTime: revenueByDay,
          ordersByStatus,
          salesByCategory
        },
        topProducts,
        lowStockAlerts: formattedLowStock,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard stats'
    });
  }
};
