// 모듈듈 로딩용 템플릿
const _required = []
const modules = {}
const prefix = 'https://raw.githack.com/ChessBot-Entry/something-for-entry/main/code/'

await Promise.all(_required.map(id => {
    return (async () => {
        modules[id] = await import(prefix + id + '.mjs')
    })()
}))

//여기까지가 템플릿임