import { ServiceType } from '@/types/index.js';

export function mergeServiceTypes(x: ServiceType[], y: ServiceType[]): ServiceType[] {
    const xSet = new Set(x);
    const ySet = new Set(y);
    return [...new Set([...xSet, ...ySet]).values()];
}
