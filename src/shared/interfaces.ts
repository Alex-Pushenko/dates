export interface Event {
    year: number;
    title: string;
    description: string;
}

export interface ThemeData {
    id: string;
    name: string;
    events: Event[];
}

export interface YearData {
    id: number;
    yearStart: number;
    yearEnd: number;
    themes: ThemeData[];
}