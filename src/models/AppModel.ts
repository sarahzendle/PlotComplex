import { makeAutoObservable, reaction } from 'mobx';

export class AppModel {
  state: 'good' | 'bad' = 'good';

  inputValue = '(((((z^2 + z)^2 + z)^2 + z)^2 + z)^2 + z)^2 + z';

  // plotType controls which visualization the renderer should use.
  // Keep in sync with localStorage like `inputValue`.
  plotType: 'surface' | 'sphere' = 'surface';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    const storedInputValue = localStorage.getItem('inputValue');

    if (storedInputValue) {
      this.inputValue = storedInputValue;
    }

  const storedPlotType = localStorage.getItem('plotType');
  const allowedPlotTypes = ['surface', 'sphere'] as const;
    if ((storedPlotType) && allowedPlotTypes.includes(storedPlotType as any)) {
      // safe to assign since we've validated the string
      console.log('loaded plot type from storage:', storedPlotType);
      this.plotType = storedPlotType as 'surface' | 'sphere';
    }

    reaction(
      () => this.inputValue,
      (inputValue) => {
        console.log('set input equation');
        console.log(this.plotType);
        localStorage.setItem('inputValue', inputValue);
      },
    );

    reaction(
      () => this.plotType,
      (plotType) => {
        console.log('set plot type: ', this.plotType);
        localStorage.setItem('plotType', plotType);
      },
    );
  }
}
