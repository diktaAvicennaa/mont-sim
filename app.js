// Konfigurasi Supabase
const SUPABASE_URL = 'https://yiacockzaycfosfynhlp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYWNvY2t6YXljZm9zZnluaGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NjgwMjIsImV4cCI6MjA5MDI0NDAyMn0.prQKppwct-cIDLGe1z-k3O_wC54GL7y1PQjqu7OQjvY'; // Typo sudah diperbaiki

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fungsi untuk memperbarui UI
function updateDashboard(data) {
    if (!data) return;

    document.getElementById('last-update').innerText = new Date(data.created_at).toLocaleString('id-ID');

    // Update Status Boolean
    const updateStatus = (id, isTrue) => {
        const el = document.getElementById(id);
        if(el) {
            el.className = `status-indicator ${isTrue ? 'on' : 'off'}`;
            el.innerText = isTrue ? 'ON' : 'OFF';
        }
    };

    updateStatus('oil-status', data.oil_status);
    updateStatus('coolant-status', data.coolant_status);
    updateStatus('alt-status', data.alternator_status);
    updateStatus('switch-status', data.switch_status);

    // Update Nilai Numerik/String (Dengan pengaman jika data null)
    if(document.getElementById('alt-volt')) {
        document.getElementById('alt-volt').innerText = data.alternator_voltage ? data.alternator_voltage.toFixed(1) : '0.0';
    }
    if(document.getElementById('bat-volt')) {
        document.getElementById('bat-volt').innerText = data.battery_voltage ? data.battery_voltage.toFixed(1) : '0.0';
    }
    if(document.getElementById('fuel-level')) {
        document.getElementById('fuel-level').innerText = data.fuel_level !== null ? data.fuel_level : '0';
    }
    if(document.getElementById('sim-series')) {
        document.getElementById('sim-series').innerText = data.sim_series || "N/A";
    }
}

// Fungsi mengambil data awal (baris terakhir)
async function fetchLatestData() {
    const { data, error } = await client
        .from('sensor_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }
    updateDashboard(data);
}

// Jalankan saat web dibuka
fetchLatestData();

// Lakukan update otomatis setiap 5 detik
setInterval(fetchLatestData, 5000);