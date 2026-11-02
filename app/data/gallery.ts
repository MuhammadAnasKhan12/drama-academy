/**
 * ✏️ Gallery photos. Add a photo by putting the file in app/assets/photos/, registering it in
 * app/lib/images.ts, then adding a line here.
 * ⚠️ Only use photos of children with written parental photo consent.
 */
import type { PhotoKey } from "~/lib/images";

export type GalleryCategory = "Classes" | "Holiday clubs";

export type GalleryPhoto = { photo: PhotoKey; category: GalleryCategory; caption: string; alt: string };

export const gallery: GalleryPhoto[] = [
  { photo: "musicGuitar", category: "Classes", caption: "Singing and movement with live guitar", alt: "Children dancing with arms outstretched while a teacher plays guitar" },
  { photo: "runningGame", category: "Classes", caption: "Warm-up games — the best way to start", alt: "A smiling teacher and children running in a drama warm-up game" },
  { photo: "craftPlaydough", category: "Holiday clubs", caption: "Making props for our story", alt: "A girl proudly holding up a green model she made at a holiday club" },
  { photo: "storyCircle", category: "Classes", caption: "Story circle: what happens next?", alt: "A teacher leading a story circle with children sitting on the studio floor" },
  { photo: "parkClimbing", category: "Holiday clubs", caption: "Park time at holiday club", alt: "Three children in hi-vis vests pulling silly faces on a climbing frame" },
  { photo: "drumGame", category: "Classes", caption: "Rhythm games with the bongos", alt: "A teacher with bongo drums directing children in a rhythm game" },
  { photo: "huddle", category: "Classes", caption: "Team huddle before a scene", alt: "Children huddled together in a circle with their teacher" },
  { photo: "outingGroup", category: "Holiday clubs", caption: "Out and about on a club trip", alt: "A group of children in hi-vis vests on an outing with their club leader" },
  { photo: "warmupCircle", category: "Classes", caption: "Character work in the studio", alt: "Children gathered around their teacher in a bright studio" },
];
