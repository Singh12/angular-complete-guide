import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    templateUrl: './alert.component.html',
    selector: 'app-alert',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent {
    @Input() message: string;
    @Output() oncloseModel = new EventEmitter<void>();
    constructor() {}

    onClose() {
        this.oncloseModel.emit();
    }
}

