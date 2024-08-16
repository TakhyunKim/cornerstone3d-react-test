import { ToolGroupManager, utilities, destroy } from "@cornerstonejs/tools";

import { ViewerSlot } from "../ViewerSlot";
import { renderingViewerEngine } from "../renderEngine";
import {
  DEFAULT_MAPPED_TOOL_WITH_KEY,
  MAPPED_SUPPORT_TOOL,
  SUPPORT_KEYS,
} from "./constants";

import type { RenderingEngine as CornerstoneRenderingEngine } from "@cornerstonejs/core";

import { ToolGroup, MappingToolWithKey } from "./types";

export class ToolManager extends ViewerSlot {
  private toolManagerId: string;
  private toolGroupManager: ToolGroup | undefined;
  private renderingEngine: CornerstoneRenderingEngine;

  /**
   * @param toolManagerId toolManagerId must be the same as the viewportId you want to assign
   */
  constructor(toolManagerId: string) {
    super();

    this.toolManagerId = toolManagerId;
    this.renderingEngine = renderingViewerEngine;
    this.toolGroupManager = ToolGroupManager.createToolGroup(toolManagerId);
  }

  /** Added to toolGroupManager by iterating over the supported tools */
  private addSupportedToolsToCornerstone = (): void => {
    const toolGroupManager = this.toolGroupManager;
    if (!toolGroupManager) return;

    for (const [_, tool] of Object.entries(MAPPED_SUPPORT_TOOL)) {
      toolGroupManager.addTool(tool.toolName);
    }
  };

  private mappingRenderingInfoWithToolManager = (): void => {
    const toolGroupManager = this.toolGroupManager;

    if (!toolGroupManager) return;

    toolGroupManager.addViewport(this.toolManagerId, this.renderingEngine.id);
  };

  private enableToolElement = (element: HTMLDivElement): void => {
    utilities.stackPrefetch.enable(element);
  };

  /** Disable right click context menu so we can have right click tools */
  private blockRightClickEvent = (element: HTMLDivElement) => {
    element.oncontextmenu = (e) => e.preventDefault();
  };

  destroy = (): void => {
    destroy();
  };

  /**
   * Functions to set the tool you want to use externally and the mouse key you want to map to it.
   * If there is no key to map, assign the default mouse key
   */
  setTool = (mappingToolWithKeys: MappingToolWithKey[] = []) => {
    const toolGroup = this.toolGroupManager;

    if (!toolGroup) return;

    mappingToolWithKeys.forEach(({ tool, key }) => {
      toolGroup.setToolActive(MAPPED_SUPPORT_TOOL[tool].toolName, {
        bindings: [
          {
            mouseButton:
              SUPPORT_KEYS[key ?? DEFAULT_MAPPED_TOOL_WITH_KEY[tool]],
          },
        ],
      });
    });
  };

  init = (
    element: HTMLDivElement,
    mappingToolWithKeys?: MappingToolWithKey[]
  ): void => {
    this.addSupportedToolsToCornerstone();
    this.enableToolElement(element);
    this.blockRightClickEvent(element);
    this.mappingRenderingInfoWithToolManager();
    this.setTool(mappingToolWithKeys);
  };

  getSnapshot = () => {
    return this.toolGroupManager;
  };
}
