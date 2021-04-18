const parseSpotifyUri = (url: string) => {
    if (url.includes('http')) {
        url = url.split('track/')[1];
        url = url.split('?')[0];
        url = `spotify:track:${url}`
    }
    return url;
}

export {
    parseSpotifyUri,
}