const script = document.createElement('script')
script.src = chrome.runtime.getURL("./main.mjs")

document.head.append(script)

const configPromise = chrome.storage.local.get("config")

script.onload = function() {
    configPromise.then((config) => {
        postMessage(config, "*") // 안전따위 신경쓰지 않아
    })
}