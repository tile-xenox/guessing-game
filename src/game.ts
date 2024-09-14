import type { GameStart, Eq } from './type'

export function gameStart<S extends string>(seed: S): GameStart<S>;
export function gameStart(): unknown {
    return {
        guessingNumber: (): Eq => "正解!!",
        check: () => { void 0; },
    }
}
