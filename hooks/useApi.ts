import { useContext } from 'react';
import { ApiContext, ApiContextType, Category, Product, TeamMember, Certificate, Catalog, ExportCountry } from '../context/ApiContext';

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export type { Category, Product, TeamMember, Certificate, Catalog, ExportCountry };
