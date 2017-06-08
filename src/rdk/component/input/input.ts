import {
    NgModule, Component, EventEmitter, Input, Output, ContentChildren, Directive, QueryList,
    ElementRef, ViewChild, AfterContentInit, Renderer2, AfterViewInit
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AbstractRDKComponent} from "../core";
import {Observable} from "rxjs";

@Directive({selector: '[rdk-prefix-icon]'})
export class RdkPrefixIcon {
}

@Component({
    selector: 'rdk-input',
    templateUrl: 'input.html',
    styleUrls: ['input.scss'],
    host: {
        '[style.width]': 'width',
        '[style.height]': 'height',
        '[style.line-height]': 'height',
        '(click)': '_stopPropagation($event)'
    }
})
export class RdkInput extends AbstractRDKComponent implements AfterContentInit, AfterViewInit {
    private _value: string | number; //input表单值
    private _longIndent: boolean = false;
    private _focused: boolean;
    private _focusEmitter: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
    private _blurEmitter: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();


    constructor(private _render2: Renderer2,
                private _elementRef: ElementRef) {
        super();
    }

    //input form表单值
    @Input()
    public get value(): string | number {
        return this._value;
    }

    public set value(newValue: string | number) {
        if (this._value != newValue) {
            this._value = newValue;
            this.valueChange.emit(newValue);
        }
    }

    @Output() public valueChange: EventEmitter<string | number> = new EventEmitter<string | number>();

    @Input() public clearable: boolean = true;

    private _placeholder:string='';
    @Input()
    public set placeholder(txt:string) {
        this._placeholder = txt;
    }

    public get placeholder() {
        return this._placeholder;
    }

    @Output('blur')
    get onBlur(): Observable<FocusEvent> {
        return this._blurEmitter.asObservable();
    }

    @Output('focus')
    get onFocus(): Observable<FocusEvent> {
        return this._focusEmitter.asObservable();
    }

    @ContentChildren(RdkPrefixIcon) _iconFront: QueryList<RdkPrefixIcon> = null;

    @ViewChild('input') _inputElement: ElementRef;

    public focus() {
        this._inputElement.nativeElement.focus();
    }

    private _clearValue(event): void {
        this.value = null;
    }

    private _handleFocus(event: FocusEvent) {
        this._focused = true;
        this._focusEmitter.emit(event);
    }

    private _handleBlur(event: FocusEvent) {
        this._focused = false;
        this._blurEmitter.emit(event);
    }

    private _stopPropagation(event){
        event.preventDefault();
        event.stopPropagation();
    }

    private _inputPaddingStyle: {};

    /**
     * 动态计算 input的padding-left 和padding-right (不确定图标的个数, 好空出对应的位置.)
     * 当前计算方法根据图标的个数计算, 默认图标大小为12px , dom大小获取的不准确.
     * @private
     */
    private _setInputPaddingStyle() {
        let prefixIconLength = this._elementRef.nativeElement.querySelector(".rdk-input-icon-front").children.length;
        let endIconLength = this._elementRef.nativeElement.querySelector(".rdk-input-icon-end").children.length;

        let prefixIconPadding = 4;

        const ICON_SIZE:number = 12;

        // 没有图标默认前面空4个位置, 有一个
        if (prefixIconLength !== 0) {
            prefixIconPadding = ICON_SIZE * prefixIconLength + 8 + 4
        }

        this._inputPaddingStyle = {
            "padding-left": prefixIconPadding + "px",
            "padding-right": ICON_SIZE*endIconLength + 8 + "px"
        }
    }

    ngAfterContentInit() {
        this._iconFront && this._iconFront.length ? this._longIndent = true : null;
        setTimeout(() => {
            this._render2.setStyle(this._elementRef.nativeElement, 'opacity', 1);
        }, 0);

    }

    ngAfterViewInit() {
        this._setInputPaddingStyle();
    }


}

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [RdkInput, RdkPrefixIcon],
    exports: [RdkInput, RdkPrefixIcon],
})
export class RdkInputModule {

}


