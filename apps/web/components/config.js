const config = [
    // AIR
    {
        type: 'number',
        index: 2,
        mode: 'whatever',
        length: 1,
        type: 2
    },
    {
        type: 'number',
        index: 2,
        mode: 'whatever',
        length: 1,
        type: 5
    },
]

const object = find(config, 'type', 2)
