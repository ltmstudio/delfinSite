'use client';

interface StructuredDataProps {
  locale: string;
}

export default function StructuredData({ locale }: StructuredDataProps) {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Delfin",
    "alternateName": "Delfin Sanitary Ware",
    "url": `https://delfin-sanitary.com/${locale}`,
    "logo": "https://delfin-sanitary.com/logo-delfin.png",
    "description": locale === 'ru' 
      ? "Производитель премиум сантехники и керамики для ванной. Турецкое качество по европейским стандартам."
      : locale === 'tr'
      ? "Premium banyo gereçleri ve seramik üreticisi. Avrupa standartlarında Türk kalitesi."
      : "Premium bathroom fixtures and ceramics manufacturer. Turkish quality with European standards.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["Russian", "Turkish", "English"]
    },
    "sameAs": [
      // Добавьте ссылки на социальные сети
      // "https://www.facebook.com/delfin",
      // "https://www.instagram.com/delfin",
      // "https://www.linkedin.com/company/delfin"
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Delfin",
    "url": `https://delfin-sanitary.com/${locale}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://delfin-sanitary.com/${locale}?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": locale
  };

  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://delfin-sanitary.com/#product",
    "category": "Bathroom Fixtures",
    "name": "Delfin Bathroom Products",
    "description": locale === 'ru'
      ? "Коллекция премиум сантехники: унитазы, раковины, смесители, ванны"
      : locale === 'tr'
      ? "Premium banyo ürünleri koleksiyonu: klozet, lavabo, batarya, küvet"
      : "Premium bathroom products collection: toilets, sinks, faucets, bathtubs",
    "brand": {
      "@type": "Brand",
      "name": "Delfin"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Delfin"
    },
    "offers": {
      "@type": "AggregateOffer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": locale === 'ru' ? "RUB" : locale === 'tr' ? "TRY" : "USD"
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": locale === 'ru' ? "Главная" : locale === 'tr' ? "Ana Sayfa" : "Home",
        "item": `https://delfin-sanitary.com/${locale}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
    </>
  );
}



