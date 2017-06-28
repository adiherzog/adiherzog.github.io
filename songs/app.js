var openInNewTab = false;

var openInNewTabCheckbox = document.getElementById('open-in-new-tab');
openInNewTabCheckbox.addEventListener(
    'change',
    function() {
        openInNewTab = !openInNewTab;
        refreshList();
    },
    false
);


var songsSorted = songs.sort(function(a, b) {
    if(a.title < b.title) {
        return -1;
    }
    if(a.title > b.title) {
        return 1;
    }
    return 0;
});

refreshList();

function refreshList() {
    var songsDomElement = document.getElementById('songs');
    songsDomElement.innerHTML = '';


    console.log(openInNewTab);

    var target = openInNewTab ? ' target="_blank"' : '';

    songsSorted.forEach(function(song) {
        var songElement = document.createElement('div');
        var content = '<p>' + song.title;
        if (song.artist) {
            content += ' - ' + song.artist
        }
        if (song.youtube) {
            content += ' - <a href="' + song.youtube + '"' + target + '>YouTube</a>';
        } else {
            content += ' - <a href="https://www.youtube.com/results?search_query=' + song.artist + ' ' + song.title + '"' + target + '>YouTube</a>';
        }
        if (song.lyrics) {
            content += ' - <a href="' + song.lyrics + '"' + target + '>Lyrics</a>';
        } else {
            content += ' - <a href="http://www.songtexte.com/search?q=' + song.artist + ' ' + song.title + '&c=all"' + target + '>Lyrics</a>';
        }
        content += ' - <a href="https://www.ultimate-guitar.com/search.php?search_type=title&order=&value=' + song.artist + ' ' + song.title + '"' + target + '>Tabs</a>';
        content += '</p>';
        songElement.innerHTML = content;
        songsDomElement.appendChild(songElement);
    });
}
