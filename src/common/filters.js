export function getUniqueItems(items, valueGetter) {
    return [... new Set(items.map(v => {
        return valueGetter(v)
    }))]
}

export function filterItems(items, selected, valueGetter) {
    if (selected != null) {
        items = items.filter((v) => {
            let filter = false
            for (let i=0; i < selected.length; i++) {
                if (selected[i] == valueGetter(v)) {
                    filter = true
                    break
                }
            }
            return filter
        })
    }
    return items
}
