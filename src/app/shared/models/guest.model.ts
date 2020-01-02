export enum Status {
    'Coming' = 'Coming',
    'Probably_Coming' = 'Probably coming',
    'Maybe' = 'Maybe coming',
    'Probably_Not_Coming'= 'Probably not coming',
    'Not_Coming'= 'Not coming'
}

export class Companion {
    constructor(
        public name: string,
        public status: Status
    ) { }
}

export class Guest {
    constructor(
        public name: string,
        public status: Status,
        public group: string,
        public companions: Companion[],
        public id ?:string
    ) { }
}