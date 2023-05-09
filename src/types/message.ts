export class Message {
    sender: string;
    message: string | null;
    errorMessage: string | null = null;
    error: boolean = false;

    constructor(sender: string, message: string | null) {
        this.sender = sender;
        this.message = message;
    }

    toString(): string {
        return `Message ${this.sender}: ${this.message}`;
    }

    getSender(): string {
        return this.sender;
    }

    setSender(sender: string): void {
        this.sender = sender;
    }

    getMessage(): string | null {
        return this.message;
    }

    setMessage(message: string): void {
        this.message = message;
    }

    getError(): boolean | string {
        return this.error ? this.errorMessage! : false;
    }

    setError(errorMessage: string): void {
        this.error = true;
        this.errorMessage = errorMessage;
    }

}