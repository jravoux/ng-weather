import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export const VOID = new Observable<void>((subscriber) => subscriber.next());

export function mapToVoid<T>(): OperatorFunction<T, void> {
  return (source) => source.pipe(map(() => void 0));
}
