import { describe, test, expect } from 'vitest';
import { gameStart } from '../index';

describe('guessingGame', () => {
    test('ok', () => {
        const { guessingNumber, check } = gameStart('game');

        check(guessingNumber(8122));

        expect(true).toBe(true);
    })
})
