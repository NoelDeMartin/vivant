# Vivant ![CI](https://github.com/NoelDeMartin/vivant/actions/workflows/ci.yml/badge.svg)

> [!WARNING]
> For now, this is nothing more than a proof of concept; use it at your own discretion. I'm not sure how far I'll take the project, but if you think this is cool or have some questions, let me know :).

Vivant is an animation library for Vue, powered by [@vueuse/motion](https://motion.vueuse.org/), and supporting Layout Animations like [Framer Motion](https://www.framer.com/motion/).

See what it can do [in the playground](https://noeldemartin.github.io/vivant/).

## Installation

If you want to try it in your own projects, you can get the library from npm:

```sh
npm install vivant
```

Once it's installed, make sure to use the plugin in your app:

```js
import vivant from 'vivant';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.use(vivant()); // <-- use Vivant
app.mount('#app');
```

## Development

If you want to take it for a spin, you can clone this repository and you should be ready to go with two commands:

```sh
npm install
npm run dev
```

## Motivation and Known Issues

I started this library because I want to make animations in Vue, but Framer Motion is often given as [one of the reasons to choose React over Vue](https://x.com/adamwathan/status/1679796922679283712). There are some animation libraries in the Vue ecosystem, like `@vueuse/motion`, but they still lack some of the key features from Framer Motion.

This library is my attempt at filling those gaps, but I'm well aware that it's a giant endeavour. For now, I've implemented some examples I found in the React ecosystem, and I'm using it to implement animations in [my own apps](https://noeldemartin.com/projects). But this is by no means a comprehensive solution, consider it a proof of concept.

Here's some issues I'm aware of:

-   The library doesn't support interruptible animations, and overlapping animations in general. If you stress-test the playground, you'll probably find some glitches when some animations aren't played in isolation.
-   Morphing and layout animations in edge cases. Even though I've made them work for the examples in the playground, I'm sure there are many situations were they will break. For example, anything involving scroll positions is probably botched.
-   The API surface is not comprehensive, there will be some combination of settings that may not work properly.
-   Overall polish. The current implementation has been pretty much written for the examples in the playground, so it's very possible that trying to use the library for something else doesn't quite work. But I've made it with a real API, so the core idea should hold. You know, "write the code you wish you had".

I'm sure there are more problems beyond the list. If you think there's something missing that I'm not aware of, please let me know.
