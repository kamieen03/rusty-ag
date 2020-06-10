export function idToName(id) {
    return id
        .split("-")
        .map(word => word[0].toUpperCase() + word.substr(1))
        .join(" ");
}

export function nameToId(name) {
    return name
        .toLowerCase()
        .replace(/\s/g, "+");
}
