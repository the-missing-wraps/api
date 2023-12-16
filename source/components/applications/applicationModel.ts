import { Schema, model } from 'mongoose';
import { ServiceType, Status, Usage } from '@/types/index.js';

interface CompanyInformation {
    name: string;
    surname: string;
    company: string;
    email: string;
    phone?: string;
}

interface ApplicationSchema {
    companyInformation: CompanyInformation;
    when: Date[];
    usage: Usage;
    serviceTypes: ServiceType[];
    description: string;
    status: Status;
}

const applicationSchema = new Schema<ApplicationSchema>({
    companyInformation: {
        name: String,
        surname: String,
        company: String,
        email: { type: String, required: true },
        phone: {
            type: String,
            required: false
        }
    },
    when: [Date],
    usage: String,
    serviceTypes: [String],
    description: String,
    status: String
});

export const Application = model('application', applicationSchema);
