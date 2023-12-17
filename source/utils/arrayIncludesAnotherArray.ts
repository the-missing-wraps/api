export function arrayIncludesAnotherArray(x: any[], y: any[]): boolean {
    return x.some(el => y.includes(el));
}
