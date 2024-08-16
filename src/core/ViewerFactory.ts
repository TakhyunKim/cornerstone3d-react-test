import { ViewerCreator } from "./ViewerCreator";
import { ToolManager } from "./tools";
import { RenderingStackViewport } from "./renderViewport";

import type { MappingToolWithKey } from "./tools";

export interface ViewerSnapshot {
  toolManager: ToolManager;
  viewport: RenderingStackViewport;
}

export class ViewerFactory extends ViewerCreator {
  private ToolManager: ToolManager;
  private RenderingStackViewport: RenderingStackViewport;
  private snapshot: ViewerSnapshot;

  constructor(viewerId: string) {
    super();

    this.ToolManager = new ToolManager(viewerId);
    this.RenderingStackViewport = new RenderingStackViewport(viewerId);
    /**
     * The reason for specifying snapshot separately is that
     * if you export the same type of object from getSnapshot,
     * the useSyncExternalStore hook will cause
     * an infinite rendering bug in the useSyncExternalStore hook.
     *
     * Docs: https://react.dev/reference/react/useSyncExternalStore#im-getting-an-error-the-result-of-getsnapshot-should-be-cached
     */
    this.snapshot = {
      toolManager: this.ToolManager,
      viewport: this.RenderingStackViewport,
    };
  }

  init = async (
    element: HTMLDivElement,
    imageIds: string[],
    tools?: MappingToolWithKey[]
  ) => {
    await this.RenderingStackViewport.init(element, imageIds);
    this.ToolManager.init(element, tools);
  };

  getSnapshot = () => {
    return this.snapshot;
  };

  onSubscribe(): void {
    this.ToolManager.onSubscribe();
    this.RenderingStackViewport.onSubscribe();
  }

  onUnsubscribe(): void {
    this.ToolManager.onUnsubscribe();
    this.RenderingStackViewport.onUnsubscribe();
  }
}
