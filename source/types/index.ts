export type Usage = 'shared' | 'exclusive';
export type ServiceType = 'Intersection' | 'Parking';
export type Status = 'pending' | 'approved' | 'rejected';

export interface CompanyInformation {
    name: string;
    surname: string;
    company: string;
    email: string;
    phone?: string;
}

export interface Application {
    companyInformation: CompanyInformation;
    when: Date[];
    usage: Usage;
    serviceTypes: ServiceType[];
    description: string;
    status: Status;
    token: string;
}

export interface Booking {
    when: Date[];
    usage: Usage;
    serviceTypes: ServiceType[];
    status: Status;
}
