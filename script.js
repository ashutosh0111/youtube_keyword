document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("searchButton");
    const keywordInput = document.getElementById("keyword");
    const searchResult = document.getElementById("searchResult");

    searchButton.addEventListener("click", async () => {
        const keyword = keywordInput.value;
        if (keyword) {
            try {
                const searchVolume = await calculateSearchVolume(keyword);
                searchResult.textContent = `Search volume for keyword "${keyword}": ${searchVolume}`;
            } catch (error) {
                searchResult.textContent = "An error occurred while fetching search volume.";
                console.error("Error:", error);
            }
        } else {
            searchResult.textContent = "Please enter a keyword.";
        }
    });
});

const API_KEY =' AIzaSyB8YyrulBocjYUo7wki41j61K5xD6wv3LU';

async function getVideoViews(videoId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`);
    const data = await response.json();
    console.log(data);
    if (data.items && data.items.length > 0) {
        return parseInt(data.items[0].statistics.viewCount);
    }
    return 0;
}

async function calculateSearchVolume(keyword) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(keyword)}&key=${API_KEY}`);
    const data = await response.json();
    console.log(data);
    let totalSearchVolume = 0;
    for (const item of data.items) {
        const videoId = item.id.videoId;
        const videoViews = await getVideoViews(videoId);
        totalSearchVolume += videoViews;
    }

    return totalSearchVolume;
}
