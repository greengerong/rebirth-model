
rebirth-model
=============

generate typescript model from json schema or json.

## from schema

    node index.js -f test/person.json  -o ./dist | ./node_modules/bunyan/bin/bunyan
    
## from json

    node index.js -f test/person.data.json  -o ./dist -j | ./node_modules/bunyan/bin/bunyan