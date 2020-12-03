import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Category} from '../../model/Category';

@Injectable({
    providedIn: 'root'
})
export class MockCategoryService {
    public static mockCategories = [
        new Category(
            0,
            'Videó'
        ),
        new Category(
            1,
            'Audió'
        )
    ]

    constructor() {
    }

    getCategories(): Observable<Category[]> {
        return of(MockCategoryService.mockCategories);
    }

}
