let config = []

await new Promise((resolve) => {
    window.addEventListener('message', (configSend) => {
        config = configSend
        resolve()
    })    
})

window.entryExtConfig = config

config.forEach((scriptSetting) => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = scriptSetting.src

    document.head.append(script)
})