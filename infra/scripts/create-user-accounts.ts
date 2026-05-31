import axios from 'axios';

const GATEWAY_URL = 'http://localhost:3000';
const PASSWORD = 'password123';

const ACCOUNTS_TO_CREATE = [
  // Admin
  { email: 'admin@smarttani.id', role: 'admin', fullName: 'Super Admin' },

  // Farmer / Petani
  { email: 'petani@smarttani.id', role: 'petani', fullName: 'Pak Petani' },
  { email: 'farmer@smarttani.id', role: 'petani', fullName: 'Mr Farmer' },

  // Buyer
  { email: 'buyer@smarttani.id', role: 'buyer', fullName: 'Budi Buyer' },

  // Investor
  { email: 'investor@smarttani.id', role: 'investor', fullName: 'Iwan Investor' },

  // Distributor
  { email: 'distributor@smarttani.id', role: 'distributor', fullName: 'Dani Distributor' },

  // Logistics / Logistik
  { email: 'logistik@smarttani.id', role: 'logistik', fullName: 'Kurir Logistik' },
  { email: 'logistic@smarttani.id', role: 'logistik', fullName: 'Kurir Logistic' },

  // Student / Siswa
  { email: 'siswa@smarttani.id', role: 'siswa', fullName: 'Siswa Academy' },
  { email: 'student@smarttani.id', role: 'siswa', fullName: 'Student Academy' },

  // Instructor / Instruktur
  { email: 'instruktur@smarttani.id', role: 'instruktur', fullName: 'Instruktur Academy' },
  { email: 'intruktor@smarttani.id', role: 'instruktur', fullName: 'Intruktor Academy' },
  { email: 'instructor@smarttani.id', role: 'instruktur', fullName: 'Instructor Academy' },
];

async function run() {
  console.log('🚀 Starting account creation script for SmartTani...');

  // 1. Register/Login Admin
  console.log('🔑 Setting up Admin credentials...');
  const adminCreds = {
    email: 'admin@smarttani.id',
    password: PASSWORD,
    role: 'admin',
    full_name: 'Super Admin',
  };

  try {
    await axios.post(`${GATEWAY_URL}/auth/register`, adminCreds);
    console.log('✅ Admin registered');
  } catch (_err: unknown) {
    console.log('ℹ️ Admin registration skipped (already exists)');
  }

  let adminToken = '';
  try {
    const loginRes = await axios.post(`${GATEWAY_URL}/auth/login`, {
      email: adminCreds.email,
      password: adminCreds.password,
    });
    adminToken = loginRes.data.data.accessToken;
    console.log('✅ Admin logged in successfully');
  } catch (err: unknown) {
    console.error('❌ Failed to login admin:', (err as Error).message);
    process.exit(1);
  }

  // 2. Create and Verify other roles
  console.log('\n👤 Registering and Verifying roles...');
  const results: Array<{ email: string; role: string; status: string; note: string }> = [];

  for (const account of ACCOUNTS_TO_CREATE) {
    const { email, role, fullName } = account;
    let success = false;
    let note: string;
    let userId = '';

    // Skip admin if already handled (or re-process to ensure status is active)
    if (email === 'admin@smarttani.id') {
      results.push({ email, role, status: 'Active', note: 'Created/verified during startup' });
      continue;
    }

    try {
      // Try registering the user
      const registerRes = await axios.post(`${GATEWAY_URL}/auth/register`, {
        email,
        password: PASSWORD,
        role,
        full_name: fullName,
      });
      userId = registerRes.data.data.id;
      success = true;
      note = 'Newly Registered';
    } catch (err: unknown) {
      const axErr = err as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      if (axErr.response && axErr.response.status === 409) {
        // Already exists, fetch users to find the ID
        try {
          const usersRes = await axios.get(`${GATEWAY_URL}/auth/users`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          const existingUser = usersRes.data.data.find(
            (u: Record<string, unknown>) => u.email === email
          );
          if (existingUser) {
            userId = existingUser.id;
            success = true;
            note = 'Already Exists';
          } else {
            note = 'Exists, but ID not found';
          }
        } catch (fetchErr: unknown) {
          note = 'Exists, fetch ID failed: ' + (fetchErr as Error).message;
        }
      } else {
        note = 'Registration failed: ' + (axErr.response?.data?.message || axErr.message);
      }
    }

    // If successfully registered or found, verify the user
    if (success && userId) {
      try {
        await axios.patch(
          `${GATEWAY_URL}/auth/users/${userId}/verify`,
          {},
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );

        // Also ensure status is 'active' using the status update endpoint
        await axios
          .patch(
            `${GATEWAY_URL}/auth/users/${userId}/status`,
            { status: 'active' },
            {
              headers: { Authorization: `Bearer ${adminToken}` },
            }
          )
          .catch(() => {}); // ignore status endpoint failure if already active

        results.push({ email, role, status: 'Active', note });
        console.log(
          `✅ Role: ${role.padEnd(12)} | Email: ${email.padEnd(26)} | Status: Active (${note})`
        );
      } catch (verifyErr: unknown) {
        results.push({
          email,
          role,
          status: 'Pending Verification',
          note: `${note} (Verify failed: ${(verifyErr as Error).message})`,
        });
        console.log(
          `⚠️ Role: ${role.padEnd(12)} | Email: ${email.padEnd(26)} | Status: Pending (${note})`
        );
      }
    } else {
      results.push({ email, role, status: 'Failed', note });
      console.log(
        `❌ Role: ${role.padEnd(12)} | Email: ${email.padEnd(26)} | Status: Failed (${note})`
      );
    }
  }

  console.log('\n📊 ACCOUNT SEEDING SUMMARY:');
  console.table(results);
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
});
