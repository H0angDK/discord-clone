export interface Pageable<T> {
    content: Array<T>;
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}
