import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';

const prisma = new PrismaClient();

// Mapping Turkish country names from DHL to standard 2-letter ISO codes (CCA2)
const trToCca2 = {
  "ABD": "US", "Afganistan": "AF", "Almanya": "DE", "Amerikan Samoası": "AS", "Andora": "AD", "Angola": "AO", "Anguilla": "AI",
  "Antigua": "AG", "Arjantin": "AR", "Arnavutluk": "AL", "Aruba": "AW", "Avustralya": "AU", "Avusturya": "AT", "Azerbaycan": "AZ",
  "Bahamalar": "BS", "Bahreyn": "BH", "Bangladeş": "BD", "Barbados": "BB", "Belçika": "BE", "Belize": "BZ", "Benin": "BJ",
  "Bermuda": "BM", "Beyaz Rusya": "BY", "Birleşik Arap Emirlikleri": "AE", "Birleşik Krallık": "GB", "Bolivya": "BO", "Bonaire": "BQ",
  "Bosna Hersek": "BA", "Botsvana": "BW", "Brezilya": "BR", "Brunei": "BN", "Bulgaristan": "BG", "Burkina Faso": "BF", "Burundi": "BI",
  "Cape Verde": "CV", "Cayman Adaları": "KY", "Cebelitarık": "GI", "Cezayir": "DZ", "Cibuti": "DJ", "Cook Adaları": "CK", "Curaçao": "CW",
  "Çad": "TD", "Çekya": "CZ", "Çin": "CN", "Danimarka": "DK", "Doğu Timor": "TL", "Dominik": "DM", "Dominik Cumhuriyeti": "DO",
  "Ekvador": "EC", "Ekvator Ginesi": "GQ", "El Salvador": "SV", "Endonezya": "ID", "Eritre": "ER", "Ermenistan": "AM", "Estonya": "EE",
  "Esvatini": "SZ", "Etiyopya": "ET", "Falkland Adaları": "FK", "Faroe Adaları": "FO", "Fas": "MA", "Fiji": "FJ", "Fildişi Sahilleri": "CI",
  "Filipinler": "PH", "Finlandiya": "FI", "Fransa": "FR", "Fransız Guyanası": "GF", "Gabon": "GA", "Galler": "GB", "Gambiya": "GM",
  "Gana": "GH", "Gine": "GN", "Gine Bissau": "GW", "Grenada": "GD", "Grönland": "GL", "Guadeloupe": "GP", "Guam": "GU", "Guatemala": "GT",
  "Guernsey": "GG", "Guyana": "GY", "Güney Afrika": "ZA", "Güney Kore": "KR", "Güney Sudan": "SS", "Gürcistan": "GE", "Haiti": "HT",
  "Hırvatistan": "HR", "Hindistan": "IN", "Hollanda": "NL", "Honduras": "HN", "Hong Kong": "HK", "Irak": "IQ", "İngiltere": "GB",
  "İran": "IR", "İrlanda": "IE", "İskoçya": "GB", "İspanya": "ES", "İsrail": "IL", "İsveç": "SE", "İsviçre": "CH", "İtalya": "IT",
  "İzlanda": "IS", "Jamaika": "JM", "Japonya": "JP", "Jersey": "JE", "Kamboçya": "KH", "Kamerun": "CM", "Kanada": "CA", "Karadağ": "ME",
  "Katar": "QA", "Kazakistan": "KZ", "Kenya": "KE", "Kıbrıs": "CY", "Kırgızistan": "KG", "Kiribati": "KI", "Kolombiya": "CO", "Komorlar": "KM",
  "Kongo": "CG", "Kongo Demokratik Cum.": "CD", "Kosova": "XK", "Kosta Rika": "CR", "Kuveyt": "KW", "Kuzey Kore": "KP", "Kuzey Makedonya": "MK",
  "Kuzey Mariana Adaları": "MP", "Küba": "CU", "Laos": "LA", "Lesotho": "LS", "Letonya": "LV", "Liberya": "LR", "Libya": "LY", "Lihtenştayn": "LI",
  "Litvanya": "LT", "Lübnan": "LB", "Lüksemburg": "LU", "Macaristan": "HU", "Madagaskar": "MG", "Makao": "MO", "Malavi": "MW", "Maldivler": "MV",
  "Malezya": "MY", "Mali": "ML", "Malta": "MT", "Marshall Adaları": "MH", "Martinik": "MQ", "Mauritius": "MU", "Mayotte": "YT", "Meksika": "MX",
  "Mısır": "EG", "Mikronezya": "FM", "Moğolistan": "MN", "Moldova": "MD", "Monako": "MC", "Montserrat": "MS", "Moritanya": "MR", "Mozambik": "MZ",
  "Myanmar": "MM", "Namibya": "NA", "Nauru": "NR", "Nepal": "NP", "Nijer": "NE", "Nijerya": "NG", "Nikaragua": "NI", "Niue": "NU", "Norveç": "NO",
  "Orta Afrika Cumhuriyeti": "CF", "Özbekistan": "UZ", "Pakistan": "PK", "Palau": "PW", "Panama": "PA", "Papua Yeni Gine": "PG", "Paraguay": "PY",
  "Peru": "PE", "Polonya": "PL", "Portekiz": "PT", "Porto Riko": "PR", "Reunion": "RE", "Romanya": "RO", "Ruanda": "RW", "Rusya Federasyonu": "RU",
  "Samoa": "WS", "San Marino": "SM", "Sao Tome ve Principe": "ST", "Senegal": "SN", "Seyşeller": "SC", "Sırbistan": "RS", "Sierra Leone": "SL",
  "Singapur": "SG", "Slovakya": "SK", "Slovenya": "SI", "Solomon Adaları": "SB", "Somali": "SO", "Somaliland": "SO", "Sri Lanka": "LK", "St. Barthelemy": "BL",
  "St. Eustatius": "BQ", "St. Helena": "SH", "St. Kitts": "KN", "St. Lucia": "LC", "St. Maarten": "SX", "St. Vincent": "VC", "Sudan": "SD", "Surinam": "SR",
  "Suriye": "SY", "Suudi Arabistan": "SA", "Şili": "CL", "Tacikistan": "TJ", "Tahiti": "PF", "Tanzanya": "TZ", "Tayland": "TH", "Tayvan": "TW",
  "Togo": "TG", "Tonga": "TO", "Trinidad ve Tobago": "TT", "Tunus": "TN", "Turks ve Caicos Adaları": "TC", "Tuvalu": "TV", "Türkiye": "TR", "Türkmenistan": "TM",
  "Uganda": "UG", "Ukrayna": "UA", "Umman": "OM", "Uruguay": "UY", "Ürdün": "JO", "Vanuatu": "VU", "Vatikan": "VA", "Venezuela": "VE", "Vietnam": "VN",
  "Yemen": "YE", "Yeni Kaledonya": "NC", "Yeni Zelanda": "NZ", "Yunanistan": "GR", "Zambiya": "ZM", "Zimbabve": "ZW", "Kanarya Adaları": "ES",
  "Virgin Adaları (ABD)": "VI", "Virgin Adaları (İngiltere)": "VG", "Saipan": "MP", "Saint Helena": "SH"
};

async function run() {
  const workbook = xlsx.readFile('../DHL_Tarifs_Zones.xlsx');
  
  // 1. Parse Countries and Zones (Ülke-Bölge)
  const zoneSheet = workbook.Sheets['Ülke-Bölge'];
  const zoneData = xlsx.utils.sheet_to_json(zoneSheet, { header: 1 });
  
  const zoneCountries = {};
  
  for (let i = 1; i < zoneData.length; i++) {
    const row = zoneData[i];
    if (!row || row.length === 0) continue;
    
    for (let j = 0; j < row.length; j += 2) {
      const countryStr = row[j];
      const zone = row[j+1];
      if (countryStr && zone) {
        const zoneStr = String(zone);
        if (!zoneCountries[zoneStr]) zoneCountries[zoneStr] = [];
        const cleanName = String(countryStr).trim();
        // Map to CCA2, fallback to original string if not mapped
        const cca2 = trToCca2[cleanName] || cleanName;
        zoneCountries[zoneStr].push(cca2);
      }
    }
  }

  // 2. Parse Prices (Fiyatlar)
  const priceSheet = workbook.Sheets['Fiyatlar'];
  const priceData = xlsx.utils.sheet_to_json(priceSheet);
  
  const zoneRates = {};
  
  for (let i = 1; i <= 10; i++) {
    zoneRates[String(i)] = {};
  }

  for (const row of priceData) {
    if (!row['Bölge']) continue;
    const weightStr = String(row['Bölge']).replace(',', '.');
    const weightVal = parseFloat(weightStr);
    
    if (isNaN(weightVal)) continue;

    let hasPrices = false;
    for (let i = 1; i <= 10; i++) {
      if (row[String(i)]) {
        hasPrices = true;
        break;
      }
    }
    
    if (!hasPrices) continue;

    for (let i = 1; i <= 10; i++) {
      const priceStr = row[String(i)];
      if (priceStr) {
        const priceVal = parseFloat(String(priceStr).replace(',', '.'));
        zoneRates[String(i)][weightStr] = priceVal;
      }
    }
  }

  // 3. Upsert into Database
  console.log('Clearing old shipping zones...');
  await prisma.shippingZone.deleteMany({});

  console.log('Inserting new shipping zones from DHL data...');
  for (let i = 1; i <= 10; i++) {
    const zoneStr = String(i);
    const countries = zoneCountries[zoneStr] || [];
    // remove duplicates
    const uniqueCountries = [...new Set(countries)];
    const rates = zoneRates[zoneStr] || {};
    
    if (uniqueCountries.length > 0 || Object.keys(rates).length > 0) {
      await prisma.shippingZone.create({
        data: {
          name: `DHL Zone ${zoneStr}`,
          countries: uniqueCountries,
          weightRates: rates,
          currency: 'EUR',
          isActive: true
        }
      });
      console.log(`Zone ${zoneStr} inserted with ${uniqueCountries.length} countries and ${Object.keys(rates).length} weight brackets.`);
    }
  }

  console.log('\nDHL Data successfully imported!');
  await prisma.$disconnect();
}

run().catch(e => {
  console.error(e);
  prisma.$disconnect();
});
