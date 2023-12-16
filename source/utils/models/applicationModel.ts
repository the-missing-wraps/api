import { Schema, Document, model, Model } from 'mongoose';
import { TestEnvironment, Usage } from '../../types/index.js';

export interface ApplicationAttrs {
    company: string;
    when: Date[];
    usage: Usage;
    testEnvironment: TestEnvironment;
}

export interface ApplicationDocument extends Document {
    createdAt: string;
    updatedAt: string;
}

export interface ApplicationModel extends Model<ApplicationDocument> {
    addOne(doc: ApplicationAttrs): ApplicationDocument;
}

export const applicationSchema: Schema<ApplicationAttrs> = new Schema(
    {
        company: {
            type: String,
            required: true
        },
        when: {
            type: [Date],
            required: true
        },
        usage: {
            type: String,
            required: true
        },
        testEnvironment: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Application = model<ApplicationDocument, ApplicationModel>('Application', applicationSchema);
applicationSchema.statics.addOne = (document: ApplicationAttrs) => {
    return new Application(document);
};
