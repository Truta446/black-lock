import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countdown'
})
export class CountdownPipe implements PipeTransform {
  private getMsDiff = (futureDate: string): number => (+(new Date(futureDate)) - Date.now());

  private msToTime(msRemaining: number): string | null {
    if (msRemaining < 0) {
      console.info('No Time Remaining:', msRemaining);
      return null;
    }

    let seconds: string | number = Math.floor((msRemaining / 1000) % 60);
    let minutes: string | number = Math.floor((msRemaining / (1000 * 60)) % 60);
    let hours: string | number = Math.floor((msRemaining / (1000 * 60 * 60)) % 24);

    /**
     * Add the relevant `0` prefix if any of the numbers are less than 10
     * i.e. 5 -> 05
     */
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    hours = (hours < 10) ? '0' + hours : hours;

    return `${hours}:${minutes}:${seconds}`;
  }

  public transform(value: any, ...args: string[]): string | null {
    const futureDate = args[0];

    /**
     * Initial check to see if time remaining is in the future
     * If not, don't bother creating an observable
     */
    if (!futureDate || this.getMsDiff(futureDate) < 0) {
      return null;
    }

    return this.msToTime(this.getMsDiff(futureDate));
  }
}
