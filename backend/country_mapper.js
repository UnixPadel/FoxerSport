const trToCca2 = {
  "ABD": "US", "Almanya": "DE", "Andora": "AD", "Arnavutluk": "AL", "Avusturya": "AT",
  "Belçika": "BE", "Birleşik Krallık": "GB", "Bulgaristan": "BG", "Çekya": "CZ",
  "Danimarka": "DK", "Estonya": "EE", "Finlandiya": "FI", "Fransa": "FR",
  "Hollanda": "NL", "İrlanda": "IE", "İspanya": "ES", "İsveç": "SE", "İsviçre": "CH",
  "İtalya": "IT", "Kanada": "CA", "Letonya": "LV", "Litvanya": "LT", "Lüksemburg": "LU",
  "Macaristan": "HU", "Polonya": "PL", "Portekiz": "PT", "Romanya": "RO", "Slovakya": "SK",
  "Slovenya": "SI", "Yunanistan": "GR", "Türkiye": "TR", "Rusya Federasyonu": "RU",
  "Birleşik Arap Emirlikleri": "AE", "Katar": "QA", "Suudi Arabistan": "SA", "Kuveyt": "KW",
  "Bahreyn": "BH", "Umman": "OM", "Çin": "CN", "Japonya": "JP", "Güney Kore": "KR",
  "Hindistan": "IN", "Brezilya": "BR", "Meksika": "MX", "Güney Afrika": "ZA",
  "Avustralya": "AU", "Yeni Zelanda": "NZ", "Mısır": "EG", "Fas": "MA", "Cezayir": "DZ",
  "Tunus": "TN", "İsrail": "IL", "Ürdün": "JO", "Lübnan": "LB", "Irak": "IQ", "Kıbrıs": "CY",
  "Kosova": "XK", "Kuzey Makedonya": "MK", "Sırbistan": "RS", "Karadağ": "ME", "Bosna Hersek": "BA",
  "Hırvatistan": "HR", "Malta": "MT", "Monako": "MC", "San Marino": "SM", "Vatikan": "VA"
};

export function getCca2FromTrName(name) {
  // Try exact match in hardcoded map
  if (trToCca2[name]) return trToCca2[name];
  
  // As a fallback, we can just return the name itself if it's not found,
  // so we can see what's missing, but it's better to just return the name for now.
  return name;
}
