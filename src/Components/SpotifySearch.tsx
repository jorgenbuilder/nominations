import { useContext, useState } from 'react';
import { Image } from 'react-bootstrap';
import { AsyncTypeahead, TypeaheadResult } from 'react-bootstrap-typeahead';
import { SpotifyAPIContext } from '../Providers/SpotifyAPI';

interface SpotifySearchProps {
    searchType: 'song' | 'album';
    onChange: (option: SpotifyApi.TrackObjectFull[] | SpotifyApi.AlbumObjectSimplified[]) => void;
};

const SpotifySearch:React.FC<SpotifySearchProps> = ({ searchType, onChange }) => {

    // Spit out a spotify entity object (track or album, etc.) and/or the raw input
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SpotifyApi.TrackObjectFull[] | SpotifyApi.AlbumObjectSimplified[]>([]);

    const { SpotifyAPI } = useContext(SpotifyAPIContext);

    const search = async (query: string) => {
        if (searchType === 'song') {
            setSearchResults((await SpotifyAPI.searchTracks(query)).tracks.items);
            setIsLoading(false);
        } else if (searchType === 'album') {
            setSearchResults((await SpotifyAPI.searchAlbums(query)).albums.items);
            setIsLoading(false);
        }
    }

    return (
        <AsyncTypeahead
            isLoading={isLoading}
            onSearch={search}
            //@ts-ignore
            options={searchResults}
            id="spotify-search"
            labelKey={x => x.name}
            renderMenuItemChildren={(option) => {
                let o;
                if (searchType === 'song') {
                    o = option as TypeaheadResult<SpotifyApi.TrackObjectFull>
                    return (
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Image src={o.album.images[0].url} width="62" alt="Album Art" rounded />
                            <div style={{marginLeft: '.5em'}}>
                                <div style={{display: 'flex'}}>
                                    {o?.name}
                                </div>
                                <div>
                                    <small>{o?.artists[0].name}</small> • <small>{o?.album.name}</small>
                                </div>
                            </div>
                        </div>
                    );
                } else if (searchType === 'album') {
                    o = option as unknown as TypeaheadResult<SpotifyApi.AlbumObjectSimplified>
                    return (
                        <>
                            {o?.name}
                        </>
                    );
                }
            }}
            onChange={(option) => onChange(option)}
        />
    );
}

export default SpotifySearch;