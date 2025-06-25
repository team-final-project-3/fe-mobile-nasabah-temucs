
const dummyBranches = [
  {
    id: 'BNI001', 
    name: 'BNI Kota',
    branch_code: 'BNI001',
    address: 'Jl. Jendral Sudirman No. 58, Jakarta Pusat',
    region_code: 'Jakarta Pusat',
    latitude: -6.1364118618039685,
    longitude: 106.81465839421412,
    status: 'open',
    holiday: false,
    created_at: '2025-06-01T09:00:00',
    updated_at: '2025-06-01T10:00:00',
  },
  {
    id: 'BNI002',
    name: 'BNI Bandung',
    branch_code: 'BNI002',
    address: 'Jl. Asia Afrika No. 23, Bandung',
    region_code: 'Bandung',
    latitude: -6.921901,
    longitude: 107.606659,
    status: 'close',
    holiday: true,
    created_at: '2025-06-01T09:00:00',
    updated_at: '2025-06-01T10:00:00',
  },
  {
    id: 'BNI003',
    name: 'BNI Surabaya',
    branch_code: 'BNI003',
    address: 'Jl. Tunjungan No. 12, Surabaya',
    region_code: 'Surabaya',
    latitude: -7.265757,
    longitude: 112.734146,
    status: 'open',
    holiday: false,
    created_at: '2025-06-01T09:00:00',
    updated_at: '2025-06-01T10:00:00',
  },
  {
    id: 'BNI004',
    name: 'BNI jj',
    branch_code: 'BNI003',
    address: 'Jl. Tunjungan No. 12, Surabaya',
    region_code: 'Surabaya',
    latitude: -7.265757,
    longitude: 112.734146,
    status: 'open',
    holiday: false,
    created_at: '2025-06-01T09:00:00',
    updated_at: '2025-06-01T10:00:00',
  },
];

export default dummyBranches;

export const dummyServices = [
  { id: 's1', service_name: 'Buka Rekening Baru' },
  { id: 's2', service_name: 'Setor Tunai' },
  { id: 's3', service_name: 'Tarik Tunai' },
  { id: 's4', service_name: 'Transfer Dana' },
  { id: 's5', service_name: 'Ganti Kartu ATM' },
  { id: 's6', service_name: 'Pengajuan Pinjaman' },
];

// 2. Data Documents
export const dummyDocuments = [
  { "id": "1a1b2c3d-4e5f-6789-aaaa-bbbbcccc0001", "document_name": "KTP Asli" },
  { "id": "2a1b2c3d-4e5f-6789-bbbb-bbbbcccc0002", "document_name": "Kartu Keluarga (KK)" },
  { "id": "3a1b2c3d-4e5f-6789-cccc-bbbbcccc0003", "document_name": "NPWP" },
  { "id": "4a1b2c3d-4e5f-6789-dddd-bbbbcccc0004", "document_name": "Surat Keterangan Usaha" },
  { "id": "5a1b2c3d-4e5f-6789-eeee-bbbbcccc0005", "document_name": "Slip Gaji 3 Bulan Terakhir" }
];

// 3. Data Penghubung Service dan Document
export const dummyServiceDocuments = [
  { service_id: 's1', document_id: '1a1b2c3d-4e5f-6789-aaaa-bbbbcccc0001' },
  { service_id: 's1', document_id: '2a1b2c3d-4e5f-6789-bbbb-bbbbcccc0002' },
  { service_id: 's1', document_id: '3a1b2c3d-4e5f-6789-cccc-bbbbcccc0003' },
  { service_id: 's2', document_id: '1a1b2c3d-4e5f-6789-aaaa-bbbbcccc0001' },
  { service_id: 's5', document_id: '1a1b2c3d-4e5f-6789-aaaa-bbbbcccc0001' },
  { service_id: 's6', document_id: '1a1b2c3d-4e5f-6789-aaaa-bbbbcccc0001' },
  { service_id: 's6', document_id: '5a1b2c3d-4e5f-6789-eeee-bbbbcccc0005' },
];

export const dummyQueues = [
  {
    id: 'queue-001',
    user_id: 'user-abc',
    branch_id: '1b3f35c2-4e5d-4a17-a5f1-1234567890ab',
    cs_id: 'cs-001',
    loket_id: 'L01',
    booking_date: '2025-06-13T10:00:00Z',
    ticket_number: 'A001',
    estimated_time: '2025-06-13T10:15:00Z',
    called_at: null,
    status: 'waiting',
    notification: false,
    created_at: '2025-06-13T09:55:00Z',
    created_by: 'system',
    updated_at: '2025-06-13T09:55:00Z',
    updated_by: 'system'
  },
  {
    id: 'queue-002',
    user_id: 'user-def',
    branch_id: '1b3f35c2-4e5d-4a17-a5f1-1234567890ab',
    cs_id: 'cs-002',
    loket_id: 'L02',
    booking_date: '2025-06-13T09:40:00Z',
    ticket_number: 'A002',
    estimated_time: '2025-06-13T10:05:00Z',
    called_at: '2025-06-13T10:05:00Z',
    status: 'in_progress',
    notification: true,
    created_at: '2025-06-13T09:35:00Z',
    created_by: 'system',
    updated_at: '2025-06-13T10:05:00Z',
    updated_by: 'cs-002'
  },
  {
    id: 'queue-003',
    user_id: 'user-ghi',
    branch_id: '1b3f35c2-4e5d-4a17-a5f1-1234567890ab',
    cs_id: 'cs-001',
    loket_id: 'L01',
    booking_date: '2025-06-13T09:00:00Z',
    ticket_number: 'A003',
    estimated_time: '2025-06-13T09:10:00Z',
    called_at: '2025-06-13T09:10:00Z',
    status: 'done',
    notification: true,
    created_at: '2025-06-13T08:55:00Z',
    created_by: 'system',
    updated_at: '2025-06-13T09:15:00Z',
    updated_by: 'cs-001'
  },
  {
    id: 'queue-004',
    user_id: 'user-jkl',
    branch_id: '2d3f45b3-6c7e-4c18-b2a2-abcdef123456', // Bandung
    cs_id: 'cs-003',
    loket_id: 'L03',
    booking_date: '2025-06-13T10:30:00Z',
    ticket_number: 'B001',
    estimated_time: '2025-06-13T10:45:00Z',
    called_at: '2025-06-13T10:50:00Z',
    status: 'skipped',
    notification: true,
    created_at: '2025-06-13T10:25:00Z',
    created_by: 'system',
    updated_at: '2025-06-13T10:50:00Z',
    updated_by: 'cs-003'
  },
  {
    id: 'queue-005',
    user_id: 'user-mno',
    branch_id: '2d3f45b3-6c7e-4c18-b2a2-abcdef123456',
    cs_id: 'cs-003',
    loket_id: 'L03',
    booking_date: '2025-06-13T10:10:00Z',
    ticket_number: 'B002',
    estimated_time: '2025-06-13T10:25:00Z',
    called_at: '2025-06-13T10:20:00Z',
    status: 'done',
    notification: true,
    created_at: '2025-06-13T10:05:00Z',
    created_by: 'system',
    updated_at: '2025-06-13T10:25:00Z',
    updated_by: 'cs-003'
  },
  {
    id: 'queue-006',
    user_id: 'user-pqr',
    branch_id: '3a7e58c9-89c1-43b1-9812-56789abcdef0', // Surabaya
    cs_id: 'cs-004',
    loket_id: 'L04',
    booking_date: '2025-06-13T11:00:00Z',
    ticket_number: 'C001',
    estimated_time: '2025-06-13T11:20:00Z',
    called_at: null,
    status: 'cancel',
    notification: false,
    created_at: '2025-06-13T10:55:00Z',
    created_by: 'user-pqr',
    updated_at: '2025-06-13T10:59:00Z',
    updated_by: 'user-pqr'
  },
  {
    id: 'queue-007',
    user_id: 'user-stu',
    branch_id: '4e5d78f2-1234-4c56-a8f7-90abcdef1234', // Medan
    cs_id: 'cs-005',
    loket_id: 'L05',
    booking_date: '2025-06-13T12:00:00Z',
    ticket_number: 'D001',
    estimated_time: '2025-06-13T12:15:00Z',
    called_at: null,
    status: 'waiting',
    notification: false,
    created_at: '2025-06-13T11:55:00Z',
    created_by: 'system',
    updated_at: '2025-06-13T11:55:00Z',
    updated_by: 'system'
  }
];

export const dummyQueueHistory = [
  {
    id: '1',
    branch_id: 'BNI001',
    loket_id: 'A1',
    cs_id: 'cs-001',
    booking_date: '2025-06-12T09:00:00',
    estimated_time: '2025-06-12T09:15:00',
    ticket_number: 'A001',
    status: 'in_progress',
  },
  {
    id: '2',
    branch_id: 'BNI002',
    loket_id: 'B2',
    cs_id: 'cs-002',
    booking_date: '2025-06-11T10:30:00',
    estimated_time: '2025-06-11T10:45:00',
    ticket_number: 'B023',
    status: 'skipped',
  },
  {
    id: '3',
    branch_id: 'BNI003',
    loket_id: 'C3',
    cs_id: 'cs-003',
    booking_date: '2025-06-10T14:00:00',
    estimated_time: '2025-06-10T14:20:00',
    ticket_number: 'C012',
    status: 'cancel',
  },
  {
    id: '4',
    branch_id: 'BNI004',
    loket_id: 'C4',
    cs_id: 'cs-004',
    booking_date: '2025-06-10T14:00:00',
    estimated_time: '2025-06-10T14:20:00',
    ticket_number: 'C034',
    status: 'done',
  },
];

