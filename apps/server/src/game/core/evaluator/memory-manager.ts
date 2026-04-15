export class MemoryManager {
    private memories: Record<string, Record<string, any>> = {};

    initialize(robotId: string): void {
        this.memories[robotId] = {};
    }

    clearAll(): void {
        this.memories = {};
    }

    clearForRobot(robotId: string): void {
        delete this.memories[robotId];
    }

    getMemory(robotId: string): Record<string, any> {
        if (!this.memories[robotId]) {
            this.memories[robotId] = {};
        }
        return this.memories[robotId];
    }

    set(robotId: string, key: string, value: any): void {
        const mem = this.getMemory(robotId);
        mem[key] = value;
    }

    get(robotId: string, key: string): any {
        return this.getMemory(robotId)[key];
    }

    has(robotId: string, key: string): boolean {
        return key in this.getMemory(robotId);
    }
}
