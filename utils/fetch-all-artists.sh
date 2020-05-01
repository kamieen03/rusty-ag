#!/usr/bin/env bash

for letter in {a..z}; do
    curl -s "https://www.wikiart.org/en/Alphabet/$letter/text-list" | grep 'a href="/en' | sed 's|<a href="/en/|"|g' | sed 's|>|: "|g' | sed 's|</a: "|",|'
done
