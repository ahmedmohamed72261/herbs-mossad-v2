import React, { createContext, useState, useEffect } from 'react';
import api from '@/lib/api';

export interface Category {
  id: number | string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  slug: string;
  image?: string | null;
}

export interface Product {
  id: number | string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  short_description_en: string;
  short_description_ar: string;
  image?: string | null;
  category?: {
    id: number | string;
    slug: string;
    name_en: string;
    name_ar: string;
  };
  tags?: string[];
  certifications?: string[];
  is_featured?: boolean;
}

export interface TeamMember {
  id: number | string;
  name_en: string;
  name_ar: string;
  position_en: string;
  position_ar: string;
  bio_en: string;
  bio_ar: string;
  image: string | null;
  linkedin: string | null;
  email: string | null;
  phone: string | null;
}

export interface Certificate {
  id: number | string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image: string | null;
  file: string | null;
  issuer: string | null;
  issued_date: string | null;
}

export interface Catalog {
  id: number | string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  short_description_en?: string | null;
  short_description_ar?: string | null;
  file: string | null;
  image: string | null;
  version: string | null;
}

export interface ExportCountry {
  _id: string;
  name_en: string;
  name_ar: string;
  flag: string | null;
  display_order: number;
}

export interface ApiContextType {
  categories: Category[];
  products: Product[];
  teamMembers: TeamMember[];
  certificates: Certificate[];
  catalogs: Catalog[];
  exportCountries: ExportCountry[];
  loading: {
    categories: boolean;
    products: boolean;
    teamMembers: boolean;
    certificates: boolean;
    catalogs: boolean;
    exportCountries: boolean;
  };
  errors: {
    categories: boolean;
    products: boolean;
    teamMembers: boolean;
    certificates: boolean;
    catalogs: boolean;
    exportCountries: boolean;
  };
  fetchCategories: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchTeamMembers: () => Promise<void>;
  fetchCertificates: () => Promise<void>;
  fetchCatalogs: () => Promise<void>;
  fetchExportCountries: () => Promise<void>;
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [exportCountries, setExportCountries] = useState<ExportCountry[]>([]);

  const [loading, setLoading] = useState({
    categories: false,
    products: false,
    teamMembers: false,
    certificates: false,
    catalogs: false,
    exportCountries: false,
  });

  const [errors, setErrors] = useState({
    categories: false,
    products: false,
    teamMembers: false,
    certificates: false,
    catalogs: false,
    exportCountries: false,
  });

  const fetchCategories = async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    setErrors((prev) => ({ ...prev, categories: false }));
    try {
      const response = await api.get('/categories');
      const data = response.data?.data || response.data || [];
      setCategories(Array.isArray(data) ? data.map((item: any) => item ? { ...item, id: item.id ?? item._id } : null).filter(Boolean) : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setErrors((prev) => ({ ...prev, categories: true }));
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  const fetchProducts = async () => {
    setLoading((prev) => ({ ...prev, products: true }));
    setErrors((prev) => ({ ...prev, products: false }));
    try {
      const response = await api.get('/products');
      const data = response.data?.data || response.data || [];
      setProducts(Array.isArray(data) ? data.map((item: any) => item ? { ...item, id: item.id ?? item._id } : null).filter(Boolean) : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setErrors((prev) => ({ ...prev, products: true }));
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const fetchTeamMembers = async () => {
    setLoading((prev) => ({ ...prev, teamMembers: true }));
    setErrors((prev) => ({ ...prev, teamMembers: false }));
    try {
      const response = await api.get('/team-members');
      const data = response.data?.data || response.data || [];
      setTeamMembers(Array.isArray(data) ? data.map((item: any) => item ? { ...item, id: item.id ?? item._id } : null).filter(Boolean) : []);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setErrors((prev) => ({ ...prev, teamMembers: true }));
    } finally {
      setLoading((prev) => ({ ...prev, teamMembers: false }));
    }
  };

  const fetchCertificates = async () => {
    setLoading((prev) => ({ ...prev, certificates: true }));
    setErrors((prev) => ({ ...prev, certificates: false }));
    try {
      const response = await api.get('/certificates');
      const data = response.data?.data || response.data || [];
      setCertificates(Array.isArray(data) ? data.map((item: any) => item ? { ...item, id: item.id ?? item._id } : null).filter(Boolean) : []);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      setErrors((prev) => ({ ...prev, certificates: true }));
    } finally {
      setLoading((prev) => ({ ...prev, certificates: false }));
    }
  };

  const fetchCatalogs = async () => {
    setLoading((prev) => ({ ...prev, catalogs: true }));
    setErrors((prev) => ({ ...prev, catalogs: false }));
    try {
      const response = await api.get('/catalogs');
      const data = response.data?.data || response.data || [];
      setCatalogs(Array.isArray(data) ? data.map((item: any) => item ? { ...item, id: item.id ?? item._id } : null).filter(Boolean) : []);
    } catch (error) {
      console.error('Failed to fetch catalogs:', error);
      setErrors((prev) => ({ ...prev, catalogs: true }));
    } finally {
      setLoading((prev) => ({ ...prev, catalogs: false }));
    }
  };

  const fetchExportCountries = async () => {
    setLoading((prev) => ({ ...prev, exportCountries: true }));
    setErrors((prev) => ({ ...prev, exportCountries: false }));
    try {
      const response = await api.get('/export-countries');
      const data = response.data || [];
      setExportCountries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch export countries:', error);
      setErrors((prev) => ({ ...prev, exportCountries: true }));
    } finally {
      setLoading((prev) => ({ ...prev, exportCountries: false }));
    }
  };

  return (
    <ApiContext.Provider
      value={{
        categories,
        products,
        teamMembers,
        certificates,
        catalogs,
        exportCountries,
        loading,
        errors,
        fetchCategories,
        fetchProducts,
        fetchTeamMembers,
        fetchCertificates,
        fetchCatalogs,
        fetchExportCountries,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
