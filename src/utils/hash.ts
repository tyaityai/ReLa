export const generateBytesFromURL = async (url: string): Promise<Uint8Array> => {
    const normalized = url.trim();
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return new Uint8Array(hashBuffer);
}

export const isHTTPS = (url: string): boolean => {
    return url.startsWith("https://");
}