declare module '@/lib/firebase' {
    import { Firestore } from 'firebase/firestore';
    import { Storage } from 'firebase/storage';

    export const db: Firestore;
    export const storage: Storage;
}