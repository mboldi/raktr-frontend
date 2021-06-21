import {User} from './User';

export class Comment {
    id: number;
    body: string;
    dateOfWriting: Date;
    writer: User;

    static fromJson(comment: Comment): Comment {
        return new Comment(
            comment.id,
            comment.body,
            comment.dateOfWriting,
            comment.writer
        );
    }

    constructor(id: number, body: string, dateOfWriting: Date, writer: User) {
        this.id = id;
        this.body = body;
        this.dateOfWriting = dateOfWriting;
        this.writer = writer;
    }

    toJson(): String {
        return `{\"Comment\": ${JSON.stringify(this)}}`;
    }
}
