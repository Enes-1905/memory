import './style.scss';
import controllerIcon from './assets/stadia_controller.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="home">
    <img
      class="home__controller"
      src="${controllerIcon}"
      alt=""
    >

    <div class="home__content">
      <p class="home__eyebrow">It's play time.</p>

      <h1 class="home__title">Ready to play?</h1>

      <button class="home__play-button" type="button">
        <span>🎮</span>
        <span>Play</span>
        <span>→</span>
      </button>
    </div>
  </main>
`;