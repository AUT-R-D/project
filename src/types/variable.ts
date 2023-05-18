export class Variable {
    name: string;
    value: string;

    constructor(name: string, value: string){
        this.name = name;
        this.value = value;
    }

    public getName(): string{
        return this.name;
    }

    public getValue(): string{
        return this.value;
    }

    public setName(name: string): void{
        this.name = name;
    }

    public setValue(value: string): void{
        this.value = value;
    }

    public toString(): string{
        return this.name + " = " + this.value;
    }

}