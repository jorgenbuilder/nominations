interface Nomination {
    type: 'song' | 'album';
    data: SongData | AlbumData;
    votes?: Vote[];
    points?: number;
    user: User;
}

interface SongData {
    title: string;
    spotifyURI: string;
}

interface AlbumData {
    title: string;
    spotifyURI: string;
}

interface Round {
    name: string;
    status: 'live' | 'archive';
    nomSchema: NomSchema;
    votSchema: VotSchema;
    nominations?: Nomination[];
}

interface VotSchema {
    [key: number]: number;
}

interface NomSchema {
    type: 'song' | 'album';
    count: number;
}

interface Vote {
    points: number;
    user: User;
}

interface User {
    uid?: string;
    name: string;
    avatarUrl: string;
}

interface NomBudget {
    allowed: number;
    used: number;
    remaining: number;
}

interface VoteBudgetData {
    allowed: number;
    used: number;
    remaining: number;
};

interface VotBudget {
    [key: number]: VoteBudgetData;
}

export type {
    Nomination,
    SongData,
    Round,
    VotSchema,
    NomSchema,
    Vote,
    User,
    NomBudget,
    VotBudget,
    VoteBudgetData,
}