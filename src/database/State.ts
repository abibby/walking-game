export interface LastLoginState {
    key: 'last-login'
    value: {
        time: Date
    }
}

export type State = LastLoginState
