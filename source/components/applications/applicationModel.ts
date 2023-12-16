import { Schema, model } from 'mongoose';
import { TestEnvironment, Usage } from '../../types/index.js';

interface ApplicationSchema {
    company: string;
    when: Date[];
    usage: Usage;
    testEnvironment: TestEnvironment;
}

const applicationSchema = new Schema<ApplicationSchema>({
    company: String,
    when: [Date],
    usage: String,
    testEnvironment: String
});

export const Application = model('application', applicationSchema);
