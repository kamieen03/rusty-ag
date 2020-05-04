#!/usr/bin/env bash
url=https://www.wikiart.org/en/App/wiki/DictionariesJson/2
curl -s "$url" | python -m json.tool | grep -v '"id":' > styles.json
