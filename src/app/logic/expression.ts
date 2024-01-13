
interface Expression {
    
}

function parseConstant(c: string): number | null {
    if (c == 'π') {
        return Math.PI;
    }
    return null;
}