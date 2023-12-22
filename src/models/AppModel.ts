import { makeAutoObservable, reaction } from 'mobx';

export class AppModel {
  state: 'good' | 'bad' = 'good';

  inputValue = '(((((z^2 + z)^2 + z)^2 + z)^2 + z)^2 + z)^2 + z';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    const storedInputValue = localStorage.getItem('inputValue');

    if (storedInputValue) {
      this.inputValue = storedInputValue;
    }

    reaction(
      () => this.inputValue,
      (inputValue) => {
        console.log('set');
        localStorage.setItem('inputValue', inputValue);
      },
    );
  }
}
