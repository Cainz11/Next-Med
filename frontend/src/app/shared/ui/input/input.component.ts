import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: InputComponent, multi: true },
  ],
  template: `
    <div class="app-input-wrap">
      @if (label()) {
        <label [for]="id()" class="app-label">{{ label() }}</label>
      }
      <input
        [id]="id()"
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="disabled() || disabledState()"
        [required]="required()"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="error() ? id() + '-error' : null"
        class="app-input"
        [class.app-input-error]="!!error()"
        [value]="innerValue"
        (input)="onValueChange($any($event.target).value)"
        (blur)="onTouched()"
      />
      @if (error()) {
        <span [id]="id() + '-error'" class="app-input-error-msg">{{ error() }}</span>
      }
    </div>
  `,
  styles: [`
    .app-input-wrap { margin-bottom: var(--space-4); }
    .app-label {
      display: block;
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      margin-bottom: var(--space-1);
      color: var(--text);
    }
    .app-input {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--surface);
      font-size: var(--text-base);
    }
    .app-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-muted);
    }
    .app-input-error { border-color: var(--error); }
    .app-input-error-msg { color: var(--error); font-size: var(--text-sm); margin-top: var(--space-1); display: block; }
  `],
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>();
  type = input<string>('text');
  placeholder = input<string>('');
  id = input<string>('app-input');
  disabled = input(false);
  required = input(false);
  error = input<string | null>(null);

  innerValue = '';
  protected disabledState = signal(false);
  private onTouchedFn: () => void = () => {};
  private onChangeFn: (v: string) => void = () => {};

  onValueChange(v: string): void {
    this.innerValue = v ?? '';
    this.onChangeFn(v ?? '');
  }

  onTouched(): void {
    this.onTouchedFn();
  }

  writeValue(v: string): void {
    this.innerValue = v ?? '';
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }
}
