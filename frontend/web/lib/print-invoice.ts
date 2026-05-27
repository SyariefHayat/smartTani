import { FarmerOrder } from '@/components/features/order/farmer-orders/types';

export function printInvoice(order: FarmerOrder) {
  const shortId = order.id.slice(-6).toUpperCase();
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    alert('Popup terblokir! Harap izinkan popup untuk mencetak invoice.');
    return;
  }

  // Format Dates
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(order.date));

  // Items rows
  const itemRows = order.items
    .map(
      (item, idx) => `
    <tr>
      <td class="text-center">${idx + 1}</td>
      <td class="item-name">${item.name}</td>
      <td class="text-right">Rp ${Number(item.price).toLocaleString('id-ID')}</td>
      <td class="text-center">${item.quantity}</td>
      <td class="text-right font-semibold">Rp ${(Number(item.price) * Number(item.quantity)).toLocaleString('id-ID')}</td>
    </tr>
  `
    )
    .join('');

  // Calculate items subtotal
  const itemsSubtotal = order.items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const platformFee = order.platformFee || 0;
  const shippingCost = order.shippingCost || 0;
  const total = order.totalAmount;

  // Invoice Status Stamp
  let stampHtml = '';
  if (order.status === 'completed' || order.status === 'delivered') {
    stampHtml = '<div class="stamp">LUNAS</div>';
  } else if (order.status === 'cancelled') {
    stampHtml = '<div class="stamp cancelled">DIBATALKAN</div>';
  } else {
    stampHtml = `<div class="stamp pending">${order.status.toUpperCase()}</div>`;
  }

  // Address
  let addressHtml = '<p>Tidak ada alamat pengiriman</p>';
  if (order.shippingAddress) {
    let addr = order.shippingAddress;
    // Check if shippingAddress is a JSON string
    if (typeof addr === 'string') {
      try {
        addr = JSON.parse(addr);
      } catch (e) {
        console.error(e);
      }
    }

    addressHtml = `
      <p><strong>${addr.recipient_name || order.customerName}</strong></p>
      <p>${addr.phone_number || '-'}</p>
      <p>${addr.full_address || ''}</p>
      <p>${addr.city || ''}, ${addr.province || ''} ${addr.postal_code || ''}</p>
    `;
  } else {
    addressHtml = `
      <p><strong>${order.customerName}</strong></p>
    `;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice #${shortId}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #334155;
          margin: 0;
          padding: 40px;
          font-size: 14px;
          line-height: 1.5;
          background-color: #ffffff;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 20px;
          margin-bottom: 25px;
        }
        .logo-section h1 {
          font-size: 26px;
          font-weight: 800;
          color: #16a34a;
          margin: 0 0 5px 0;
          letter-spacing: -0.025em;
        }
        .logo-section p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-title h2 {
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 5px 0;
          color: #0f172a;
        }
        .invoice-title p {
          margin: 0;
          color: #475569;
          font-family: monospace;
          font-size: 14px;
          font-weight: bold;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 25px;
        }
        .info-section h3 {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          margin: 0 0 8px 0;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 4px;
        }
        .info-section p {
          margin: 3px 0;
          color: #475569;
        }
        .info-section strong {
          color: #0f172a;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          margin-bottom: 25px;
        }
        th {
          background-color: #f8fafc;
          color: #475569;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.05em;
          padding: 10px 12px;
          border-bottom: 2px solid #e2e8f0;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #f1f5f9;
        }
        .item-name {
          font-weight: 600;
          color: #1e293b;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        .summary-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }
        .stamp-container {
          flex: 1;
        }
        .totals-table {
          width: 280px;
        }
        .totals-table td {
          padding: 6px 10px;
          border: none;
        }
        .totals-table tr.grand-total td {
          border-top: 2px solid #e2e8f0;
          font-size: 16px;
          font-weight: 800;
          color: #16a34a;
          padding-top: 10px;
        }
        .footer {
          border-top: 1px solid #f1f5f9;
          padding-top: 20px;
          text-align: center;
          color: #94a3b8;
          font-size: 11px;
        }
        .stamp {
          border: 3px dashed #16a34a;
          color: #16a34a;
          font-size: 16px;
          font-weight: 800;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 4px;
          display: inline-block;
          transform: rotate(-6deg);
          margin-top: 10px;
          letter-spacing: 0.05em;
        }
        .stamp.cancelled {
          border-color: #ef4444;
          color: #ef4444;
        }
        .stamp.pending {
          border-color: #eab308;
          color: #eab308;
        }
        .btn-print {
          background-color: #16a34a;
          color: white;
          border: none;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 20px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .btn-print:hover {
          background-color: #15803d;
        }
        @media print {
          body {
            padding: 0;
            background: none;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="no-print" style="text-align: right;">
          <button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
        </div>
        
        <div class="header">
          <div class="logo-section">
            <h1>SmartTani</h1>
            <p>Platform Ekosistem Pertanian Terintegrasi</p>
          </div>
          <div class="invoice-title">
            <h2>INVOICE</h2>
            <p>#${shortId}</p>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-section">
            <h3>Diterbitkan Oleh</h3>
            <p><strong>SmartTani Academy & Marketplace</strong></p>
            <p>Email: billing@smarttani.id</p>
            <p>Website: www.smarttani.id</p>
          </div>
          <div class="info-section">
            <h3>Tujuan Pembayaran</h3>
            ${addressHtml}
          </div>
        </div>

        <div class="info-grid" style="margin-bottom: 20px;">
          <div class="info-section">
            <h3>Rincian Transaksi</h3>
            <p>ID Pesanan: <strong>${order.id}</strong></p>
            <p>Metode Pembayaran: <strong>${order.paymentMethod}</strong></p>
          </div>
          <div class="info-section">
            <h3>Tanggal Transaksi</h3>
            <p>${formattedDate}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="text-center" style="width: 40px;">No</th>
              <th>Nama Item</th>
              <th class="text-right" style="width: 120px;">Harga Satuan</th>
              <th class="text-center" style="width: 60px;">Jumlah</th>
              <th class="text-right" style="width: 140px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <div class="summary-wrapper">
          <div class="stamp-container">
            ${stampHtml}
          </div>
          <table class="totals-table">
            <tr>
              <td>Subtotal Item:</td>
              <td class="text-right">Rp ${itemsSubtotal.toLocaleString('id-ID')}</td>
            </tr>
            <tr>
              <td>Biaya Layanan:</td>
              <td class="text-right">Rp ${platformFee.toLocaleString('id-ID')}</td>
            </tr>
            <tr>
              <td>Ongkos Kirim:</td>
              <td class="text-right">Rp ${shippingCost.toLocaleString('id-ID')}</td>
            </tr>
            <tr class="grand-total">
              <td>Total Akhir:</td>
              <td class="text-right">Rp ${total.toLocaleString('id-ID')}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Terima kasih atas transaksi Anda di SmartTani. Hubungi support@smarttani.id jika memiliki kendala pembayaran.</p>
          <p style="margin-top: 5px; font-size: 10px; color: #cbd5e1;">Invoice ini sah dan diproduksi secara komputerisasi oleh sistem billing SmartTani.</p>
        </div>
      </div>
      <script>
        // Trigger print dialog automatically when loaded
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.print();
          }, 500);
        });
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
