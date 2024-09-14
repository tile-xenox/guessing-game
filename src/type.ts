type LtM = {
    "0": never,
    "1": "0",
    "2": "1" | "0",
    "3": "2" | "1" | "0",
    "4": "3" | "2" | "1" | "0",
    "5": "4" | "3" | "2" | "1" | "0",
    "6": "5" | "4" | "3" | "2" | "1" | "0",
    "7": "6" | "5" | "4" | "3" | "2" | "1" | "0",
    "8": "7" | "6" | "5" | "4" | "3" | "2" | "1" | "0",
    "9": "8" | "7" | "6" | "5" | "4" | "3" | "2" | "1" | "0",
}

type Msg = {
    lt: "小さすぎます",
    gt: "大きすぎます",
    eq: "正解!!",
}

type Lt<N = false> = N extends true ? Msg["gt"] : Msg["lt"];
type Gt<N = false> = N extends true ? Msg["lt"] : Msg["gt"];
export type Eq = Msg["eq"];

type Sym = " " | "!" | "\"" | "#" | "$" | "%" | "'" | "(" | ")" | "*" | "," | "-" | "." | "/" | ":" | ":" | "<" | "=" | ">" | "?" | "@" | "[" | "\\" | "]" | "^" | "_" | "`" | "{" | "|" | "}" | "~";
type IntW = {
    "0": ["0"],
    "1": ["1"],
    "2": ["2"],
    "3": ["3"],
    "4": ["4"],
    "5": ["5"],
    "6": ["6"],
    "7": ["7"],
    "8": ["8"],
    "9": ["9"],
    a: [],
    b: ["6"],
    c: [],
    d: ["9"],
    e: ["2"],
    f: ["5"],
    g: ["8"],
    h: [],
    i: ["1"],
    j: ["4"],
    k: ["1", "6"],
    l: ["1"],
    m: ["1", "2"],
    n: ["7"],
    o: ["0", "0"],
    p: ["3"],
    q: ["9"],
    r: ["7"],
    s: ["8"],
    t: ["1", "0"],
    u: ["0"],
    v: ["5"],
    w: ["5", "5"],
    x: ["0", "1"],
    y: [],
    z: ["2"],
}

type DecW = {
    A: ["2"],
    B: [],
    C: ["0", "1"],
    D: ["5", "5"],
    E: ["5"],
    F: ["0"],
    G: ["1", "0"],
    H: ["8"],
    I: ["7"],
    J: ["9"],
    K: ["3"],
    L: ["0", "0"],
    M: ["7"],
    N: ["1", "2"],
    O: ["1"],
    P: ["1", "6"],
    Q: ["4"],
    R: ["1"],
    S: [],
    T: ["8"],
    U: ["5"],
    V: ["2"],
    W: ["9"],
    X: [],
    Y: ["6"],
    Z: [],
}

type SecretN<S> = S extends `${string}${Sym}${string}` ? true : false;
type SecretI<S> = S extends `${infer F}${infer R}` ? F extends keyof IntW ? [...IntW[F], ...SecretI<R>] : SecretI<R> : [];
type SecretD<S> = S extends `${infer F}${infer R}` ? F extends keyof DecW ? [...DecW[F], ...SecretD<R>] : SecretD<R> : [];
type FixI<T> = T extends [infer F, ...infer R] ? F extends "0" ? FixI<R> : T : ["0"];
type FixD<T> = T extends [...infer R, infer F] ? F extends "0" ? FixD<R> : T : [];

type GenerateSecret<S> = {
    n: SecretN<S>,
    i: FixI<SecretI<S>>,
    d: FixD<SecretD<S>>,
};

type ToN<T> = `${T & number}` extends `-${string}` ? true : false;
type ToS<T> = `${T & number}` extends `-${infer S}` ? S : `${T & number}`;
type GetI<T> = T extends `${infer I}.${string}` ? I : T;
type GetD<T> = T extends `${string}.${infer D}` ? D : "";
type ToA<T> = T extends `${infer F}${infer R}` ? [F, ...ToA<R>] : [];

type GenerateExpect<T> = {
    n: ToN<T>,
    i: ToA<GetI<ToS<T>>>,
    d: ToA<GetD<ToS<T>>>,
}

type Num = {
    n: boolean,
    i: string[],
    d: string[],
}

type CN<E extends Num, S extends Num> = E["n"] extends S["n"] ? Eq : [E["n"], S["n"]] extends [false, true] ? Gt : Lt;
type CA<E, S, N> = [E, S] extends [[infer EF, ...infer ER], [infer SF, ...infer SR]]
    ? EF extends SF
        ? CA<ER, SR, N>
        : EF extends LtM[SF & keyof LtM]
            ? Lt<N>
            : Gt<N>
    : Eq;
type CL<E extends unknown[], S extends unknown[], N> = [E, S] extends [[unknown, ...infer ER], [unknown, ...infer SR]]
    ? CL<ER, SR, N>
    : [E["length"], S["length"]] extends [0, 0]
        ? Eq
        : E["length"] extends 0
            ? Lt<N>
            : Gt<N>

type GuessingNumner<E, S> = GenerateExpect<E> extends infer E extends Num
    ? GenerateSecret<S> extends infer S extends Num
        ? CN<E, S> extends infer RN
            ? RN extends Eq
                ? CL<E["i"], S["i"], S["n"]> extends infer RIL
                    ? RIL extends Eq
                        ? CA<E["i"], S["i"], S["n"]> extends infer RI
                            ? RI extends Eq
                                ? CA<E["d"], S["d"], S["n"]> extends infer RD
                                    ? RD extends Eq
                                        ? CL<E["d"], S["d"], S["n"]>
                                        : RD
                                    : unknown
                                : RI
                            : unknown
                        : RIL
                    : unknown
                : RN
            : unknown
        : unknown
    : unknown

export type GameStart<S extends string> = {
    guessingNumber: <E extends number>(expect: E) => GuessingNumner<E, S>,
    check: (v: Eq) => void,
}
