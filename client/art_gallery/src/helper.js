export function idToName(id) {
    return id
        .split("-")
        .map(word => word[0].toUpperCase() + word.substr(1))
        .join(" ");
}

export function nameToId(name) {
    return name
        .toLowerCase()
        .replace(/\s/g, "-");
}

export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
