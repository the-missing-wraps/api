import { Application } from '@/types/index.js';

export type ApplicationBody = Pick<
    Application,
    'companyInformation' | 'when' | 'usage' | 'serviceTypes' | 'description'
>;

export const applicationBodyJsonSchema = {
    type: 'object',
    required: ['companyInformation', 'when', 'usage', 'serviceTypes', 'description'],
    properties: {
        companyInformation: {
            type: 'object',
            required: ['name', 'surname', 'company', 'email'],
            properties: {
                name: { type: 'string' },
                surname: { type: 'string' },
                company: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' }
            }
        },
        when: {
            type: 'array',
            items: {
                type: 'string',
                format: 'date'
            }
        },
        usage: {
            type: 'string',
            enum: ['shared', 'exclusive']
        },
        serviceTypes: {
            type: 'array',
            items: {
                type: 'string',
                enum: ['intersection', 'parking']
            }
        },
        description: { type: 'string' }
    }
};

export type AssessBody = {
    status: 'approved' | 'rejected';
};

export const assessBodyJsonSchema = {
    type: 'object',
    required: ['status'],
    properties: {
        status: {
            type: 'string',
            enum: ['approved', 'rejected']
        }
    }
};
