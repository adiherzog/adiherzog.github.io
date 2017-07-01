/* global allSongs */

const state = {
    openInNewTab: false,
    songs: allSongs.sort((a, b) => a.title.localeCompare(b.title))
};


const openInNewTabCheckbox = document.getElementById('open-in-new-tab');
openInNewTabCheckbox.addEventListener('change', () => {
    state.openInNewTab = !state.openInNewTab;
    render();
}, false);


render();

/**
 *
 */
function render() {
    const songsDomElement = document.getElementById('songs');
    const listFrag = renderList(state.songs, state.openInNewTab);
    songsDomElement.innerHTML = '';
    songsDomElement.appendChild(listFrag);
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
        const tabsUrl = `https://www.ultimate-guitar.com/search.php?search_type=title&order=&value=${song.artist} ${song.title}`;
        content += ` - ${createLink(tabsUrl, 'Tabs', target)}`;
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
