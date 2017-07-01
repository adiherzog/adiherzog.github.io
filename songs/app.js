/* global songs */

var openInNewTab = false;

var openInNewTabCheckbox = document.getElementById('open-in-new-tab');
openInNewTabCheckbox.addEventListener(
    'change',
    function () {
        openInNewTab = !openInNewTab;
        refreshList();
    },
    false
);


var songsSorted = songs.sort(function (a, b) {
    if (a.title < b.title) {
        return -1;
    }
    if (a.title > b.title) {
        return 1;
    }
    return 0;
});

refreshList();

function refreshList() {
    var songsDomElement = document.getElementById('songs');
    songsDomElement.innerHTML = '';

    songsSorted.forEach(function (song) {
        var songElement = document.createElement('div');
        var content = `<p>${song.title}`;
        if (song.artist) {
            content += ' - ' + song.artist;
        }
        if (song.youtube) {
            content += ` - ${createLink(song.youtube, 'YouTube', openInNewTab)}`;
        } else {
            const youTubeSearchUrl = `https://www.youtube.com/results?search_query=${song.artist} ${song.title}`;
            content += ` - ${createLink(youTubeSearchUrl, 'YouTube', openInNewTab)}`;
        }
        if (song.lyrics) {
            content += ` - ${createLink(song.lyrics, 'Lyrics', openInNewTab)}`;
        } else {
            const songtexteSearchUrl = `http://www.songtexte.com/search?q=${song.artist} ${song.title}&c=all`;
            content += ` - ${createLink(songtexteSearchUrl, 'Lyrics', openInNewTab)}`;
        }
        const tabsUrl = `https://www.ultimate-guitar.com/search.php?search_type=title&order=&value=${song.artist} ${song.title}`;
        content += ` - ${createLink(tabsUrl, 'Tabs', openInNewTab)}`;
        content += '</p>';
        songElement.innerHTML = content;
        songsDomElement.appendChild(songElement);
    });
}

/**
 *
 * @param url
 * @param text
 * @param {boolean} openInNewTab
 * @returns {string}
 */
function createLink(url, text, openInNewTab) {
    var target = openInNewTab ? ' target="_blank"' : '';
    return `<a href="${url}" ${target}>${text}</a>`;
}
