'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is : '${pageTitle}'`
);
let socket = null

function connectWS(uniqueId) {
  socket = new WebSocket("wss://wsecho.kokoa.dev/kokoa0429/yt2neos/" + uniqueId)
  socket.addEventListener('message', function (event) {
    if (event.data.startsWith("toS")) console.log(event.data)
    const commands = event.data.split(":")

    switch (commands[1]) {
      case "pause":
        document.getElementsByTagName("video")[0].click()
        break
      case "next":
        document.getElementsByClassName("ytp-next-button")[0].click()
        break
      case "play":
        const videoId = commands[2]// youtube_parser(commands[2])
        if(videoId) {
          location.href = `https://youtube.com/watch?v=${videoId}`
        }
        break
    }
  });
}



function getInfomation() {
  try {
    const videoTag = document.getElementsByTagName("video")[0]
    const duration = videoTag.duration
    const currentTime = videoTag.currentTime
    const title = document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer")[0].innerText
    const channelName = document.getElementById("channel-name").innerText
    const id = youtube_parser(document.URL)
    if (socket) {
      socket.send([currentTime, duration, title, channelName, id].join("$#"))
    }
  } catch { }
}

setInterval(() => getInfomation(), 1000)

function youtube_parser(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
}

// Communicate with background file by sending a message
// chrome.runtime.sendMessage(
//   {
//     type: 'GREETINGS',
//     payload: {
//       message: 'Hello, my name is Con. I am from ContentScript.',
//     },
//   },
//   response => {
//     console.log(response.message);
//   }
// );

// // Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ws') {
    console.log(`ws connect req: ${request.payload.connect}`);
    connectWS(request.payload.uniqueId)
  }
})
//   // Send an empty response
//   // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
//   sendResponse({});
//   return true;
// });
