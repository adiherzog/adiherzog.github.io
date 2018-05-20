/* global allSongs */

const state = {
    openInNewTab: false,
    songs: allSongs.sort((a, b) => a.title.localeCompare(b.title))
};

const songList = document.getElementById('song-list');
const openInNewTabCheckbox = document.getElementById('open-in-new-tab');
openInNewTabCheckbox.addEventListener('change', onOpenInNewTabCheckboxChanged, false);

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keyup', onSearch, false);


render(state.songs, state.openInNewTab);

/**
 *
 */
function onSearch() {
    const query = searchInput.value;
    const filteredSongs = filterSongs(state.songs, query);
    render(filteredSongs, state.openInNewTab);
}

/**
 * @static
 *
 * @param allSongs
 * @param query
 * @returns {*}
 */
function filterSongs(allSongs, query) {
    if (!query) {
        return allSongs;
    }
    const lowerCaseQuery = query.toLowerCase();

    return allSongs.filter((song) => (
        song.artist.toLowerCase().includes(lowerCaseQuery)
        || song.title.toLowerCase().includes(lowerCaseQuery)
    ));
}

/**
 *
 */
function onOpenInNewTabCheckboxChanged() {
    searchInput.value = '';
    state.openInNewTab = !state.openInNewTab;
    render(state.songs, state.openInNewTab);
}


/**
 * @param {object[]} songs
 * @param {boolean} openInNewTab
 */
function render(songs, openInNewTab) {
    const listFrag = renderList(songs, openInNewTab);
    songList.innerHTML = '';
    songList.appendChild(listFrag);
}


/**
 * @static
 *
 * @param {object[]} songs
 * @param {boolean} openInNewTab
 */
function renderList(songs, openInNewTab) {
    const frag = document.createDocumentFragment();

    const target = openInNewTab ? '_blank' : '';

    songs.forEach((song) => {
        const songElement = document.createElement('div');
        let content = `<p>${song.title}`;
        if (song.artist) {
            content += ' - ' + song.artist;
        }
        if (song.youtube) {
            content += ` - ${createLink(song.youtube, 'YouTube', target)}`;
        } else {
            const youTubeSearchUrl = `https://www.youtube.com/results?search_query=${song.artist} ${song.title}`;
            content += ` - ${createLink(youTubeSearchUrl, 'YouTube', target)}`;
        }
        if (song.lyrics) {
            content += ` - ${createLink(song.lyrics, 'Lyrics', target)}`;
        } else {
            const songtexteSearchUrl = `http://www.songtexte.com/search?q=${song.artist} ${song.title}&c=all`;
            content += ` - ${createLink(songtexteSearchUrl, 'Lyrics', target)}`;
        }
        if (song.tabs) {
            content += ` - ${createLink(song.tabs, 'Tabs', target)}`;
        } else {
            const tabsUrl = `https://www.ultimate-guitar.com/search.php?search_type=title&order=&value=${song.artist} ${song.title}`;
            content += ` - ${createLink(tabsUrl, 'Tabs', target)}`;
        }
        content += '</p>';
        songElement.innerHTML = content;
        frag.appendChild(songElement);
    });

    return frag;
}

/**
 *
 * @static
 *
 * @param url
 * @param {string} text
 * @param {string} target the anchor tag target attribute (e.g. _blank  or _top)
 * @returns {string}
 */
function createLink(url, text, target) {
    return `<a href="${url}" target="${target}">${text}</a>`;
}
