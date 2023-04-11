# Introduction
This app is built with create react app. Most of the games logic is handled by the `useGame` hook, which has been tested using `react-testing-library`. I have added a `BoardContext` to store the number of tiles being used. This is hard coded at the oment - but the idea would be that this would be used to add the ability to change the number of tiles in the grid.

# Instructions
To run the app:
```
npm i && npm run start
```
To run unit tests:
```
npm run test
```

# Improvements
- I would like to add the ability to allow a user to change the number of tiles in the grid. I have built most of the logic so that it should be able to handle any size grid.
- A "highscore" tracker would be a nice feature to add. I was thinking of storing this in `localstorage` so that it persists between sessions.
- If I had a bit more time I would like to pull some of the logic in `useGame` into the `matrixUtils` file, which would allow me to test the logic at a more granular level.
