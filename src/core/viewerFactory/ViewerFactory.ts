import { v4 as uuidV4 } from "uuid";

import { ToolManager } from "../tools";
import { RenderingStackViewport } from "../renderViewport";
import { EventHandler } from "../eventHandler";
import { Subscribable } from "../Subscribable";

import type { MappingToolWithKey } from "../tools";
import type { StackViewport } from "../renderViewport";

export type ViewerStatus = {
  viewport: StackViewport;
};

export type ViewerSnapshot = ViewerStatus | null;

// TODO: Need to refactor common behaviours like subscribe
export class ViewerFactory extends Subscribable<ViewerSnapshot> {
  private viewerId: string;
  private ToolManager: ToolManager;
  private RenderingStackViewport: RenderingStackViewport;
  private EventHandler: EventHandler;
  protected snapshot: ViewerSnapshot;

  constructor() {
    super();

    this.viewerId = uuidV4();
    this.EventHandler = new EventHandler();
    this.ToolManager = new ToolManager(this.viewerId);
    this.RenderingStackViewport = new RenderingStackViewport(this.viewerId);

    /**
     * The reason for specifying snapshot separately is that
     * if you export the same type of object from getSnapshot,
     * the useSyncExternalStore hook will cause
     * an infinite rendering bug in the useSyncExternalStore hook.
     *
     * Docs: https://react.dev/reference/react/useSyncExternalStore#im-getting-an-error-the-result-of-getsnapshot-should-be-cached
     */
    this.snapshot = null;
  }

  protected setSnapshot = () => {
    const viewport = this.RenderingStackViewport.getSnapshot();

    if (!viewport) return this.snapshot;

    this.snapshot = {
      viewport,
    };
  };

  protected onUnsubscribe = (): void => {
    this.ToolManager.destroy();
    this.RenderingStackViewport.destroy();
  };

  init = async (
    element: HTMLDivElement,
    imageIds: string[],
    tools?: MappingToolWithKey[]
  ) => {
    this.EventHandler.init(element, this.emitChange);

    await this.RenderingStackViewport.init(element, imageIds);
    this.ToolManager.init(element, tools);
    this.emitChange();
  };
}
