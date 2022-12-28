export interface Note {
    date: Date;
    text: string;
    user: {};
    note_id: string | null;
}

export interface DBResult {
    message: string;
    code: number;
}
