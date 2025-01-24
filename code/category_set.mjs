// 모듈듈 로딩용 템플릿
const _required = ['entry_getter', 'multiwrap']
const modules = {}
const prefix = 'https://raw.githack.com/ChessBot-Entry/something-for-entry/main/code/'

await Promise.all(_required.map(id => {
    return (async () => {
        modules[id] = await import(prefix + id + '.mjs')
    })()
}))

//여기까지가 템플릿임

const categorySetup = {}

const makeWrap = modules['multiwrap'].makeWrap

const entryLoaded = await modules['entry_getter'].waitForEntryjs()

const Entry = window.Entry
const EntryStatic = window.EntryStatic

if (!entry_loaded) {
    EntryStatic.getAllBlocks = makeWrap(EntryStatic.getAllBlocks, function(callNext) {
        const result = callNext()


    })
}
else {

}