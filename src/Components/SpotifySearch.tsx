import { useContext, useState } from 'react';
import { Image } from 'react-bootstrap';
import { AsyncTypeahead, TypeaheadResult } from 'react-bootstrap-typeahead';
import { SpotifyAPIContext } from '../Providers/SpotifyAPI';

interface SpotifySearchProps {
    onChange: (option: SpotifyApi.TrackObjectFull[]) => void;
};

const SpotifySearch:React.FC<SpotifySearchProps> = ({ onChange }) => {

    // Spit out a spotify entity object (track or album, etc.) and/or the raw input
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SpotifyApi.TrackObjectFull[]>([]);

    const { SpotifyAPI } = useContext(SpotifyAPIContext);

    const search = async (query: string) => {
        setSearchResults((await SpotifyAPI.searchTracks(query)).tracks.items);
        setIsLoading(false);
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
                const o = option as TypeaheadResult<SpotifyApi.TrackObjectFull>;
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
            }}
            onChange={(option) => onChange(option)}
        />
    );
}

export default SpotifySearch;