const wrapperSymbol = Symbol("MultiWrapper")


const callNextGen = function* (wrapChain) {
    for (const {wrapper, enabled} of wrapChain)
        if (enabled) yield wrapper
}

export const makeWrap = (dest, wrapper) => {
    const wrapperData = {
        wrapChain: [{wrapper, enabled: true}],
        wrapDest: dest
    }

    if (wrapperSymbol in dest) {
        wrapperData.wrapChain.concat((dest)[wrapperSymbol].wrapChain)
    }
    
    const wrappedFunc = function(this, ...args) {
        const {wrapChain, wrapDest} = wrappedFunc[wrapperSymbol]
        if (wrapChain.length === 0)
            return wrapDest.call(this, ...args)

        const callee = callNextGen(wrapChain)
        const callNext = (...args) => {
            const {value, done} = callee.next()
            if (done)
                return wrapDest.call(this, ...args)
            else
                return value.call(this, callNext, ...args)
        }

        return callNext(...args)
    }

    wrappedFunc[wrapperSymbol] = wrapperData
    wrappedFunc.toggleWrapper = toggleWrapper.bind(null, wrapperData.wrapChain)
    wrappedFunc.wrap = wrap.bind(null, wrapperData.wrapChain)
    wrappedFunc.unwrap = unwrap.bind(null, wrapperData.wrapChain)

    return (wrappedFunc)
}

const toggleWrapper = (wrapChain, wrapper, enabled) => {
    for (let i = 0; i < wrapChain.length; i++) {
        if (wrapChain[i].wrapper === wrapper) {
            wrapChain[i].enabled = enabled
            return
        }
    }
}

const wrap = (wrapChain, wrapper) => {
    wrapChain.unshift({wrapper, enabled: true})
}

const unwrap =(wrapChain, wrapper) => {
    for (let i = 0; i < wrapChain.length; i++) {
        if (wrapChain[i].wrapper === wrapper) {
            wrapChain.splice(i, 1)
            return
        }
    }
}

