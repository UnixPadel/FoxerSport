import xlsx from 'xlsx';

const workbook = xlsx.readFile('../DHL_Tarifs_Zones.xlsx');
const sheetName = workbook.SheetNames[1];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet);

console.log('\n--- SHEET: ' + sheetName + ' ---');
for (let i = 0; i < Math.min(10, data.length); i++) {
  console.log(data[i]);
}
