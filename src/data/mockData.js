export const employees = [
  { id: 1, name: 'Nguyen Van A', nationality: 'VN', flag: '🇻🇳', visaType: '技能実習3号', expiryDate: '2025-03-15', status: 'expiring' },
  { id: 2, name: 'Wang Fang', nationality: 'CN', flag: '🇨🇳', visaType: '特定技能1号', expiryDate: '2025-08-20', status: 'normal' },
  { id: 3, name: 'Kim Jihoon', nationality: 'KR', flag: '🇰🇷', visaType: '技術・人文知識・国際業務', expiryDate: '2025-01-10', status: 'expiring' },
  { id: 4, name: 'Silva Maria', nationality: 'BR', flag: '🇧🇷', visaType: '永住者', expiryDate: '2031-05-30', status: 'normal' },
  { id: 5, name: 'Thapa Ram', nationality: 'NP', flag: '🇳🇵', visaType: '技能実習2号', expiryDate: '2024-12-05', status: 'expired' },
  { id: 6, name: 'Tran Thi B', nationality: 'VN', flag: '🇻🇳', visaType: '特定技能1号', expiryDate: '2026-02-28', status: 'normal' },
  { id: 7, name: 'Li Wei', nationality: 'CN', flag: '🇨🇳', visaType: '技術・人文知識・国際業務', expiryDate: '2025-11-15', status: 'normal' },
  { id: 8, name: 'Dela Cruz Jose', nationality: 'PH', flag: '🇵🇭', visaType: '技能実習3号', expiryDate: '2025-02-20', status: 'expiring' },
];

export const procedures = [
  { id: 1, employeeId: 1, type: '在留資格更新申請', deadline: '2024-12-15', status: 'in_progress', assignedTo: '田中 花子' },
  { id: 2, employeeId: 3, type: '在留資格更新申請', deadline: '2024-11-30', status: 'applied', assignedTo: '佐藤 一郎' },
  { id: 3, employeeId: 5, type: '在留資格変更許可申請', deadline: '2024-11-01', status: 'in_progress', assignedTo: '田中 花子' },
  { id: 4, employeeId: 8, type: '在留資格更新申請', deadline: '2025-01-20', status: 'in_progress', assignedTo: '鈴木 次郎' },
  { id: 5, employeeId: 2, type: '住所変更届', deadline: '2024-10-30', status: 'completed', assignedTo: '佐藤 一郎' },
];

export const complianceItems = [
  { id: 1, requirement: '在留資格確認（定期）', status: true },
  { id: 2, requirement: '在留カードコピー保管', status: true },
  { id: 3, requirement: '雇用保険加入', status: true },
  { id: 4, requirement: '社会保険加入', status: true },
  { id: 5, requirement: '期限切れ在留者への対応', status: false },
  { id: 6, requirement: '外国人労働者届出（ハローワーク）', status: false },
];
