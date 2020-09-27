import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css'],
    providers: [Title]
})
export class OverviewComponent implements OnInit {

    constructor(private title: Title) {
        this.title.setTitle('Raktr - Áttekintés');
    }

    ngOnInit(): void {
    }

}
