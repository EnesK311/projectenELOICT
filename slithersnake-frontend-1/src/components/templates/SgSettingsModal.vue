<template>
    <dialog class="modal settings-modal hidden">
        <div class="title-div">
          <h2>Settings</h2>
          <button>Close <i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="sound-div horz-div">
          <h3>Sound</h3>
          <div>
            <span class="sound-value">30%</span>
            <input class="sound-range" type="range">
          </div>
        </div>

        <div class="mode-div horz-div">
          <h3>Dark mode</h3>
          <button class="mode-toggle">
            <span></span>
          </button>
        </div>

        <div class="controls-div">
          <h3>Controls</h3>
          <ul class="controls">
            <li>
              <p>Move left</p>
              <button>Arrow-left</button>
            </li>
            <li>
              <p>Move right</p>
              <button>Arrow-right</button>
            </li>
            <li>
              <p>Move up</p>
              <button>Arrow-up</button>
            </li>
            <li>
              <p>Move down</p>
              <button>Arrow-down</button>
            </li>
          </ul>
        </div>
      </dialog>
</template>