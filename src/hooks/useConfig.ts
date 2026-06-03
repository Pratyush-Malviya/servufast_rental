import { useState, useEffect } from "react";

export interface BrandConfig {
  contact: {
    phone: string;
    phoneTel: string;
    email: string;
    address: string;
  };
  social: {
    whatsapp: string;
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  general: {
    brandName: string;
    brandSubtitle: string;
    editionText: string;
    copyrightText: string;
  };
}

const cache = {
  data: null as BrandConfig | null,
  fetchPromise: null as Promise<BrandConfig | null> | null,
};

export function useConfig() {
  const [config, setConfig] = useState<BrandConfig | null>(cache.data);

  const fetchConfig = () => {
    if (cache.data) {
      setConfig(cache.data);
      return;
    }
    
    if (!cache.fetchPromise) {
      cache.fetchPromise = fetch("/api/config")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load config");
          return res.json();
        })
        .then((data) => {
          cache.data = data;
          cache.fetchPromise = null;
          return data;
        })
        .catch((err) => {
          cache.fetchPromise = null;
          console.error("Config fetch failed:", err);
          return null;
        });
    }

    cache.fetchPromise.then((data) => {
      if (data) {
        setConfig(data);
      }
    });
  };

  useEffect(() => {
    fetchConfig();

    const handleUpdate = () => {
      cache.data = null;
      fetchConfig();
    };

    window.addEventListener("brand-config-updated", handleUpdate);
    return () => {
      window.removeEventListener("brand-config-updated", handleUpdate);
    };
  }, []);

  return {
    config: config || {
      contact: {
        phone: "+1 (865) 696-9885",
        phoneTel: "+18656969885",
        email: "registration@servufast.com",
        address: "Executive Office, Financial District, San Francisco, CA 94111",
      },
      social: {
        whatsapp: "https://wa.me/18656969885",
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      },
      general: {
        brandName: "ServUfast",
        brandSubtitle: "",
        editionText: "Edition No. 01 · 2026",
        copyrightText: "© 2026 ServUfast LLC. All rights reserved. Registered under Delaware and United States Corporate Standards.",
      },
    },
    refresh: () => {
      cache.data = null;
      fetchConfig();
    }
  };
}
