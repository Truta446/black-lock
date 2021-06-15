import { Component, Host, Input, OnInit, Optional, SkipSelf, OnDestroy } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit, OnDestroy, ControlValueAccessor {

  constructor(
    @Optional() @Host() @SkipSelf() private controlContainer: ControlContainer,
    private fb: FormBuilder
  ) { }

  @Input() acceptedMethods = ['CREDIT_CARD', 'PIX', 'BANK_SLIP'];
  form!: FormGroup;
  valueSubscription!: Subscription;
  onChangeFunction: any = () => null;
  onTouchedFunction: any = () => null;

  ngOnInit(): void {
    this.form = this.fb.group({
      method: [''],
      credit: [{}],
      bankSlip: [{}]
    });
    if (this.controlContainer) {
      this.form = (this.controlContainer.control as FormGroup);
    }
    this.valueSubscription = this.form.valueChanges.subscribe((value) => {
      this.onChangeFunction(value);
      this.onTouchedFunction();
    });
  }

  ngOnDestroy(): void {
    this.valueSubscription.unsubscribe();
  }

  hasMethod(method: string): boolean {
    return this.acceptedMethods.includes(method);
  }

  methodIcon(): string {
    switch (this.form.value.method) {
      case 'CREDIT_CARD':
        return 'credit_card';
      case 'PIX':
        return 'account_balance_wallet';
      case 'BANK_SLIP':
        return 'receipt_long';
      default:
        return 'menu';
    }
  }

  methodName(): string {
    switch (this.form.value.method) {
      case 'CREDIT_CARD':
        return 'Cartão de crédito';
      case 'PIX':
        return 'PIX';
      case 'BANK_SLIP':
        return 'Boleto';
      default:
        return '';
    }
  }

  setMethod(method: string): void {
    this.form.patchValue({method});
    this.onChangeFunction(this.form.value);
    this.onTouchedFunction();
  }

  registerOnChange(onChangeFun: Function): void {
    this.onChangeFunction = onChangeFun;
  }

  registerOnTouched(onTouchedFun: Function): void {
    this.onTouchedFunction = onTouchedFun;
  }

  writeValue(value: any): void {
    this.form.patchValue(value);
  }
}
