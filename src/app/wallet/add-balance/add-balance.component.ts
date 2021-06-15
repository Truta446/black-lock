import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as numeral from 'numeral';

@Component({
  selector: 'app-add-balance',
  templateUrl: './add-balance.component.html',
  styleUrls: ['./add-balance.component.scss']
})
export class AddBalanceComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      amountCents: ['R$ 0,00']
    });
  }

  ngOnInit(): void {
  }

  transform(event: any): void {
    const value = event.target.value.replace('R$ ', '').replace(/\./g, '').replace(/,/g, '');
    if (parseFloat(value) || parseFloat(value) === 0) {
      event.target.value = numeral(parseFloat(`${value.slice(0, -2)}.${value.slice(-2)}`)).format('$ 0,0.00');
    } else {
      event.target.value = numeral(0).format('$ 0,0.00');
    }
    this.form.get('amountCents')?.setValue(event.target.value);
  }

  save(): void {
    const value = this.form.value.amountCents.replace('R$ ', '').replace(/\./g, '').replace(/,/g, '');
    localStorage.setItem('addBalance', JSON.stringify({amountCents: value}));
  }
}
