# https://endaaman.me/memo/565201805cb27a58150a9da2

co = require 'co'

run = (func)->
    ts = []
    for i in [1..2000]
        ts.push Date.now()
        yield func

    x = 0
    y = 0
    for i, t of ts
        if i > 0
            d = ts[i] - ts[i-1]
            y = y + d
            if d is 0
                x = x + 1

    console.log x, y / 2000

co ->
    yield run (r)-> setTimeout r, 0
    yield run (r)-> setTimeout r, 1
    yield run (r)-> setTimeout r, 2
    yield run (r)-> process.nextTick r
    yield run (r)-> setImmediate r
