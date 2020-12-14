export interface ConnectionManagerConfig {
  selectedService: 'google' | 'outlook';
}

export interface ConnectionManagerProps {
  isAuthorizedListener: (status: boolean) => void;
  authorizedServiceListener: (services: string[]) => void;
}
