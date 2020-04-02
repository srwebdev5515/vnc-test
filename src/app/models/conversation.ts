import { Message } from './message';
import { Observable, of } from 'rxjs';

export interface Conversation {
    messages: Message[];
    user1: string;
    user2: string;
}

export const ConversationsMock: Conversation[] = [
    { messages: [], user1: 'user1', user2: 'user2' },
    { messages: [], user1: 'user2', user2: 'user3' },
];
