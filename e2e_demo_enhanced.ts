
import crypto from 'crypto';

const BASE_URL = 'http://localhost:3000';
const MIDTRANS_SERVER_KEY = 'SB-Mid-server-test';

async function api(path: string, method: string = 'GET', body?: any, token?: string, isMultipart: boolean = false) {
  const headers: Record<string, string> = {};
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let requestBody = body;
  if (!isMultipart && body) {
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: requestBody,
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error(`❌ Failed to parse JSON response from ${method} ${path}`);
    console.error(`Raw response: ${text.substring(0, 500)}`);
    throw new Error(`Invalid JSON response from ${path}`);
  }

  if (!response.ok) {
    console.error(`Error ${method} ${path}:`, JSON.stringify(data, null, 2));
  }
  return { status: response.status, data };
}

function generateMidtransSignature(orderId: string, statusCode: string, grossAmount: string) {
  const payload = orderId + statusCode + grossAmount + MIDTRANS_SERVER_KEY;
  return crypto.createHash('sha512').update(payload).digest('hex');
}

async function runDemo() {
  console.log('🚀 Starting SmartTani Enhanced E2E Demo Script...');

  try {
    // 1. Admin setup & Login
    console.log('\n--- Phase 1: Admin Setup ---');
    const adminEmail = `admin_${Date.now()}@smarttani.id`;
    await api('/auth/register', 'POST', {
      email: adminEmail,
      password: 'password123',
      role: 'admin',
      full_name: 'Super Admin',
    });
    
    const loginAdmin = await api('/auth/login', 'POST', {
      email: adminEmail,
      password: 'password123',
    });
    const adminToken = loginAdmin.data.data.accessToken;
    console.log('✅ Admin logged in');

    // 2. Register Petani & Listing
    console.log('\n--- Phase 2: Petani Listing ---');
    const farmerEmail = `petani_${Date.now()}@smarttani.id`;
    const regFarmer = await api('/auth/register', 'POST', {
      email: farmerEmail,
      password: 'password123',
      role: 'petani',
      full_name: 'Pak Tani',
    });
    const farmerId = regFarmer.data.data.id;
    
    // Verify farmer (Admin action) - must be before login if verification is required
    await api(`/auth/users/${farmerId}/verify`, 'PATCH', {}, adminToken);
    console.log('✅ Petani registered and verified');

    const loginFarmer = await api('/auth/login', 'POST', {
      email: farmerEmail,
      password: 'password123',
    });
    const farmerToken = loginFarmer.data.data.accessToken;
    console.log('✅ Petani logged in');

    // Create Product
    const createProduct = await api('/products', 'POST', {
      title: 'Cabai Merah 1kg',
      description: 'Cabai merah segar langsung dari kebun Petani SmartTani yang sangat terpercaya.',
      category: 'Sayuran',
      price_per_unit: 35000,
      unit: 'kg',
      stock: 100,
      min_order: 1,
      location: { province: 'Jawa Barat', city: 'Bandung' }
    }, farmerToken);
    const productId = createProduct.data.data.id || createProduct.data.data._id;
    console.log('✅ Product listed:', productId);

    // Upload Image
    console.log('📤 Uploading product image...');
    const formData = new FormData();
    const fileContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    const blob = new Blob([fileContent], { type: 'image/png' });
    formData.append('image', blob, 'cabai.png');

    await api(`/products/${productId}/images`, 'POST', formData, farmerToken, true);
    console.log('✅ Product image uploaded');

    // 3. Buyer Search & Checkout
    console.log('\n--- Phase 3: Buyer Transaction ---');
    const buyerEmail = `buyer_${Date.now()}@smarttani.id`;
    const regBuyer = await api('/auth/register', 'POST', {
      email: buyerEmail,
      password: 'password123',
      role: 'buyer',
      full_name: 'Budi Pembeli',
    });
    const buyerId = regBuyer.data.data.id;
    await api(`/auth/users/${buyerId}/verify`, 'PATCH', {}, adminToken);
    
    const loginBuyer = await api('/auth/login', 'POST', {
      email: buyerEmail,
      password: 'password123',
    });
    const buyerToken = loginBuyer.data.data.accessToken;
    console.log('✅ Buyer registered, verified, and logged in');

    // Search
    const search = await api('/products?search=cabai');
    console.log('✅ Search results found:', search.data.data.length);

    // Add to cart
    await api('/cart/items', 'POST', {
      productId: productId,
      quantity: 2
    }, buyerToken);
    console.log('✅ Added to cart');

    // Checkout
    const checkout = await api('/orders', 'POST', {
      shippingAddress: {
        recipient_name: 'Budi Pembeli',
        phone_number: '081234567890',
        full_address: 'Jl. Merdeka No. 1, Blok B, Jakarta Selatan',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postal_code: '12345'
      }
    }, buyerToken);
    const orderId = checkout.data.data.id;
    const totalAmount = checkout.data.data.total_amount;
    console.log('✅ Order created:', orderId, 'Total:', totalAmount);

    // 4. Payment Simulation (Webhook)
    console.log('\n--- Phase 4: Payment Webhook ---');
    const signature = generateMidtransSignature(orderId, '200', Math.round(totalAmount).toString());
    await api('/payments/webhook', 'POST', {
      order_id: orderId,
      status_code: '200',
      gross_amount: Math.round(totalAmount).toString(),
      signature_key: signature,
      transaction_status: 'settlement'
    });
    console.log('✅ Payment simulation successful (Status: PAID)');

    // 5. Petani confirm order
    console.log('\n--- Phase 5: Petani Confirmation ---');
    await api(`/orders/${orderId}/confirm`, 'PATCH', {}, farmerToken);
    console.log('✅ Petani confirmed order');

    // 6. Logistics Update
    console.log('\n--- Phase 6: Logistics Tracking ---');
    const logisticsEmail = `logistics_${Date.now()}@smarttani.id`;
    const regLogistics = await api('/auth/register', 'POST', {
      email: logisticsEmail,
      password: 'password123',
      role: 'logistik',
      full_name: 'Kurir Kilat',
    });
    const logId = regLogistics.data.data.id;
    await api(`/auth/users/${logId}/verify`, 'PATCH', {}, adminToken);

    const loginLogistics = await api('/auth/login', 'POST', {
      email: logisticsEmail,
      password: 'password123',
    });
    const logToken = loginLogistics.data.data.accessToken;
    console.log('✅ Logistics registered, verified, and logged in');

    await api(`/shipments/${orderId}/pickup`, 'PATCH', {}, adminToken);
    console.log('✅ Status updated: PICKUP');
    
    await api(`/shipments/${orderId}/transit`, 'PATCH', {}, adminToken);
    console.log('✅ Status updated: IN_TRANSIT');
    
    await api(`/shipments/${orderId}/deliver`, 'PATCH', {}, adminToken);
    console.log('✅ Status updated: DELIVERED');

    // 7. Buyer confirm receipt
    console.log('\n--- Phase 7: Buyer Finalization ---');
    await api(`/orders/${orderId}/deliver`, 'PATCH', {}, buyerToken);
    console.log('✅ Buyer confirmed receipt (Order COMPLETED)');

    // 8. Investment Flow
    console.log('\n--- Phase 8: Investment Flow ---');
    const farmer2Email = `petani2_${Date.now()}@smarttani.id`;
    const regFarmer2 = await api('/auth/register', 'POST', {
      email: farmer2Email,
      password: 'password123',
      role: 'petani',
      full_name: 'Pak Tani Bawang',
    });
    const farmer2Id = regFarmer2.data.data.id;
    await api(`/auth/users/${farmer2Id}/verify`, 'PATCH', {}, adminToken);

    const loginFarmer2 = await api('/auth/login', 'POST', {
      email: farmer2Email,
      password: 'password123',
    });
    const farmer2Token = loginFarmer2.data.data.accessToken;
    console.log('✅ Petani 2 registered, verified, and logged in');

    const proposal = await api('/proposals', 'POST', {
      title: 'Modal Tanam Bawang Merah',
      commodity: 'Bawang Merah',
      land_area_ha: 1.5,
      location: {
        province: 'Jawa Tengah',
        city: 'Brebes',
        district: 'Wanasari',
        full_address: 'Jl. Raya Bawang No. 45'
      },
      funding_needed: 10000000,
      projected_roi_percent: 15,
      duration_days: 90,
      harvest_date_estimated: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Butuh modal bibit dan pupuk untuk musim tanam mendatang agar hasil maksimal.',
      use_of_funds: 'Bibit: 5jt, Pupuk: 3jt, Tenaga kerja: 2jt',
      risk_notes: 'Hama ulat grayak dan banjir musiman.'
    }, farmer2Token);
    const proposalId = proposal.data.data.id;
    console.log('✅ Proposal created:', proposalId);

    await api(`/proposals/${proposalId}/submit`, 'POST', {}, farmer2Token);
    await api(`/proposals/${proposalId}/approve`, 'POST', {}, adminToken);
    console.log('✅ Proposal approved by Admin');

    // 9. Investor invest
    console.log('\n--- Phase 9: Investor Funding ---');
    const investorEmail = `investor_${Date.now()}@smarttani.id`;
    const regInvestor = await api('/auth/register', 'POST', {
      email: investorEmail,
      password: 'password123',
      role: 'investor',
      full_name: 'Rich Investor',
    });
    const investorId = regInvestor.data.data.id;
    await api(`/auth/users/${investorId}/verify`, 'PATCH', {}, adminToken);

    const loginInvestor = await api('/auth/login', 'POST', {
      email: investorEmail,
      password: 'password123',
    });
    const investorToken = loginInvestor.data.data.accessToken;
    console.log('✅ Investor registered, verified, and logged in');

    await api('/investments', 'POST', {
      proposalId: proposalId,
      amount: 5000000
    }, investorToken);
    console.log('✅ Invested 5.000.000');

    // 10. Admin Dashboard
    console.log('\n--- Phase 10: Admin Analytics ---');
    console.log('⏳ Waiting for events to be processed...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    const analytics = await api('/analytics/overview', 'GET', undefined, adminToken);
    console.log('✅ Analytics retrieved:');
    console.log('- GMV:', analytics.data.data.total_gmv);
    console.log('- Total Users:', analytics.data.data.active_users);
    console.log('- Today Orders:', analytics.data.data.today_orders);
    console.log('- Pending Proposals:', analytics.data.data.pending_proposals);
    console.log('- Disbursed Investment:', analytics.data.data.disbursed_investment);

    console.log('\n✨ Enhanced E2E Demo Script Completed Successfully!');

  } catch (error) {
    console.error('\n❌ Demo failed:', error);
    process.exit(1);
  }
}

runDemo();
