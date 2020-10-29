import {Injectable} from '@angular/core';
import {Category} from '../model/Category';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    mockCategories = [
        new Category(
            0,
            'Videó'
        ),
        new Category(
            1,
            'Audió'
        ),
        new Category(
            2,
            'Világítás'
        ),
        new Category(
            3,
            'Kábel'
        )
    ]

    constructor() {
    }

    getCategories(): Observable<Category[]> {
        return of(this.mockCategories);
    }
}
