export type Company = {
  company: string;
  name: string;
};

export type Representative = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  is_admin?: boolean;
};

export type PermitEntry = {
  permitType: number;
  permitId: number;
  isDraft?: boolean;
  repName?: string | null;
  permit?: unknown;
  companyId?: string;
  companyName?: string;
};
