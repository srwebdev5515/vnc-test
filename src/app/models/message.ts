import { Observable, of } from 'rxjs';

export interface Message {
    message: string;
    from: string;
    created: Date;
}

export const MessagesMock: Observable<Message[]> = of([
    { message: 'message 1', from: 'user1', created: new Date() },
    { message: 'message 2', from: 'user2', created: new Date() },
    { message: 'message 3', from: 'user3', created: new Date() },
    { message: 'message 4', from: 'user4', created: new Date() },
]);
