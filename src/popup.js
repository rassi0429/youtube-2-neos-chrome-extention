'use strict';

import './popup.css';

(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions
  const storage = {
    getUniqueId: cb => {
      chrome.storage.sync.get(['uniqueId'], result => {
        cb(result.uniqueId);
      });
    },
    setUniqueId: (value, cb) => {
      chrome.storage.sync.set(
        {
          uniqueId: value,
        },
        () => {
          cb();
        }
      );
    },
  };


  function setup() {
    document.getElementById('connectButton').addEventListener('click', () => {

      storage.getUniqueId((v) => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const tab = tabs[0];
          chrome.tabs.sendMessage(
            tab.id,
            {
              type: 'ws',
              payload: {
                connect: true,
                uniqueId: v,
              },
            },
            response => { }
          );
        });
      });
    });
    storage.getUniqueId((v) => {
      console.log(v)
      document.getElementById("uniqueId").value = v || "UNIQUE_ID"
    })
    document.getElementById('uniqueId').addEventListener('change', (evt) => {
      console.log(evt.target.value)
      storage.setUniqueId(evt.target.value, () => { })
    });
  }

  // function setupCounter(initialValue = 0) {
  //   document.getElementById('counter').innerHTML = initialValue;

  //   document.getElementById('incrementBtn').addEventListener('click', () => {
  //     updateCounter({
  //       type: 'INCREMENT',
  //     });
  //   });

  //   document.getElementById('decrementBtn').addEventListener('click', () => {
  //     updateCounter({
  //       type: 'DECREMENT',
  //     });
  //   });
  // }

  // function updateCounter({ type }) {
  //   counterStorage.get(count => {
  //     let newCount;

  //     if (type === 'INCREMENT') {
  //       newCount = count + 1;
  //     } else if (type === 'DECREMENT') {
  //       newCount = count - 1;
  //     } else {
  //       newCount = count;
  //     }

  //     counterStorage.set(newCount, () => {
  //       document.getElementById('counter').innerHTML = newCount;

  //       // Communicate with content script of
  //       // active tab by sending a message
  //       chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  //         const tab = tabs[0];

  //         chrome.tabs.sendMessage(
  //           tab.id,
  //           {
  //             type: 'COUNT',
  //             payload: {
  //               count: newCount,
  //             },
  //           },
  //           response => {
  //             console.log('Current count value passed to contentScript file');
  //           }
  //         );
  //       });
  //     });
  //   });
  // }

  function restoreCounter() {
    // Restore count value
    // counterStorage.get(count => {
    //   if (typeof count === 'undefined') {
    //     // Set counter value as 0
    //     counterStorage.set(0, () => {
    //       setupCounter(0);
    //     });
    //   } else {
    //     setupCounter(count);
    //   }
    // });
  }

  document.addEventListener('DOMContentLoaded', setup());

  // Communicate with background file by sending a message
  // chrome.runtime.sendMessage(
  //   {
  //     type: 'GREETINGS',
  //     payload: {
  //       message: 'Hello, my name is Pop. I am from Popup.',
  //     },
  //   },
  //   response => {
  //     console.log(response.message);
  //   }
  // );
})();
