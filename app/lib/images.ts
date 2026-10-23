/**
 * Every photo used on the site, in one place.
 * To swap a photo: drop the new file in app/assets/photos/ and change the path here.
 * ⚠️ Only use photos of children with written parental photo consent.
 */
import musicGuitar from "~/assets/photos/class-music-guitar.jpg?photo";
import craftPlaydough from "~/assets/photos/camp-craft-playdough.jpg?photo";
import parkClimbing from "~/assets/photos/camp-park-climbing.jpg?photo";
import storyCircle from "~/assets/photos/class-story-circle.jpg?photo";
import huddle from "~/assets/photos/class-huddle.jpg?photo";
import drumGame from "~/assets/photos/class-drum-game.jpg?photo";
import outingGroup from "~/assets/photos/camp-outing-group.jpg?photo";
import runningGame from "~/assets/photos/class-running-game.jpg?photo";
import warmupCircle from "~/assets/photos/class-warmup-circle.jpg?photo";

export const photos = {
  musicGuitar,
  craftPlaydough,
  parkClimbing,
  storyCircle,
  huddle,
  drumGame,
  outingGroup,
  runningGame,
  warmupCircle,
} satisfies Record<string, ResponsivePicture>;

export type PhotoKey = keyof typeof photos;
