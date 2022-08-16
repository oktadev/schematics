// broadcast-channel should not detect node environment
// https://github.com/pubkey/broadcast-channel/blob/master/src/util.js#L61
process[Symbol.toStringTag] = 'Process';
