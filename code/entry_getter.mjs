const callbacks = {
    'entryjs_load': []
}

const awaits = {
    'entryjs_load': []
}

const generateDummyPromise = () => {
    let resolve
    let promise = new Promise((_resolve) => {resolve = _resolve})

    return {promise, resolve}
}

const promises = {
    'entryjs_load': generateDummyPromise()
}

export const waitForEntryjs = async (callback) => {
    if (callback instanceof Function)
        callbacks['entryjs_load'].push(callback)
    else if (callback instanceof Promise)
        awaits['entryjs_load'].push(callback)

    return promises['entryjs_load']
}

const waitForElement = async(targetNode, callback, config, timeout) => {
    return new Promise((resolve, reject) => {
        const test = callback([], null)
        if (test) {
            resolve(test)
            return
        }

        let timeoutID;

        const observerCallback = (mutations, observer) => {
            const ret = callback(mutations, observer)

            if (ret) {
                resolve(ret)
                observer.disconnect()
                if (timeoutID)
                    clearTimeout(timeoutID)
            } 
        }
        
        const observer = new MutationObserver(observerCallback);
        observer.observe(targetNode, config);

        if (timeout != null)
            setTimeout(() => {
                reject(new TypeError("시간 초과"))
                observer.disconnect()
            }, timeout)
    })
}

const entryjsFinder = () => {
    for (const script of [...document.scripts]) {
        if (!script.src) continue

        const loc = script.src.split('/')
        let file = loc.pop()

        if (file == undefined) continue

        if (file.indexOf('?') !== -1)
            file = file.slice(0, file.indexOf('?'))

        if (file === 'entry.min.js' || file === 'entry.js')
            return script
    }
}

const entryjs = await waitForElement(document.body, entryjsFinder,
    { attributes: false, childList: true, subtree: false })

if (window.Entry && window.Entry.events_) {
    promises['entryjs_load'].resolve(false)
    callbacks['entryjs_load'].forEach(func => func(false))
}
else {
    entryjs.addEventListener('load', () => {
        promises['entryjs_load'].resolve(true)
        callbacks['entryjs_load'].forEach(func => func(true))
    })

    const _onload = entryjs.onload

    if (_onload) {
        entryjs.onload = async function() {
            const load_await = awaits['entryjs_load']
            while (load_await.length)
                await load_await.pop()
            _onload.call(this, ...arguments)
        }
    }
}
