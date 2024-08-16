import { Subscribable } from "./Subscribable";

export abstract class ViewerCreator extends Subscribable {
  /** init is responsible for initial settings related to the constructor element */
  abstract init(...params: unknown[]): void | Promise<void>;
  /** Functions that return elements to be exposed externally from their class */
  abstract getSnapshot(): unknown;
}
