import emailService from '../services/email.service';
import pushService from '../services/push.service';
import { renderTemplate } from '../lib/template';
import userClient from '../lib/user-client';

/**
 * Handle user registration event
 */
export async function handleUserRegistered(payload: any) {
  const { id, email, full_name, verification_token } = payload;
  
  // Send Welcome Email
  await emailService.send({
    to: email,
    subject: 'Selamat Datang di SmartTani!',
    html: renderTemplate('welcome', { 
      name: full_name || email, 
      verificationLink: `https://smarttani.com/verify?token=${verification_token}` 
    }),
  });
}

/**
 * Handle order created event (notify farmer)
 */
export async function handleOrderCreated(payload: any) {
  const { id, total_amount, farmer_id } = payload;
  
  const farmer = await userClient.getUser(farmer_id);
  if (!farmer) return;

  await emailService.send({
    to: farmer.email,
    subject: 'Ada Pesanan Baru!',
    html: renderTemplate('order-created', { 
      farmerName: farmer.full_name || farmer.email,
      orderId: id,
      totalAmount: total_amount.toLocaleString('id-ID')
    }),
  });

  await pushService.sendToUser({
    userId: farmer.id,
    title: 'Pesanan Baru!',
    body: `Ada pesanan baru #${id} masuk.`,
    data: { orderId: id, type: 'ORDER_CREATED' }
  });
}

/**
 * Handle order paid event (notify farmer)
 */
export async function handleOrderPaid(payload: any) {
  const { order_id, total_amount, farmer_id } = payload;
  
  const farmer = await userClient.getUser(farmer_id);
  if (!farmer) return;

  // Email to Farmer
  await emailService.send({
    to: farmer.email,
    subject: 'Pembayaran Pesanan Berhasil!',
    html: renderTemplate('order-paid', { 
      farmerName: farmer.full_name || farmer.email,
      orderId: order_id,
      totalAmount: total_amount.toLocaleString('id-ID')
    }),
  });

  // Push to Farmer
  await pushService.sendToUser({
    userId: farmer.id,
    title: 'Pembayaran Berhasil!',
    body: `Pesanan #${order_id} telah dibayar. Silakan siapkan barang.`,
    data: { orderId: order_id, type: 'ORDER_PAID' }
  });
}

/**
 * Handle proposal approved event (notify farmer)
 */
export async function handleProposalApproved(payload: any) {
  const { id, title, farmer_id } = payload;
  
  const farmer = await userClient.getUser(farmer_id);
  if (!farmer) return;

  await emailService.send({
    to: farmer.email,
    subject: 'Proposal Disetujui!',
    html: renderTemplate('proposal-approved', { 
      farmerName: farmer.full_name || farmer.email,
      proposalTitle: title
    }),
  });

  await pushService.sendToUser({
    userId: farmer.id,
    title: 'Proposal Disetujui!',
    body: `Proposal "${title}" telah disetujui dan siap didanai.`,
    data: { proposalId: id, type: 'PROPOSAL_APPROVED' }
  });
}

/**
 * Handle proposal rejected event (notify farmer)
 */
export async function handleProposalRejected(payload: any) {
  const { id, title, farmer_id, reason } = payload;
  
  const farmer = await userClient.getUser(farmer_id);
  if (!farmer) return;

  await emailService.send({
    to: farmer.email,
    subject: 'Update Proposal Investasi',
    html: renderTemplate('proposal-rejected', { 
      farmerName: farmer.full_name || farmer.email,
      proposalTitle: title,
      rejectionReason: reason
    }),
  });
}

/**
 * Handle proposal fully funded event (notify farmer)
 */
export async function handleProposalFunded(payload: any) {
  const { id, title, farmer_id, funding_raised } = payload;
  
  const farmer = await userClient.getUser(farmer_id);
  if (!farmer) return;

  await emailService.send({
    to: farmer.email,
    subject: 'Pendanaan Terpenuhi!',
    html: renderTemplate('proposal-funded', { 
      proposalTitle: title,
      totalFunded: funding_raised.toLocaleString('id-ID')
    }),
  });

  await pushService.sendToUser({
    userId: farmer.id,
    title: 'Proposal Fully Funded!',
    body: `Proposal "${title}" telah mencapai target pendanaan.`,
    data: { proposalId: id, type: 'PROPOSAL_FUNDED' }
  });
}

/**
 * Handle shipment picked up event (notify buyer)
 */
export async function handleShipmentPickedUp(payload: any) {
  const { order_id, buyer_id } = payload;
  
  // We need buyer info. If payload doesn't have it, we might need order info first.
  // Assuming payload or event structure provides enough info or we fetch it.
  // For Q1, let's assume we can fetch user by buyer_id if provided.
  if (!buyer_id) return;

  const buyer = await userClient.getUser(buyer_id);
  if (!buyer) return;

  await pushService.sendToUser({
    userId: buyer.id,
    title: 'Pesanan Diambil!',
    body: `Pesanan #${order_id} telah diambil oleh kurir dan sedang menuju ke lokasi Anda.`,
    data: { orderId: order_id, type: 'SHIPMENT_PICKED_UP' }
  });
}

/**
 * Handle shipment in transit event (notify buyer)
 */
export async function handleShipmentInTransit(payload: any) {
  const { order_id, buyer_id, notes } = payload;
  
  if (!buyer_id) return;

  const buyer = await userClient.getUser(buyer_id);
  if (!buyer) return;

  await pushService.sendToUser({
    userId: buyer.id,
    title: 'Pesanan Sedang Dikirim!',
    body: notes || `Pesanan #${order_id} sedang dalam perjalanan.`,
    data: { orderId: order_id, type: 'SHIPMENT_IN_TRANSIT' }
  });
}

/**
 * Handle shipment delivered event (notify buyer)
 */
export async function handleShipmentDelivered(payload: any) {
  const { order_id, buyer_id } = payload;
  
  if (!buyer_id) return;

  const buyer = await userClient.getUser(buyer_id);
  if (!buyer) return;

  await emailService.send({
    to: buyer.email,
    subject: 'Barang Sudah Sampai!',
    html: renderTemplate('order-delivered', { 
      buyerName: buyer.full_name || buyer.email,
      orderId: order_id
    }),
  });

  await pushService.sendToUser({
    userId: buyer.id,
    title: 'Barang Sampai!',
    body: `Pesanan #${order_id} telah sampai di tujuan.`,
    data: { orderId: order_id, type: 'SHIPMENT_DELIVERED' }
  });
}

/**
 * Handle investment completed event (notify investor)
 */
export async function handleInvestmentCompleted(payload: any) {
  const { id, investor_id, amount, actual_return, actual_return_percent, proposal_title } = payload;
  
  const investor = await userClient.getUser(investor_id);
  if (!investor) return;

  await emailService.send({
    to: investor.email,
    subject: 'Investasi Selesai!',
    html: renderTemplate('investment-completed', { 
      investorName: investor.full_name || investor.email,
      proposalTitle: proposal_title || 'Proposal Investasi',
      initialInvestment: amount.toLocaleString('id-ID'),
      actualRoi: actual_return_percent,
      totalReturn: actual_return.toLocaleString('id-ID')
    }),
  });

  await pushService.sendToUser({
    userId: investor.id,
    title: 'Investasi Selesai!',
    body: `Investasi Anda pada "${proposal_title}" telah selesai dengan ROI ${actual_return_percent}%.`,
    data: { investmentId: id, type: 'INVESTMENT_COMPLETED' }
  });
}
